import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class PatchEmailDto {
  @ApiProperty()
  @IsEmail()
  @Type(() => String)
  email: string;
}
