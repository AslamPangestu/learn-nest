import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.entity';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: Users[] = [];

    fakeUserService = {
      findAll: (email: string) => {
        if (!email) {
          return Promise.resolve(users);
        }
        const user = users.filter((item) => item.email === email);
        return Promise.resolve(user);
      },
      create: (name: string, email: string, password: string) => {
        const user = {
          id: Date.now(),
          name,
          email,
          password,
        } as Users;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUserService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create new user', async () => {
      const user = await service.register(
        'name',
        'email@email.com',
        'password',
      );

      expect(user.password).not.toEqual('password');
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('should throw error if email already exists', async () => {
      await service.register('name', 'email@email.com', 'password');
      await expect(
        service.register('name', 'email@email.com', 'password'),
      ).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should throw error if email not registered', async () => {
      await expect(
        service.login('email@email.com', 'password'),
      ).rejects.toThrow("User doesn't exist");
    });

    it('should throw error if password invalid', async () => {
      await service.register('name', 'email@email.com', 'password');
      await expect(
        service.login('email@email.com', 'password1'),
      ).rejects.toThrow('Password Invalid');
    });

    it('should login user', async () => {
      await service.register('name', 'email@email.com', 'password');
      const user = await service.login('email@email.com', 'password');
      expect(user).toBeDefined();
    });
  });
});
