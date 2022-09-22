export interface AdditionalFields {
  account_number: string
  key: string
  postal_code: string
  ship_date: string
  destination_country: string
  state: string
}

export interface MetadataLineItem {
  id: number
  quantity: number
}

export interface LineItem {
  id: number
  sku: string | null
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
  line_items: MetadataLineItem[]
  metrics: Metrics
}

export interface MetaData {
  key: string
  value: MetaDataValue[] | string
}

export interface WpOrder {
  meta_data?: MetaData[]
  status?: string
  line_items?: LineItem[]
}
