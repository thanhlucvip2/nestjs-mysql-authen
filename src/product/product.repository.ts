import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';

export class ProductRepository extends Repository<ProductEntity> {}
