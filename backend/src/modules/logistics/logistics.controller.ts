import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { SellersService } from '../sellers/sellers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('logistics')
export class LogisticsController {
  constructor(
    private readonly logisticsService: LogisticsService,
    private readonly sellersService: SellersService,
  ) {}

  @Get('zones/:sellerId')
  listPublic(@Param('sellerId') sellerId: string) {
    return this.logisticsService.listForSeller(sellerId);
  }

  @Get('me/zones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async myZones(@CurrentUser() user: AuthUser) {
    const seller = await this.sellersService.findByUserId(user.userId);
    if (!seller) throw new NotFoundException('Seller profile not found');
    return this.logisticsService.listForSeller(String(seller._id));
  }

  @Post('me/zones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async setMyZones(
    @CurrentUser() user: AuthUser,
    @Body() body: { zones: { countryCode: string; flatRate: number; estimatedDays?: number }[] },
  ) {
    const seller = await this.sellersService.findByUserId(user.userId);
    if (!seller) throw new NotFoundException('Seller profile not found');
    return this.logisticsService.setZones(String(seller._id), body.zones);
  }
}
