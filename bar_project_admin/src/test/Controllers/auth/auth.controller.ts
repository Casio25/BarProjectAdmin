import { SignInAuthDto } from '../../Dto/auth/signin-auth.dto';
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, HttpCode, HttpStatus, Request, UseGuards, Patch } from '@nestjs/common';
import { AuthGuard, OneTimeAuthGuard } from '../../../auth/auth.guard';
import { AuthService } from '../../Services/auth/auth.service';
import { CreateAuthDto } from '../../Dto/auth/create-auth.dto';
import { UpdateAuthDto } from '../../Dto/auth/update-auth.dto';
import { ForgotPasswordDto } from '../../Dto/auth/ForgotPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createAuth(createAuthDto);
  }
  @HttpCode(HttpStatus.OK)
   @Post("signin")
   signIn(@Body() signInAuthDto: SignInAuthDto) {
   return this.authService.signIn(signInAuthDto);
   }

   @Post("resend_email")
   resendEmail(@Body()forgotPasswordDto: ForgotPasswordDto){
    return this.authService.resendEmail(forgotPasswordDto)
   }

   @Post("forgot_password")
   forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
   return this.authService.forgotPassword(forgotPasswordDto)
   }

  @UseGuards(AuthGuard)
  @Get("verify")
  verifyEmail(@Request() req){
    return this.authService.verify(req.user)
  }

  @UseGuards(AuthGuard)
  @Patch("update")
  update(@Request() req, @Body() updateAuthDto: UpdateAuthDto){
    return this.authService.update(req.user, updateAuthDto)
  }
  @UseGuards(AuthGuard)
  @Get("one_time_token")
  oneTimeToken(@Request() req){
  return this.authService.oneTimeToken(req.user)
  }
  



  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req;
  }
  // @Post("verify")
  // verifyEmail(@Body() verifyAuthDto: VerifyAuthDto){
  //   return this.authService.verify(verifyAuthDto)
  // }
}
