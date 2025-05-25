import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma.service';
import { UserNotFoundError } from './user.error';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new UserNotFoundError(id);
      }

      return user;
    } catch (error: unknown) {
      throw new UserNotFoundError(id);
    }
  }

  findAll(params: { page: number; limit: number }) {
    const { page, limit } = params;
    return this.prisma.user.findMany({
      skip: limit * (page - 1),
      take: limit,
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  updateUser(id: string, data: Prisma.UserCreateInput) {
    return this.prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async updatePassword(token: string, password: string) {
    const foundToken = await this.prisma.token.findFirstOrThrow({
      select: {
        userId: true,
      },
      where: {
        id: token,
      },
    });

    await this.prisma.user.update({
      data: {
        password: await bcrypt.hash(password, 10),
      },
      where: {
        id: foundToken.userId,
      },
    });

    await this.prisma.token.update({
      data: {
        usedAt: new Date(),
      },
      where: {
        id: token,
      },
    });
  }

  deleteUser(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
