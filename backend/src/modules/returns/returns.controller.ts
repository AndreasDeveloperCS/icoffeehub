import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { ReturnStatus } from './schemas/return-request.schema';
import { SellersService } from '../sellers/sellers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('returns')
@UseGuards(JwtAuthGuard)
export class ReturnsController {
  constructor(
    private readonly returnsService: ReturnsService,
    private readonly sellersService: SellersService,
  ) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() body: { orderId: string; sku: string; reason: string }) {
    return this.returnsService.create(user.userId, body.orderId, body.sku, body.reason);
  }

  @Get('mine')
  mine(@CurrentUser() user: AuthUser) {
    return this.returnsService.listForUser(user.userId);
  }

  @Get('seller/mine')
  @UseGuards(RolesGuard)
  @Roles(Role.SELLER)
  async sellerMine(@CurrentUser() user: AuthUser) {
    const seller = await this.sellersService.findByUserId(user.userId);
    return seller ? this.returnsService.listForSeller(String(seller._id)) : [];
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  setStatus(@Param('id') id: string, @Body('status') status: ReturnStatus) {
    return this.returnsService.setStatus(id, status);
  }
}
