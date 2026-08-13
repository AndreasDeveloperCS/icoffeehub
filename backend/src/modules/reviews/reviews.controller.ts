import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@Controller()
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('products/:productId/reviews')
  list(@Param('productId') productId: string) {
    return this.reviewsService.listForProduct(productId);
  }

  @Post('products/:productId/reviews')
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthUser, @Param('productId') productId: string, @Body() dto: CreateReviewDto) {
    const fullUser = await this.usersService.findById(user.userId);
    if (!fullUser) throw new NotFoundException('User not found');
    return this.reviewsService.create(user.userId, fullUser.name, productId, dto);
  }
}
