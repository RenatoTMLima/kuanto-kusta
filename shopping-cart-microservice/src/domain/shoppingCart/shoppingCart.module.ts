import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ShoppingCartController } from './shoppingCart.controller';
import { ShoppingCartService } from './shopingCart.service';
import { ShoppingCartRepository } from './repositories/shoppingCart.repository';
import { CartProductsRepository } from './repositories/cartProducts.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingCartRepository, CartProductsRepository]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: `${configService.get<string>('USERS_MICROSERVICE_URL')}/auth`,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
