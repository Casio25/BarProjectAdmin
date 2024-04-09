import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from "@nestjs/class-validator";
import { Role } from '@prisma/client';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
    @IsOptional()
    @IsEnum(Role)
    role: Role;
}
