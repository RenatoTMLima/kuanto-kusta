import { Injectable } from '@nestjs/common';
import { ShoppingCart } from './interfaces/shoppingCart.interface';
import { CartProductsDTO } from './dtos/cartProducts.dto';
import { ShoppingCartRepository } from './shoppingCart.repository';

@Injectable()
export class ShoppingCartService {
  constructor(private shoppingCartRepository: ShoppingCartRepository) {}

  async getShoppingCart(): Promise<ShoppingCart> {
    return this.shoppingCartRepository.getShoppingCart();
  }

  async addProductsToShoppingCart(
    addProductPayload: CartProductsDTO[],
  ): Promise<void> {
    return this.shoppingCartRepository.addProductsToShoppingCart(
      addProductPayload,
    );
  }

  async removeProductFromCart(productId: string): Promise<void> {
    return this.shoppingCartRepository.removeProductFromCart(productId);
  }
}
