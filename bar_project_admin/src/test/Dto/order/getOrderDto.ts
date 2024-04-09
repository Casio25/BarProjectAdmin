/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty } from "@nestjs/class-validator";
import { IsNumber } from "class-validator";

export class GetOrderDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;


}
