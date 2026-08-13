import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ _id: false })
class Address {
  @Prop() label?: string;
  @Prop() line1?: string;
  @Prop() line2?: string;
  @Prop() city?: string;
  @Prop() country?: string;
  @Prop() postalCode?: string;
  @Prop() phone?: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  name: string;

  @Prop({ enum: Role, default: Role.CUSTOMER })
  role: Role;

  @Prop({ enum: ['active', 'suspended'], default: 'active' })
  status: string;

  @Prop({ type: [Address], default: [] })
  addresses: Address[];

  @Prop({ type: [String], default: [] })
  wishlist: string[];

  @Prop({
    type: [{ productId: Types.ObjectId, note: String, rating: Number, createdAt: Date }],
    default: [],
  })
  tastingJournal: { productId: Types.ObjectId; note: string; rating?: number; createdAt: Date }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
