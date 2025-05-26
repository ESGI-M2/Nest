import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':userId')
  getMessagesByUser(@Param('userId') userId: string) {
    return this.chatService.getMessagesByUser(userId);
  }
}
