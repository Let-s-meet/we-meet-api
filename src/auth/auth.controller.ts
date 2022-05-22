import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsLoginDto } from './dto/auth-credentials-login.dto';
import { AuthCredentialsRegisterDto } from './dto/auth-credentials-register.dto';

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
  ): Promise<{ userData: any; accessToken: string }> {
    return this.authService.login(authCredentialsLoginDto);
  }
}
