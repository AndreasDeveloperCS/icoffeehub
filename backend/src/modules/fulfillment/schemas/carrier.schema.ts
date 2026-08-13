import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarrierDocument = Carrier & Document;

@Schema({ timestamps: true })
export class Carrier {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  trackingUrlTemplate?: string;

  @Prop({ default: true })
  active: boolean;
}

export const CarrierSchema = SchemaFactory.createForClass(Carrier);
