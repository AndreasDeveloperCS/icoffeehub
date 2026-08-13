import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PAID = 'paid',
  FULFILLED = 'fulfilled',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Schema({ _id: false })
class OrderItemShipping {
  @Prop({ type: Types.ObjectId, ref: 'SellerCompany', required: true })
  sellerId: Types.ObjectId;

  @Prop({ enum: ['pending', 'shipped', 'delivered'], default: 'pending' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Shipment' })
  shipmentId?: Types.ObjectId;
}
const OrderItemShippingSchema = SchemaFactory.createForClass(OrderItemShipping);

@Schema({ _id: false })
class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SellerCompany', required: true })
  sellerId: Types.ObjectId;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;
}
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
class ShippingAddress {
  @Prop({ required: true }) fullName: string;
  @Prop({ required: true }) line1: string;
  @Prop() line2?: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) country: string;
  @Prop() postalCode?: string;
  @Prop() phone?: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ type: ShippingAddress, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true, default: 0 })
  shippingTotal: number;

  @Prop({ default: 0 })
  discountTotal: number;

  @Prop()
  couponCode?: string;

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ enum: OrderStatus, default: OrderStatus.PAID })
  status: OrderStatus;

  @Prop({
    type: { provider: String, status: String, transactionId: String, paidAt: Date },
    required: true,
  })
  payment: { provider: string; status: string; transactionId: string; paidAt: Date };

  @Prop({ type: [OrderItemShippingSchema], default: [] })
  fulfillment: OrderItemShipping[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
