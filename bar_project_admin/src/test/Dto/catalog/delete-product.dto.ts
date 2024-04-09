import { IsString, IsInt, IsNotEmpty, IsBoolean, IsArray } from "@nestjs/class-validator";
export class DeleteProductDto {
    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsInt()
    @IsNotEmpty()
    authorId: number;

    @IsInt()
    @IsNotEmpty()
    order: number;
}