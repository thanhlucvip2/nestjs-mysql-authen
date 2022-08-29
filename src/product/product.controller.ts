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
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { ProductDto } from './dto/product.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { UserCustomDecorator } from 'src/user/user.decorator';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  @UseGuards(new AuthGuard()) // check user đã đăng nhập chưa
  async getAllData(@UserCustomDecorator() user): Promise<ProductEntity[]> {
    console.log(user);

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
