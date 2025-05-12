import { apiClient } from '@/shared/lib/utils/api-client'
import { TypeChangeEmailSchema } from '../../schemas/change-email.schema'
import { TypeChangePasswordSchema } from '../../schemas/change-password.schema'

export const accountApi = {
    changeEmail: async (data: TypeChangeEmailSchema): Promise<boolean> => {
        return apiClient.post('/staff/change-email', data)
    },

    changePassword: async (data: TypeChangePasswordSchema): Promise<boolean> => {
        return apiClient.post('/staff/change-password', data)
    }
}