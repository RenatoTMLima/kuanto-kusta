import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthFilter } from 'src/shared/filters/auth.filter';
import { AuthGuard } from '../auth/auth.guard';
import { CartProductsDTO } from './dtos/cartProducts.dto';
import { ShoppingCart } from './interfaces/shoppingCart.interface';
import { ShoppingCartService } from './shoppingCart.service';

@Controller('shoppingCart')
@UseGuards(AuthGuard)
@UseFilters(AuthFilter)
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get()
  async getShoppingCart(): Promise<ShoppingCart> {
    return this.shoppingCartService.getShoppingCart();
  }

  @Post()
  async addProductsToShoppingCart(
    @Body() shoppingCartData: CartProductsDTO[],
  ): Promise<void> {
    await this.shoppingCartService.addProductsToShoppingCart(shoppingCartData);
    return;
  }

  @Delete('/:productId')
  async removeProductFromCart(
    @Param('productId') productId: string,
  ): Promise<string> {
    await this.shoppingCartService.removeProductFromCart(productId);
    return;
  }
}
