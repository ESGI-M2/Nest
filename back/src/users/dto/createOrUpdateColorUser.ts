import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateOrUpdateColorUserDto {
  @ApiProperty()
  @IsString()
  @Type(() => String)
  profileColor: string;
}
