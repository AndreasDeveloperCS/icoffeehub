import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DeliveryZoneDocument = DeliveryZone & Document;

@Schema({ timestamps: true })
export class DeliveryZone {
  @Prop({ type: Types.ObjectId, ref: 'SellerCompany', required: true, index: true })
  sellerId: Types.ObjectId;

  @Prop({ required: true, uppercase: true })
  countryCode: string;

  @Prop({ required: true, default: 0 })
  flatRate: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ default: 5 })
  estimatedDays: number;
}

export const DeliveryZoneSchema = SchemaFactory.createForClass(DeliveryZone);
DeliveryZoneSchema.index({ sellerId: 1, countryCode: 1 }, { unique: true });
