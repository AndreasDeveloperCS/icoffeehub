import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SellerPayoutDocument = SellerPayout & Document;

@Schema({ timestamps: true })
export class SellerPayout {
  @Prop({ type: Types.ObjectId, ref: 'SellerCompany', required: true, index: true })
  sellerId: Types.ObjectId;

  @Prop({ required: true })
  periodStart: Date;

  @Prop({ required: true })
  periodEnd: Date;

  @Prop({ required: true })
  grossSales: number;

  @Prop({ required: true })
  commissionRate: number;

  @Prop({ required: true })
  commissionAmount: number;

  @Prop({ required: true })
  netPayout: number;

  @Prop({ enum: ['pending', 'paid'], default: 'pending' })
  status: string;

  @Prop()
  paidAt?: Date;
}

export const SellerPayoutSchema = SchemaFactory.createForClass(SellerPayout);
