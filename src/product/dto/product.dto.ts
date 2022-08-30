import { ProductEntity } from 'src/product/product.entity';
import { UserEntity } from 'src/user/user.entity';
export class ProductDto {
  name: string;
  price: string;
}

export class productUserDto {
  id?: string;
  name: string;
  updated: Date;
  price: string;
  idea: string;
  description: string;
  author: {
    id: string;
    created: Date;
    username: string;
    password: string;
    token: string;
  };
}
