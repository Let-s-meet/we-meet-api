import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class MeetCreationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
