import { IsArray, IsOptional, IsString, ArrayMinSize } from 'class-validator';

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one recipient is required' })
  @IsString({ each: true })
  recipients: string[];
}
