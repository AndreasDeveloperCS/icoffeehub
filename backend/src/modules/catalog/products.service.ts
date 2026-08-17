import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Product, ProductDocument, ProductStatus } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { SellersService } from '../sellers/sellers.service';
import { LogisticsService } from '../logistics/logistics.service';
import { AuditLogService } from '../audit/audit-log.service';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly sellersService: SellersService,
    private readonly logisticsService: LogisticsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  private async uniqueSlug(name: string) {
    const base = slugify(name) || `product-${Date.now()}`;
    let slug = base;
    let count = 0;
    while (await this.productModel.exists({ slug })) {
      count += 1;
      slug = `${base}-${count}`;
    }
    return slug;
  }

  async createForSeller(userId: string, dto: CreateProductDto) {
    const seller = await this.sellersService.findByUserId(userId);
    if (!seller) throw new NotFoundException('Seller profile not found');
    await this.sellersService.assertApproved(String(seller._id));

    const slug = await this.uniqueSlug(dto.name);
    const product = await this.productModel.create({
      ...dto,
      sellerId: seller._id,
      slug,
      status: ProductStatus.PENDING_REVIEW,
    });
    await this.auditLogService.log(userId, 'seller', 'product.created', 'Product', String(product._id));
    return product;
  }

  async updateForSeller(userId: string, productId: string, dto: UpdateProductDto) {
    const seller = await this.sellersService.findByUserId(userId);
    if (!seller) throw new NotFoundException('Seller profile not found');
    const product = await this.productModel.findById(productId).exec();
    if (!product) throw new NotFoundException('Product not found');
    if (String(product.sellerId) !== String(seller._id)) {
      throw new ForbiddenException('You do not own this product');
    }
    Object.assign(product, dto);
    // Edits go back through moderation.
    product.status = ProductStatus.PENDING_REVIEW;
    return product.save();
  }

  findForSeller(sellerId: string) {
    return this.productModel.find({ sellerId: new Types.ObjectId(sellerId) }).sort({ createdAt: -1 }).exec();
  }

  async findForSellerByUserId(userId: string) {
    const seller = await this.sellersService.findByUserId(userId);
    if (!seller) throw new NotFoundException('Seller profile not found');
    return this.findForSeller(String(seller._id));
  }

  async findPublic(query: QueryProductsDto) {
    const filter: FilterQuery<ProductDocument> = { status: ProductStatus.ACTIVE };

    if (query.originCountry) filter.originCountry = query.originCountry;
    if (query.roastLevel) filter.roastLevel = query.roastLevel;
    if (query.processingMethod) filter.processingMethod = query.processingMethod;
    if (query.flavorNote) filter.flavorNotes = query.flavorNote;
    if (query.category) filter.category = query.category;
    if (query.sellerId) filter.sellerId = new Types.ObjectId(query.sellerId);
    if (query.q) filter.$text = { $search: query.q };

    if (query.deliverTo) {
      const sellerIds = await this.logisticsService.getSellerIdsDeliveringTo(query.deliverTo);
      filter.sellerId = { $in: sellerIds.map((id) => new Types.ObjectId(id)) };
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(48, Math.max(1, Number(query.limit) || 12));

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (query.sort === 'price_asc') sort = { 'variants.0.price': 1 };
    else if (query.sort === 'price_desc') sort = { 'variants.0.price': -1 };
    else if (query.sort === 'rating') sort = { ratingAverage: -1 };

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const product = await this.productModel.findOne({ slug, status: ProductStatus.ACTIVE }).exec();
    if (!product) throw new NotFoundException('Product not found');
    const seller = await this.sellersService.findById(String(product.sellerId));
    return {
      ...product.toObject(),
      sellerVerified: seller?.verified ?? false,
      sellerName: seller?.companyName,
    };
  }

  findById(id: string) {
    return this.productModel.findById(id).exec();
  }

  listPendingReview() {
    return this.productModel.find({ status: ProductStatus.PENDING_REVIEW }).exec();
  }

  async setStatus(productId: string, status: ProductStatus) {
    const product = await this.productModel.findByIdAndUpdate(productId, { status }, { new: true }).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async applyRatingDelta(productId: string, averageRating: number, ratingCount: number) {
    await this.productModel
      .findByIdAndUpdate(productId, { ratingAverage: averageRating, ratingCount })
      .exec();
  }

  async decrementVariantStock(productId: string, sku: string, quantity: number) {
    await this.productModel.updateOne(
      { _id: productId, 'variants.sku': sku },
      { $inc: { 'variants.$.stock': -quantity } },
    );
  }

  listFeatured(limit = 8) {
    return this.productModel
      .find({ status: ProductStatus.ACTIVE, featured: true })
      .limit(limit)
      .exec();
  }

  listAllActiveForScoring(limit = 300) {
    return this.productModel.find({ status: ProductStatus.ACTIVE }).limit(limit).exec();
  }

  countActive() {
    return this.productModel.countDocuments({ status: ProductStatus.ACTIVE }).exec();
  }
}
