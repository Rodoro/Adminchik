export class AdminActionLogDto {
    readonly action: string;
    readonly user_id: string;
    readonly target_id?: string;
    readonly metadata?: object;
}