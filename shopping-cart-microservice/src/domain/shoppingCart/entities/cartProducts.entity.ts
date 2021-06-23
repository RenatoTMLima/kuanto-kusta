import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ShoppingCart } from './shoppingCart.entity';

@Entity('cartProducts')
export class CartProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  shoppingCartId: string;

  @Column({ type: 'varchar', nullable: false })
  productId: string;

  @Column('numeric', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @ManyToOne((type) => ShoppingCart, (shoppingCart) => shoppingCart.products)
  @JoinColumn({ name: 'shoppingCartId' })
  shoppingCart: ShoppingCart;
}
