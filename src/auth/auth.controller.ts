import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/orm/user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialsLoginDto } from './dto/auth-credentials-login.dto';
import { AuthCredentialsRegisterDto } from './dto/auth-credentials-register.dto';
import { TokenVerificationDto } from './dto/token-verification.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(
    @Body(ValidationPipe)
    authCredentialsRegisterDto: AuthCredentialsRegisterDto,
  ): Promise<void> {
    return this.authService.register(authCredentialsRegisterDto);
  }

  @Post('/login')
  login(
    @Body(ValidationPipe) authCredentialsLoginDto: AuthCredentialsLoginDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(authCredentialsLoginDto);
  }

  @Post('/verify_token')
  @UseGuards(AuthGuard())
  verifyToken(@GetUser() user: User) {
    return user;
  }
}
