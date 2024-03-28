import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from 'src/users/users.entity';

import { Items } from './items.entity';
import { CreateItemDTO } from './dtos/create-item.dto';
import { QueryItemDTO } from './dtos/query-item.dto';

@Injectable()
export class ItemsService {
  constructor(@InjectRepository(Items) private repository: Repository<Items>) {}

  create(item: CreateItemDTO, user: Users) {
    const newItem = this.repository.create(item);
    newItem.user = user;
    return this.repository.save(newItem);
  }

  async approved(id: number, approved: boolean) {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    item.approved = approved;
    return this.repository.save(item);
  }

  async getAll(queryDto: QueryItemDTO) {
    const query = await this.repository
      .createQueryBuilder()
      .select('*')
      .where('approved = :approved', { approved: true });
    if (queryDto.name) {
      query.andWhere('name LIKE :name', { name: `%${queryDto.name}%` });
    }
    if (queryDto.category) {
      query.andWhere('category LIKE :category', {
        category: `%${queryDto.category}%`,
      });
    }
    if (queryDto.location) {
      query.andWhere('location LIKE :location', {
        location: `%${queryDto.location}%`,
      });
    }
    if (queryDto.year) {
      query.andWhere('year LIKE :year', { year: `%${queryDto.year}%` });
    }
    return query.getRawMany();
  }
}
