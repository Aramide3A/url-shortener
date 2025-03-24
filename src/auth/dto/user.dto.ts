import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class userValidationDto {
  @ApiProperty({
    name: 'username',
    description: 'Username of the user(should be email)',
    example: 'alalaa@gmail.com',
  })
  @IsEmail()
  username: string;

  @ApiProperty({
    name: 'password',
    description: 'Password of the user',
    example: '12345678',
  })
  @IsNotEmpty()
  password: string;
}
