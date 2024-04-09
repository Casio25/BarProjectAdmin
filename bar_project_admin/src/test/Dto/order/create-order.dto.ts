/* eslint-disable prettier/prettier */
import { IsString, IsInt, IsNotEmpty, IsArray } from "@nestjs/class-validator";
export class CreateOrderDto {
  orderId: string;
  @IsArray()
  @IsNotEmpty({ each: true })
  items: Order[];
  @IsString()
  date: string;
  userEmail: string;
  userPassword: string;
  totalPrice: number;
}

export class Order {
  @IsInt()
  itemId: number;
  price: number;
  @IsInt()
  quantity: number;
}
