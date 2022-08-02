import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUSerDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'password',
        'email',
        'firstName',
        'lastName',
        'isActive',
        'roles',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!(await bcrypt.compareSync(password, user.password))) {
      throw new UnauthorizedException('Password is incorrect');
    }

    delete user.password;

    return user;
  }

  async create(createUserDto: CreateUSerDto) {
    try {
      const { password, ...userCreate } = createUserDto;

      const user = this.userRepository.create({
        ...userCreate,
        password: await bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      delete user.password;

      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error creating user');
    }
  }
}
