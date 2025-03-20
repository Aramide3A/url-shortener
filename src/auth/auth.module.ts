import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
  ],
})
export class AuthModule {}
