import { apiClient } from "@/shared/lib/utils/api-client";


export const metricsApi = {
    getRequests: async (range: '3h' | '24h' | '7d' | '30d' | '' = '7d') => {
        return apiClient.get<Array<{
            time: string;
            total_requests: number;
            error_requests: number;
            avg_duration: number;
        }>>(`/logs/requests?range=${range == '' ? '24h' : range}`);
    },

    getAdminActions: async () => {
        return apiClient.get<Array<{
            action: string;
            count: number;
            unique_users: number;
        }>>('/logs/admin-actions');
    },

    getErrors: async (range: '24h' | '7d' | '30d' | '' = '24h') => {
        return apiClient.get<Array<{
            type: string;
            count: number;
            last_message: string;
        }>>(`/logs/errors?range=${range == '' ? '24h' : range}`);
    },

    getHttpRequestsPaginated: async (page: number, pageSize: number) => {
        return apiClient.get<{
            data: Array<{
                timestamp: string;
                method: string;
                path: string;
                status: number;
                duration_ms: number;
                ip: string;
                user_id: string | null;
                request_id: string;
            }>;
            pagination: {
                total: number;
                page: number;
                pageSize: number;
                totalPages: number;
            };
        }>(`/logs/http-requests?page=${page}&pageSize=${pageSize}`);
    },

    getErrorLogsPaginated: async (page: number, pageSize: number) => {
        return apiClient.get<{
            data: Array<{
                timestamp: string;
                type: string;
                message: string;
                stack_trace: string;
                request_id: string | null;
                user_id: string | null;
                path: string;
                method: string;
                status: number;
                request_body: string | null;
                response_body: string | null;
            }>;
            pagination: {
                total: number;
                page: number;
                pageSize: number;
                totalPages: number;
            };
        }>(`/logs/errors-page?page=${page}&pageSize=${pageSize}`);
    },

    getEndpoints: async (range: '3h' | '24h' | '7d' | '30d' | '' = '7d') => {
        return apiClient.get<Array<{
            path: string;
            method: string;
            requests: number;
            avg_duration: number;
            errors: number;
        }>>(`/logs/endpoints?range=${range == '' ? '24h' : range}`);
    },
};