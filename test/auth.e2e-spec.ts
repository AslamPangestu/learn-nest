import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('handle register', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'name', email: 'email@email.com', password: 'password' })
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body.id).toBeDefined();
        expect(body.name).toEqual('name');
        expect(body.email).toEqual('email@email.com');
      });
  });

  it('handle login', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'email@email.com', password: 'password' })
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.id).toBeDefined();
        expect(body.name).toEqual('name');
        expect(body.email).toEqual('email@email.com');
      });
  });
});
