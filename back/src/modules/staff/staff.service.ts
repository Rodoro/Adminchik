import { PrismaService } from "@/src/core/prisma/prisma.service";
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { hash, verify } from "argon2";
import { DeleteStaffDto } from "./dto/delete-staff.dto";
import { plainToInstance } from "class-transformer";
import { StaffResponseDto } from "./dto/staff-response.dto";
import { Staff } from "@/prisma/generated";
import { ChangeEmailDto } from "./dto/change-email.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { LoggingService } from "../logging/logging.service";

@Injectable()
export class StaffService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly loggingService: LoggingService
    ) { }

    async me(id: string): Promise<StaffResponseDto> {
        const user = await this.prismaService.staff.findUnique({
            where: { id },
            include: {
                notificationSettings: true
            }
        });

        if (!user) {
            throw new NotFoundException('Staff member not found');
        }

        return plainToInstance(StaffResponseDto, user);
    }

    async findAll(): Promise<StaffResponseDto[]> {
        const users = await this.prismaService.staff.findMany();
        return plainToInstance(StaffResponseDto, users);
    }

    async create(id: string, createStaffDto: CreateStaffDto): Promise<void> {
        const { email, password, displayName, firstName, lastName } = createStaffDto;

        const isUsernameExists = await this.prismaService.staff.findUnique({
            where: { email },
        });

        if (isUsernameExists) {
            throw new ConflictException('Это имя пользователя уже занято');
        }

        const newUser = await this.prismaService.staff.create({
            data: {
                email,
                password: await hash(password),
                displayName,
                firstName,
                lastName
            }
        });

        await this.loggingService.logAdminAction({
            action: 'create_staff',
            user_id: id,
            target_id: newUser.id,
            metadata: {
                email: newUser.email,
                role: newUser.displayName,
            },
        });
    }

    async delete(id: string, deleteStaffDto: DeleteStaffDto): Promise<void> {
        const { email } = deleteStaffDto;
        const staff = await this.prismaService.staff.findUnique({
            where: { email },
        });

        if (!staff) {
            throw new NotFoundException('Администратор не найден');
        }

        await this.loggingService.logAdminAction({
            action: 'delete_staff',
            user_id: id,
            target_id: staff.id,
            metadata: {
                email: staff.email,
                role: staff.displayName,
            },
        });

        await this.prismaService.staff.delete({
            where: { email },
        });
    }

    public async changeEmail(user: Staff, input: ChangeEmailDto): Promise<void> {
        const { email } = input;

        await this.prismaService.staff.update({
            where: {
                id: user.id
            },
            data: {
                email
            }
        });
    }

    public async changePassword(user: Staff, input: ChangePasswordDto): Promise<void> {
        const { oldPassword, newPassword } = input;

        const isValidPassword = await verify(user.password, oldPassword);

        if (!isValidPassword) {
            throw new UnauthorizedException('Неверный старый пароль');
        }

        await this.prismaService.staff.update({
            where: {
                id: user.id
            },
            data: {
                password: await hash(newPassword)
            }
        });
    }
}