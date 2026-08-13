import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { SellersService } from '../sellers/sellers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('payouts')
@UseGuards(JwtAuthGuard)
export class PayoutsController {
  constructor(
    private readonly payoutsService: PayoutsService,
    private readonly sellersService: SellersService,
  ) {}

  @Get('mine')
  @UseGuards(RolesGuard)
  @Roles(Role.SELLER)
  async mine(@CurrentUser() user: AuthUser) {
    const seller = await this.sellersService.findByUserId(user.userId);
    return seller ? this.payoutsService.listForSeller(String(seller._id)) : [];
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  all() {
    return this.payoutsService.listAll();
  }

  @Post('admin/generate')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  generate(@Body() body: { sellerId: string; periodStart: string; periodEnd: string }) {
    return this.payoutsService.generate(body.sellerId, new Date(body.periodStart), new Date(body.periodEnd));
  }

  @Patch('admin/:id/paid')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  markPaid(@Param('id') id: string) {
    return this.payoutsService.markPaid(id);
  }
}
