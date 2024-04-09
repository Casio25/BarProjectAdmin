import { AuthDataService } from '../../DataServices/authData.service';
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from '../../Services/auth/auth.service';
import { AuthController } from '../../Controllers/auth/auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../../auth/constants';


@Module({
  imports: [JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '3600s' },
  })],
  exports: [AuthService, AuthDataService],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AuthDataService],
})
export class AuthModule {}
