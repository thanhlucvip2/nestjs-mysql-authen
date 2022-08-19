import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  price: string;
}
