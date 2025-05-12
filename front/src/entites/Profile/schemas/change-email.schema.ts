import { z } from 'zod'

export const changeEmailSchema = z.object({
    email: z
        .string({
            required_error: 'Email обязателен для заполнения',
            invalid_type_error: 'Email должен быть строкой'
        })
        .email({ message: 'Неверный формат email' })
})

export type TypeChangeEmailSchema = z.infer<typeof changeEmailSchema>