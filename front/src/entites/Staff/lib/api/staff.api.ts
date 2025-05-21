import { apiClient } from '@/shared/lib/utils/api-client';
import { Staff, StaffLoginData } from '../../types/staff.types';

export const staffApi = {
    login: async (data: StaffLoginData): Promise<Staff> => {
        return apiClient.post('/session/login', data);
    },

    logout: async (): Promise<void> => {
        return apiClient.post('/session/logout');
    },

    getCurrent: async (): Promise<Staff> => {
        return apiClient.get('/staff/me');
    },

    getAll: async () => {
        return apiClient.get<Staff[]>(`/staff/all`);
    },

    getById: async (id: string): Promise<Staff> => {
        return apiClient.get(`/staff/info/${id}`);
    },

    create: async (data: {
        email: string;
        password: string;
        displayName: string;
        firstName: string;
        lastName: string;
        midleName?: string;
        permissions?: number[];
    }): Promise<void> => {
        return apiClient.post('/staff', data);
    },

    update: async (id: string, data: {
        email: string;
        password?: string;
        displayName: string;
        firstName: string;
        lastName: string;
        midleName?: string;
        permissions?: number[];
    }): Promise<void> => {
        return apiClient.put(`/staff/${id}`, data);
    },

    delete: async (email: string): Promise<void> => {
        return apiClient.delete(`/staff`, { email });
    },

    addPermissions: async (staffId: string, permissions: number[]) => {
        return apiClient.post(`/staff/permissions/add`, { staffId, permissions });
    },

    removePermissions: async (staffId: string, permissions: number[]) => {
        return apiClient.post(`/staff/permissions/remove`, { staffId, permissions });
    },

    addProjects: async (staffId: string, projectIds: string[]) => {
        return apiClient.post(`/staff/projects/add`, { staffId, projectIds });
    },

    removeProjects: async (staffId: string, projectIds: string[]) => {
        return apiClient.post(`/staff/projects/remove`, { staffId, projectIds });
    },
};