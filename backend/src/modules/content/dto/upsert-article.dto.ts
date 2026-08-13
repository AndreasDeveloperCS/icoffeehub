import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ArticleType } from '../schemas/article.schema';

export class UpsertArticleDto {
  @IsString()
  title: string;

  @IsEnum(ArticleType)
  type: ArticleType;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  countrySlug?: string;

  @IsOptional()
  @IsString()
  heroImageUrl?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: 'draft' | 'published';
}
