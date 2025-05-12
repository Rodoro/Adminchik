import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ChangeNotificationsSettingsDto {
    @ApiProperty({
        description: 'Включены ли уведомления о входе в систему',
        default: true,
    })
    @IsBoolean()
    authLogin: boolean;

    @ApiProperty({
        description: 'Включены ли уведомления о сбросе пароля',
        default: true,
    })
    @IsBoolean()
    passwordReset: boolean;
}

export class ChangeNotificationsSettingsResponse {
    @ApiProperty({
        description: 'Обновленные настройки уведомлений',
    })
    notificationSettings: {
        authLogin: boolean;
        passwordReset: boolean;
    };

    @ApiProperty({
        description: 'Токен для авторизации в Telegram (если требуется)',
        required: false,
    })
    telegramAuthToken?: string;
}