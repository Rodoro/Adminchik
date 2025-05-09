import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from 'src/shared/utils/is-dev.utils';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { StaffModule } from '../modules/staff/staff.module';
import { SessionModule } from '../modules/session/session.module';
import { MailModule } from '../modules/mail/mail.module';
import { PasswordModule } from '../modules/password/password.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true
    }),
    PrismaModule,
    RedisModule,
    MailModule,

    StaffModule,
    SessionModule,
    PasswordModule
  ],
})
export class CoreModule { }
