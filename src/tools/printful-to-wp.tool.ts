import { Item, ShippedItem } from '../types/printful-event.type'
import { Md5 } from 'md5-typescript'
import { LineItem } from '../types/wc-metadata.type'

export function transformPfCourierToWpCourier(pfCourierName: string): string {
  switch (pfCourierName) {
    case 'LPS':
      return 'latvijas-pasts'
    case 'FEDEX':
      return 'fedex'
    case 'DPD':
      return 'dpd'
    case 'CORREOS':
      return 'spain-correos-es'
    case 'ASENDIAEU':
      return 'asendia-de'
    default:
      break
  }

  throw new Error('No translation available')
}

export function transformPfItemsToWpItems(shippedItems: ShippedItem[], orderItems: Item[]): LineItem[] {
  const lineItems: LineItem[] = []
  const itemsMap = new Map<number, string>()

  orderItems.forEach(i => {
    itemsMap.set(i.id, i.external_id)
  })

  shippedItems
    .filter(i => i.quantity > 0)
    .forEach(i => {
      const wpId = itemsMap.get(i.item_id)
      if (wpId) {
        lineItems.push({ quantity: i.quantity, id: +wpId })
      }
    })

  return lineItems
}

export function generateTrackingId(carrier: string, trackingNumber: string): string {
  return Md5.init(`${carrier}-${trackingNumber}`)
}
