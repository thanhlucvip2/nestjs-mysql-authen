import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jsonWebToken from 'jsonwebtoken';
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

  @BeforeInsert()
  // mã hóa password
  async hashPasswrd(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken = false) {
    const { id, created, username, password, token } = this;
    const responseObject = { id, created, username, password, token };
    if (!showToken) {
      delete responseObject.token;
    }
    return responseObject;
  }

  async comparePassword(passwordHash: string): Promise<boolean> {
    // check password trùng khớp không
    return await bcrypt.compare(passwordHash, this.password);
  }
  private get token() {
    const { id, username } = this;
    return jsonWebToken.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      {
        expiresIn: '7d',
      },
    );
  }
}
