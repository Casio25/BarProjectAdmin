import { IsEmail, IsNotEmpty, IsOptional } from "@nestjs/class-validator";
import { IsString } from "class-validator";

export class ForgotPasswordDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string
}