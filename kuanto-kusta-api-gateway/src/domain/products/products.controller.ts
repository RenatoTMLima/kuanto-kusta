import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './interfaces/product.interface';
import { AuthGuard } from '../auth/auth.guard';
import { AuthFilter } from 'src/shared/filters/auth.filter';

@Controller('products')
@UseGuards(AuthGuard)
@UseFilters(AuthFilter)
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  async listAll(): Promise<Product[]> {
    return this.productService.listAll();
  }

  @Post()
  async createProduct(@Body() product: Product): Promise<void> {
    return this.productService.create(product);
  }
}
