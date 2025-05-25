import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ConversationNotFoundError } from './conversation.error';
import { UsersService } from 'src/users/users.service';
import { UserNotFoundError } from 'src/users/user.error';

@Injectable()
export class ConversationService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

  async getById(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      throw new ConversationNotFoundError(id);
    }

    return conversation;
  }

  async create(sender: string, recipient: string, name?: string) {
    try {
      const senderUser = await this.userService.getById(sender);
      const recipientUser = await this.userService.getById(recipient);

      const conversation = await this.prisma.conversation.create({
        data: {
          name,
          users: {
            create: [
              {
                userId: senderUser.id,
              },
              {
                userId: recipientUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      return conversation;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }

      throw new Error('Failed to create conversation');
    }
  }
}
