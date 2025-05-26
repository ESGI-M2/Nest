import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { ServerOptions, Server } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

export class JwtIoAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options) as Server;

    // Secure JWT authentication for WebSocket connections
    server.use((socket, next) => {
      const cookieHeader = socket.handshake.headers.cookie || '';

      const cookies = cookie.parse(cookieHeader);

      const token = cookies.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const payload = jwt.verify(
          token,
          process.env.JWT_SECRET || 'default_secret',
        );

        // set socket data
        socket.data = payload;

        next();
      } catch (error: unknown) {
        return next(
          error instanceof Error
            ? error
            : new Error('Authentication error: Invalid token'),
        );
      }
    });

    return server;
  }
}
