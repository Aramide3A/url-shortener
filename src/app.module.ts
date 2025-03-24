import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UrlModule } from './url/url.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 5,
        },
      ],
    }),
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UrlModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 300000,
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [ PrismaService],
})
export class AppModule {}
