import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: { content: string; sender: string }) {
    const message = await this.chatService.create(payload.content, payload.sender);
    this.server.emit('message', message);
  }
}