import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { SellersService } from '../sellers/sellers.service';
import { ProductsService } from '../catalog/products.service';
import { OrdersService } from '../orders/orders.service';
import { ReviewsService } from '../reviews/reviews.service';
import { AuditLogService } from '../audit/audit-log.service';
import { SellerStatus } from '../sellers/schemas/seller-company.schema';
import { ProductStatus } from '../catalog/schemas/product.schema';
import { OrderStatus } from '../orders/schemas/order.schema';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    private readonly sellersService: SellersService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly reviewsService: ReviewsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get('dashboard')
  async dashboard() {
    const [sellersTotal, sellersPending, productsActive, ordersTotal, revenue] = await Promise.all([
      this.sellersService.countAll(),
      this.sellersService.countPending(),
      this.productsService.countActive(),
      this.ordersService.countAll(),
      this.ordersService.totalRevenue(),
    ]);
    return { sellersTotal, sellersPending, productsActive, ordersTotal, revenue };
  }

  @Get('sellers/pending')
  pendingSellers() {
    return this.sellersService.listPending();
  }

  @Patch('sellers/:id/status')
  async setSellerStatus(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body('status') status: SellerStatus) {
    const seller = await this.sellersService.setStatus(id, status);
    await this.auditLogService.log(user.userId, user.role, `seller.${status}`, 'SellerCompany', id);
    return seller;
  }

  @Get('products/pending')
  pendingProducts() {
    return this.productsService.listPendingReview();
  }

  @Patch('products/:id/status')
  async setProductStatus(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body('status') status: ProductStatus) {
    const product = await this.productsService.setStatus(id, status);
    await this.auditLogService.log(user.userId, user.role, `product.${status}`, 'Product', id);
    return product;
  }

  @Get('reviews')
  reviews() {
    return this.reviewsService.listAllForModeration();
  }

  @Patch('reviews/:id/status')
  async setReviewStatus(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body('status') status: 'visible' | 'hidden') {
    const review = await this.reviewsService.setStatus(id, status);
    await this.auditLogService.log(user.userId, user.role, `review.${status}`, 'Review', id);
    return review;
  }

  @Get('orders')
  orders() {
    return this.ordersService.listAll();
  }

  @Patch('orders/:id/status')
  async setOrderStatus(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body('status') status: OrderStatus) {
    const order = await this.ordersService.updateStatus(id, status, user.userId);
    await this.auditLogService.log(user.userId, user.role, `order.${status}`, 'Order', id);
    return order;
  }

  @Get('audit-logs')
  auditLogs() {
    return this.auditLogService.list();
  }
}
