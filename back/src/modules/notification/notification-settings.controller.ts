import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Staff } from '@/prisma/generated';
import { NotificationSettingsService } from './notification-settings.service';
import { ChangeNotificationsSettingsDto, ChangeNotificationsSettingsResponse } from './dto/change-notifications-settings.dto';

@ApiTags('Notification Settings')
@Authorization()
@ApiBearerAuth()
@Controller('notification-settings')
export class NotificationSettingsController {
    constructor(
        private readonly notificationSettingsService: NotificationSettingsService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Получить текущие настройки уведомлений' })
    @ApiResponse({
        status: 200,
        description: 'Настройки уведомлений получены',
        type: ChangeNotificationsSettingsResponse,
    })
    async getSettings(@Authorized() user: Staff) {
        return this.notificationSettingsService.getSettings(user);
    }

    @Post()
    @ApiOperation({ summary: 'Изменить настройки уведомлений' })
    @ApiResponse({
        status: 200,
        description: 'Настройки успешно обновлены',
        type: ChangeNotificationsSettingsResponse,
    })
    async changeSettings(
        @Authorized() user: Staff,
        @Body() input: ChangeNotificationsSettingsDto,
    ) {
        return this.notificationSettingsService.changeSettings(user, input);
    }
}