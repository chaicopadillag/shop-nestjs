import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() socketServer: Socket;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.headers['x-token'];
      const user = this.jwtService.verify(token as any);

      await this.messagesWsService.addClient(client, user.id);

      this.socketServer.emit(
        'client-connected',
        this.messagesWsService.showClients(),
      );
    } catch (error) {
      client.disconnect(true);
      return;
    }
  }

  handleDisconnect(client: Socket) {
    // console.log('cliente desconectado', client.id);
    this.messagesWsService.removeClient(client.id);
    this.socketServer.emit(
      'client-connected',
      this.messagesWsService.showClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  handleMessage(client: Socket, payload: any) {
    this.socketServer.emit('message-from-server', {
      message: payload.message,
      from: this.messagesWsService.getUserClient(client.id),
    });
  }
}
