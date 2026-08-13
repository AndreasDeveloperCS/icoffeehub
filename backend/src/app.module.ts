import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { LogisticsModule } from './modules/logistics/logistics.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ContentModule } from './modules/content/content.module';
import { AiModule } from './modules/ai/ai.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { FulfillmentModule } from './modules/fulfillment/fulfillment.module';
import { ReturnsModule } from './modules/returns/returns.module';
import { SupportModule } from './modules/support/support.module';
import { AuditLogModule } from './modules/audit/audit-log.module';
import { PayoutsModule } from './modules/payouts/payouts.module';
import { CollectionsModule } from './modules/collections/collections.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    UsersModule,
    AuthModule,
    SellersModule,
    CatalogModule,
    LogisticsModule,
    OrdersModule,
    ReviewsModule,
    ContentModule,
    AiModule,
    SubscriptionsModule,
    NotificationsModule,
    AdminModule,
    PromotionsModule,
    FulfillmentModule,
    ReturnsModule,
    SupportModule,
    AuditLogModule,
    PayoutsModule,
    CollectionsModule,
  ],
})
export class AppModule {}
