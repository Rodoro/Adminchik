import { apiClient } from '@/shared/lib/utils/api-client';

export const avatarApi = {

    async uploadAvatar(file: File): Promise<{ success: boolean; message: string }> {
        const formData = new FormData();

        formData.append('avatar', file, file.name);

        // console.log('Отправляемый файл:', {
        //     name: file.name,
        //     size: file.size,
        //     type: file.type,
        //     lastModified: file.lastModified
        // });

        try {
            await apiClient.post('/profile/avatar', formData);

            return {
                success: true,
                message: 'Аватар успешно обновлен'
            };
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            throw new Error('Ошибка при загрузке аватара');
        }
    },


    removeAvatar: async (): Promise<{ success: boolean }> => {
        return apiClient.delete('/profile/avatar')
    },

};