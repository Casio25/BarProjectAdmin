import { IsString, IsInt, IsNotEmpty, IsBoolean, IsArray } from "@nestjs/class-validator";
import { IsOptional } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    authorId: number;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    string: string;

    @IsInt()
    @IsNotEmpty()
    price: number;

    @IsString()
    photo: string;

    @IsInt()
    @IsNotEmpty()
    categoryId: number;

    

    @IsString()
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    visibility: boolean;

    @IsBoolean()
    @IsNotEmpty()
    inStock: boolean;
}
