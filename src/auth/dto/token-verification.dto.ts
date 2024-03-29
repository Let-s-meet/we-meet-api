import { IsNotEmpty, IsString } from 'class-validator';

export class TokenVerificationDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
