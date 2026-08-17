import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { UpsertArticleDto } from './dto/upsert-article.dto';
import { ArticleType } from './schemas/article.schema';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('articles')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  list(@Query('type') type?: ArticleType, @Query('q') q?: string, @Query('locale') locale?: string) {
    return this.contentService.listPublished(type, q, locale);
  }

  @Get('country/:countrySlug')
  byCountry(@Param('countrySlug') countrySlug: string, @Query('locale') locale?: string) {
    return this.contentService.listByCountry(countrySlug, locale);
  }

  @Get('translations/:translationGroup')
  translations(@Param('translationGroup') translationGroup: string) {
    return this.contentService.listTranslations(translationGroup);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  listAllForAdmin() {
    return this.contentService.listAllForAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: UpsertArticleDto) {
    return this.contentService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: Partial<UpsertArticleDto>) {
    return this.contentService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }

  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.contentService.findBySlug(slug);
  }
}
