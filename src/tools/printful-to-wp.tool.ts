import { Item, ShippedItem } from '../types/printful-event.type'
import { Md5 } from 'md5-typescript'
import { MetadataLineItem, WpOrder } from '../types/wc-metadata.type'
import { WpTracking } from '../types/tracking.type'

export function transformPfCourierToWpCourier(pfCourierName: string): string {
  switch (pfCourierName) {
    case 'LPS':
      return 'latvijas-pasts'
    case 'FEDEX':
      return 'fedex'
    case 'DPD':
      return 'dpd-lv'
    case 'CORREOS':
      return 'correos-spain'
    case 'ASENDIAEU':
      return 'asendia-de'
    default:
      break
  }

  throw new Error('No translation available')
}

export function transformPfItemsToWpLineItems(shippedItems: ShippedItem[], orderItems: Item[], order: WpOrder) {
  const lineItems: MetadataLineItem[] = []
  const itemsMap = new Map<number, string>()
  const skuMap = new Map<number, string>()
  let totalItemsInOrder = 0

  orderItems.forEach(i => {
    if (i.external_id) {
      itemsMap.set(i.id, i.external_id)
    }
  })

  shippedItems
    .filter(i => i.quantity > 0)
    .forEach(i => {
      const wpId = itemsMap.get(i.item_id)
      if (wpId) {
        lineItems.push({ quantity: i.quantity, id: +wpId })
      }
    })

  order.line_items?.forEach(i => {
    if (i.sku) {
      skuMap.set(i.id, i.sku)
    }
    totalItemsInOrder += i.quantity
  })

  const skuList: string[] = []
  const qtyList: number[] = []

  lineItems.forEach(i => {
    const sku = skuMap.get(i.id)
    if (sku) {
      skuList.push(sku)
      qtyList.push(i.quantity)
    }
  })

  return {
    totalItemsInOrder,
    skuLine: skuList.join(','),
    qtyLine: qtyList.join(','),
  }
}

export function generateTrackingId(carrier: string, trackingNumber: string): string {
  return Md5.init(`${carrier}-${trackingNumber}`)
}

export function qtyLineToTotal(line: string): number {
  return line.split(',').reduce((sum, current) => sum + +current, 0)
}

export function extractShippedQuantityFromTracking(tracking: WpTracking[]): number {
  return tracking.reduce((sum, current) => {
    if (current.sku) {
      return sum + qtyLineToTotal(current.sku)
    } else {
      return sum
    }
  }, 0)
}
