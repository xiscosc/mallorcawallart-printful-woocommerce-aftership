import axios from 'axios'
import { WooCommerceMetadata } from '../types/wc-metadata.type'

export async function getWordpressOrder(orderId: string): Promise<any> {
  const url: string = `${process.env.WORDPRESS_API_ENDPOINT as string}/wp-json/wc/v3/orders/${orderId}?consumer_key=${process.env.WORDPRESS_API_KEY as string}&consumer_secret=${
    process.env.WORDPRESS_API_SECRET as string
  }`
  return await axios.get<any>(url, {
    headers: {
      Accept: 'application/json',
    },
  })
}

export async function updateMetadataWordpressOrder(orderId: string, body: WooCommerceMetadata): Promise<any> {
  const url: string = `${process.env.WORDPRESS_API_ENDPOINT as string}/wp-json/wc/v3/orders/${orderId}?consumer_key=${process.env.WORDPRESS_API_KEY as string}&consumer_secret=${
    process.env.WORDPRESS_API_SECRET as string
  }`
  return await axios.put<any>(url, body)
}
