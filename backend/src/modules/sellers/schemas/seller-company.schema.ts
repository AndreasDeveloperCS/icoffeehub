import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SellerCompanyDocument = SellerCompany & Document;

export enum SellerType {
  FARM = 'farm',
  ROASTER = 'roaster',
  IMPORTER_EXPORTER = 'importer_exporter',
  COFFEE_SHOP = 'coffee_shop',
  EQUIPMENT_VENDOR = 'equipment_vendor',
  COURSE_PROVIDER = 'course_provider',
}

export enum SellerStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

@Schema({ timestamps: true })
export class SellerCompany {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ enum: SellerType, default: SellerType.ROASTER })
  sellerType: SellerType;

  @Prop()
  description?: string;

  @Prop()
  country?: string;

  @Prop({ type: [String], default: [] })
  deliveryCountries: string[];

  @Prop({ enum: SellerStatus, default: SellerStatus.PENDING })
  status: SellerStatus;

  @Prop({ type: [String], default: [] })
  verificationDocuments: string[];

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: 0 })
  commissionRate: number;

  @Prop()
  logoUrl?: string;
}

export const SellerCompanySchema = SchemaFactory.createForClass(SellerCompany);
