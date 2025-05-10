import { z } from 'zod'

export const changeInfoSchema = z.object({
    firstName: z
        .string({
            required_error: "Имя обязательно для заполнения",
            invalid_type_error: "Имя должно быть строкой"
        })
        .min(1, { message: "Имя не может быть пустым" })
        .regex(/^[a-zA-Zа-яА-Я0-9]+(?:-[a-zA-Zа-яА-Я0-9]+)*$/, {
            message: "Имя может содержать только буквы, цифры и дефисы"
        }),

    midleName: z
        .string({
            required_error: "Отчество обязательно для заполнения",
            invalid_type_error: "Отчество должно быть строкой"
        }),

    lastName: z
        .string({
            required_error: "Фамилия обязательна для заполнения",
            invalid_type_error: "Фамилия должна быть строкой"
        })
        .min(1, { message: "Фамилия не может быть пустым" })
        .regex(/^[a-zA-Zа-яА-Я0-9]+(?:-[a-zA-Zа-яА-Я0-9]+)*$/, {
            message: "Фамилия может содержать только буквы, цифры и дефисы"
        }),

    displayName: z
        .string({
            required_error: "Отображаемое имя обязательно",
            invalid_type_error: "Отображаемое имя должно быть строкой"
        })
        .min(1, { message: "Отображаемое имя не может быть пустым" }),

    bio: z
        .string({
            invalid_type_error: "Описание должно быть строкой"
        })
        .max(300, { message: "Описание должно быть не длиннее 300 символов" })
        .optional()
})

export type TypeChangeInfoSchema = z.infer<typeof changeInfoSchema>