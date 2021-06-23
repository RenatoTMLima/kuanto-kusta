import { CartProductsDTO } from './cartProducts.dto';

export interface ShoppingCartDTO {
  userId: string;
  products: CartProductsDTO[];
}
