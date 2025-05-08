import { PrismaService } from "@/src/core/prisma/prisma.service";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { hash } from "argon2";
import { DeleteStaffDto } from "./dto/delete-staff.dto";
import { plainToInstance } from "class-transformer";
import { StaffResponseDto } from "./dto/staff-response.dto";

@Injectable()
export class StaffService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async me(id: string): Promise<StaffResponseDto> {
        const user = await this.prismaService.staff.findUnique({
            where: { id }
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

    async create(createStaffDto: CreateStaffDto): Promise<void> {
        const { email, password } = createStaffDto;

        const isUsernameExists = await this.prismaService.staff.findUnique({
            where: { email },
        });

        if (isUsernameExists) {
            throw new ConflictException('Это имя пользователя уже занято');
        }

        await this.prismaService.staff.create({
            data: {
                email,
                password: await hash(password),
            }
        });
    }

    async delete(deleteStaffDto: DeleteStaffDto): Promise<void> {
        const { email } = deleteStaffDto;
        const staff = await this.prismaService.staff.findUnique({
            where: { email },
        });

        if (!staff) {
            throw new NotFoundException('Администратор не найден');
        }

        await this.prismaService.staff.delete({
            where: { email },
        });
    }
}