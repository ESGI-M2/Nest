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
      conversationPayload.recipients[0],
      conversationPayload.name,
    );
  }

  @Get(':id/messages')
  async getMessagesInConversation(@Param('id') id: string) {
    return await this.conversationService.getMessagesInConversation(id);
  }
}
