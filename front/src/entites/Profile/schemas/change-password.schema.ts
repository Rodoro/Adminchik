import { z } from 'zod'

export const changePasswordSchema = z.object({
    oldPassword: z
        .string({
            required_error: 'Старый пароль обязателен',
            invalid_type_error: 'Пароль должен быть строкой'
        })
        .min(8, { message: 'Пароль должен содержать минимум 8 символов' }),

    newPassword: z
        .string({
            required_error: 'Новый пароль обязателен',
            invalid_type_error: 'Пароль должен быть строкой'
        })
        .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
})

export type TypeChangePasswordSchema = z.infer<typeof changePasswordSchema>