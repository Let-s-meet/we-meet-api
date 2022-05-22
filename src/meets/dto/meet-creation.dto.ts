import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinDate,
  MinLength,
} from 'class-validator';

export class MeetCreationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  start: Date;

  @IsNotEmpty()
  @IsDateString()
  end: Date;

  @IsNotEmpty()
  @IsNumberString()
  seats: number;
}
