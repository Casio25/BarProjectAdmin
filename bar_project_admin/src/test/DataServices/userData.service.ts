import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order, User } from '@prisma/client';
@Injectable()
export class UserDataService {
    constructor(private prisma: PrismaService) { }

    async findUser(email: string): Promise<User | null> {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    email: email
                },
            });
            
            return user || null
        }
        catch (error) {
            console.error("Error finding user: ", error)
            throw new Error(error);
        }
    }
}