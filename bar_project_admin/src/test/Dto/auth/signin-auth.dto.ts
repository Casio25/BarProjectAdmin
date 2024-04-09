/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty } from "@nestjs/class-validator";
import { IsString } from "class-validator";

export class SignInAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
}