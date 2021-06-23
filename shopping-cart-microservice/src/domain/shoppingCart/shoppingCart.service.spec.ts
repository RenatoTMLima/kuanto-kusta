import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ShoppingCartService } from './shopingCart.service';
import { ShoppingCart } from './entities/shoppingCart.entity';
import { CartProducts } from './entities/cartProducts.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const cartProductsInstance = (productData) => {
  const cartProductsEntity = new CartProducts();
  cartProductsEntity.id = String(Date.now());
  cartProductsEntity.productId = productData.productId;
  cartProductsEntity.shoppingCartId = productData.shoppingCartId;
  cartProductsEntity.price = productData.price;
  cartProductsEntity.quantity = productData.quantity;

  return cartProductsEntity;
};

const shoppingCartInstance = (shoppingCartData) => {
  const { products, ...data } = shoppingCartData;
  const shoppingCartId = String(Date.now());

  const shoppingCartEntity = new ShoppingCart();
  shoppingCartEntity.shoppingCartId = shoppingCartId;
  shoppingCartEntity.userId = data.userId;
  shoppingCartEntity.products = products.map((product) =>
    cartProductsInstance({ ...product, shoppingCartId }),
  );

  return shoppingCartEntity;
};

describe('ShoppingCartService Tests', () => {
  let shoppingCartService: ShoppingCartService;

  const shoppingCartRepositoryMock = {
    getShoppingCart: jest.fn().mockImplementation((userId) => {
      if (userId !== 'USERID0001') return undefined;

      return shoppingCartInstance({
        userId,
        products: [
          {
            productId: 'PROD001',
            price: 59.9,
            quantity: 3,
          },
          {
            productId: 'PROD002',
            price: 79.9,
            quantity: 2,
          },
        ],
      });
    }),
    createShoppingCart: jest
      .fn()
      .mockImplementation((shoppingCartData) =>
        shoppingCartInstance(shoppingCartData),
      ),
  };

  const cartProductsRepositoryMock = {
    insertOrUpdateNewProductsToCart: jest.fn(),
    removeProductFromCart: jest.fn(),
  };

  beforeEach(async () => {
    const shoppingCartModule: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingCartService,
        {
          provide: getRepositoryToken(ShoppingCart),
          useValue: shoppingCartRepositoryMock,
        },
        {
          provide: getRepositoryToken(CartProducts),
          useValue: cartProductsRepositoryMock,
        },
      ],
    }).compile();

    shoppingCartService =
      shoppingCartModule.get<ShoppingCartService>(ShoppingCartService);
  });

  it('should return users shopping cart', async () => {
    const shoppingCart = await shoppingCartService.getShoppingCart(
      'USERID0001',
    );

    expect(shoppingCart).toBeInstanceOf(ShoppingCart);
    expect(shoppingCart.products.length).toEqual(2);
  });

  it('should return undefined for a non existing shopping cart', async () => {
    const shoppingCart = await shoppingCartService.getShoppingCart(
      'USERID0002',
    );

    expect(shoppingCart).toEqual(undefined);
  });

  it('should add products to cart', async () => {
    const shoppingCartData = {
      products: [
        {
          productId: 'PROD003',
          price: 20,
          quantity: 5,
        },
        {
          productId: 'PROD004',
          price: 30,
          quantity: 1,
        },
      ],
      userId: 'USERID0001',
    };

    await shoppingCartService.addProductsToShoppingCart(shoppingCartData);

    expect(shoppingCartRepositoryMock.getShoppingCart).toHaveBeenCalled();
    expect(
      cartProductsRepositoryMock.insertOrUpdateNewProductsToCart,
    ).toHaveBeenCalled();
  });

  it('should create a shopping cart for the user and add products to cart', async () => {
    const shoppingCartData = {
      products: [
        {
          productId: 'PROD003',
          price: 20,
          quantity: 5,
        },
        {
          productId: 'PROD004',
          price: 30,
          quantity: 1,
        },
      ],
      userId: 'USERID0002',
    };

    await shoppingCartService.addProductsToShoppingCart(shoppingCartData);

    expect(shoppingCartRepositoryMock.getShoppingCart).toHaveBeenCalled();
    expect(shoppingCartRepositoryMock.createShoppingCart).toHaveBeenCalled();
  });

  it('should remove a product from the shopping cart', async () => {
    const removeProductData = {
      productId: 'PROD001',
      userId: 'USERID0001',
    };

    await shoppingCartService.removeProductFromCart(removeProductData);

    expect(shoppingCartRepositoryMock.getShoppingCart).toHaveBeenCalled();
    expect(cartProductsRepositoryMock.removeProductFromCart).toHaveBeenCalled();
  });

  it('should return error trying to remove a product from a non existing shopping cart', async () => {
    const removeProductData = {
      productId: 'PROD001',
      userId: 'USERID0002',
    };

    shoppingCartService
      .removeProductFromCart(removeProductData)
      .catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          `User doesn't have products in the shopping cart`,
        );
      });
  });
});
