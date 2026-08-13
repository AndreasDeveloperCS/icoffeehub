export interface PaymentResult {
  provider: string;
  status: 'succeeded' | 'failed';
  transactionId: string;
  paidAt: Date;
}

export interface PaymentProvider {
  charge(amount: number, currency: string): Promise<PaymentResult>;
}
