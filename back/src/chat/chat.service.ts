import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async create(conversationId, senderId, content: string) {
    try {
      const message = await this.prisma.message.create({
        data: {
          conversationId,
          senderId,
          content,
        },
        include: {
          sender: true,
        },
      });
      return message;
    } catch (error) {
      throw new Error('Failed to create message');
    }
  }

  findAll() {
    return this.prisma.message.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  getMessagesByUser(userId: string) {
    return this.prisma.message.findMany({
      where: {
        senderId: userId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
