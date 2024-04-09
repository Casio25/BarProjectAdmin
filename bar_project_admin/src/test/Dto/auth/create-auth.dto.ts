/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional } from "@nestjs/class-validator";
import { IsString } from "class-validator";

export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;
    @IsString()
    @IsNotEmpty()
    secondName: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
    @IsOptional()
    phoneNumber: string;


    
    
}
