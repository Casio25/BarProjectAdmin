/* eslint-disable prettier/prettier */
// prettier-ignore
import { ConsoleLogger, Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order, User } from '@prisma/client';
import { ICreateOrder } from '../../utils/interface/orderInterface'; 
import { IRequest } from 'src/utils/interface/requestInterface';
import { AuthDataService } from 'src/logic/DataServices/authData.service';
import { IUser } from 'src/utils/interface/userInterface';
import { IGetOrder } from 'src/utils/interface/IGetOrder';
@Injectable()
export class OrderDataService {
  constructor(private prisma: PrismaService) { }

  async createOne(order: ICreateOrder, user: IUser): Promise<Order> {
    console.log("created one logic");
    
    try {
      const createdOrder = await this.prisma.order.create({
        data: {
          userId: user.id,
          totalPrice: order.totalPrice,
          date: order.date,
          items: {
            create: order.items.map((item) => ({
              itemId: item.itemId,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
      });

      return createdOrder;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
  Test(): void {
    console.log("test")
  }
  async findOrders(where): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({
        where,
        include: {
          items: true, // Include the 'items' relation
        },
      });
    } catch (error) {
      throw new Error("Cannot find orders");
    }
  }

 
}