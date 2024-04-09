import { UpdateAuthDto } from '../../Dto/auth/update-auth.dto';
import { ForgotPasswordDto } from '../../Dto/auth/ForgotPassword.dto';
import { AuthDataService } from '../../DataServices/authData.service';
/* eslint-disable prettier/prettier */
import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateAuth, ISignAuth } from '../../../utils/interface/authInterface';
import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from '../../Dto/auth/create-auth.dto';
import { SignInAuthDto } from '../../Dto/auth/signin-auth.dto';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/utils/interface/jwtpayloadInterface';
import { Order, User } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { IMailOption } from "../../../utils/interface/mailInterface";
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/utils/interface/IUser';
import { IForgotPassword } from 'src/utils/interface/IForgotPassword';

@Injectable()
export class AuthService {
  private authors: (CreateAuthDto | SignInAuthDto)[] = [];
  constructor(private authDataService: AuthDataService,
              private jwtService: JwtService){}
  //creating new user
  async createAuth(createAuthDto: ICreateAuth) {
    try {
      const user = await this.authDataService.findUser(createAuthDto.email)
      if (user) {
        throw new Error("User already exists")
      }
      await this.authDataService.createUser(createAuthDto);
      const payload = {email: createAuthDto.email}
      const jwtToken = await this.jwtService.signAsync(payload);
      await this.sendEmail(createAuthDto.email, jwtToken)
        .then(() => {
          console.log('User Registered and email sent successfully');
        })
        .catch((error) => {
          console.log('User registered, but email sending failed:', error);
        });
    } catch (error) {
      console.error('Error creating user:', error.message);
      return { error: error.message };
    }
  }

  async resendEmail(forgotPasswordDto: IForgotPassword): Promise<any> {
    console.log("resend email user email: ", forgotPasswordDto.email)
    const user = await this.authDataService.findUser(forgotPasswordDto.email);
    try {
      if (user?.email !== forgotPasswordDto.email) {
        throw new Error("User with this email doesn't exist")
      }
      const payload = { email: user.email }
      const jwtToken = await this.jwtService.signAsync(payload);
      await this.sendEmail(forgotPasswordDto.email, jwtToken)
        .then(() => {
          console.log('email resend succesfully');
        })
        .catch((error) => {
          console.log('Email resending failed:', error);
        });
  }catch (error){
    console.error("Error resending email: ", error.message);
    return {error: error.message};
  }
}


  //sending email
  private sendEmail(email: string, jwtToken:string): Promise<void> {
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
        to: email,
        subject: 'Order Confirmation',
        text: `You have successfully registered with your ${email} email address.\nTo finish your registration, click on the link below:\n\nhttp://localhost:3000/en/verify`,
        html: `<p>You have successfully registered with your ${email} email address.</p>
         <p>To finish your registration, click on the link below:</p>
         <a href="http://localhost:3000/en/verify?token=${jwtToken}" id="verification-link">Verify Email</a>`,
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

  async signIn(signInAuthDto: ISignAuth): Promise<any> {
    const user = await this.authDataService.findUser(signInAuthDto.email);
    try{

    if (user?.email !== signInAuthDto.email) {
       throw new Error("User with this email doesn't exist")
    }

    const isPasswordValid = user.password === signInAuthDto.password;
    if (!isPasswordValid) {
      return { error: "Wrong password" };
    }

    const { password, ...result } = user;
    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }catch(error){
      console.error('Error logging in:', error.message);
      return { error: error.message };
  }
  }

  //onetimejwttoken generation
  async oneTimeToken(req: any){
    const user = await this.authDataService.findUser(req.email);

    const { password, ...result } = user;
    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }


  async forgotPassword(forgotPasswordDto: IForgotPassword): Promise<any> {
    const user = await this.authDataService.findUser(forgotPasswordDto.email);
    try {
      if (user?.email !== forgotPasswordDto.email) {
        throw new Error("User with this email doesn't exist")
      }
      const payload = { email: user.email }
      const jwtToken = await this.jwtService.signAsync(payload);
      await this.forgotPasswordEmail(forgotPasswordDto.email, jwtToken)
        .then(() => {
          console.log('email resend succesfully');
        })
        .catch((error) => {
          console.log('Email resending failed:', error);
        });
    } catch (error) {
      console.error("Error resending email: ", error.message);
      return { error: error.message };
    }
  }


  async update(req: any, updateAuthDto: UpdateAuthDto) {
    console.log(updateAuthDto)
    const allowedFields = ['email', 'firstName', 'secondName', 'isEmailConfirmed', 'password', 'phoneNumber', 'role'];
    const where: any = {};

    allowedFields.forEach(field => {
      if (updateAuthDto[field] !== undefined) {
        where[field] = updateAuthDto[field];
      }
    });

    try {
      const user = await this.authDataService.findUser(req.email);

      if (!user) {
        throw new Error("User doesn't exist");
      }

      // Assuming you have an update method in authDataService
      await this.authDataService.update(user, where);

      // You may return some response here if needed
    } catch (error) {
      throw error;
    }
  }

  async verify(req: any) {
    try {
      const user = await this.authDataService.findUser(req.email);
      console.log(user)

      if (!user) {
        throw new Error("User doesn't exist");
      }

      const where: any = {
        isEmailConfirmed: true
      }

      // Assuming you have an update method in authDataService
      await this.authDataService.update(user, where);

      // You may return some response here if needed
    } catch (error) {
      throw error;
    }
  }





  private forgotPasswordEmail(email: string, jwtToken: string): Promise<void> {
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
        to: email,
        subject: 'Order Confirmation',
        text: `You requested to change password with this ${email} email address \n
        To change your password, click on the link below:\n http://localhost:3000/en/change_password `,
        html: `<p>You requested to change password with this ${email} email address.</p>
         <p>To change your password, click on the link below:</p>
         <a href="http://localhost:3000/en/change_password?token=${jwtToken}" id="verification-link">ChangePassword</a>`,
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




}


