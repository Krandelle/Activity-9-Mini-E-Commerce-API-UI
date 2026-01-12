import { Injectable, BadRequestException, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // 1. Seed dummy data if DB is empty
  async onModuleInit() {
    const count = await this.productsRepository.count();
    if (count === 0) {
      await this.productsRepository.save([
        { name: 'CvSU Hoodie', price: 500, stock: 10, description: 'Cotton' },
        { name: 'IT Keychain', price: 50, stock: 5, description: 'Acrylic' },
        { name: 'Gaming Mouse', price: 800, stock: 2, description: 'RGB' }, 
      ]);
      console.log('Inserted dummy data into SQLite!');
    }
  }

  // --- CRUD Operations ---

  create(createProductDto: CreateProductDto) {
    return this.productsRepository.save(createProductDto);
  }

  findAll() {
    return this.productsRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id); 
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productsRepository.remove(product);
  }

  // --- CHECKOUT LOGIC ---

  async checkout(cart: { id: number; quantity: number }[]) {
    // A. Consolidate duplicates
    const consolidatedCart = new Map<number, number>();
    for (const item of cart) {
      const currentQty = consolidatedCart.get(item.id) || 0;
      consolidatedCart.set(item.id, currentQty + item.quantity);
    }

    // B. Validation
    for (const [id, totalQuantity] of consolidatedCart.entries()) {
      const product = await this.productsRepository.findOneBy({ id });
      
      if (!product) throw new BadRequestException(`Product ${id} not found`);
      if (product.stock < totalQuantity) {
        throw new BadRequestException(
          `Error: You want ${totalQuantity} of "${product.name}", but only ${product.stock} are left.`
        );
      }
    }

    // C. Deduction (Actually saves to DB)
    for (const [id, totalQuantity] of consolidatedCart.entries()) {
      const product = await this.productsRepository.findOneBy({ id });
      if (product) {
        product.stock -= totalQuantity;
        await this.productsRepository.save(product);
      }
    }

    return { message: 'Order success!' };
  }
}