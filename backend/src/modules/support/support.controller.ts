import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { DisputeStatus } from './schemas/dispute.schema';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('disputes')
  createDispute(@CurrentUser() user: AuthUser, @Body() body: { orderId: string; reason: string; description?: string }) {
    return this.supportService.createDispute(user.userId, body.orderId, body.reason, body.description);
  }

  @Get('disputes/mine')
  myDisputes(@CurrentUser() user: AuthUser) {
    return this.supportService.listDisputesForUser(user.userId);
  }

  @Get('admin/disputes')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  allDisputes() {
    return this.supportService.listAllDisputes();
  }

  @Patch('admin/disputes/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  resolveDispute(@Param('id') id: string, @Body() body: { status: DisputeStatus; resolution?: string }) {
    return this.supportService.resolveDispute(id, body.status, body.resolution);
  }

  @Post('tickets')
  createTicket(@CurrentUser() user: AuthUser, @Body() body: { subject: string; message: string }) {
    return this.supportService.createTicket(user.userId, body.subject, body.message);
  }

  @Get('tickets/mine')
  myTickets(@CurrentUser() user: AuthUser) {
    return this.supportService.listTicketsForUser(user.userId);
  }

  @Post('tickets/:id/reply')
  reply(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body('message') message: string) {
    return this.supportService.replyToTicket(id, user.userId, user.role, message);
  }

  @Get('admin/tickets')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  allTickets() {
    return this.supportService.listAllTickets();
  }

  @Post('admin/tickets/:id/reply')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  adminReply(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() body: { message: string; close?: boolean }) {
    return this.supportService.replyToTicket(id, user.userId, user.role, body.message, body.close);
  }
}
