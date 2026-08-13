import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { Order, OrderSchema } from './schemas/order.schema';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MockPaymentProvider } from './payments/mock-payment.provider';
import { CatalogModule } from '../catalog/catalog.module';
import { LogisticsModule } from '../logistics/logistics.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SellersModule } from '../sellers/sellers.module';
import { PromotionsModule } from '../promotions/promotions.module';
import { AuditLogModule } from '../audit/audit-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Invoice.name, schema: InvoiceSchema },
    ]),
    CatalogModule,
    LogisticsModule,
    NotificationsModule,
    SellersModule,
    PromotionsModule,
    AuditLogModule,
  ],
  providers: [CartService, OrdersService, MockPaymentProvider],
  controllers: [CartController, OrdersController],
  exports: [OrdersService, CartService, MongooseModule],
})
export class OrdersModule {}
