import { Module } from '@nestjs/common';
import { NotificationSettingsService } from './notification-settings.service';
import { NotificationSettingsController } from './notification-settings.controller';
import { PrismaService } from '@/src/core/prisma/prisma.service';

@Module({
    controllers: [NotificationSettingsController],
    providers: [NotificationSettingsService, PrismaService],
})
export class NotificationSettingsModule { }