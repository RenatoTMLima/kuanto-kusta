import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  async listAll(): Promise<Product[]> {
    return this.productService.listAllProducts();
  }

  @Post()
  async createNewProduct(@Body() product: Product): Promise<Product> {
    return this.productService.createNewProduct(product);
  }
}
