import { apiClient } from '@/shared/lib/utils/api-client'

export const passwordApi = {
    resetPassword: async (email: string, userAgent: string) => {
        return apiClient.post<{ success: boolean }>(
            '/password/reset',
            { email },
            { 'User-Agent': userAgent }
        )
    },

    setNewPassword: async (data: {
        password: string
        passwordRepeat: string
        token: string
    }) => {
        return apiClient.post<{ success: boolean }>('/password/new', data)
    }
}