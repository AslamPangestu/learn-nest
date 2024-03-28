import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private repository: Repository<Users>) {}

  create(name: string, email: string, password: string) {
    const user = this.repository.create({ name, email, password });
    return this.repository.save(user);
  }

  async findAll(email: string) {
    const users = await this.repository.find({
      where: {
        email,
      },
    });
    if (!users.length) {
      throw new NotFoundException('Users not found');
    }
    return users;
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Id must be provided');
    }
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, attrs: Partial<Users>) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const body = { ...user, attrs };
    return this.repository.save(body);
  }

  async remove(id: number) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repository.remove(user);
  }
}
