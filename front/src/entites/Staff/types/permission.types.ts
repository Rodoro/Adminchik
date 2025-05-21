export enum Permission {
    EDIT_PROFILE = 0,
    MANAGE_STAFF = 1,
    CHEK_LOGS = 2,
}

export const PermissionBadges: Record<Permission, string> = {
    [Permission.EDIT_PROFILE]: "Редактирование профиля",
    [Permission.MANAGE_STAFF]: "Управление персоналом",
    [Permission.CHEK_LOGS]: "Просмотр логов",
};