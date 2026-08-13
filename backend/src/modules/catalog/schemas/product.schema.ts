import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProcessingMethod, ProductCategory, RoastLevel } from '../enums/coffee.enums';

export type ProductDocument = Product & Document;

@Schema({ _id: false })
class ProductVariant {
  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  weightGrams: number;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ default: 0 })
  stock: number;
}
const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);

export enum ProductStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: Types.ObjectId, ref: 'SellerCompany', required: true, index: true })
  sellerId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ enum: ProductCategory, default: ProductCategory.ROASTED_BEANS })
  category: ProductCategory;

  @Prop()
  description?: string;

  @Prop()
  originCountry?: string;

  @Prop()
  farmName?: string;

  @Prop()
  variety?: string;

  @Prop()
  altitudeMeters?: number;

  @Prop({ enum: RoastLevel })
  roastLevel?: RoastLevel;

  @Prop({ enum: ProcessingMethod })
  processingMethod?: ProcessingMethod;

  @Prop({ type: [String], default: [] })
  flavorNotes: string[];

  @Prop()
  roastDate?: Date;

  @Prop({ type: [String], default: [] })
  photos: string[];

  @Prop({ type: [ProductVariantSchema], default: [] })
  variants: ProductVariant[];

  @Prop({ enum: ProductStatus, default: ProductStatus.PENDING_REVIEW })
  status: ProductStatus;

  @Prop({ default: 0 })
  ratingAverage: number;

  @Prop({ default: 0 })
  ratingCount: number;

  @Prop({ default: false })
  featured: boolean;

  @Prop()
  seoTitle?: string;

  @Prop()
  seoDescription?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 'text', description: 'text', originCountry: 'text', flavorNotes: 'text' });
