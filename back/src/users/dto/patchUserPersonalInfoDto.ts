import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class PatchUserPersonalInfoDto {
  @ApiProperty()
  @IsString()
  @Type(() => String)
  firstName: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  lastName: string;
}
