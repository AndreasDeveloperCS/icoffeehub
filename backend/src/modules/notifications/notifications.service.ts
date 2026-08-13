import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {}

  create(userId: string, type: string, message: string) {
    return this.notificationModel.create({ userId: new Types.ObjectId(userId), type, message });
  }

  listForUser(userId: string) {
    return this.notificationModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  async markRead(userId: string, id: string) {
    return this.notificationModel
      .findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, { read: true }, { new: true })
      .exec();
  }
}
