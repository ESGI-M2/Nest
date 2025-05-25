import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { content: string; recipientId: string },
  ) {
    const validatedPayload = plainToInstance(SendMessageDto, payload);

    try {
      await validateOrReject(validatedPayload);

      const socketData = client.data;

      const { sub: senderId } = socketData;

      const message = await this.chatService.create(
        validatedPayload.conversationId,
        senderId,
        validatedPayload.content,
      );

      this.server.emit('message', message);

      return {
        status: 'ok',
        message: 'Message sent successfully',
      };
    } catch (errors) {
      console.error('Validation or other error:', errors);
      client.emit('error', {
        message: "Données invalides pour l'envoi du message.",
      });
      return {
        status: 'error',
        message: "Données invalides pour l'envoi du message.",
      };
    }
  }
}
