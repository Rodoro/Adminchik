import { z } from 'zod'

export const loginSchema = z.object({
    email: z
        .string({
            required_error: "Email обязателен для заполнения",
            invalid_type_error: "Email должен быть строкой"
        })
        .min(1, { message: "Поле email не может быть пустым" })
        .email({ message: "Введите корректный email адрес" }),

    password: z
        .string({
            required_error: "Пароль обязателен для заполнения",
            invalid_type_error: "Пароль должен быть строкой"
        })
        .min(6, { message: "Пароль должен содержать минимум 6 символов" })
})

export type LoginSchema = z.infer<typeof loginSchema>