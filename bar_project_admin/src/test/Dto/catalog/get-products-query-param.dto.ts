import { IsString, IsInt, IsNotEmpty, IsArray, IsObject } from "@nestjs/class-validator";
import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

class PriceDto {
    @Min(0)
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    minPrice: number;

    @Min(0)
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    maxPrice: number;
}


export class GetProductsQueryParamDto {
    // @Min(0)
    // @IsNumber()
    // @Type(() => Number)
    // skip: number;

    // @Min(1)
    // @IsNumber()
    // @Type(() => Number)
    // take: number;


    @IsOptional()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    string: string;
}