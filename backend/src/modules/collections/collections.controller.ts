import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  mine(@CurrentUser() user: AuthUser) {
    return this.collectionsService.listForUser(user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: AuthUser, @Body() body: { name: string; description?: string; isPublic?: boolean }) {
    return this.collectionsService.create(user.userId, body.name, body.description, body.isPublic);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() body: any) {
    return this.collectionsService.update(id, user.userId, body);
  }

  @Post(':id/products/:productId')
  @UseGuards(JwtAuthGuard)
  toggleProduct(@CurrentUser() user: AuthUser, @Param('id') id: string, @Param('productId') productId: string) {
    return this.collectionsService.toggleProduct(id, user.userId, productId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.collectionsService.remove(id, user.userId);
  }

  @Get(':id')
  findPublic(@Param('id') id: string) {
    return this.collectionsService.findPublic(id);
  }
}
