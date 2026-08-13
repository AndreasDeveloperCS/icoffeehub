import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionOrderDocument = SubscriptionOrder & Document;

@Schema({ timestamps: true })
export class SubscriptionOrder {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SubscriptionPlan', required: true })
  planId: Types.ObjectId;

  @Prop({ enum: ['active', 'paused', 'cancelled'], default: 'active' })
  status: string;

  @Prop()
  shippingCountry?: string;

  @Prop()
  nextDeliveryDate?: Date;
}

export const SubscriptionOrderSchema = SchemaFactory.createForClass(SubscriptionOrder);
