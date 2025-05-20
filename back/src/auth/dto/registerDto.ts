import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.trim())
  @Type(() => String)
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  })
  @Matches(/[a-zA-Z]/, {
    message: 'Le mot de passe doit contenir au moins une lettre.',
  })
  @Matches(/[0-9]/, {
    message: 'Le mot de passe doit contenir au moins un chiffre.',
  })
  @Matches(/[^a-zA-Z0-9]/, {
    message: 'Le mot de passe doit contenir au moins un caractère spécial.',
  })
  @Transform(({ value }: { value: string }) => value.trim())
  @Type(() => String)
  password: string;

  @ApiProperty()
  @IsString()
  @Length(2, 255, { message: 'Le prénom doit contenir au moins 2 caractères.' })
  @Transform(({ value }: { value: string }) => value.trim())
  @Type(() => String)
  firstName: string;

  @ApiProperty()
  @IsString()
  @Length(2, 255, { message: 'Le nom doit contenir au moins 2 caractères.' })
  @Transform(({ value }: { value: string }) => value.trim())
  @Type(() => String)
  lastName: string;
}
