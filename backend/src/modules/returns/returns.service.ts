import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReturnRequest, ReturnRequestDocument, ReturnStatus } from './schemas/return-request.schema';
import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectModel(ReturnRequest.name) private returnModel: Model<ReturnRequestDocument>,
    private readonly ordersService: OrdersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(userId: string, orderId: string, sku: string, reason: string) {
    const order = await this.ordersService.findByIdForUser(userId, orderId);
    const item = order.items.find((i) => i.sku === sku);
    if (!item) throw new BadRequestException('Item not found on this order');

    return this.returnModel.create({
      orderId: order._id,
      userId: new Types.ObjectId(userId),
      sellerId: item.sellerId,
      sku,
      reason,
      refundAmount: item.price * item.quantity,
    });
  }

  listForUser(userId: string) {
    return this.returnModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  listForSeller(sellerId: string) {
    return this.returnModel.find({ sellerId: new Types.ObjectId(sellerId) }).sort({ createdAt: -1 }).exec();
  }

  listAll() {
    return this.returnModel.find().sort({ createdAt: -1 }).limit(200).exec();
  }

  async setStatus(id: string, status: ReturnStatus) {
    const request = await this.returnModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!request) throw new NotFoundException('Return request not found');
    await this.notificationsService.create(
      String(request.userId),
      'return_update',
      `Your return request for ${request.sku} is now ${status}.`,
    );
    return request;
  }
}
