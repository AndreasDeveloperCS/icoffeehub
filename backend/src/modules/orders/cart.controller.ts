import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  get(@CurrentUser() user: AuthUser) {
    return this.cartService.getOrCreate(user.userId);
  }

  @Post('items')
  addItem(@CurrentUser() user: AuthUser, @Body() body: { productId: string; sku: string; quantity: number }) {
    return this.cartService.addItem(user.userId, body.productId, body.sku, body.quantity ?? 1);
  }

  @Post('items/update')
  updateItem(@CurrentUser() user: AuthUser, @Body() body: { productId: string; sku: string; quantity: number }) {
    return this.cartService.updateItemQuantity(user.userId, body.productId, body.sku, body.quantity);
  }

  @Delete('items/:productId/:sku')
  removeItem(@CurrentUser() user: AuthUser, @Param('productId') productId: string, @Param('sku') sku: string) {
    return this.cartService.removeItem(user.userId, productId, sku);
  }
}
