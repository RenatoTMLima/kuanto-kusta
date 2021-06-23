import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async listAll(): Promise<Product[]> {
    try {
      return this.productModel.find().exec();
    } catch (error) {
      throw new HttpException(
        'Error while trying to retrieve data.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getProductById(productId: string): Promise<Product> {
    try {
      return this.productModel.findOne({ productId }).exec();
    } catch (error) {
      throw new HttpException(
        'Error while trying to retrieve data.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(newProduct: Product): Promise<Product> {
    try {
      const createdProduct = new this.productModel(newProduct);
      return createdProduct.save();
    } catch (error) {
      throw new HttpException(
        'Error while trying to create new Product.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
