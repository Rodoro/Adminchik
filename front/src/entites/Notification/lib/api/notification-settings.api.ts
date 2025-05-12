import { apiClient } from '@/shared/lib/utils/api-client';
import { TypeChangeNotificationsSettingsSchema } from '../../schemas/change-notifications-settings.schema';

export const notificationSettingsApi = {
    getSettings: async (): Promise<{
        notificationSettings: {
            authLogin: boolean;
            passwordReset: boolean;
        };
        telegramAuthToken?: string;
    }> => {
        return apiClient.get('/notification-settings');
    },

    changeSettings: async (
        data: TypeChangeNotificationsSettingsSchema
    ): Promise<{
        notificationSettings: {
            authLogin: boolean;
            passwordReset: boolean;
        };
        telegramAuthToken?: string;
    }> => {
        return apiClient.post('/notification-settings', data);
    },
};