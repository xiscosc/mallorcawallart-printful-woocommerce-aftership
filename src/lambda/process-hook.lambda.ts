import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import { InvocationType, InvokeCommandInput, InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'
import { v4 as uuidv4 } from 'uuid'
import * as log from 'lambda-log'
import { PrintulEvent } from '../types/printful-event.type'

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method not allowed',
    }
  }

  if (event.body === null || event.body === undefined) {
    return {
      statusCode: 400,
      body: 'Body is required',
    }
  }

  const printfulEvent: PrintulEvent = { ...JSON.parse(event.body), eventId: uuidv4() }
  if (printfulEvent.type === undefined || printfulEvent.type !== 'package_shipped') {
    return {
      statusCode: 400,
      body: 'Event type not allowed',
    }
  }

  const client = new LambdaClient({})
  const dbLambdaParams: InvokeCommandInput = {
    FunctionName: process.env.DB_LAMBDA as string,
    InvocationType: InvocationType.Event,
    Payload: Buffer.from(JSON.stringify(printfulEvent)),
  }
  const wpLambdaParams: InvokeCommandInput = {
    FunctionName: process.env.WORDPRESS_LAMBDA as string,
    InvocationType: InvocationType.Event,
    Payload: Buffer.from(JSON.stringify(printfulEvent)),
  }

  const dbInvocation = client.send(new InvokeCommand(dbLambdaParams))
  const wpInvocation = client.send(new InvokeCommand(wpLambdaParams))
  await Promise.all([dbInvocation, wpInvocation])

  log.info(printfulEvent.eventId)
  return {
    statusCode: 200,
    body: 'Ok',
  }
}
