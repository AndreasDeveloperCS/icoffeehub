import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SubscriptionPlan, SubscriptionPlanDocument } from './schemas/subscription-plan.schema';
import { SubscriptionOrder, SubscriptionOrderDocument } from './schemas/subscription-order.schema';

function addByFrequency(date: Date, frequency: string) {
  const next = new Date(date);
  if (frequency === 'weekly') next.setDate(next.getDate() + 7);
  else if (frequency === 'biweekly') next.setDate(next.getDate() + 14);
  else next.setMonth(next.getMonth() + 1);
  return next;
}

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(SubscriptionPlan.name) private planModel: Model<SubscriptionPlanDocument>,
    @InjectModel(SubscriptionOrder.name) private subOrderModel: Model<SubscriptionOrderDocument>,
  ) {}

  listPlans() {
    return this.planModel.find({ active: true }).exec();
  }

  createPlan(data: Partial<SubscriptionPlan>) {
    return this.planModel.create(data);
  }

  async subscribe(userId: string, planId: string, shippingCountry: string) {
    const plan = await this.planModel.findById(planId).exec();
    if (!plan || !plan.active) throw new NotFoundException('Subscription plan not found');

    return this.subOrderModel.create({
      userId: new Types.ObjectId(userId),
      planId: plan._id,
      shippingCountry,
      status: 'active',
      nextDeliveryDate: addByFrequency(new Date(), plan.frequency),
    });
  }

  listForUser(userId: string) {
    return this.subOrderModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('planId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async cancel(userId: string, id: string) {
    const sub = await this.subOrderModel
      .findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, { status: 'cancelled' }, { new: true })
      .exec();
    if (!sub) throw new NotFoundException('Subscription not found');
    return sub;
  }
}
