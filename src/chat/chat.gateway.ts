import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  constructor() {
    console.log('Chat Gateway Loaded');
  }

  handleConnection(client: any) {
    console.log('Connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Disconnected:', client.id);
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string) {
    console.log(message);

    this.server.emit('message', message);
  }
}