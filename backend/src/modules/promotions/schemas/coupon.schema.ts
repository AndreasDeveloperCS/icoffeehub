import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CouponDocument = Coupon & Document;

export enum CouponType {
  PERCENT = 'percent',
  FIXED = 'fixed',
}

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ enum: CouponType, default: CouponType.PERCENT })
  type: CouponType;

  @Prop({ required: true })
  value: number;

  @Prop({ default: 0 })
  minOrderAmount: number;

  @Prop()
  maxUses?: number;

  @Prop({ default: 0 })
  usedCount: number;

  @Prop()
  expiresAt?: Date;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: Types.ObjectId, ref: 'SellerCompany' })
  sellerId?: Types.ObjectId;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
