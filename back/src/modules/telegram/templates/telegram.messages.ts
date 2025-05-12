import type { Staff } from '@/prisma/generated'
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types'

export const MESSAGES = {
	welcome: () =>
		`<b>👋 Добро пожаловать в TeaStream Bot!</b>\n\n` +
		`Чтобы получать уведомления и улучшить ваш опыт использования платформы, давайте свяжем ваш Telegram аккаунт с TeaStream.\n\n` +
		`Нажмите на кнопку ниже и перейдите в раздел <b>Уведомления</b>, чтобы завершить настройку.`,
	authSuccess: `🎉 Вы успешно авторизовались и Telegram аккаунт связан с панелью Adminchik!\n\n`,
	invalidToken: '❌ Недействительный или просроченный токен.',
	profile: (user: Staff) =>
		`<b>👤 Профиль пользователя:</b>\n\n` +
		`👤 Имя пользователя: <b>${user.displayName}</b>\n` +
		`📧 Email: <b>${user.email}</b>\n` +
		`📝 О себе: <b>${user.bio || 'Не указано'}</b>\n\n` +
		`🔧 Нажмите на кнопку ниже, чтобы перейти к настройкам профиля.`,
	loginStaff: (metadata: SessionMetadata) =>
		`<b>👤 Вход в акаунт</b>\n\n` +
		`Пользователь вошел в акаунт <b>Adminchik</b>.\n\n` +
		`Если это были не вы, срочно поменяйте пароль, и свжитесь с главным администратром. Данные входа:\n\n` +
		`📅 <b>Дата запроса:</b> ${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}\n\n` +
		`🖥️ <b>Информация о запросе:</b>\n\n` +
		`🌍 <b>Расположение:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`📱 <b>Операционная система:</b> ${metadata.device.os}\n` +
		`🌐 <b>Браузер:</b> ${metadata.device.browser}\n` +
		`💻 <b>IP-адрес:</b> ${metadata.ip}\n\n`,
	resetPassword: (token: string, metadata: SessionMetadata) =>
		`<b>🔒 Сброс пароля</b>\n\n` +
		`Вы запросили сброс пароля для вашей учетной записи на панели <b>Adminchik</b>.\n\n` +
		`Чтобы создать новый пароль, пожалуйста, перейдите по следующей ссылке:\n\n` +
		`<b><a href="https:/nimda.gravitynode.ru/recovery/${token}">Сбросить пароль</a></b>\n\n` +
		`📅 <b>Дата запроса:</b> ${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}\n\n` +
		`🖥️ <b>Информация о запросе:</b>\n\n` +
		`🌍 <b>Расположение:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`📱 <b>Операционная система:</b> ${metadata.device.os}\n` +
		`🌐 <b>Браузер:</b> ${metadata.device.browser}\n` +
		`💻 <b>IP-адрес:</b> ${metadata.ip}\n\n` +
		`Если вы не делали этот запрос, просто проигнорируйте это сообщение.\n\n`,
}
