import { Body, Controller, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    const found = await this.usersService.findById(user.userId);
    if (!found) throw new NotFoundException('User not found');
    return this.usersService.toSafeJson(found);
  }

  @Patch('me')
  async updateMe(@CurrentUser() user: AuthUser, @Body() body: { name?: string; addresses?: any[] }) {
    const updated = await this.usersService.updateProfile(user.userId, body);
    return this.usersService.toSafeJson(updated);
  }

  @Post('me/wishlist/:productId')
  async toggleWishlist(@CurrentUser() user: AuthUser, @Param('productId') productId: string) {
    const updated = await this.usersService.toggleWishlist(user.userId, productId);
    return { wishlist: updated.wishlist };
  }

  @Post('me/journal/:productId')
  async addJournalEntry(
    @CurrentUser() user: AuthUser,
    @Param('productId') productId: string,
    @Body() body: { note: string; rating?: number },
  ) {
    const updated = await this.usersService.addJournalEntry(user.userId, productId, body.note, body.rating);
    return { tastingJournal: updated.tastingJournal };
  }
}
