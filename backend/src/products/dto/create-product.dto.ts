// src/products/dto/create-product.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';

export class CreateProductDto {
  
  // 1. Name of the product
  @ApiProperty({ 
    example: 'Wireless Gaming Mouse', 
    description: 'The name of the product' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  // 2. Price (Must be a number and not negative)
  @ApiProperty({ 
    example: 49.99, 
    description: 'The price of the product' 
  })
  @IsNumber()
  @Min(0) // Price cannot be negative
  price: number;

  // 3. Description (Optional but good to have)
  @ApiProperty({ 
    example: 'High precision optical sensor...', 
    description: 'Product details',
    required: false // Marks it as optional in Swagger UI
  })
  @IsString()
  @IsOptional()
  description?: string;

  // 4. Stock / Inventory Count
  @ApiProperty({ 
    example: 100, 
    description: 'Quantity available in inventory' 
  })
  @IsNumber()
  @Min(0) // Stock cannot be negative
  stock: number;
}