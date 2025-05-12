import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import type { Request } from 'express';
import type { ResetPasswordDto } from './dto/reset-password.dto';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { TokenType } from '@/prisma/generated';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { NewPasswordDto } from './dto/new-password.dto';
import { hash } from 'argon2';
import { TelegramService } from './../telegram/telegram.service'

@Injectable()
export class PasswordService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailServce: MailService,
        private readonly telegramService: TelegramService
    ) { }

    public async resetPassword(
        req: Request,
        input: ResetPasswordDto,
        userAgent: string
    ) {
        const { email } = input;

        const user = await this.prismaService.staff.findUnique({
            where: { email },
            include: {
                notificationSettings: true
            }
        });

        if (!user) {
            throw new NotAcceptableException('Пользователь не найден');
        }

        const resetToken = await generateToken(this.prismaService, user, TokenType.PASSWORD_RESET);
        const metadata = getSessionMetadata(req, userAgent);

        await this.mailServce.sendPasswordResetToken(user.email, resetToken.token, metadata);

        if (
            resetToken.user?.notificationSettings?.passwordReset &&
            resetToken.user?.telegramId
        ) {
            await this.telegramService.sendPasswordResetToken(
                resetToken.user.telegramId,
                resetToken.token,
                metadata
            )
        }

        return true;
    }

    public async newPassword(input: NewPasswordDto) {
        const { password, token } = input;

        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.PASSWORD_RESET
            }
        });

        if (!existingToken || !existingToken.userId) {
            throw new NotFoundException('Токен не найден');
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date();

        if (hasExpired) {
            throw new BadRequestException('Токен истек');
        }

        await this.prismaService.staff.update({
            where: {
                id: existingToken.userId
            },
            data: {
                password: await hash(password)
            }
        });

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.PASSWORD_RESET
            }
        });

        return true;
    }
}