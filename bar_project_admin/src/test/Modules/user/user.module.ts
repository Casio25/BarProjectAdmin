
import { Module } from '@nestjs/common';
import { UserService } from '../../Services/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from '../../Controllers/user/user.controller';
import { UserDataService } from '../../DataServices/userData.service';


@Module({
  exports: [UserService, UserDataService],
  controllers: [UserController],
  providers: [UserService, UserDataService, PrismaService,]
})
export class UserModule {}
