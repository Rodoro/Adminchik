import { Session } from '@/entites/Session/types/session.types'
import { apiClient } from '@/shared/lib/utils/api-client'

export const sessionApi = {

    getAll: async (id: string): Promise<Session[]> => {
        return apiClient.get('/staff/session/' + id)
    },

    terminate: async (id: string, sessionId: string): Promise<void> => {
        return apiClient.delete(`/staff/session/${id}/${sessionId}`)
    },
}