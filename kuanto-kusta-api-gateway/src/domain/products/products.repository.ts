import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductsRepository {
  constructor(private httpService: HttpService) {}

  async listAllProducts(): Promise<Product[]> {
    try {
      const response = await this.httpService.get<Product[]>('/').toPromise();

      return response.data;
    } catch (error) {
      const { statusCode, message } = error.response.data;
      throw new HttpException(message, statusCode);
    }
  }

  async create(newProduct: Product): Promise<void> {
    try {
      await this.httpService.post<Product>('/', newProduct).toPromise();
      return;
    } catch (error) {
      const { statusCode, message } = error.response.data;
      throw new HttpException(message, statusCode);
    }
  }
}
