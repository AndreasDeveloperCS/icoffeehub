import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { SellerType } from '../schemas/seller-company.schema';

export class OnboardSellerDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsEnum(SellerType)
  sellerType?: SellerType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsArray()
  deliveryCountries?: string[];

  @IsOptional()
  @IsArray()
  verificationDocuments?: string[];
}
