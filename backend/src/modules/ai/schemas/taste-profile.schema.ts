import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RoastLevel } from '../../catalog/enums/coffee.enums';

export type TasteProfileDocument = TasteProfile & Document;

@Schema({ timestamps: true })
export class TasteProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [String], enum: RoastLevel, default: [] })
  preferredRoastLevels: RoastLevel[];

  @Prop({ type: [String], default: [] })
  preferredFlavorNotes: string[];

  @Prop({ min: 1, max: 5, default: 3 })
  acidityPreference: number;

  @Prop({ min: 1, max: 5, default: 3 })
  bodyPreference: number;

  @Prop({ type: [String], default: [] })
  avoidFlavorNotes: string[];

  @Prop()
  brewMethod?: string;
}

export const TasteProfileSchema = SchemaFactory.createForClass(TasteProfile);
