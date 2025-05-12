import { Markup } from 'telegraf'

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[Markup.button.callback('👤 Просмотреть профиль', 'me')],
		[Markup.button.url('🌐 На сайт', 'https://nimda.gravitynode.ru')]
	]),
	profile: Markup.inlineKeyboard([
		Markup.button.url(
			'⚙️ Настройки аккаунта',
			'https://nimda.gravitynode.ru/settings'
		)
	])
}
