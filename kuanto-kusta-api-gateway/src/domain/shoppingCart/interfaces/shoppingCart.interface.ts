import { CartProducts } from './cartProducts.interface';

export interface ShoppingCart {
  shoppingCartId: string;
  userId: string;
  totalPrice: number;
  totalQuantity: number;
  products: CartProducts[];
}
