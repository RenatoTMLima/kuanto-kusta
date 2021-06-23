import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ShoppingCartRepository } from './repositories/shoppingCart.repository';
import { CartProductsRepository } from './repositories/cartProducts.repository';
import { ShoppingCart } from './entities/shoppingCart.entity';

import { ShoppingCartDTO } from './dtos/shoppingCart.dto';
import { RemoveCartProductRequestDTO } from './dtos/removeCartProductRequest.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCartRepository)
    private shoppingCartRepository: ShoppingCartRepository,
    @InjectRepository(CartProductsRepository)
    private cartProductsRepository: CartProductsRepository,
  ) {}

  async getShoppingCart(userId: string): Promise<ShoppingCart> {
    return this.shoppingCartRepository.getShoppingCart(userId);
  }

  async addProductsToShoppingCart({
    products,
    userId,
  }: ShoppingCartDTO): Promise<void> {
    const shoppingCartAlreadyExists =
      await this.shoppingCartRepository.getShoppingCart(userId);

    if (!!shoppingCartAlreadyExists) {
      const { shoppingCartId } = shoppingCartAlreadyExists;
      const productsToInsertOrUpdate = [];

      products.forEach((product) => {
        const productFound = shoppingCartAlreadyExists.products.find(
          (productExists) => productExists.productId === product.productId,
        );
        if (!!productFound) {
          productsToInsertOrUpdate.push({
            ...productFound,
            price: product.price,
            quantity: product.quantity + productFound.quantity,
          });
        } else {
          productsToInsertOrUpdate.push({ ...product, shoppingCartId });
        }
      });

      await this.cartProductsRepository.insertOrUpdateNewProductsToCart(
        productsToInsertOrUpdate,
      );

      return;
    }

    const shoppingCartData = {
      userId,
      products,
    } as ShoppingCartDTO;

    await this.shoppingCartRepository.createShoppingCart(shoppingCartData);

    return;
  }

  async removeProductFromCart({
    productId,
    userId,
  }: RemoveCartProductRequestDTO): Promise<void> {
    const userShoppingCart = await this.shoppingCartRepository.getShoppingCart(
      userId,
    );

    if (!userShoppingCart)
      throw new BadRequestException(
        `User doesn't have products in the shopping cart`,
      );

    const { shoppingCartId } = userShoppingCart;

    await this.cartProductsRepository.removeProductFromCart({
      productId,
      shoppingCartId,
    });

    return;
  }
}
