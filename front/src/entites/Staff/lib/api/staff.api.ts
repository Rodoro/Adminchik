import { apiClient } from '@/shared/lib/utils/api-client'
import { Staff, StaffLoginData } from '../../types/staff.types'

export const staffApi = {
    login: async (data: StaffLoginData): Promise<Staff> => {
        return apiClient.post('/session/login', data)
    },

    logout: async (): Promise<void> => {
        return apiClient.post('/session/logout')
    },

    getCurrent: async (): Promise<Staff> => {
        return apiClient.get('/staff/me')
    }
}