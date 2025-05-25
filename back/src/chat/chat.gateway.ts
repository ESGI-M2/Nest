import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
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
    client: any,
    payload: { content: string; recipientId: string },
  ) {
    console.log('Received message from client:', payload);
    const dto = plainToInstance(SendMessageDto, payload);

    try {
      await validateOrReject(dto);

      const senderId = client.user.id;

      const message = await this.chatService.create(senderId, dto);

      // 4️⃣ Broadcast to everyone
      this.server.emit('message', message);
    } catch (errors) {
      console.error('Validation or other error:', errors);
      client.emit('error', {
        message: "Données invalides pour l'envoi du message.",
      });
    }
  }
}
