import { IsString, IsInt, IsNotEmpty, IsArray } from "@nestjs/class-validator";
import { IsOptional } from "class-validator";
export class CreateCategoryDto {

    @IsNotEmpty()
    @IsString()
    name: string
}