/* eslint-disable prettier/prettier */
import { GetOrderDto } from '../../Dto/order/getOrderDto';
import { OrderService } from './../../Services/order/order.service';
import { Body, Controller, Post, Get, Param, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { CreateOrderDto } from 'src/logic/Dto/order/create-order.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { IRequest, IOrdersRequest } from 'src/utils/interface/requestInterface';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':id')
  getId(@Param('id') id: string) {
    return [{ id }];
  }

  @UseGuards(AuthGuard)
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() request: IRequest) {
    const userEmail = createOrderDto.userEmail;
    
    console.log('User Email:', userEmail);
    console.log(createOrderDto.userEmail)
    return this.orderService.createOrder(createOrderDto)
  }
  @UseGuards(AuthGuard)
  @Get()
  getOrders(@Req() request: IOrdersRequest) {
    
    const email = request.user.email; 
    console.log(" to get history: ", email);
    return this.orderService.getOrders( email );
  }

  
}
