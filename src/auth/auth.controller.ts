import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth, GetRawHeader } from './decorators';
import { GetHasRoles } from './decorators/get-has-roles.decorator';
import { GetAuthUser } from './decorators/getAuthUser.decorator';
import { CreateUSerDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserRoleGuard } from './guards/user-role.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: CreateUSerDto })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity',
  })
  async register(@Body() createUserDto: CreateUSerDto) {
    return await this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  // TODO: add guards
  // @Get('user')
  // @SetMetadata('roles', ['admin', 'cashier', 'user'])
  // @UseGuards(AuthGuard(), UserRoleGuard)
  // async getUser(
  //   @GetAuthUser() user,
  //   @GetAuthUser('email') email,
  //   @GetRawHeader() headers,
  // ) {
  //   return {
  //     user,
  //     email,
  //     headers,
  //   };
  // }

  // @Get('user')
  // @GetHasRoles('admin', 'cashier', 'user')
  // @UseGuards(AuthGuard(), UserRoleGuard)
  // async getUser(
  //   @GetAuthUser() user,
  //   @GetAuthUser('email') email,
  //   @GetRawHeader() headers,
  // ) {
  //   return {
  //     user,
  //     email,
  //     headers,
  //   };
  // }
  @Get('user')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {token}',
    required: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Auth('admin', 'cashier', 'user')
  async getUser(
    @GetAuthUser() user,
    @GetAuthUser('email') email,
    @GetRawHeader() headers,
  ) {
    return {
      user,
      email,
      headers,
    };
  }
}
