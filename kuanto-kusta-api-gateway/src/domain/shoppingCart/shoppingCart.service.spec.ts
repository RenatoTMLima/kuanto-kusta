import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ShoppingCartService } from './shoppingCart.service';
import { ShoppingCartRepository } from './shoppingCart.repository';

describe('ShoppingCartService Tests', () => {
  let shoppingCartService: ShoppingCartService;

  const shoppingCartRepositoryMock = {
    getShoppingCart: jest.fn().mockImplementation(() => {
      return {
        shoppingCartId: 'shoppingCartId',
        userId: 'userId',
        totalPrice: 389.5,
        totalQuantity: 5,
        products: [
          {
            id: 'id001',
            shoppingCartId: 'shoppingCartId',
            productId: '1111',
            price: 59.9,
            quantity: 2,
          },
          {
            id: 'id002',
            shoppingCartId: 'shoppingCartId',
            productId: '2222',
            price: 89.9,
            quantity: 3,
          },
        ],
      };
    }),
    addProductsToShoppingCart: jest
      .fn()
      .mockImplementation((addProductPayload) => {
        if (addProductPayload[0].productId === 'PROD001')
          throw new BadRequestException('Error trying to add product to cart.');

        return;
      }),
    removeProductFromCart: jest
      .fn()
      .mockImplementation((removeProductPayload) => {
        if (removeProductPayload.productId === 'PROD001')
          throw new BadRequestException(
            'Error trying to remove product from cart.',
          );

        return;
      }),
  };

  beforeEach(async () => {
    const shoppingCartModule: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingCartService,
        {
          provide: ShoppingCartRepository,
          useValue: shoppingCartRepositoryMock,
        },
      ],
    }).compile();

    shoppingCartService =
      shoppingCartModule.get<ShoppingCartService>(ShoppingCartService);
  });

  it('should return user shopping cart', async () => {
    const shoppingCart = await shoppingCartService.getShoppingCart();

    expect(shoppingCartRepositoryMock.getShoppingCart).toHaveBeenCalled();
    expect(shoppingCart.totalPrice).toEqual(389.5);
    expect(shoppingCart.totalQuantity).toEqual(5);
    expect(shoppingCart.totalQuantity).toEqual(
      shoppingCart.products.reduce(
        (total, product) => (total += product.quantity),
        0,
      ),
    );
    expect(shoppingCart.products.length).toEqual(2);
  });

  it('should add products to user shopping cart successfully', async () => {
    const addProductData = [
      {
        productId: 'PROD0002',
        price: 29.9,
        quantity: 2,
      },
      {
        productId: 'PROD0003',
        price: 39.9,
        quantity: 3,
      },
    ];

    await shoppingCartService.addProductsToShoppingCart(addProductData);

    expect(
      shoppingCartRepositoryMock.addProductsToShoppingCart,
    ).toHaveBeenLastCalledWith(addProductData);
  });

  it('should throw error trying to add products to cart', async () => {
    const addProductData = [
      {
        productId: 'PROD001',
        price: 29.9,
        quantity: 2,
      },
    ];

    await shoppingCartService
      .addProductsToShoppingCart(addProductData)
      .catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Error trying to add product to cart.');
      });

    expect(
      shoppingCartRepositoryMock.addProductsToShoppingCart,
    ).toHaveBeenLastCalledWith(addProductData);
  });

  it('should remove a product successfully from the cart', async () => {
    const productToRemove = 'PROD0002';

    await shoppingCartService.removeProductFromCart(productToRemove);

    expect(
      shoppingCartRepositoryMock.removeProductFromCart,
    ).toHaveBeenLastCalledWith(productToRemove);
  });

  it('should throw error trying to remove product from cart', async () => {
    const productToRemove = 'PROD001';

    await shoppingCartService
      .removeProductFromCart(productToRemove)
      .catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'Error trying to remove product from cart.',
        );
      });

    expect(
      shoppingCartRepositoryMock.removeProductFromCart,
    ).toHaveBeenLastCalledWith(productToRemove);
  });
});
