import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseInterceptors,
} from '@nestjs/common';

import { Serialize } from 'src/interceptors/serialize.interceptor';

import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { UserDTO } from 'src/users/dtos/user.dto';

import { AuthService } from './auth.service';
import { LoginAuthDTO } from './dtos/login-auth.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { Users } from 'src/users/users.entity';

@Controller('auth')
@Serialize(UserDTO)
@UseInterceptors(CurrentUserInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() body: CreateUserDTO) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('/login')
  async login(@Body() body: LoginAuthDTO, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);
    session.user_id = user.id;
    return user;
  }

  @Post('/logout')
  async logout(@Session() session: any) {
    session.user_id = null;
  }

  @Get('/profile')
  getProfile(@CurrentUser() user: Users) {
    return user;
  }
}
