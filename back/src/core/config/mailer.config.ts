import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export function getMailerConfig(
    configService: ConfigService
): MailerOptions {
    return {
        transport: {
            host: configService.getOrThrow<string>("MAILER_HOST"),

            auth: {
                user: configService.getOrThrow<string>("MAILER_USER"),
                pass: configService.getOrThrow<string>("MAILER_PASSWORD"),
            },
            tls: {
                rejectUnauthorized: false
            }

        },
        defaults: {
            from: `"No-Reply" ${configService.getOrThrow<string>("MAILER_USER")}`,
        }
    }
}