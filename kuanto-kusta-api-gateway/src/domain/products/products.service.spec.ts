import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';

describe('ProductsService Tests', () => {
  let productsService: ProductsService;

  const productsRepositoryMock = {
    create: jest.fn().mockImplementation((newProduct) => {
      if (newProduct.productId !== 'PROD0003')
        throw new BadRequestException('Error trying to create a new product.');

      return;
    }),
    listAllProducts: jest.fn().mockImplementation(() => {
      return [
        {
          productId: 'PROD0001',
          price: 19.9,
        },
        {
          productId: 'PROD0002',
          price: 29.9,
        },
      ];
    }),
  };

  beforeEach(async () => {
    const productsModule: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: productsRepositoryMock,
        },
      ],
    }).compile();

    productsService = productsModule.get<ProductsService>(ProductsService);
  });

  it('should create a new product successfully', async () => {
    const newProduct = { productId: 'PROD0003', price: 39.9 };

    await productsService.create(newProduct);

    expect(productsRepositoryMock.create).toHaveBeenLastCalledWith(newProduct);
  });

  it('should throw error trying to create a new product', async () => {
    const newProduct = { productId: 'PROD0004', price: 39.9 };

    await productsService.create(newProduct).catch((error) => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('Error trying to create a new product.');
    });

    expect(productsRepositoryMock.create).toHaveBeenLastCalledWith(newProduct);
  });

  it('should return a list of products', async () => {
    const products = await productsService.listAll();

    expect(products.length).toEqual(2);
    expect(products).toBeInstanceOf(Array);
  });
});
