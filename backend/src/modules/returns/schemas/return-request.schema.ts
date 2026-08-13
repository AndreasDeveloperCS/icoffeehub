import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReturnRequestDocument = ReturnRequest & Document;

export enum ReturnStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class ReturnRequest {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SellerCompany', required: true })
  sellerId: Types.ObjectId;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ enum: ReturnStatus, default: ReturnStatus.REQUESTED })
  status: ReturnStatus;

  @Prop()
  refundAmount?: number;
}

export const ReturnRequestSchema = SchemaFactory.createForClass(ReturnRequest);
