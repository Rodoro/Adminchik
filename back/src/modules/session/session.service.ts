import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginStaffDto } from './dto/login-staff.dto';
import { verify } from 'argon2';
import { destroySession, saveSession } from '@/src/shared/utils/session.util';
import type { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { StaffResponseDto } from '../staff/dto/staff-response.dto';

@Injectable()
export class SessionService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
    ) { }

    public async login(req: Request, loginStaffDto: LoginStaffDto): Promise<StaffResponseDto> {
        const { email, password } = loginStaffDto;

        const user = await this.prismaService.staff.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const isValidPassword = await verify(user.password, password);

        if (!isValidPassword) {
            throw new NotFoundException('Неверный пароль');
        }

        await saveSession(req, user);
        return plainToInstance(StaffResponseDto, user);
    }

    public async logout(req: Request): Promise<{ success: boolean }> {
        await destroySession(req, this.configService);
        return { success: true };
    }
}