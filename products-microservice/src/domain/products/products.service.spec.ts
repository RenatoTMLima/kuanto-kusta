import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductRepository } from './products.repository';
import { Product } from './schemas/product.schema';
import { InternalServerErrorException, HttpException } from '@nestjs/common';

const mockProducts = [
  {
    _id: '60d015a5aff33e02244cf629',
    productId: '3214',
    price: 89.9,
    __v: 0,
  },
  {
    _id: '60d015a5aff3215144cf629',
    productId: '2233',
    price: 59.9,
    __v: 0,
  },
];

class ProductRepositoryMock {
  async listAll() {
    return mockProducts;
  }
  async getProductById(productId: string): Promise<Product> {
    return mockProducts.find((product) => product.productId === productId);
  }
  async create(newProduct: Product): Promise<Product> {
    if (newProduct.productId === '9999')
      throw new InternalServerErrorException();

    const productCreated = new Product();
    productCreated.productId = newProduct.productId;
    productCreated.price = newProduct.price;

    return productCreated;
  }
}

describe('ProductService', () => {
  let productsService: ProductsService;

  beforeEach(async () => {
    const ProductRepositoryProvider = {
      provide: ProductRepository,
      useClass: ProductRepositoryMock,
    };

    const productModule: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, ProductRepositoryProvider],
    }).compile();

    productsService = await productModule.get<ProductsService>(ProductsService);
  });

  it('should return a newly created product', async () => {
    const newProduct = { productId: 'SH123', price: 59.9 };

    const productCreated = await productsService.createNewProduct(newProduct);

    expect(productCreated).toBeInstanceOf(Product);
    expect(productCreated.productId).toEqual('SH123');
    expect(productCreated.price).toEqual(59.9);
  });

  it('should return an error trying to create a new product with an existing productId', async () => {
    const newProduct = { productId: '3214', price: 59.9 };

    productsService.createNewProduct(newProduct).catch((error) => {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Product ID already exists.');
    });
  });

  it('should return an error trying to create a new product, but an unexpected error occurs', async () => {
    const newProduct = { productId: '9999', price: 59.9 };

    productsService.createNewProduct(newProduct).catch((error) => {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toEqual('Internal Server Error');
    });
  });

  it('should return all products from the database', async () => {
    const productsList = await productsService.listAllProducts();

    expect(productsList).toBeInstanceOf(Array);
    expect(productsList.length).toEqual(2);
  });
});
