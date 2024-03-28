import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';

import { Serialize } from 'src/interceptors/serialize.interceptor';

import { UsersService } from './users.service';

import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';

@Controller('users')
@Serialize(UserDTO)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  createUser(@Body() body: CreateUserDTO) {
    return this.userService.create(body.name, body.email, body.password);
  }

  @Get()
  findUsers(@Query('email') email: string) {
    return this.userService.findAll(email);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id, 10));
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id, 10));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.userService.update(parseInt(id, 10), body);
  }
}
