import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { PasswordRecoveryTemplate } from './templates/password-recovery.template';
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';

@Injectable()
export class MailService {
    public constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) { }

    public async sendPasswordResetToken(email: string, token: string, metadata: SessionMetadata) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(PasswordRecoveryTemplate({ domain, token, metadata }))

        return this.sendMail(email, 'Сброс пароля', html)
    }

    private sendMail(email: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            to: email,
            subject,
            html,
        });
    }
}
