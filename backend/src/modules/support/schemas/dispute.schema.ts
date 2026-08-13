import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DisputeDocument = Dispute & Document;

export enum DisputeStatus {
  OPEN = 'open',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Dispute {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  reason: string;

  @Prop()
  description?: string;

  @Prop({ enum: DisputeStatus, default: DisputeStatus.OPEN })
  status: DisputeStatus;

  @Prop()
  resolution?: string;
}

export const DisputeSchema = SchemaFactory.createForClass(Dispute);
