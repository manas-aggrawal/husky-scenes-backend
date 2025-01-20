import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { MongooseModule } from '@nestjs/mongoose';

import { DB_URL } from './common/constants/app.constants';
import { UserModule } from './user/user.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuthModule } from './common/auth.module';
import { EventModule } from './event/events.module';
console.log('DB connect url: ', DB_URL);
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: DB_URL,
      }),
    }),
    UserModule,
    AuthModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
