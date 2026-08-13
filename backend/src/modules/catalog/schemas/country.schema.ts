import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CountryDocument = Country & Document;

@Schema({ timestamps: true })
export class Country {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true, unique: true, uppercase: true, minlength: 2, maxlength: 2 })
  isoCode: string;

  @Prop()
  region?: string;

  @Prop()
  summary?: string;

  @Prop()
  heroImageUrl?: string;

  @Prop({ default: false })
  isCoffeeOrigin: boolean;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
