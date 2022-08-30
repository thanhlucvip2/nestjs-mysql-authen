import { UserEntity } from 'src/user/user.entity';
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
  async getAllData(@UserCustomDecorator() user: UserEntity): Promise<any[]> {
    // console.log(user);

    return await this.productService.getAll(user);
  }

  @Get(':id')
  @UseGuards(new AuthGuard()) // check user đã đăng nhập chưa
  async getOneById(@Param('id') id: string): Promise<any> {
    return await this.productService.findById(id);
  }

  @Post()
  @UseGuards(new AuthGuard()) // check user đã đăng nhập chưa
  async createData(
    @UserCustomDecorator() user,
    @Body() bodyDto: ProductDto,
  ): Promise<any> {
    return await this.productService.create(bodyDto, user);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard()) // check user đã đăng nhập chưa
  async deleteData(@Param('id') id: string): Promise<{ delete: boolean }> {
    return await this.productService.deleteData(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard()) // check user đã đăng nhập chưa
  @UsePipes(new ValidationPipe()) // chạy vào đây để check validate data
  async updateData(
    @Param('id') id: string,
    @Body() body: ProductDto,
  ): Promise<ProductEntity> {
    return await this.productService.updateData(id, body);
  }
}
