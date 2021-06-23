import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { CartProductsDTO } from '../dtos/cartProducts.dto';
import { RemoveCartProductDTO } from '../dtos/removeCartProduct.dto';
import { CartProducts } from '../entities/cartProducts.entity';

@EntityRepository(CartProducts)
export class CartProductsRepository extends Repository<CartProducts> {
  async insertOrUpdateNewProductsToCart(
    products: CartProductsDTO[],
  ): Promise<void> {
    try {
      const createdNewProducts = products.map((product) =>
        this.create(product),
      );

      await this.save(createdNewProducts);

      return;
    } catch (error) {
      throw new HttpException(
        'Error trying to add/update a product to the cart.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeProductFromCart({
    productId,
    shoppingCartId,
  }: RemoveCartProductDTO): Promise<void> {
    try {
      await this.delete({ shoppingCartId, productId });

      return;
    } catch (error) {
      throw new HttpException(
        'Error trying to remove a product from the cart.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
