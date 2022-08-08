import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

type ConectClient = {
  [id: string]: { user: User; socket: Socket };
};

@Injectable()
export class MessagesWsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private clients: ConectClient = {};

  async addClient(client: Socket, id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new Error('User not found');

    this.verifyUserClient(user.id);
    this.clients[client.id] = { user, socket: client };
  }

  removeClient(id: string) {
    delete this.clients[id];
  }

  showClients() {
    return Object.keys(this.clients);
  }

  getUserClient(id: string) {
    return this.clients[id].user.firstName;
  }

  private verifyUserClient(id: string) {
    for (const clientId of Object.keys(this.clients)) {
      const socketConnect = this.clients[clientId];
      if (socketConnect.user.id === id) {
        socketConnect.socket.disconnect(true);
        break;
      }
    }
  }
}
