import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { ShoppingCartDTO } from '../dtos/shoppingCart.dto';
import { ShoppingCart } from '../entities/shoppingCart.entity';

@EntityRepository(ShoppingCart)
export class ShoppingCartRepository extends Repository<ShoppingCart> {
  async getShoppingCart(userId: string): Promise<ShoppingCart> {
    try {
      return this.findOne({
        where: {
          userId,
        },
        relations: ['products'],
      });
    } catch (error) {
      throw new HttpException(
        'Error trying to retrieve the shopping cart data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createShoppingCart(
    shoppingCartData: ShoppingCartDTO,
  ): Promise<ShoppingCart> {
    try {
      const newShoppingCart = this.create(shoppingCartData);

      await this.save(newShoppingCart);

      return newShoppingCart;
    } catch (error) {
      throw new HttpException(
        'Error trying to create the shopping cart.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
