import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SellerPayout, SellerPayoutSchema } from './schemas/seller-payout.schema';
import { PayoutsService } from './payouts.service';
import { PayoutsController } from './payouts.controller';
import { OrdersModule } from '../orders/orders.module';
import { SellersModule } from '../sellers/sellers.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: SellerPayout.name, schema: SellerPayoutSchema }]), OrdersModule, SellersModule],
  providers: [PayoutsService],
  controllers: [PayoutsController],
})
export class PayoutsModule {}
