import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  create(data: { email: string; passwordHash: string; name: string; role?: Role }) {
    return this.userModel.create(data);
  }

  async updateProfile(id: string, data: Partial<Pick<User, 'name' | 'addresses'>>) {
    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async toggleWishlist(id: string, productId: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    const idx = user.wishlist.indexOf(productId);
    if (idx >= 0) user.wishlist.splice(idx, 1);
    else user.wishlist.push(productId);
    await user.save();
    return user;
  }

  async addJournalEntry(id: string, productId: string, note: string, rating?: number) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    user.tastingJournal.push({
      productId: new Types.ObjectId(productId),
      note,
      rating,
      createdAt: new Date(),
    });
    await user.save();
    return user;
  }

  toSafeJson(user: UserDocument) {
    const obj = user.toObject();
    delete obj.passwordHash;
    return obj;
  }
}
