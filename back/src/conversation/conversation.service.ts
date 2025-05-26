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

  async getConversationsForUser(userId: string) {
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const conversations = await this.prisma.conversation.findMany({
      where: {
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    return conversations;
  }

  async create(sender: string, recipients: string[], name?: string) {
    try {
      const allIds = [sender, ...recipients];
      const users = await Promise.all(
        allIds.map((id) => this.userService.getById(id)),
      );

      const createUsers = users.map((u) => ({ userId: u.id }));

      const conversation = await this.prisma.conversation.create({
        data: {
          name,
          users: {
            create: createUsers,
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

  async getMessagesInConversation(conversationId: string) {
    const conversation = await this.getById(conversationId);

    const messages = await this.prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  }
}
