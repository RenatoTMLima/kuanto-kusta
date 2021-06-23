import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CartProductsTable1624111431785 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cartProducts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'shoppingCartId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'productId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'numeric',
            precision: 10,
            scale: 2,
          },
          {
            name: 'quantity',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'cartProducts',
      new TableForeignKey({
        name: 'ShoppingCartFK',
        columnNames: ['shoppingCartId'],
        referencedColumnNames: ['shoppingCartId'],
        referencedTableName: 'shoppingCart',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('cartProducts', 'ShoppingCartFK');
    await queryRunner.dropTable('cartProducts');
  }
}
