export interface ShippedItem {
  item_id: number
  quantity: number
  picked: number
  printed: number
  steps: any[]
}

export interface Shipment {
  id: number
  carrier: string
  can_change_hold: boolean
  service: string
  tracking_number: string
  tracking_url: string
  created: number
  ship_date: Date | string
  shipped_at: number
  reshipment: boolean
  items: ShippedItem[]
}

export interface Recipient {
  name: string
  company: string
  address1: string
  address2: string | null
  city: string
  state_code: string | null
  state_name: string | null
  country_code: string | null
  country_name: string | null
  zip: number | string
  phone: string
  email: string | null
  tax_number: string | null
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
  created: number
  type: string
  url: string | null
  options: Option[]
  filename: string
  visible: boolean
  position: Position | null
}

export interface Option2 {
  id: string
  value: string
}

export interface Item {
  id: number
  external_id: string | null
  variant_id: number
  sync_variant_id: number | null
  external_variant_id: string | null
  quantity: number
  price: string
  retail_price: string | null
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
  subtotal: string | null
  discount: string | null
  shipping: string | null
  tax: string | null
  vat: string | null
  total: string | null
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
  gift: Gift | null
  packing_slip: PackingSlip | null
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
