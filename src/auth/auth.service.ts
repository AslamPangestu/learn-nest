import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { UsersService } from '../users/users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async register(name: string, email: string, password: string) {
    const users = await this.userService.findAll(email);
    if (users.length) {
      throw new BadRequestException('User already exists');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    const hashedPassword = `${salt}.${hash.toString('hex')}`;

    const user = await this.userService.create(name, email, hashedPassword);
    return user;
  }

  async login(email: string, password: string) {
    const users = await this.userService.findAll(email);

    if (!users.length) {
      throw new NotFoundException("User doesn't exist");
    }
    if (users.length !== 1) {
      throw new BadRequestException('User Invalid');
    }

    const user = users[0];
    const [salt, hashCurrentPassword] = user.password.split('.');
    const hashedPassword = (await scrypt(password, salt, 64)) as Buffer;

    if (hashCurrentPassword !== hashedPassword.toString('hex')) {
      throw new BadRequestException('Password Invalid');
    }

    return user;
  }
}
