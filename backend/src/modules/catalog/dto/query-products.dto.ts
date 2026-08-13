import { IsIn, IsOptional, IsString } from 'class-validator';

export class QueryProductsDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  originCountry?: string;

  @IsOptional()
  @IsString()
  roastLevel?: string;

  @IsOptional()
  @IsString()
  processingMethod?: string;

  @IsOptional()
  @IsString()
  flavorNote?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  deliverTo?: string;

  @IsOptional()
  @IsString()
  sellerId?: string;

  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'newest', 'rating'])
  sort?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
