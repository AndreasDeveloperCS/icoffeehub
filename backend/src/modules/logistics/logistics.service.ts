import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeliveryZone, DeliveryZoneDocument } from './schemas/delivery-zone.schema';

@Injectable()
export class LogisticsService {
  constructor(@InjectModel(DeliveryZone.name) private zoneModel: Model<DeliveryZoneDocument>) {}

  async setZones(sellerId: string, zones: { countryCode: string; flatRate: number; estimatedDays?: number }[]) {
    await this.zoneModel.deleteMany({ sellerId: new Types.ObjectId(sellerId) });
    if (zones.length === 0) return [];
    return this.zoneModel.insertMany(
      zones.map((z) => ({ ...z, countryCode: z.countryCode.toUpperCase(), sellerId: new Types.ObjectId(sellerId) })),
    );
  }

  listForSeller(sellerId: string) {
    return this.zoneModel.find({ sellerId: new Types.ObjectId(sellerId) }).exec();
  }

  async getSellerIdsDeliveringTo(countryCode: string): Promise<string[]> {
    const zones = await this.zoneModel.find({ countryCode: countryCode.toUpperCase() }).exec();
    return zones.map((z) => String(z.sellerId));
  }

  async getRate(sellerId: string, countryCode: string) {
    return this.zoneModel
      .findOne({ sellerId: new Types.ObjectId(sellerId), countryCode: countryCode.toUpperCase() })
      .exec();
  }

  async isDeliverable(sellerId: string, countryCode: string) {
    const zone = await this.getRate(sellerId, countryCode);
    return !!zone;
  }
}
