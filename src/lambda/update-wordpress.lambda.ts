import { PrintulEvent } from '../types/printful-event.type'
import * as log from 'lambda-log'
import { extractShippedQuantityFromTracking, qtyLineToTotal, transformPfCourierToWpCourier, transformPfItemsToWpLineItems } from '../tools/printful-to-wp.tool'
import { OrderStatus, ReplaceTracking, WpTracking } from '../types/tracking.type'
import { getWordpressOrder, getWordpressTracking, updateWordpressTracking } from '../client/wordpress.client'

export async function handler(event: PrintulEvent): Promise<any> {
  log.info(event.eventId)
  const orderId = event.data.order.external_id
  if (orderId === null) {
    throw Error(`No wp order to process ${event.eventId}`)
  }

  const wpOrder = await getWordpressOrder(orderId)
  const { totalItemsInOrder, skuLine, qtyLine } = transformPfItemsToWpLineItems(event.data.shipment.items, event.data.order.items, wpOrder)
  const basicTracking: WpTracking = {
    tracking_provider: transformPfCourierToWpCourier(event.data.shipment.carrier),
    tracking_number: event.data.shipment.tracking_number,
    replace_tracking: ReplaceTracking.no,
    status_shipped: OrderStatus.partiallyShipped,
  }

  if (skuLine.length == 0) {
    // No items to track, add basic tracking
    await updateWordpressTracking(orderId, basicTracking)
  } else {
    // Get current tracking to check if all items are shipped
    const totalShipped = extractShippedQuantityFromTracking(await getWordpressTracking(orderId)) + qtyLineToTotal(qtyLine)
    const orderStatus: OrderStatus = totalShipped >= totalItemsInOrder ? OrderStatus.shipped : OrderStatus.partiallyShipped
    const newTracking: WpTracking = {
      ...basicTracking,
      status_shipped: orderStatus,
      qty: qtyLine,
      sku: skuLine,
    }

    await updateWordpressTracking(orderId, newTracking)
  }

  log.info('Finishing')
}
