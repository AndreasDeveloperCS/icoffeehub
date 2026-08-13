import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SellerCompany, SellerCompanyDocument, SellerStatus } from './schemas/seller-company.schema';
import { OnboardSellerDto } from './dto/onboard-seller.dto';
import { NotificationsService } from '../notifications/notifications.service';

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `seller-${Date.now()}`
  );
}

@Injectable()
export class SellersService {
  constructor(
    @InjectModel(SellerCompany.name) private sellerModel: Model<SellerCompanyDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createForUser(userId: string, companyName: string) {
    let slug = slugify(companyName);
    let count = 0;
    while (await this.sellerModel.exists({ slug: count === 0 ? slug : `${slug}-${count}` })) {
      count += 1;
    }
    if (count > 0) slug = `${slug}-${count}`;

    return this.sellerModel.create({
      userId: new Types.ObjectId(userId),
      companyName,
      slug,
      status: SellerStatus.PENDING,
    });
  }

  findByUserId(userId: string) {
    return this.sellerModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
  }

  findBySlug(slug: string) {
    return this.sellerModel.findOne({ slug }).exec();
  }

  findById(id: string) {
    return this.sellerModel.findById(id).exec();
  }

  listApproved() {
    return this.sellerModel.find({ status: SellerStatus.APPROVED }).exec();
  }

  listPending() {
    return this.sellerModel.find({ status: SellerStatus.PENDING }).exec();
  }

  async updateOwnProfile(userId: string, dto: OnboardSellerDto) {
    const seller = await this.findByUserId(userId);
    if (!seller) throw new NotFoundException('Seller profile not found');
    Object.assign(seller, dto);
    return seller.save();
  }

  async assertApproved(sellerId: string) {
    const seller = await this.sellerModel.findById(sellerId).exec();
    if (!seller || seller.status !== SellerStatus.APPROVED) {
      throw new ForbiddenException('Seller is not approved to sell yet');
    }
    return seller;
  }

  async setStatus(sellerId: string, status: SellerStatus) {
    const seller = await this.sellerModel.findByIdAndUpdate(sellerId, { status }, { new: true }).exec();
    if (!seller) throw new NotFoundException('Seller not found');
    if (status === SellerStatus.APPROVED) {
      await this.notificationsService.create(
        String(seller.userId),
        'seller_approved',
        `Your seller profile "${seller.companyName}" has been approved. You can now list products.`,
      );
    }
    return seller;
  }

  countAll() {
    return this.sellerModel.countDocuments().exec();
  }

  countPending() {
    return this.sellerModel.countDocuments({ status: SellerStatus.PENDING }).exec();
  }
}
