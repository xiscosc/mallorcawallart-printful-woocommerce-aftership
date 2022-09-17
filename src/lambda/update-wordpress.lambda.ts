import { PrintulEvent } from '../types/printful-event.type'
import * as log from 'lambda-log'
import { generateTrackingId, transformPfCourierToWpCourier, transformPfItemsToWpItems } from '../tools/printful-to-wp.tool'
import { getWordpressOrder, updateMetadataWordpressOrder } from '../client/wordpress.client'
import { MetaData, MetaDataValue } from '../types/wc-metadata.type'

export async function handler(event: PrintulEvent): Promise<any> {
  const afterShipMetadataItems = '_aftership_tracking_items'
  const afterShipMetadataNumber = '_aftership_tracking_number'
  const afterShipMetadataProvider = '_aftership_tracking_provider_name'
  log.info(event.eventId)
  const orderId = event.data.order.external_id
  if (orderId === null) {
    throw Error(`No wp order to process ${event.eventId}`)
  }

  const oldOrder = await getWordpressOrder(orderId)
  const oldMetadata: MetaData | undefined = oldOrder.meta_data.find((i: MetaData) => {
    return i.key === afterShipMetadataItems
  })

  const trackingNumber = event.data.shipment.tracking_number
  const carrier = transformPfCourierToWpCourier(event.data.shipment.carrier)
  const items = transformPfItemsToWpItems(event.data.shipment.items, event.data.order.items)
  const trackingId = generateTrackingId(carrier, trackingNumber)
  const additionalFields = {
    account_number: '',
    key: '',
    postal_code: '',
    ship_date: '',
    destination_country: '',
    state: '',
  }

  const metadataValue: MetaDataValue = {
    tracking_id: trackingId,
    tracking_number: trackingNumber,
    slug: carrier,
    additional_fields: additionalFields,
    line_items: items,
    metrics: {
      created_at: new Date(),
      updated_at: new Date(),
    },
  }

  if (oldMetadata) {
    if (typeof oldMetadata.value !== 'string') {
      oldMetadata.value.push(metadataValue)
      await updateMetadataWordpressOrder(orderId, { meta_data: [oldMetadata] })
    }
  } else {
    const newMetadataItems: MetaData = {
      key: afterShipMetadataItems,
      value: [metadataValue],
    }

    const newMetadataNumber: MetaData = {
      key: afterShipMetadataNumber,
      value: trackingNumber,
    }

    const newMetadataProvider: MetaData = {
      key: afterShipMetadataProvider,
      value: carrier,
    }

    await updateMetadataWordpressOrder(orderId, { meta_data: [newMetadataItems, newMetadataNumber, newMetadataProvider] })
  }
}
