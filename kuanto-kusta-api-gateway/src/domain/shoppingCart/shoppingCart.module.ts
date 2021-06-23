import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { HttpModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShoppingCartController } from './shoppingCart.controller';
import { ShoppingCartService } from './shoppingCart.service';
import { ShoppingCartRepository } from './shoppingCart.repository';

import { HttpServiceMiddleware } from '../../shared/middlewares/httpService.middleware';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: `${configService.get<string>(
          'SHOPPINGCART_MICROSERVICE_URL',
        )}/shoppingCart`,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService, ShoppingCartRepository],
})
export class ShoppingCartModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpServiceMiddleware).forRoutes(ShoppingCartController);
  }
}
