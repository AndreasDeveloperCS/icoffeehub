import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service';
import { OrdersService } from '../orders/orders.service';
import { SellersService } from '../sellers/sellers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('fulfillment')
@UseGuards(JwtAuthGuard)
export class FulfillmentController {
  constructor(
    private readonly fulfillmentService: FulfillmentService,
    private readonly ordersService: OrdersService,
    private readonly sellersService: SellersService,
  ) {}

  @Get('carriers')
  listCarriers() {
    return this.fulfillmentService.listCarriers();
  }

  @Post('carriers')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  createCarrier(@Body() body: { name: string; trackingUrlTemplate?: string }) {
    return this.fulfillmentService.createCarrier(body);
  }

  @Post('orders/:orderId/ship')
  @UseGuards(RolesGuard)
  @Roles(Role.SELLER)
  async ship(
    @CurrentUser() user: AuthUser,
    @Param('orderId') orderId: string,
    @Body() body: { carrierName: string; trackingNumber?: string },
  ) {
    const seller = await this.sellersService.findByUserId(user.userId);
    if (!seller) throw new NotFoundException('Seller profile not found');
    return this.fulfillmentService.shipOrder(String(seller._id), orderId, body);
  }

  @Get('seller/mine')
  @UseGuards(RolesGuard)
  @Roles(Role.SELLER)
  async myShipments(@CurrentUser() user: AuthUser) {
    const seller = await this.sellersService.findByUserId(user.userId);
    if (!seller) throw new NotFoundException('Seller profile not found');
    return this.fulfillmentService.listForSeller(String(seller._id));
  }

  @Post('shipments/:id/events')
  @UseGuards(RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  addEvent(@Param('id') id: string, @Body() body: { status: string; location?: string; note?: string }) {
    return this.fulfillmentService.addTrackingEvent(id, body.status, body.location, body.note);
  }

  @Get('orders/:orderId/tracking')
  async tracking(@CurrentUser() user: AuthUser, @Param('orderId') orderId: string) {
    await this.ordersService.findByIdForUser(user.userId, orderId);
    return this.fulfillmentService.getTrackingForOrder(orderId);
  }
}
