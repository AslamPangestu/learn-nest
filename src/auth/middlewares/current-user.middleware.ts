/* eslint-disable @typescript-eslint/no-namespace */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: Users;
    }
  }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}
  async use(req: Request, res: Response, next: (error?: NextFunction) => void) {
    const { user_id } = req.session || {};
    if (user_id) {
      const user = await this.userService.findOne(user_id);
      req.currentUser = user;
    }
    next();
  }
}
