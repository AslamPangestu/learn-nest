import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import cookieSession from 'cookie-session';
import { ConfigModule, ConfigService } from '@nestjs/config';

// import { AppController } from './app.controller';
// import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { Users } from './users/users.entity';

import { ItemsModule } from './items/items.module';
import { Items } from './items/items.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DB_NAME'),
        entities: [Users, Items],
        synchronize: true,
      }),
    }),
    UsersModule,
    ItemsModule,
  ],
  // controllers: [AppController],
  providers: [
    // AppService,
    { provide: 'APP_PIPE', useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({ keys: ['asdf'] })).forRoutes('*');
  }
}
