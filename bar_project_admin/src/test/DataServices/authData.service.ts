import { IsNotEmpty } from '@nestjs/class-validator';
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Order, Role } from '@prisma/client';
import { ICreateAuth } from '../../utils/interface/authInterface';
import { IUser } from 'src/utils/interface/IUser';


interface IUpdateData {
    id: number;
    email: string;
    password: string;
    firstName: string;
    secondName: string;
    phoneNumber: string;
    role: Role;
    isEmailConfirmed: boolean;
}

@Injectable()
export class AuthDataService {
    constructor(private prisma: PrismaService) { }

    // Check if user with the same email already exists

    async findUser(email: string): Promise<User | null> {
        try {
            const user =  await this.prisma.user.findFirst({
                where: {
                    email: email
                },
            });
            return user || null
        }
        catch (error){
            console.error("Error finding user: ", error)
            throw new Error(error);
        }
    }

    async createUser(userData: ICreateAuth): Promise<User> {
        try {            

            // If no existing user found, create a new user
            const newUser = await this.prisma.user.create({
                data: {
                    firstName: userData.firstName,
                    secondName: userData.secondName,
                    email: userData.email,
                    password: userData.password,
                },
            });


            if (!newUser || newUser.id == null) {
                // Handle the case where user creation failed
                throw new Error('User not created');
            }

            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('User not created');
            
        }
    }

    async update(user :IUpdateData, where?: IUpdateData): Promise<User | null> {
        console.log("where: ", where)
        try {
            const updatedUser = await this.prisma.user.update({
                where:{
                    id: user.id
                },
                data: {
                    isEmailConfirmed: true,
                    firstName: where.firstName,
                    secondName: where.secondName,
                    password: where.password,
                    role: where.role,
                    phoneNumber: where.phoneNumber


                }
            });


            if (!updatedUser || updatedUser.email == null) {
                // Handle the case where user creation failed
                throw new Error('User not verified');
            }

            return updatedUser;
        } catch (error) {
            console.error('Error verifing user:', error);
            throw new Error('User not veriofied');

        }
    }


    

   
}

