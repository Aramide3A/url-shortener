import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class signUpdto {
  @ApiProperty({
    name: 'name',
    description: 'Name of the user',
    example: 'Abubakar',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    name: 'email',
    description: 'Email of the user',
    example: 'alalaa@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    description: 'Password of the user',
    example: '12345678',
  })
  @IsNotEmpty()
  password: string;
}
