import { apiRequest } from '../api-client';

export interface FulfillmentLineItemDto {
  lineItemId: number;
  productType: string;
  color: string;
  size: string;
  quantity: number;
  designFrontUrl?: string;
  designBackUrl?: string;
  designLeftSleeveUrl?: string;
  designRightSleeveUrl?: string;
  sellerSku?: string;
  gearmentVariantId?: number;
}

export interface SendToFulfillmentDto {
  orderId: number;
  orderIdTT: string;
  tiktokShopId: number;
  provider: string;
  lineItems: FulfillmentLineItemDto[];
}

export interface SendToFulfillmentResponseDto {
  jobId: string;
  status: string;
  fulfillmentRequestId: number;
}

export interface FulfillmentJobStatusDto {
  id: number;
  status: string;
  progress: number;
  jobId: string;
  createdAt: string;
  completedAt: string | null;
  errorMessage?: string;
}

export interface FulfillmentRequest {
  id: number;
  orderId: number;
  orderIdTT: string;
  provider: string;
  providerOrderId?: string;
  providerOrderNumber?: number;
  jobId?: string;
  status: string;
  requestPayload?: any;
  responsePayload?: any;
  shippingLabelR2Url?: string;
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/**
 * Send order to fulfillment provider
 */
export async function sendToFulfillment(
  dto: SendToFulfillmentDto,
  token?: string
): Promise<SendToFulfillmentResponseDto> {
  return apiRequest<SendToFulfillmentResponseDto>({
    url: '/orders/send-to-fulfillment',
    method: 'POST',
    data: dto,
    token,
  });
}

/**
 * Get fulfillment job status
 */
export async function getFulfillmentJobStatus(
  jobId: string,
  token?: string
): Promise<FulfillmentJobStatusDto> {
  return apiRequest<FulfillmentJobStatusDto>({
    url: `/orders/fulfillment-job-status/${jobId}`,
    method: 'GET',
    token,
  });
}

/**
 * Get fulfillment history for an order
 */
export async function getFulfillmentHistory(
  orderId: number,
  token?: string
): Promise<FulfillmentRequest[]> {
  return apiRequest<FulfillmentRequest[]>({
    url: `/orders/${orderId}/fulfillment-history`,
    method: 'GET',
    token,
  });
}

