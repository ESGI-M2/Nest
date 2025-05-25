import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SendMessageDto {
  @ApiProperty({ description: 'Message content' })
  @IsString()
  @MinLength(1, { message: 'Le message ne doit pas être vide.' })
  @Length(1, 1000, {
    message: 'Le message ne doit pas dépasser 1000 caractères.',
  })
  @Transform(({ value }: { value: string }) => value.trim())
  @Type(() => String)
  content: string;

  @ApiProperty({ description: 'Recipient user ID' })
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @Type(() => String)
  recipientId: string;
}
