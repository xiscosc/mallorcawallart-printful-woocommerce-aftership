export interface WpTracking {
  tracking_provider: string
  tracking_number: string
  status_shipped: OrderStatus
  replace_tracking: ReplaceTracking
  sku?: string
  qty?: string
}

export enum OrderStatus {
  processing = 0,
  shipped = 1,
  partiallyShipped = 2,
}

export enum ReplaceTracking {
  no = 0,
  yes = 1,
}
