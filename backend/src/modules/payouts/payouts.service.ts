import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SellerPayout, SellerPayoutDocument } from './schemas/seller-payout.schema';
import { OrdersService } from '../orders/orders.service';
import { SellersService } from '../sellers/sellers.service';

const DEFAULT_COMMISSION_RATE = 10;

@Injectable()
export class PayoutsService {
  constructor(
    @InjectModel(SellerPayout.name) private payoutModel: Model<SellerPayoutDocument>,
    private readonly ordersService: OrdersService,
    private readonly sellersService: SellersService,
  ) {}

  async generate(sellerId: string, periodStart: Date, periodEnd: Date) {
    const seller = await this.sellersService.findById(sellerId);
    if (!seller) throw new NotFoundException('Seller not found');

    const grossSales = await this.ordersService.sumSellerSales(sellerId, periodStart, periodEnd);
    const commissionRate = seller.commissionRate > 0 ? seller.commissionRate : DEFAULT_COMMISSION_RATE;
    const commissionAmount = Math.round(grossSales * (commissionRate / 100) * 100) / 100;
    const netPayout = Math.round((grossSales - commissionAmount) * 100) / 100;

    return this.payoutModel.create({
      sellerId: new Types.ObjectId(sellerId),
      periodStart,
      periodEnd,
      grossSales,
      commissionRate,
      commissionAmount,
      netPayout,
    });
  }

  listForSeller(sellerId: string) {
    return this.payoutModel.find({ sellerId: new Types.ObjectId(sellerId) }).sort({ periodEnd: -1 }).exec();
  }

  listAll() {
    return this.payoutModel.find().sort({ createdAt: -1 }).limit(200).exec();
  }

  async markPaid(id: string) {
    const payout = await this.payoutModel.findByIdAndUpdate(id, { status: 'paid', paidAt: new Date() }, { new: true }).exec();
    if (!payout) throw new NotFoundException('Payout not found');
    return payout;
  }
}
