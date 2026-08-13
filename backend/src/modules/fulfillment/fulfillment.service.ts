import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Carrier, CarrierDocument } from './schemas/carrier.schema';
import { Shipment, ShipmentDocument, ShipmentStatus } from './schemas/shipment.schema';
import { TrackingEvent, TrackingEventDocument } from './schemas/tracking-event.schema';
import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FulfillmentService {
  constructor(
    @InjectModel(Carrier.name) private carrierModel: Model<CarrierDocument>,
    @InjectModel(Shipment.name) private shipmentModel: Model<ShipmentDocument>,
    @InjectModel(TrackingEvent.name) private trackingEventModel: Model<TrackingEventDocument>,
    private readonly ordersService: OrdersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  listCarriers() {
    return this.carrierModel.find({ active: true }).exec();
  }

  createCarrier(data: Partial<Carrier>) {
    return this.carrierModel.create(data);
  }

  async shipOrder(sellerId: string, orderId: string, data: { carrierName: string; trackingNumber?: string }) {
    const order = await this.ordersService.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    const owns = order.fulfillment.some((f) => String(f.sellerId) === sellerId);
    if (!owns) throw new ForbiddenException('This order does not include items from your store');

    const shipment = await this.shipmentModel.create({
      orderId: new Types.ObjectId(orderId),
      sellerId: new Types.ObjectId(sellerId),
      carrierName: data.carrierName,
      trackingNumber: data.trackingNumber,
      status: ShipmentStatus.IN_TRANSIT,
      shippedAt: new Date(),
    });

    await this.trackingEventModel.create({
      shipmentId: shipment._id,
      status: 'in_transit',
      note: `Shipped via ${data.carrierName}${data.trackingNumber ? ` (tracking: ${data.trackingNumber})` : ''}`,
    });

    await this.ordersService.markSellerShipped(orderId, sellerId, String(shipment._id));

    await this.notificationsService.create(
      String(order.userId),
      'order_shipped',
      `Part of your order #${orderId.slice(-6).toUpperCase()} has shipped via ${data.carrierName}.`,
    );

    return shipment;
  }

  async addTrackingEvent(shipmentId: string, status: string, location?: string, note?: string) {
    const shipment = await this.shipmentModel.findById(shipmentId).exec();
    if (!shipment) throw new NotFoundException('Shipment not found');

    await this.trackingEventModel.create({ shipmentId: shipment._id, status, location, note });

    if (status === 'delivered') {
      shipment.status = ShipmentStatus.DELIVERED;
      shipment.deliveredAt = new Date();
      await shipment.save();
    } else if (status === 'in_transit') {
      shipment.status = ShipmentStatus.IN_TRANSIT;
      await shipment.save();
    }

    return shipment;
  }

  async getTrackingForOrder(orderId: string) {
    const shipments = await this.shipmentModel.find({ orderId: new Types.ObjectId(orderId) }).exec();
    const events = await this.trackingEventModel
      .find({ shipmentId: { $in: shipments.map((s) => s._id) } })
      .sort({ occurredAt: 1 })
      .exec();
    return shipments.map((s) => ({
      shipment: s,
      events: events.filter((e) => String(e.shipmentId) === String(s._id)),
    }));
  }

  listForSeller(sellerId: string) {
    return this.shipmentModel.find({ sellerId: new Types.ObjectId(sellerId) }).sort({ createdAt: -1 }).exec();
  }
}
