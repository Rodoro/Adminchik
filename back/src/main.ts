import { NestFactory, Reflector } from '@nestjs/core';
import { CoreModule } from './core/core.module';
import { ConfigService } from '@nestjs/config'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { RedisService } from './core/redis/redis.service';
import { RedisStore } from 'connect-redis';
import { parseBoolean } from './shared/utils/parse-boolean.util';
import { ms, StringValue } from './shared/utils/ms.utils';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  const config = app.get(ConfigService)
  const redis = app.get(RedisService)

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  )

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(session({
    secret: config.getOrThrow<string>('SESSION_SECRET'),
    name: config.getOrThrow<string>('SESSION_NAME'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: config.getOrThrow<string>('SESSION_DOMAIN'),
      maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAXAGE')),
      httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
      secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
      sameSite: 'lax',
    },
    store: new RedisStore({
      client: redis,
      prefix: config.getOrThrow<string>('SESSION_FOLDER')
    })
  }))

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie']
  })

  const configSwager = new DocumentBuilder()
    .setTitle('Adminchik API')
    .setVersion('1.0')
    .addCookieAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwager);
  const customCss = readFileSync(join(__dirname, '../public/swagger-theme.css'), 'utf8');
  SwaggerModule.setup('api', app, document, {
    customCss,
    customSiteTitle: 'Staff API',
    customfavIcon: config.getOrThrow<string>('ALLOWED_ORIGIN') + "/favicon.ico",
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      defaultModelExpandDepth: 2,
      defaultModelsExpandDepth: 2,
    },
  });

  await app.listen(config.getOrThrow<string>('APP_PORT'));
}
bootstrap();
