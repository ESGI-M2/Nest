import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  create(content: string, senderId: string) {
    return this.prisma.message.create({
      data: {
        content,
        senderId,
      },
      include: {
        sender: true,
      },
    });
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
