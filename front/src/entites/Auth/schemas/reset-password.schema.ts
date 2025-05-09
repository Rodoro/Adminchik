import { z } from 'zod'

export const resetPasswordSchema = z.object({
	email: z
		.string({
			required_error: 'Email обязателен для заполнения',
			invalid_type_error: 'Email должен быть строкой'
		})
		.min(1, { message: 'Поле email не может быть пустым' })
		.email({ message: 'Введите корректный email адрес' })
		.transform(email => email.toLowerCase().trim())
})

export type TypeResetPasswordSchema = z.infer<typeof resetPasswordSchema>