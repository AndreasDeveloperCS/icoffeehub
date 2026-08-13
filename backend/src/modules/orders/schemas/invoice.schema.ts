import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, unique: true })
  orderId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  invoiceNumber: string;

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  shippingTotal: number;

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'USD' })
  currency: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
