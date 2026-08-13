import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProcessingMethod, ProductCategory, RoastLevel } from '../enums/coffee.enums';

class ProductVariantDto {
  @IsString()
  sku: string;

  @IsNumber()
  weightGrams: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  stock?: number;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  originCountry?: string;

  @IsOptional()
  @IsString()
  farmName?: string;

  @IsOptional()
  @IsString()
  variety?: string;

  @IsOptional()
  @IsNumber()
  altitudeMeters?: number;

  @IsOptional()
  @IsEnum(RoastLevel)
  roastLevel?: RoastLevel;

  @IsOptional()
  @IsEnum(ProcessingMethod)
  processingMethod?: ProcessingMethod;

  @IsOptional()
  @IsArray()
  flavorNotes?: string[];

  @IsOptional()
  @IsString()
  roastDate?: string;

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants: ProductVariantDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
