import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jsonWebToken from 'jsonwebtoken';
import { ProductEntity } from 'src/product/product.entity';
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany((type) => ProductEntity, (product) => product.author)
  products: ProductEntity[];

  @BeforeInsert()
  // mã hóa password
  async hashPasswrd(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken = false) {
    const { id, created, username, password, token, products } = this;
    const responseObject = { id, created, username, password, token, products };
    if (!showToken) {
      delete responseObject.token;
    }
    if (!products) {
      responseObject.products = [];
    }
    return responseObject;
  }

  async comparePassword(passwordHash: string): Promise<boolean> {
    // check password trùng khớp không
    return await bcrypt.compare(passwordHash, this.password);
  }
  private get token() {
    const { id, username, created, password } = this;
    return jsonWebToken.sign(
      {
        id,
        username,
        created,
        password,
      },
      process.env.SECRET, // process.env.SECRET : mật mã để giải mã hoặc tạo token
      {
        expiresIn: '7d',
      },
    );
  }
}
