import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf'
import { Context, Telegraf } from 'telegraf'

import { TokenType, type Staff } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types'

import { BUTTONS } from './templates/telegram.buttons'
import { MESSAGES } from './templates/telegram.messages'

@Update()
@Injectable()
export class TelegramService extends Telegraf {
	private readonly _token: string

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService
	) {
		super(configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'))
		this._token = configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN')
	}

	@Start()
	public async onStart(@Ctx() ctx: any) {
		const chatId = ctx.chat.id.toString()
		const token = ctx.message.text.split(' ')[1]

		if (token) {
			const authToken = await this.prismaService.token.findUnique({
				where: {
					token,
					type: TokenType.TELEGRAM_AUTH
				}
			})

			if (!authToken) {
				return await ctx.replyWithHTML(MESSAGES.invalidToken)
			}
			const hasExpired = new Date(authToken.expiresIn) < new Date()

			if (hasExpired || !authToken.userId) {
				return await ctx.replyWithHTML(MESSAGES.invalidToken)
			}

			await this.connectTelegram(authToken.userId, chatId)

			await this.prismaService.token.delete({
				where: {
					id: authToken.id
				}
			})

			await ctx.replyWithHTML(MESSAGES.authSuccess, BUTTONS.authSuccess)
		} else {
			const user = await this.findUserByChatId(chatId)

			if (user) {
				return await this.onMe(ctx)
			} else {
				await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.profile)
			}
		}
	}

	@Command('me')
	@Action('me')
	public async onMe(@Ctx() ctx: any) {
		const chatId = ctx.chat.id.toString()

		const user = await this.findUserByChatId(chatId)
		if (!user) {
			return
		}
		await ctx.replyWithHTML(
			MESSAGES.profile(user),
			BUTTONS.profile
		)
	}

	public async sendPasswordResetToken(
		chatId: string,
		token: string,
		metadata: SessionMetadata
	) {
		await this.telegram.sendMessage(
			chatId,
			MESSAGES.resetPassword(token, metadata),
			{ parse_mode: 'HTML' }
		)
	}

	public async sendLoginStaff(
		chatId: string,
		metadata: SessionMetadata
	) {
		await this.telegram.sendMessage(
			chatId,
			MESSAGES.loginStaff(metadata),
			{ parse_mode: 'HTML' }
		)
	}


	private async connectTelegram(userId: string, chatId: string) {
		await this.prismaService.staff.update({
			where: {
				id: userId
			},
			data: {
				telegramId: chatId
			}
		})
	}

	private async findUserByChatId(chatId: string) {
		const user = await this.prismaService.staff.findUnique({
			where: {
				telegramId: chatId
			},
		})

		return user
	}
}
