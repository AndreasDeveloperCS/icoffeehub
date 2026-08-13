import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TrackingEventDocument = TrackingEvent & Document;

@Schema({ timestamps: true })
export class TrackingEvent {
  @Prop({ type: Types.ObjectId, ref: 'Shipment', required: true, index: true })
  shipmentId: Types.ObjectId;

  @Prop({ required: true })
  status: string;

  @Prop()
  location?: string;

  @Prop()
  note?: string;

  @Prop({ default: () => new Date() })
  occurredAt: Date;
}

export const TrackingEventSchema = SchemaFactory.createForClass(TrackingEvent);
