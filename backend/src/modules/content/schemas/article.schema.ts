import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

export enum ArticleType {
  ENCYCLOPEDIA = 'encyclopedia',
  COUNTRY = 'country',
  FARM = 'farm',
  ROASTER = 'roaster',
  COFFEE_SHOP = 'coffee_shop',
  BREW_GUIDE = 'brew_guide',
  RECIPE = 'recipe',
  NEWS = 'news',
  COURSE = 'course',
}

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ enum: ArticleType, required: true, index: true })
  type: ArticleType;

  @Prop()
  summary?: string;

  @Prop()
  body?: string;

  @Prop()
  countrySlug?: string;

  @Prop()
  heroImageUrl?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  seoTitle?: string;

  @Prop()
  seoDescription?: string;

  @Prop({ enum: ['draft', 'published'], default: 'draft' })
  status: string;

  @Prop()
  publishedAt?: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.index({ title: 'text', summary: 'text', body: 'text' });
