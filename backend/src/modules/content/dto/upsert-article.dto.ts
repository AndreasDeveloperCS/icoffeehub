import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleType } from '../schemas/article.schema';

class ArticleSourceDto {
  @IsString()
  title: string;

  @IsString()
  url: string;
}

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

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsString()
  translationGroup?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleSourceDto)
  sources?: ArticleSourceDto[];
}
