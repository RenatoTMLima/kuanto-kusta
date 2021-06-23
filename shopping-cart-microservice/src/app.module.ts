import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShoppingCartModule } from './domain/shoppingCart/shoppingCart.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    TypeOrmModule.forRoot({
      synchronize: false,
      autoLoadEntities: true,
    }),
    ShoppingCartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
