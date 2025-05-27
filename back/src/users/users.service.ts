import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma.service';
import { UserNotFoundError } from './user.error';
import { EmailAlreadyTakenError } from 'src/auth/auth.error';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileColor: true,
        },
      });

      if (!user) {
        throw new UserNotFoundError(id);
      }

      return user;
    } catch (error: unknown) {
      throw new UserNotFoundError(id);
    }
  }

  async findAll(excludedUserIds: string[] = []) {
    const whereClause =
      excludedUserIds.length > 0 ? { id: { notIn: excludedUserIds } } : {};

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileColor: true,
        createdAt: true,
        updatedAt: true,
      },
      where: whereClause,
    });

    return users;
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

  async updateUserPersonalInfo(
    id: string,
    data: {
      firstName: string;
      lastName: string;
    },
  ) {
    return await this.prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async updateUserColor(id: string, color: string) {
    return await this.prisma.user.update({
      data: {
        profileColor: color,
      },
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

  async updateUserEmail(id: string, email: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (existingUser && existingUser.id !== id) {
      throw new EmailAlreadyTakenError(email);
    }

    return await this.prisma.user.update({
      data: { email },
      where: { id },
    });
  }
}
