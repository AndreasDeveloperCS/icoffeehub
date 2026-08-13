import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { ProductsService } from '../catalog/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async create(userId: string, userName: string, productId: string, dto: CreateReviewDto) {
    const product = await this.productsService.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.reviewModel.exists({
      productId: new Types.ObjectId(productId),
      userId: new Types.ObjectId(userId),
    });
    if (existing) throw new ConflictException('You already reviewed this product');

    const review = await this.reviewModel.create({
      ...dto,
      productId: new Types.ObjectId(productId),
      userId: new Types.ObjectId(userId),
      userName,
    });

    await this.recalculate(productId);
    return review;
  }

  listForProduct(productId: string) {
    return this.reviewModel
      .find({ productId: new Types.ObjectId(productId), status: 'visible' })
      .sort({ createdAt: -1 })
      .exec();
  }

  private async recalculate(productId: string) {
    const stats = await this.reviewModel.aggregate([
      { $match: { productId: new Types.ObjectId(productId), status: 'visible' } },
      { $group: { _id: '$productId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const avg = stats[0]?.avg ?? 0;
    const count = stats[0]?.count ?? 0;
    await this.productsService.applyRatingDelta(productId, Math.round(avg * 10) / 10, count);
  }

  async setStatus(reviewId: string, status: 'visible' | 'hidden') {
    const review = await this.reviewModel.findByIdAndUpdate(reviewId, { status }, { new: true }).exec();
    if (!review) throw new NotFoundException('Review not found');
    await this.recalculate(String(review.productId));
    return review;
  }

  listAllForModeration() {
    return this.reviewModel.find().sort({ createdAt: -1 }).limit(200).exec();
  }
}
