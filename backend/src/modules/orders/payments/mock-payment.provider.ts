import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PaymentProvider, PaymentResult } from './payment-provider.interface';

// Stands in for Stripe/PayPal (see doc 04 integrations). Marks every charge as
// succeeded immediately so checkout works end-to-end without real PSP keys.
// Swap this provider for a real one behind the same interface when ready.
@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  async charge(_amount: number, _currency: string): Promise<PaymentResult> {
    return {
      provider: 'mock',
      status: 'succeeded',
      transactionId: randomUUID(),
      paidAt: new Date(),
    };
  }
}
