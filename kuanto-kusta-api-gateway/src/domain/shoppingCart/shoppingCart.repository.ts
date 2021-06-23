import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/common';
import { ShoppingCart } from './interfaces/shoppingCart.interface';
import { CartProductsDTO } from './dtos/cartProducts.dto';

@Injectable()
export class ShoppingCartRepository {
  constructor(private httpService: HttpService) {}

  async getShoppingCart(): Promise<ShoppingCart> {
    try {
      const response = await this.httpService
        .get<ShoppingCart>(`/`)
        .toPromise();

      return response.data;
    } catch (error) {
      const { statusCode, message } = error.response.data;
      throw new HttpException(message, statusCode);
    }
  }

  async addProductsToShoppingCart(
    addProductPayload: CartProductsDTO[],
  ): Promise<void> {
    try {
      await this.httpService.post('/', addProductPayload).toPromise();

      return;
    } catch (error) {
      const { statusCode, message } = error.response.data;
      throw new HttpException(message, statusCode);
    }
  }

  async removeProductFromCart(productId: string): Promise<void> {
    try {
      await this.httpService.delete(`/${productId}`).toPromise();

      return;
    } catch (error) {
      const { statusCode, message } = error.response.data;
      throw new HttpException(message, statusCode);
    }
  }
}
