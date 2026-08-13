import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AiConversationDocument = AiConversation & Document;

@Schema({ _id: false })
class AiMessage {
  @Prop({ enum: ['user', 'assistant'], required: true })
  role: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}
const AiMessageSchema = SchemaFactory.createForClass(AiMessage);

@Schema({ timestamps: true })
export class AiConversation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: [AiMessageSchema], default: [] })
  messages: AiMessage[];
}

export const AiConversationSchema = SchemaFactory.createForClass(AiConversation);
