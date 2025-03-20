import { IsEmail, IsNotEmpty } from 'class-validator';

export class userValidationDto {
  @IsEmail()
  username: string;

  @IsNotEmpty()
  password: string;
}
