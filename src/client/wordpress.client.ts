import axios, { AxiosBasicCredentials } from 'axios'
import { WpOrder } from '../types/wc-metadata.type'
import { WpTracking } from '../types/tracking.type'
import * as log from 'lambda-log'

const basicAuth: AxiosBasicCredentials = {
  username: process.env.WORDPRESS_API_KEY as string,
  password: process.env.WORDPRESS_API_SECRET as string,
}

const endpoint: string = process.env.WORDPRESS_API_ENDPOINT as string

export async function getWordpressOrder(orderId: string): Promise<any> {
  const url: string = `${endpoint}/wp-json/wc/v3/orders/${orderId}`
  const response = await axios.get<any>(url, {
    headers: {
      Accept: 'application/json',
    },
    auth: basicAuth,
  })

  return response.data
}

export async function updateWordpressOrder(orderId: string, body: WpOrder): Promise<any> {
  const url: string = `${endpoint}/wp-json/wc/v3/orders/${orderId}`
  return await axios.put<any>(url, body, { auth: basicAuth })
}

export async function updateWordpressTracking(orderId: string, body: WpTracking): Promise<any> {
  const url: string = `${endpoint}/wp-json/wc-shipment-tracking/v3/orders/${orderId}/shipment-trackings`
  return await axios.post<any>(url, body, { auth: basicAuth })
}

export async function getWordpressTracking(orderId: string): Promise<WpTracking[]> {
  const url: string = `${endpoint}/wp-json/wc-shipment-tracking/v3/orders/${orderId}/shipment-trackings`
  const response = await axios.get<any>(url, { auth: basicAuth })
  return response.data
}
