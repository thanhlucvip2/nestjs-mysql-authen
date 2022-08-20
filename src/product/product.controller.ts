import { ValidationPipe } from './../shared/validation.pipe';
import { ProductService } from './product.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { ProductDto } from './dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  async getAllData(): Promise<ProductEntity[]> {
    return await this.productService.getAll();
  }

  @Get(':id')
  async getOneById(@Param('id') id: string): Promise<ProductEntity> {
    return await this.productService.findById(id);
  }

  @Post()
  async createData(@Body() bodyDto: ProductDto): Promise<ProductEntity> {
    return await this.productService.create(bodyDto);
  }

  @Delete(':id')
  async deleteData(@Param('id') id: string): Promise<{ delete: boolean }> {
    return await this.productService.deleteData(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe()) // chạy vào đây để check validate data
  async updateData(
    @Param('id') id: string,
    @Body() body: ProductDto,
  ): Promise<ProductEntity> {
    return await this.productService.updateData(id, body);
  }
}
