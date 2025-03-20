import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { userValidationDto } from './dto/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { signUpdto } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async validate(body: userValidationDto) {
    const { username, password } = body;
    const findUser = await this.userService.findUser(username);
    if (!findUser) throw new NotFoundException('User not found');

    const comparePassword = await bcrypt.compare(password, findUser.password);
    if (!comparePassword)
      throw new UnauthorizedException('Invalid Credentials pass');

    return findUser;
  }

  async signIn(user) {
    const payload = { sub: user.id, email: user.email };
    return { token: await this.jwt.sign(payload) };
  }

  async createUser(body: signUpdto) {
    const { name, email, password } = body;

    const checkEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (checkEmail) throw new ConflictException('Email already in use');

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = await this.prisma.user.create({
      data: { name, email, password: hashPassword },
    });

    return await this.signIn(newUser);
  }
}
