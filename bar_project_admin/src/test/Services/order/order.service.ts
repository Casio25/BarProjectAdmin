/* eslint-disable prettier/prettier */
import { Injectable, Req } from '@nestjs/common';
import { CreateOrderDto } from 'src/logic/Dto/order/create-order.dto';
import * as nodemailer from 'nodemailer';
import { RandomSymbols } from '../../../data/util';
import { ICreateOrder } from "../../../utils/interface/orderInterface"
import { IMailOption } from "../../../utils/interface/mailInterface"
import { IGetOrder } from 'src/utils/interface/IGetOrder';
// import { createOrder } from './order.data-service';
import { OrderDataService } from '../../DataServices/orderData.service';
import { AuthDataService } from 'src/logic/DataServices/authData.service';
import { AuthService } from 'src/logic/Services/auth/auth.service';
import * as fs from 'fs';








@Injectable()
export class OrderService {
  private orders: CreateOrderDto[] = [];
  constructor(private orderDataService: OrderDataService,
    private authDataService: AuthDataService,
    private authService: AuthService) { }


  async createOrder(createOrderDto: ICreateOrder) {
    this.orders.push(createOrderDto);
    createOrderDto.orderId = this.randomOrder(createOrderDto.date);
    this.saveOrderToFile(createOrderDto);
    this.orderDataService.Test();
    const user = await this.authDataService.findUser(createOrderDto.userEmail);
    this.orderDataService.createOne(createOrderDto, user)
    this.sendEmail(createOrderDto.orderId, createOrderDto.userEmail)
      .then(() => {
        console.log('Order created and email sent successfully');
      })
      .catch((error) => {
        console.log('Order created, but email sending failed:', error);
      });

    return createOrderDto;
  }

  private saveOrderToFile(order: ICreateOrder): void {
    const orderData = JSON.stringify(order) + '\n';
    fs.appendFileSync('order.txt', orderData);
  }

  private randomOrder(date: string): string {
    const randomOrderSymbols = RandomSymbols();
    const generatedOrders = new Set();
    let order = '';

    do {
      order = `${randomOrderSymbols} / ${date}`;
    } while (generatedOrders.has(order));
    generatedOrders.add(order);

    return order;
  }

  private sendEmail(orderId: string, userEmail: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mishakolomiets355@gmail.com',
          pass: 'jtkrcyyvszokkbqz',
        },
      });

      const mailOptions: IMailOption = {
        from: 'mishakolomietsus@gmail.com',
        to: userEmail,
        subject: 'Order Confirmation',
        text: `Your order with ID ${orderId} has been confirmed.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
          reject(error);
        } else {
          console.log('Email sent:', info.response);
          resolve();
        }
      });
    });
  }

  async getOrders(email: string) {
    try {
      
      const user = await this.authDataService.findUser(email);

      if (!user) {
        throw new Error('User not found');
      }

      // Find orders for this userid
      console.log(user)
      const where = {
        userId: user.id,
      }
      const orderHistory = await this.orderDataService.findOrders(where);

      return orderHistory;
    } catch (error) {

      console.error('Error:', error.message);
      throw error;
    }
  }

}

