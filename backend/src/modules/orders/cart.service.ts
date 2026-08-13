import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductsService } from '../catalog/products.service';
import { ProductStatus } from '../catalog/schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async getOrCreate(userId: string) {
    let cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    if (!cart) {
      cart = await this.cartModel.create({ userId: new Types.ObjectId(userId), items: [] });
    }
    return cart;
  }

  async addItem(userId: string, productId: string, sku: string, quantity: number) {
    const product = await this.productsService.findById(productId);
    if (!product || product.status !== ProductStatus.ACTIVE) throw new NotFoundException('Product not available');
    const variant = product.variants.find((v) => v.sku === sku);
    if (!variant) throw new NotFoundException('Product variant not found');
    if (variant.stock < quantity) throw new BadRequestException('Not enough stock');

    const cart = await this.getOrCreate(userId);
    const existing = cart.items.find((i) => i.productId.toString() === productId && i.sku === sku);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id as Types.ObjectId,
        sellerId: product.sellerId,
        sku,
        name: product.name,
        price: variant.price,
        currency: variant.currency,
        quantity,
      } as any);
    }
    return cart.save();
  }

  async updateItemQuantity(userId: string, productId: string, sku: string, quantity: number) {
    const cart = await this.getOrCreate(userId);
    const item = cart.items.find((i) => i.productId.toString() === productId && i.sku === sku);
    if (!item) throw new NotFoundException('Cart item not found');
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => !(i.productId.toString() === productId && i.sku === sku));
    } else {
      item.quantity = quantity;
    }
    return cart.save();
  }

  async removeItem(userId: string, productId: string, sku: string) {
    const cart = await this.getOrCreate(userId);
    cart.items = cart.items.filter((i) => !(i.productId.toString() === productId && i.sku === sku));
    return cart.save();
  }

  async clear(userId: string) {
    const cart = await this.getOrCreate(userId);
    cart.items = [];
    return cart.save();
  }
}
