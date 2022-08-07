import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, GetAuthUser } from 'src/auth/decorators';
import { SeedService } from './seed.service';

@ApiTags('Seeds')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Auth('admin')
  @Post()
  async run(@GetAuthUser() user) {
    return await this.seedService.run(user);
  }
}
