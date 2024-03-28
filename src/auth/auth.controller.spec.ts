import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {};
    fakeAuthService = {
      login: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as Users);
      },
      register: (name: string, email: string, password: string) => {
        return Promise.resolve({ id: 1, name, email, password } as Users);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: UsersService, useValue: fakeUserService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login', async () => {
    const session = {
      user_id: 0,
    };
    const user = await controller.login(
      {
        email: 'email@email.com',
        password: 'password',
      },
      session,
    );

    expect(user).toEqual({
      id: 1,
      email: 'email@email.com',
      password: 'password',
    });
    expect(session.user_id).toEqual(1);
  });

  it('should registered', async () => {
    const user = await controller.register({
      name: 'name',
      email: 'email@email.com',
      password: 'password',
    });

    expect(user).toEqual({
      id: 1,
      name: 'name',
      email: 'email@email.com',
      password: 'password',
    });
  });
});
