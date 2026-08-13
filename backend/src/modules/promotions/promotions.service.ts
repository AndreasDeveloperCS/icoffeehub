import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument, CouponType } from './schemas/coupon.schema';

@Injectable()
export class PromotionsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {}

  async preview(code: string, subtotal: number) {
    const coupon = await this.findValid(code, subtotal);
    return { code: coupon.code, discount: this.computeDiscount(coupon, subtotal) };
  }

  async findValid(code: string, subtotal: number) {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase().trim() }).exec();
    if (!coupon || !coupon.active) throw new NotFoundException('Coupon not found');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new BadRequestException('Coupon has expired');
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new BadRequestException('Coupon has been fully redeemed');
    if (subtotal < coupon.minOrderAmount) {
      throw new BadRequestException(`Coupon requires a minimum order of ${coupon.minOrderAmount}`);
    }
    return coupon;
  }

  computeDiscount(coupon: Coupon, subtotal: number) {
    const raw = coupon.type === CouponType.PERCENT ? (subtotal * coupon.value) / 100 : coupon.value;
    return Math.min(raw, subtotal);
  }

  async redeem(code: string) {
    await this.couponModel.updateOne({ code: code.toUpperCase().trim() }, { $inc: { usedCount: 1 } }).exec();
  }

  create(data: Partial<Coupon>) {
    return this.couponModel.create({ ...data, code: data.code?.toUpperCase().trim() });
  }

  listAll() {
    return this.couponModel.find().sort({ createdAt: -1 }).exec();
  }

  async setActive(id: string, active: boolean) {
    const coupon = await this.couponModel.findByIdAndUpdate(id, { active }, { new: true }).exec();
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }
}
