import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SignInDto {
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide.' })
  @Transform(({ value }: { value: string }) => value.trim())
  @Type(() => String)
  email: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Le mot de passe ne doit pas être vide.' })
  @Transform(({ value }: { value: string }) => value.trim())
  @Type(() => String)
  password: string;
}
