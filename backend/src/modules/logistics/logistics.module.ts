import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryZone, DeliveryZoneSchema } from './schemas/delivery-zone.schema';
import { LogisticsService } from './logistics.service';
import { LogisticsController } from './logistics.controller';
import { SellersModule } from '../sellers/sellers.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: DeliveryZone.name, schema: DeliveryZoneSchema }]), SellersModule],
  providers: [LogisticsService],
  controllers: [LogisticsController],
  exports: [LogisticsService],
})
export class LogisticsModule {}
