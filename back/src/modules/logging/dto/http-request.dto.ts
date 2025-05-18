export class HttpRequestLogDto {
    readonly method: string;
    readonly path: string;
    readonly status: number;
    readonly duration_ms: number;
    readonly ip: string;
    readonly user_id?: string;
    readonly request_id: string;
    readonly request_body?: string;
    readonly response_body?: string;
    readonly query_params?: string;
}