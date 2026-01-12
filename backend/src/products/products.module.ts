import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Import 1
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity'; // <--- Import 2

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // <--- ADD THIS LINE
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}