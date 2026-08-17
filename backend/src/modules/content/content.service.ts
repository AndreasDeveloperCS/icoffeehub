import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument, ArticleType } from './schemas/article.schema';
import { UpsertArticleDto } from './dto/upsert-article.dto';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

@Injectable()
export class ContentService {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

  async create(dto: UpsertArticleDto) {
    let slug = slugify(dto.title);
    let count = 0;
    while (await this.articleModel.exists({ slug: count === 0 ? slug : `${slug}-${count}` })) count += 1;
    if (count > 0) slug = `${slug}-${count}`;

    return this.articleModel.create({
      ...dto,
      slug,
      publishedAt: dto.status === 'published' ? new Date() : undefined,
    });
  }

  async update(id: string, dto: Partial<UpsertArticleDto>) {
    const article = await this.articleModel.findById(id).exec();
    if (!article) throw new NotFoundException('Article not found');
    Object.assign(article, dto);
    if (dto.status === 'published' && !article.publishedAt) article.publishedAt = new Date();
    return article.save();
  }

  async remove(id: string) {
    await this.articleModel.findByIdAndDelete(id).exec();
  }

  listPublished(type?: ArticleType, q?: string, locale = 'en') {
    const filter: Record<string, unknown> = { status: 'published', locale };
    if (type) filter.type = type;
    if (q) filter.$text = { $search: q };
    return this.articleModel.find(filter).sort({ publishedAt: -1 }).exec();
  }

  async findBySlug(slug: string) {
    const article = await this.articleModel.findOne({ slug, status: 'published' }).exec();
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  listByCountry(countrySlug: string, locale = 'en') {
    return this.articleModel.find({ countrySlug, status: 'published', locale }).exec();
  }

  /** Every published language variant of the article sharing `translationGroup`, for a language switcher. */
  listTranslations(translationGroup: string) {
    return this.articleModel.find({ translationGroup, status: 'published' }).exec();
  }

  listAllForAdmin() {
    return this.articleModel.find().sort({ createdAt: -1 }).exec();
  }
}
