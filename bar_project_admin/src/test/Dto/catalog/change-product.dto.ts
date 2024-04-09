import { IsString, IsInt, IsNotEmpty, IsBoolean, IsArray } from "@nestjs/class-validator";
import { IsOptional } from "class-validator";
export  class ChangeProductDto {

    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsInt()
    @IsNotEmpty()
    authorId: number;

    @IsInt()
    @IsNotEmpty()
    price: number;

    @IsString()
    photo: string;

    @IsInt()
    @IsNotEmpty()
    categoryId: number;

    @IsInt()
    @IsNotEmpty()
    order: number;

    @IsString()
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    visibility: boolean;

    @IsBoolean()
    @IsNotEmpty()
    inStock: boolean;
}