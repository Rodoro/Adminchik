export interface Staff {
    id: string
    email: string
    avatar: string
    bio?: string
    displayName: string
    firstName: string
    midleName: string
    lastName?: string
    telegramId?: string
    notificationSettings: {
        authLogin: boolean
        passwordReset: boolean
    }
}

export type StaffLoginData = {
    email: string
    password: string
}