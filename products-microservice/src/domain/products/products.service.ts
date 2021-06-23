import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private productRepository: ProductRepository) {}

  async listAllProducts(): Promise<Product[]> {
    return this.productRepository.listAll();
  }

  async createNewProduct(newProduct: Product): Promise<Product> {
    const productAlreadyExists = await this.productRepository.getProductById(
      newProduct.productId,
    );

    if (!!productAlreadyExists) {
      throw new HttpException(
        'Product ID already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.productRepository.create(newProduct);
  }
}
