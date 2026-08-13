import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { SellersModule } from '../sellers/sellers.module';
import { CatalogModule } from '../catalog/catalog.module';
import { OrdersModule } from '../orders/orders.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { AuditLogModule } from '../audit/audit-log.module';

@Module({
  imports: [SellersModule, CatalogModule, OrdersModule, ReviewsModule, AuditLogModule],
  controllers: [AdminController],
})
export class AdminModule {}
