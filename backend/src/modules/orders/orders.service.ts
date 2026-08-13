import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { CartService } from './cart.service';
import { CheckoutDto } from './dto/checkout.dto';
import { LogisticsService } from '../logistics/logistics.service';
import { ProductsService } from '../catalog/products.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MockPaymentProvider } from './payments/mock-payment.provider';
import { SellersService } from '../sellers/sellers.service';
import { PromotionsService } from '../promotions/promotions.service';
import { AuditLogService } from '../audit/audit-log.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    private readonly cartService: CartService,
    private readonly logisticsService: LogisticsService,
    private readonly productsService: ProductsService,
    private readonly notificationsService: NotificationsService,
    private readonly paymentProvider: MockPaymentProvider,
    private readonly sellersService: SellersService,
    private readonly promotionsService: PromotionsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const cart = await this.cartService.getOrCreate(userId);
    if (cart.items.length === 0) throw new BadRequestException('Cart is empty');

    const sellerIds = [...new Set(cart.items.map((i) => String(i.sellerId)))];
    let shippingTotal = 0;
    for (const sellerId of sellerIds) {
      const zone = await this.logisticsService.getRate(sellerId, dto.country);
      if (!zone) {
        throw new BadRequestException(`One or more items cannot be delivered to ${dto.country}`);
      }
      shippingTotal += zone.flatRate;
    }

    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    let discountTotal = 0;
    if (dto.couponCode) {
      const coupon = await this.promotionsService.findValid(dto.couponCode, subtotal);
      discountTotal = this.promotionsService.computeDiscount(coupon, subtotal);
    }

    const total = Math.max(0, subtotal - discountTotal) + shippingTotal;
    const currency = cart.items[0]?.currency ?? 'USD';

    const payment = await this.paymentProvider.charge(total, currency);
    if (payment.status !== 'succeeded') throw new BadRequestException('Payment failed');

    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      items: cart.items,
      shippingAddress: {
        fullName: dto.fullName,
        line1: dto.line1,
        line2: dto.line2,
        city: dto.city,
        country: dto.country,
        postalCode: dto.postalCode,
        phone: dto.phone,
      },
      subtotal,
      shippingTotal,
      discountTotal,
      couponCode: dto.couponCode,
      total,
      currency,
      status: OrderStatus.PAID,
      payment,
      fulfillment: sellerIds.map((sellerId) => ({ sellerId: new Types.ObjectId(sellerId), status: 'pending' })),
    });

    if (dto.couponCode && discountTotal > 0) {
      await this.promotionsService.redeem(dto.couponCode);
    }

    for (const item of cart.items) {
      await this.productsService.decrementVariantStock(String(item.productId), item.sku, item.quantity);
    }

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-8)}`;
    await this.invoiceModel.create({
      orderId: order._id,
      invoiceNumber,
      subtotal,
      shippingTotal,
      total,
      currency,
    });

    await this.cartService.clear(userId);

    await this.notificationsService.create(
      userId,
      'order_placed',
      `Your order #${String(order._id).slice(-6).toUpperCase()} has been placed and paid.`,
    );
    for (const sellerId of sellerIds) {
      const seller = await this.sellersService.findById(sellerId);
      if (seller) {
        await this.notificationsService.create(
          String(seller.userId),
          'order_received',
          `You received a new order (#${String(order._id).slice(-6).toUpperCase()}).`,
        );
      }
    }

    return order;
  }

  listForUser(userId: string) {
    return this.orderModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  async findByIdForUser(userId: string, orderId: string) {
    const order = await this.orderModel.findOne({ _id: orderId, userId: new Types.ObjectId(userId) }).exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  listForSeller(sellerId: string) {
    return this.orderModel
      .find({ 'items.sellerId': new Types.ObjectId(sellerId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  listAll() {
    return this.orderModel.find().sort({ createdAt: -1 }).limit(200).exec();
  }

  async updateStatus(orderId: string, status: OrderStatus, actorId?: string) {
    const order = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true }).exec();
    if (!order) throw new NotFoundException('Order not found');
    if (actorId) {
      await this.auditLogService.log(actorId, 'admin', 'order.status_changed', 'Order', orderId, { status });
    }
    return order;
  }

  findById(orderId: string) {
    return this.orderModel.findById(orderId).exec();
  }

  async markSellerShipped(orderId: string, sellerId: string, shipmentId: string) {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: orderId, 'fulfillment.sellerId': new Types.ObjectId(sellerId) },
      { $set: { 'fulfillment.$.status': 'shipped', 'fulfillment.$.shipmentId': new Types.ObjectId(shipmentId) } },
      { new: true },
    ).exec();
    if (!order) throw new NotFoundException('Order not found for this seller');
    const allShipped = order.fulfillment.every((f) => f.status !== 'pending');
    if (allShipped && order.status === OrderStatus.PAID) {
      order.status = OrderStatus.SHIPPED;
      await order.save();
    }
    return order;
  }

  countAll() {
    return this.orderModel.countDocuments().exec();
  }

  async sumSellerSales(sellerId: string, from: Date, to: Date) {
    const result = await this.orderModel.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to }, status: { $nin: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] } } },
      { $unwind: '$items' },
      { $match: { 'items.sellerId': new Types.ObjectId(sellerId) } },
      { $group: { _id: null, grossSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
    ]);
    return result[0]?.grossSales ?? 0;
  }

  async totalRevenue() {
    const result = await this.orderModel.aggregate([
      { $match: { status: { $ne: OrderStatus.CANCELLED } } },
      { $group: { _id: null, revenue: { $sum: '$total' } } },
    ]);
    return result[0]?.revenue ?? 0;
  }
}
