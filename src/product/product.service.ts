import { UserDto } from './../user/user.dto';
import { ProductDto, productUserDto } from './dto/product.dto';
import { ProductEntity } from './product.entity';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository, UserRepository } from './product.repository';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: ProductRepository,
    @InjectRepository(UserEntity)
    private userRepository: UserRepository,
  ) {}

  private toResponsObject(product: ProductEntity): productUserDto {
    return { ...product, author: product.author.toResponseObject(false) };
  }

  async getAll(user: UserEntity): Promise<productUserDto[]> {
    const list = await this.productRepository.find({ relations: ['author'] });
    if (!list.length) {
      throw new NotFoundException({ message: 'khong co du lieu' });
    }
    const idUser = user.id;

    return list.map((product) => this.toResponsObject(product));
    // .filter((item) => {
    //   return item.author.id === idUser;
    // });
  }

  async findById(id: string): Promise<productUserDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    /*  
    1 . away : this.productRepository.findOneBy({ id });
    2 . away : this.productRepository.findOne({ where: { id } });
    **/

    if (!product) {
      throw new HttpException('không tìm thấy Id', HttpStatus.NOT_FOUND); // sử dụng httpError , HttpStatus.NOT_FOUND : là status trả về ( 404 )
    }
    return this.toResponsObject(product);
  }

  async create(dto: ProductDto, user: UserDto): Promise<any> {
    try {
      // const user = await this.userRepository.findOne({ where: { id: userId } });

      const product = await this.productRepository.create({
        ...dto,
        author: user,
      });
      await this.productRepository.save(product);
      return {
        ...product,
        author: product.author.toResponseObject(true),
      };
    } catch (error) {
      throw new HttpException(
        error.sqlMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteData(id: string, user: UserEntity): Promise<{ delete: boolean }> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    // kiểm tra user
    const userId = user.id;

    // console.log();
    if (product.author.id !== userId) {
      throw new HttpException(
        'user không trùng với sản phẩm',
        HttpStatus.NOT_FOUND,
      );
    }
    // kiểm tra xem id có tồn tại không
    if (!product) {
      throw new HttpException('không tìm thấy Id', HttpStatus.NOT_FOUND); // sử dụng httpError , HttpStatus.NOT_FOUND : là status trả về ( 404 )
    }
    // tiến hành delete
    await this.productRepository.delete({ id });
    return {
      delete: false,
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
