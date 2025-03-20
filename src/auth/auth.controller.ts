import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { localAuthGuard } from './guard/local.guard';
import { userValidationDto } from './dto/user.dto';
import { signUpdto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(localAuthGuard)
  @Post('login')
  login(@Body() body: userValidationDto, @Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('signup')
  signUp(@Body() body: signUpdto) {
    return this.authService.createUser(body);
  }
}
