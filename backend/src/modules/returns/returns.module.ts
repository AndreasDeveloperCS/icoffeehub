import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnRequest, ReturnRequestSchema } from './schemas/return-request.schema';
import { ReturnsService } from './returns.service';
import { ReturnsController } from './returns.controller';
import { OrdersModule } from '../orders/orders.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SellersModule } from '../sellers/sellers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ReturnRequest.name, schema: ReturnRequestSchema }]),
    OrdersModule,
    NotificationsModule,
    SellersModule,
  ],
  providers: [ReturnsService],
  controllers: [ReturnsController],
})
export class ReturnsModule {}
