import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './domain/products/products.module';
import { ShoppingCartModule } from './domain/shoppingCart/shoppingCart.module';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ProductsModule,
    ShoppingCartModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
