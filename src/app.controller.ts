import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users/entities/user.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiResponse({ status: 201, description: 'Регистрация успешна', type: User })
  @ApiTags('Auth')
  @Post('auth/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Вход выполнен',
    schema: { properties: { access_token: { type: 'string' } } },
  })
  @ApiTags('Auth')
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
