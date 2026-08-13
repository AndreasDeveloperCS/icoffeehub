import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { SellersService } from '../sellers/sellers.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly sellersService: SellersService,
  ) {}

  @Post('checkout')
  checkout(@CurrentUser() user: AuthUser, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(user.userId, dto);
  }

  @Get()
  myOrders(@CurrentUser() user: AuthUser) {
    return this.ordersService.listForUser(user.userId);
  }

  @Get('seller/mine')
  @UseGuards(RolesGuard)
  @Roles(Role.SELLER)
  async myStoreOrders(@CurrentUser() user: AuthUser) {
    const seller = await this.sellersService.findByUserId(user.userId);
    if (!seller) throw new NotFoundException('Seller profile not found');
    return this.ordersService.listForSeller(String(seller._id));
  }

  @Get(':id')
  detail(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ordersService.findByIdForUser(user.userId, id);
  }
}
