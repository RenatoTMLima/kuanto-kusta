import { Injectable } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async listAll(): Promise<Product[]> {
    return this.productsRepository.listAllProducts();
  }

  async create(newProduct: Product): Promise<void> {
    await this.productsRepository.create(newProduct);
    return;
  }
}
