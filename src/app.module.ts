import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UrlModule } from './url/url.module';

@Module({
  imports: [AuthModule, UserModule,ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UrlModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
