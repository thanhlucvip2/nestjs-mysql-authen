import { UserEntity } from './../user/user.entity';
import { ProductEntity } from './product.entity';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, UserEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
