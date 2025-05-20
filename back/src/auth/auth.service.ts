import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/registerDto';
import EmailAlreadyExistsError from './exceptions/email-already-exists-error.exception.ts';
import { FormError } from 'src/common/exceptions/form-error.exception.ts';

export interface JwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user?.password || !(await bcrypt.compare(pass, user?.password))) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userWithoutPassword,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    const existingUserWithEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUserWithEmail) {
      throw new FormError({
        email: ["Cet email n'est pas disponible."],
      });
    }

    const cryptedPassword = await bcrypt.hash(password, 10);

    return await this.prisma.user.create({
      data: {
        email,
        password: cryptedPassword,
        firstName,
        lastName,
      },
    });
  }
}
