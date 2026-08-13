import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Collection, CollectionDocument } from './schemas/collection.schema';

@Injectable()
export class CollectionsService {
  constructor(@InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>) {}

  create(userId: string, name: string, description?: string, isPublic = false) {
    return this.collectionModel.create({ userId: new Types.ObjectId(userId), name, description, isPublic });
  }

  listForUser(userId: string) {
    return this.collectionModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  private async assertOwner(id: string, userId: string) {
    const collection = await this.collectionModel.findById(id).exec();
    if (!collection) throw new NotFoundException('Collection not found');
    if (String(collection.userId) !== userId) throw new ForbiddenException('Not your collection');
    return collection;
  }

  async toggleProduct(id: string, userId: string, productId: string) {
    const collection = await this.assertOwner(id, userId);
    const idx = collection.productIds.findIndex((p) => String(p) === productId);
    if (idx >= 0) collection.productIds.splice(idx, 1);
    else collection.productIds.push(new Types.ObjectId(productId));
    return collection.save();
  }

  async update(id: string, userId: string, data: { name?: string; description?: string; isPublic?: boolean }) {
    const collection = await this.assertOwner(id, userId);
    Object.assign(collection, data);
    return collection.save();
  }

  async remove(id: string, userId: string) {
    await this.assertOwner(id, userId);
    await this.collectionModel.findByIdAndDelete(id).exec();
  }

  async findPublic(id: string) {
    const collection = await this.collectionModel.findOne({ _id: id, isPublic: true }).exec();
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }
}
