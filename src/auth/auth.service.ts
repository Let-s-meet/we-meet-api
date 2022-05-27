import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/orm/user.repository';
import { AuthCredentialsLoginDto } from './dto/auth-credentials-login.dto';
import { AuthCredentialsRegisterDto } from './dto/auth-credentials-register.dto';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  private logger = new Logger('AuthService');

  async register(
    authCredentialsRegisterDto: AuthCredentialsRegisterDto,
  ): Promise<void> {
    await this.userRepository.register(authCredentialsRegisterDto);
  }

  async login(
    authCredentialsLoginDto: AuthCredentialsLoginDto,
  ): Promise<{ accessToken: string }> {
    const valid = await this.userRepository.validateUserPassword(
      authCredentialsLoginDto,
    );

    const { email } = authCredentialsLoginDto;
    if (!valid) {
      this.logger.debug(
        `Failed login attempt for user with email "${email}". Invalid Credentials`,
      );
      throw new UnauthorizedException('Invalid Credentials');
    }

    const user = await this.userRepository.findOneBy({ email: email });
    user.lastSuccessfullLogin = new Date();

    try {
      user.save();
    } catch (error) {
      console.log(error);
    }

    const payload: JwtPayload = { email };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken: accessToken };
  }
}
