import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './conversation.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createConversation(
    @Req() req,
    @Body() conversationPayload: CreateConversationDto,
  ) {
    const senderId = req.user.sub;

    return await this.conversationService.create(
      senderId,
      conversationPayload.recipients,
      conversationPayload.name,
    );
  }

  @Get()
  async getConversationsForCurrentUser(@Req() req) {
    const userId = req.user.sub;
    return await this.conversationService.getConversationsForUser(userId);
  }

  @Get(':id/messages')
  async getMessagesInConversation(@Param('id') id: string, @Req() req) {
    const userId = req.user.sub;
    return await this.conversationService.getMessagesInConversationAsUser(
      id,
      userId,
    );
  }
}
