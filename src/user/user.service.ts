import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { signUpdto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException('User Not found');
    return user;
  }
}
