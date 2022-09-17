export interface AdditionalFields {
  account_number: string
  key: string
  postal_code: string
  ship_date: string
  destination_country: string
  state: string
}

export interface LineItem {
  id: number
  quantity: number
}

export interface Metrics {
  created_at: Date
  updated_at: Date
}

export interface MetaDataValue {
  tracking_id: string
  tracking_number: string
  slug: string
  additional_fields: AdditionalFields
  line_items: LineItem[]
  metrics: Metrics
}

export interface MetaData {
  key: string
  value: MetaDataValue[] | string
}

export interface WooCommerceMetadata {
  meta_data: MetaData[]
}
