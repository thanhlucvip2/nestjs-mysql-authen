import { ProductDto } from './dto/product.dto';
import { ProductEntity } from './product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException({ message: 'khong co data' });
    }
    return product;
  }

  async create(
    dto: ProductDto,
  ): Promise<ProductEntity | { success: boolean; message: string }> {
    try {
      const product = await this.productRepository.create(dto);
      return await this.productRepository.save(product);
    } catch (error) {
      return { success: false, message: error.sqlMessage };
    }
  }

  async deleteData(id: string): Promise<{ delete: boolean }> {
    console.log(id);

    try {
      await this.productRepository.delete({ id });
      return {
        delete: true,
      };
    } catch (error) {
      return {
        delete: false,
      };
    }
  }

  async updateData(id: string, newData: ProductDto): Promise<ProductEntity> {
    await this.productRepository.update({ id }, newData);
    return await this.productRepository.findOne({ where: { id } });
  }
}
