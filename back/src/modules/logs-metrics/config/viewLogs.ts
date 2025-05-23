type PathPattern =
    | string
    | { pattern: string, params: string[] };

export const INCLUDED_PATHS = [
    '/notification-settings',
    '/password/new',
    '/profile/avatar',
    '/profile/info',
    { pattern: '/session/[id]', params: ['id'] },
    '/session/login',
    '/session/logout',
    '/staff',
    { pattern: '/staff/[id]', params: ['id'] },
    { pattern: '/staff/avatar-del/[id]', params: ['id'] },
    { pattern: '/staff/avatar/[id]', params: ['id'] },
    '/staff/change-email',
    '/staff/change-password',
    '/staff/permissions/add',
    '/staff/permissions/remove',
    '/staff/projects/add',
    '/staff/projects/remove',
    { pattern: '/staff/session/[id]/[id]', params: ['id'] },
];

export const INCLUDED_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE'
];