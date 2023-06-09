interface Headers {
    date: string;
    'content-type': string;
    'content-length': string;
    connection: string;
    'content-security-policy': string;
    'x-api-version': string;
    'x-content-type-options': string;
    'x-frame-options': string;
    'x-idempotency-key': string;
    'x-ratelimit-limit': string;
    'x-ratelimit-remaining': string;
    'x-ratelimit-retry': string;
    'x-ratelimit-type': string;
    'x-request-id': string;
    'x-robots-tag': string;
    'x-xss-protection': string;
    'cache-control': string;
  }
  
  interface CustomerDetails {
    customerId: string;
    customerName: string | null;
    customerEmail: string;
    customerPhone: string;
  }
  
  interface OrderMeta {
    returnUrl: string | null;
    notifyUrl: string | null;
    paymentMethods: any; // You can replace 'any' with a specific type if you know the expected structure
  }
  
  interface Payments {
    url: string;
  }
  
  interface Settlements {
    url: string;
  }
  
  interface Refunds {
    url: string;
  }
  
  interface CfOrder {
    cfOrderId: number;
    orderId: string;
    entity: string;
    orderCurrency: string;
    orderAmount: number;
    orderStatus: string;
    paymentSessionId: string;
    orderExpiryTime: string;
    orderNote: string | null;
    customerDetails: CustomerDetails;
    orderMeta: OrderMeta;
    payments: Payments;
    settlements: Settlements;
    refunds: Refunds;
  }
  
  export interface CreateOrderResponseData {
    cfHeaders: Headers;
    cfOrder: CfOrder;
  }
  