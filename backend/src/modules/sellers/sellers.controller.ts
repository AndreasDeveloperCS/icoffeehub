import { Body, Controller, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { OnboardSellerDto } from './dto/onboard-seller.dto';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  list() {
    return this.sellersService.listApproved();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async me(@CurrentUser() user: AuthUser) {
    const seller = await this.sellersService.findByUserId(user.userId);
    if (!seller) throw new NotFoundException('Seller profile not found');
    return seller;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: OnboardSellerDto) {
    return this.sellersService.updateOwnProfile(user.userId, dto);
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string) {
    const seller = await this.sellersService.findBySlug(slug);
    if (!seller) throw new NotFoundException('Seller not found');
    return seller;
  }
}
