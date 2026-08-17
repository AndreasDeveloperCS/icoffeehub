import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ _id: false })
class ArticleSource {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;
}
const ArticleSourceSchema = SchemaFactory.createForClass(ArticleSource);

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

  // BCP-47-ish primary subtag (en, es, pt, fr, el, bg, ar) matching the frontend's SUPPORTED_LOCALES.
  @Prop({ default: 'en', index: true })
  locale: string;

  // Shared identifier linking every language variant of the same underlying article,
  // since each locale has its own document (and its own translated slug).
  @Prop({ index: true })
  translationGroup?: string;

  // "Further reading" citations to the external material the article draws on.
  @Prop({ type: [ArticleSourceSchema], default: [] })
  sources: ArticleSource[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.index({ title: 'text', summary: 'text', body: 'text' });
ArticleSchema.index({ type: 1, locale: 1 });
