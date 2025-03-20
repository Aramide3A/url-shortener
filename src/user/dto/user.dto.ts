import { IsEmail, IsNotEmpty } from "class-validator"

export class signUpdto{
    @IsNotEmpty()
    name : string

    @IsEmail()
    email : string

    @IsNotEmpty()
    password: string
}