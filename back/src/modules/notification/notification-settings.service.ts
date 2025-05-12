import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Staff } from '@/prisma/generated';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { TokenType } from '@/prisma/generated';
import { ChangeNotificationsSettingsDto, ChangeNotificationsSettingsResponse } from './dto/change-notifications-settings.dto';

@Injectable()
export class NotificationSettingsService {
    constructor(private readonly prismaService: PrismaService) { }

    async getSettings(user: Staff) {
        const settings = await this.prismaService.notificationSettings.findUnique({
            where: { userId: user.id },
        });

        if (!settings) {
            return {
                notificationSettings: {
                    authLogin: true,
                    passwordReset: true,
                },
            };
        }

        return {
            notificationSettings: {
                authLogin: settings.authLogin,
                passwordReset: settings.passwordReset,
            },
        };
    }

    public async changeSettings(
        user: Staff,
        input: ChangeNotificationsSettingsDto,
    ): Promise<ChangeNotificationsSettingsResponse> {
        const { authLogin, passwordReset } = input;

        const notificationSettings = await this.prismaService.notificationSettings.upsert({
            where: { userId: user.id },
            create: {
                authLogin,
                passwordReset,
                user: { connect: { id: user.id } },
            },
            update: { authLogin, passwordReset },
            include: { user: true },
        });

        if (!notificationSettings.user.telegramId) {
            const telegramAuthToken = await generateToken(
                this.prismaService,
                user,
                TokenType.TELEGRAM_AUTH,
            );

            return {
                notificationSettings: {
                    authLogin: notificationSettings.authLogin,
                    passwordReset: notificationSettings.passwordReset,
                },
                telegramAuthToken: telegramAuthToken.token,
            };
        }

        return {
            notificationSettings: {
                authLogin: notificationSettings.authLogin,
                passwordReset: notificationSettings.passwordReset,
            },
        };
    }
}