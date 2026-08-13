import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SupportTicketDocument = SupportTicket & Document;

@Schema({ _id: false })
class TicketReply {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ required: true })
  authorRole: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}
const TicketReplySchema = SchemaFactory.createForClass(TicketReply);

@Schema({ timestamps: true })
export class SupportTicket {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ enum: ['open', 'closed'], default: 'open' })
  status: string;

  @Prop({ type: [TicketReplySchema], default: [] })
  replies: TicketReply[];
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);
