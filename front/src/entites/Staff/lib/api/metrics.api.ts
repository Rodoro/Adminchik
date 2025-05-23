import { apiClient } from "@/shared/lib/utils/api-client";

export type UserActivityLog = {
    timestamp: string;
    action: string;
    endpoint: string;
    status: number;
    duration_ms: number;
    ip: string;
    details: string;
    request_id: string;
};

export type PaginatedResponse<T> = {
    data: T[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
};

export const metricsApi = {
    getUserActivityLogs: async (
        userId: string,
        page: number,
        pageSize: number,
        filters?: {
            action?: string;
            endpoint?: string;
            dateFrom?: string;
            dateTo?: string;
        }
    ): Promise<PaginatedResponse<UserActivityLog>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
        });

        if (filters?.action) params.append('action', filters.action);
        if (filters?.endpoint) params.append('endpoint', filters.endpoint);
        if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters?.dateTo) params.append('dateTo', filters.dateTo);

        return apiClient.get(`/logs/users/${userId}/activity-logs?${params.toString()}`);
    },

    getAvailableActions: async (userId: string): Promise<string[]> => {
        return apiClient.get(`/logs/users/${userId}/activity-logs/actions`);
    }
};