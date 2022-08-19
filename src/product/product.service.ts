import { ProductDto } from './dto/product.dto';
import { ProductEntity } from './product.entity';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: ProductRepository,
  ) {}

  async getAll(): Promise<ProductEntity[]> {
    const list = await this.productRepository.find();
    if (!list.length) {
      throw new NotFoundException({ message: 'khong co du lieu' });
    }
    return list;
  }

  async findById(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOneBy({ id });

    /*  
    1 . away : this.productRepository.findOneBy({ id });
    2 . away : this.productRepository.findOne({ where: { id } });
    **/

    if (!product) {
      throw new HttpException('không tìm thấy Id', HttpStatus.NOT_FOUND); // sử dụng httpError , HttpStatus.NOT_FOUND : là status trả về ( 404 )
    }
    return product;
  }

  async create(dto: ProductDto): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.create(dto);
      return await this.productRepository.save(product);
    } catch (error) {
      throw new HttpException(
        error.sqlMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteData(id: string): Promise<{ delete: boolean }> {
    const product = await this.productRepository.findOneBy({ id });
    // kiểm tra xem id có tồn tại không
    if (!product) {
      throw new HttpException('không tìm thấy Id', HttpStatus.NOT_FOUND); // sử dụng httpError , HttpStatus.NOT_FOUND : là status trả về ( 404 )
    }
    // tiến hành delete
    await this.productRepository.delete({ id });
    return {
      delete: true,
    };
  }

  async updateData(id: string, newData: ProductDto): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.findOneBy({ id });
      // kiểm tra xem id có tồn tại không
      if (!product) {
        throw new HttpException('không tìm thấy Id', HttpStatus.NOT_FOUND); // sử dụng httpError , HttpStatus.NOT_FOUND : là status trả về ( 404 )
      }
      await this.productRepository.update({ id }, newData);
      return await this.productRepository.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(
        error.sqlMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
