import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Dispute, DisputeDocument, DisputeStatus } from './schemas/dispute.schema';
import { SupportTicket, SupportTicketDocument } from './schemas/support-ticket.schema';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(Dispute.name) private disputeModel: Model<DisputeDocument>,
    @InjectModel(SupportTicket.name) private ticketModel: Model<SupportTicketDocument>,
  ) {}

  // --- Disputes ---
  createDispute(userId: string, orderId: string, reason: string, description?: string) {
    return this.disputeModel.create({ userId: new Types.ObjectId(userId), orderId: new Types.ObjectId(orderId), reason, description });
  }

  listDisputesForUser(userId: string) {
    return this.disputeModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  listAllDisputes() {
    return this.disputeModel.find().sort({ createdAt: -1 }).limit(200).exec();
  }

  async resolveDispute(id: string, status: DisputeStatus, resolution?: string) {
    const dispute = await this.disputeModel.findByIdAndUpdate(id, { status, resolution }, { new: true }).exec();
    if (!dispute) throw new NotFoundException('Dispute not found');
    return dispute;
  }

  // --- Support tickets ---
  createTicket(userId: string, subject: string, message: string) {
    return this.ticketModel.create({ userId: new Types.ObjectId(userId), subject, message });
  }

  listTicketsForUser(userId: string) {
    return this.ticketModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  listAllTickets() {
    return this.ticketModel.find().sort({ createdAt: -1 }).limit(200).exec();
  }

  async replyToTicket(id: string, authorId: string, authorRole: string, message: string, close = false) {
    const ticket = await this.ticketModel.findById(id).exec();
    if (!ticket) throw new NotFoundException('Ticket not found');
    ticket.replies.push({ authorId: new Types.ObjectId(authorId), authorRole, message, createdAt: new Date() });
    if (close) ticket.status = 'closed';
    return ticket.save();
  }
}
