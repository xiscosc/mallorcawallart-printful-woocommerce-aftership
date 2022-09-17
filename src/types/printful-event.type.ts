export interface ShippedItem {
  item_id: number
  quantity: number
}

export interface Shipment {
  id: number
  carrier: string
  service: string
  tracking_number: string
  tracking_url: string
  created: number
  ship_date: Date
  shipped_at: number
  reshipment: boolean
  items: ShippedItem[]
}

export interface Recipient {
  name: string
  company: string
  address1: string
  address2: string
  city: string
  state_code: string
  state_name: string
  country_code: string
  country_name: string
  zip: number
  phone: string
  email: string
  tax_number: string
}

export interface Product {
  variant_id: number
  product_id: number
  image: string
  name: string
}

export interface Option {
  id: string
  value: string
}

export interface Position {
  area_width: number
  area_height: number
  width: number
  height: number
  top: number
  left: number
  limit_to_print_area: boolean
}

export interface File {
  type: string
  url: string
  options: Option[]
  filename: string
  visible: boolean
  position: Position
}

export interface Option2 {
  id: string
  value: string
}

export interface Item {
  id: number
  external_id: string
  variant_id: number
  sync_variant_id: number
  external_variant_id: string
  warehouse_product_variant_id: number
  quantity: number
  price: string
  retail_price: string
  name: string
  product: Product
  files: File[]
  options: Option2[]
  sku?: any
  discontinued: boolean
  out_of_stock: boolean
}

export interface RetailCosts {
  currency: string
  subtotal: string
  discount: string
  shipping: string
  tax: string
  vat: string
  total: string
}

export interface Gift {
  subject: string
  message: string
}

export interface PackingSlip {}

export interface Order {
  external_id: string
  shipping: string
  recipient: Recipient
  items: Item[]
  retail_costs: RetailCosts
  gift: Gift
  packing_slip: PackingSlip
}

export interface Data {
  shipment: Shipment
  order: Order
}

export interface PrintulEvent {
  type: string
  created: number
  retries: number
  store: number
  data: Data
  eventId: string
}
