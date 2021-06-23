import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ShoppingCartDTO } from './dtos/shoppingCart.dto';
import { ShoppingCart } from './entities/shoppingCart.entity';
import { ShoppingCartService } from './shopingCart.service';

@Controller('shoppingCart')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get('/')
  async getShoppingCart(@Body('userId') userId: string): Promise<ShoppingCart> {
    return this.shoppingCartService.getShoppingCart(userId);
  }

  @Post()
  async addProductsToShoppingCart(
    @Body() shoppingCartData: ShoppingCartDTO,
  ): Promise<void> {
    return this.shoppingCartService.addProductsToShoppingCart(shoppingCartData);
  }

  @Delete('/:productId')
  async removeProductFromCart(
    @Param('productId') productId: string,
    @Body('userId') userId: string,
  ): Promise<void> {
    return this.shoppingCartService.removeProductFromCart({
      productId,
      userId,
    });
  }
}
