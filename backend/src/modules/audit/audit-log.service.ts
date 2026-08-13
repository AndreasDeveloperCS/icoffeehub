import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class AuditLogService {
  constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>) {}

  log(actorId: string, actorRole: string, action: string, targetType: string, targetId?: string, metadata?: Record<string, unknown>) {
    return this.auditLogModel.create({
      actorId: new Types.ObjectId(actorId),
      actorRole,
      action,
      targetType,
      targetId,
      metadata,
    });
  }

  list(limit = 200) {
    return this.auditLogModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }
}
