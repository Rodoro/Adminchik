import { z } from 'zod'

export const newPasswordSchema = z
	.object({
		password: z
			.string({
				required_error: 'Пароль обязателен для заполнения',
				invalid_type_error: 'Пароль должен быть строкой'
			})
			.min(8, {
				message: 'Пароль должен содержать минимум 8 символов'
			})
			.regex(/[A-Z]/, {
				message: 'Пароль должен содержать хотя бы одну заглавную букву'
			})
			.regex(/[0-9]/, {
				message: 'Пароль должен содержать хотя бы одну цифру'
			})
			.regex(/[^A-Za-z0-9]/, {
				message: 'Пароль должен содержать хотя бы один специальный символ'
			}),

		passwordRepeat: z
			.string({
				required_error: 'Повтор пароля обязателен',
				invalid_type_error: 'Повтор пароля должен быть строкой'
			})
	})
	.refine(data => data.password === data.passwordRepeat, {
		message: 'Пароли не совпадают',
		path: ['passwordRepeat']
	})

export type TypeNewPasswordSchema = z.infer<typeof newPasswordSchema>