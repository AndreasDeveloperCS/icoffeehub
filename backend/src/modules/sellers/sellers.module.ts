import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SellerCompany, SellerCompanySchema } from './schemas/seller-company.schema';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SellerCompany.name, schema: SellerCompanySchema }]),
    NotificationsModule,
  ],
  providers: [SellersService],
  controllers: [SellersController],
  exports: [SellersService, MongooseModule],
})
export class SellersModule {}
