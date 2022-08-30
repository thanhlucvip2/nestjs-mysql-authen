import { UserEntity } from './../user/user.entity';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';

export class ProductRepository extends Repository<ProductEntity> {}
export class UserRepository extends Repository<UserEntity> {}
