import { apiClient } from '@/shared/lib/utils/api-client';

export const avatarApi = {

    async uploadAvatar(id: string, file: File): Promise<{ success: boolean; message: string }> {
        const formData = new FormData();

        formData.append('avatar', file, file.name);
        try {
            await apiClient.post('/staff/avatar/' + id, formData);

            return {
                success: true,
                message: 'Аватар успешно обновлен'
            };
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            throw new Error('Ошибка при загрузке аватара');
        }
    },


    removeAvatar: async (id: string): Promise<{ success: boolean }> => {
        return apiClient.delete('/staff/avatar-del/' + id)
    },

};