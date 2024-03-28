import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { Users } from 'src/users/users.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';

import { ItemsService } from './items.service';
import { CreateItemDTO } from './dtos/create-item.dto';
import { ItemDTO } from './dtos/item.dto';
import { ApprovedItemDTO } from './dtos/approved-item.dto';
import { QueryItemDTO } from './dtos/query-item.dto';

@Controller('items')
@UseGuards(AuthGuard)
export class ItemsController {
  constructor(private itemService: ItemsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ItemDTO)
  createItem(@Body() body: CreateItemDTO, @CurrentUser() user: Users) {
    return this.itemService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approvedItem(@Param('id') id: string, @Body() body: ApprovedItemDTO) {
    return this.itemService.approved(parseInt(id, 10), body.approved);
  }

  @Get()
  getAllItems(@Query() query: QueryItemDTO) {
    return this.itemService.getAll(query);
  }
}
