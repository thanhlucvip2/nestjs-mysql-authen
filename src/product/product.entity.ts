import { UserEntity } from './../user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
  name: string;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: 'varchar', length: 20, nullable: false })
  price: string;

  @Column('text')
  idea: string;

  @Column('text')
  description: string;

  @ManyToOne((type) => UserEntity, (author) => author.products)
  author: UserEntity;
}
