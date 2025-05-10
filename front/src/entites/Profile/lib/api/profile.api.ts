import { apiClient } from '@/shared/lib/utils/api-client'
import { TypeChangeInfoSchema } from '../../schemas/change-info.schema'

export const profileApi = {
    changeInfo: async (data: TypeChangeInfoSchema): Promise<boolean> => {
        return apiClient.put('/profile/info', data)
    },

    getCurrent: async (): Promise<{
        firstName: string
        midleName: string
        lastName: string
        displayName: string
        bio?: string
    }> => {
        return apiClient.get('/profile/me')
    }
}