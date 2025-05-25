import { Body, Controller, Post, Req } from '@nestjs/common';
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
}
