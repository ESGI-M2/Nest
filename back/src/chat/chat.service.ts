import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async create(senderId: string, dto: SendMessageDto) {
    const message = await this.prisma.message.create({
      data: {
        content: dto.content,
        senderId,
      },
      include: {
        sender: true,
      },
    });

    await this.prisma.messageDelivery.create({
      data: {
        messageId: message.id,
        recipientId: dto.recipientId,
      },
    });

    return message;
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
