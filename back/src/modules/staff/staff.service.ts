import { PrismaService } from "@/src/core/prisma/prisma.service";
import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { hash, verify } from "argon2";
import { DeleteStaffDto } from "./dto/delete-staff.dto";
import { plainToInstance } from "class-transformer";
import { StaffResponseDto } from "./dto/staff-response.dto";
import { Staff } from "@/prisma/generated";
import { ChangeEmailDto } from "./dto/change-email.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { LoggingService } from "../logging/logging.service";
import { Permission } from "@/src/shared/types/permission.types";
import { RemovePermissionsDto } from "./dto/remove-permissions.dto";
import { AddPermissionsDto } from "./dto/add-permissions.dto";
import { AddProjectsDto } from "./dto/add-projects.dto";
import { RemoveProjectsDto } from "./dto/remove-projects.dto";
import { UpdateStaffDto } from "./dto/update-staff.dto";
import { MinioService } from "@/src/core/minio/minio.service";
import * as sharp from 'sharp';
import { Upload } from "@/src/shared/interfaces/upload.interface";

@Injectable()
export class StaffService {
    constructor(
        private readonly storageService: MinioService,
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
        const { email, password, displayName, firstName, lastName, midleName, permissions } = createStaffDto;

        const isUsernameExists = await this.prismaService.staff.findUnique({
            where: { email },
        });

        if (isUsernameExists) {
            throw new ConflictException('Это имя пользователя уже занято');
        }

        const convertPermissionsToBitString = (permissions: number[] | undefined): string => {
            if (!permissions || permissions.length === 0) return '0'.repeat(10); // или любое другое дефолтное значение

            const maxPermission = Math.max(...permissions);
            const bitStringArray = new Array(maxPermission + 1).fill(0);

            permissions.forEach(permission => {
                bitStringArray[permission] = 1;
            });

            return bitStringArray.join('');
        };

        const permissionsBitString = convertPermissionsToBitString(permissions);

        const newUser = await this.prismaService.staff.create({
            data: {
                email,
                password: await hash(password),
                displayName,
                firstName,
                lastName,
                midleName,
                permissions: permissionsBitString,
                projects: []
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

    async update(
        requesterId: string,
        staffId: string,
        updateStaffDto: UpdateStaffDto
    ): Promise<void> {
        await this.checkPermission(requesterId, Permission.MANAGE_STAFF);

        const { displayName, email, firstName, lastName, midleName, permissions, bio } = updateStaffDto;

        const staff = await this.prismaService.staff.findUnique({
            where: { id: staffId },
        });

        if (!staff) {
            throw new NotFoundException('Staff member not found');
        }

        if (email !== staff.email) {
            const emailExists = await this.prismaService.staff.findUnique({
                where: { email },
                select: { id: true }
            });

            if (emailExists) {
                throw new ConflictException('Email уже используется другим пользователем');
            }
        }

        const convertPermissionsToBitString = (permissions: number[]): string => {
            const maxPermission = Math.max(...permissions);
            const bitStringArray = new Array(maxPermission + 1).fill('0');

            permissions.forEach(permission => {
                bitStringArray[permission] = '1';
            });

            return bitStringArray.join('');
        };

        const permissionsBitString = convertPermissionsToBitString(permissions);

        await this.prismaService.staff.update({
            where: { id: staffId },
            data: {
                displayName,
                email,
                firstName,
                lastName,
                midleName: midleName || null,
                bio: bio || null,
                permissions: permissionsBitString
            }
        });

        await this.loggingService.logAdminAction({
            action: 'update_staff',
            user_id: requesterId,
            target_id: staffId,
            metadata: {
                old_email: staff.email,
                new_email: email,
                changes: {
                    displayName: displayName !== staff.displayName ? displayName : undefined,
                    firstName: firstName !== staff.firstName ? firstName : undefined,
                    lastName: lastName !== staff.lastName ? lastName : undefined,
                    midleName: midleName !== staff.midleName ? midleName : undefined,
                    permissions: 'updated'
                }
            },
        });
    }

    private async checkPermission(userId: string, permission: Permission): Promise<void> {
        const user = await this.prismaService.staff.findUnique({
            where: { id: userId },
            select: { permissions: true }
        });

        if (!user) throw new NotFoundException('User not found');
        if (!this.hasPermission(user.permissions, permission)) {
            throw new ForbiddenException('Insufficient permissions');
        }
    }

    private hasPermission(permissions: string, permission: Permission): boolean {
        return permissions.length > permission && permissions[permission] === '1';
    }

    private updatePermission(permissions: string, permission: Permission, value: boolean): string {
        const permArray = permissions.split('');
        while (permArray.length <= permission) {
            permArray.push('0');
        }
        permArray[permission] = value ? '1' : '0';
        return permArray.join('');
    }

    async addPermissions(requesterId: string, dto: AddPermissionsDto): Promise<void> {
        await this.checkPermission(requesterId, Permission.MANAGE_STAFF);

        const staff = await this.prismaService.staff.findUnique({
            where: { id: dto.staffId }
        });

        if (!staff) {
            throw new NotFoundException('Staff member not found');
        }

        let newPermissions = staff.permissions;
        for (const permission of dto.permissions) {
            newPermissions = this.updatePermission(newPermissions, permission, true);
        }

        await this.prismaService.staff.update({
            where: { id: dto.staffId },
            data: { permissions: newPermissions }
        });
    }

    // Методы для работы с правами
    async removePermissions(requesterId: string, dto: RemovePermissionsDto): Promise<void> {
        await this.checkPermission(requesterId, Permission.MANAGE_STAFF);

        const staff = await this.prismaService.staff.findUnique({
            where: { id: dto.staffId }
        });

        if (!staff) {
            throw new NotFoundException('Staff member not found');
        }

        let newPermissions = staff.permissions;
        for (const permission of dto.permissions) {
            newPermissions = this.updatePermission(newPermissions, permission, false);
        }

        await this.prismaService.staff.update({
            where: { id: dto.staffId },
            data: { permissions: newPermissions }
        });
    }

    // Методы для работы с проектами
    async addProjects(requesterId: string, dto: AddProjectsDto): Promise<void> {
        await this.checkPermission(requesterId, Permission.MANAGE_STAFF);

        const staff = await this.prismaService.staff.findUnique({
            where: { id: dto.staffId }
        });

        if (!staff) {
            throw new NotFoundException('Staff member not found');
        }

        const existingProjects = new Set(staff.projects);
        dto.projectIds.forEach(projectId => existingProjects.add(projectId));

        await this.prismaService.staff.update({
            where: { id: dto.staffId },
            data: { projects: Array.from(existingProjects) }
        });
    }

    async removeProjects(requesterId: string, dto: RemoveProjectsDto): Promise<void> {
        await this.checkPermission(requesterId, Permission.MANAGE_STAFF);

        const staff = await this.prismaService.staff.findUnique({
            where: { id: dto.staffId }
        });

        if (!staff) {
            throw new NotFoundException('Staff member not found');
        }

        const remainingProjects = staff.projects.filter(
            projectId => !dto.projectIds.includes(projectId)
        );

        await this.prismaService.staff.update({
            where: { id: dto.staffId },
            data: { projects: remainingProjects }
        });
    }

    async getStaffProjects(staffId: string): Promise<string[]> {
        const staff = await this.prismaService.staff.findUnique({
            where: { id: staffId },
            select: { projects: true }
        });

        if (!staff) {
            throw new NotFoundException('Staff member not found');
        }

        return staff.projects;
    }

    public async changeAvatar(userId: string, file: Upload) {
        const user = await this.prismaService.staff.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const chunks: Buffer[] = [];
        for await (const chunk of file.createReadStream()) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const fileName = `/avatars/${userId + '/' + [...Array(3)].map(() => Math.random().toString(36)[2]).join('')}.webp`;

        if (file.filename && file.filename.endsWith('.gif')) {
            const processedBuffer = await sharp(buffer, { animated: true })
                .resize(512, 512)
                .webp()
                .toBuffer();
            await this.storageService.upload(processedBuffer, fileName, 'image/webp');
        } else {
            const processedBuffer = await sharp(buffer)
                .resize(512, 512)
                .webp()
                .toBuffer();
            await this.storageService.upload(processedBuffer, fileName, 'image/webp');
        }

        await this.prismaService.staff.update({
            where: { id: userId },
            data: { avatar: fileName },
        });

        return true;
    }

    public async removeAvatar(userId: string) {
        const user = await this.prismaService.staff.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.avatar) {
            return;
        }

        await this.storageService.remove(user.avatar);

        await this.prismaService.staff.update({
            where: { id: userId },
            data: { avatar: null },
        });

        return true;
    }
}