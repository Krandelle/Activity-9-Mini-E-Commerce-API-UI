// src/products/dto/update-product.dto.ts

import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// This reads: "Create a class that has all the same fields as CreateProductDto, 
// but make them all optional."
export class UpdateProductDto extends PartialType(CreateProductDto) {}