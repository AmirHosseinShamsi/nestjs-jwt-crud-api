import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import 'dotenv/config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    DatabaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
