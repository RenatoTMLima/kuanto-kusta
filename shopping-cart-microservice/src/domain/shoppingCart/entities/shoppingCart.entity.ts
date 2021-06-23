import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';

import { CartProducts } from './cartProducts.entity';

@Entity('shoppingCart')
export class ShoppingCart {
  @PrimaryGeneratedColumn('uuid')
  shoppingCartId: string;

  @Column({ type: 'varchar', unique: true })
  userId: string;

  @OneToMany(
    (type) => CartProducts,
    (cartProducts) => cartProducts.shoppingCart,
    { cascade: true },
  )
  products: CartProducts[];

  @Expose()
  get totalPrice(): number {
    return Number(
      this.products
        .reduce(
          (totalPrice, product) =>
            totalPrice + product.price * product.quantity,
          0,
        )
        .toFixed(2),
    );
  }

  @Expose()
  get totalQuantity(): number {
    return this.products.reduce(
      (totalPrice, product) => totalPrice + product.quantity,
      0,
    );
  }
}
