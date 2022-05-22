import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserGender } from 'src/users/enum/user-gender.enum';

export class AuthCredentialsRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The Password is too weak!',
  })
  password: string;

  @IsOptional()
  @IsDateString()
  birth: Date;

  @IsOptional()
  @IsIn([
    UserGender.FEMALE,
    UserGender.MALE,
    UserGender.OTHER,
    UserGender.NORESPONSE,
  ])
  gender: UserGender;
}
