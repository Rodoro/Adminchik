export class ErrorLogDto {
    readonly type: string;
    readonly message: string;
    readonly stack_trace: string;
    readonly ip: string;
    readonly request_id?: string;
    readonly user_id?: string;
    readonly http_path?: string;
    readonly http_method?: string;
    readonly http_status?: string;
    readonly request_body?: object;
    readonly response_body?: object;
}