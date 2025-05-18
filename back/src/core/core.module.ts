import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from 'src/shared/utils/is-dev.utils';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { StaffModule } from '../modules/staff/staff.module';
import { SessionModule } from '../modules/session/session.module';
import { MailModule } from '../modules/mail/mail.module';
import { PasswordModule } from '../modules/password/password.module';
import { MinioModule } from './minio/minio.module';
import { ProfileModule } from '../modules/profile/profile.module';
import { TelegramModule } from '../modules/telegram/telegram.module';
import { NotificationSettingsModule } from '../modules/notification/notification-settings.module';
import { LoggingModule } from '../modules/logging/logging.module';
import { ClickHouseModule } from './clickhouse/clickhouse.module';
import { LoggingInterceptor } from '../modules/logging/logging.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorFilter } from '../modules/logging/error.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true
    }),
    PrismaModule,
    RedisModule,
    MailModule,
    MinioModule,
    TelegramModule,
    ClickHouseModule,

    StaffModule,
    SessionModule,
    PasswordModule,
    ProfileModule,
    NotificationSettingsModule,
    LoggingModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ]
})
export class CoreModule { }
