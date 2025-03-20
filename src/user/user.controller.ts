import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { signUpdto } from './dto/user.dto';
import { UserService } from './user.service';
import { jwtAuthGuard } from 'src/auth/guard/jwt.gaurd';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(jwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
