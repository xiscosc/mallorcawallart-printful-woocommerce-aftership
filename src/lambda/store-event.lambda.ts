import { PrintulEvent } from '../types/printful-event.type'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, DynamoDBDocumentClient, PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import * as log from 'lambda-log'

export async function handler(event: PrintulEvent): Promise<any> {
  log.info(event.eventId)
  const client: DynamoDBDocumentClient = DynamoDBDocument.from(new DynamoDBClient({}), {
    marshallOptions: { removeUndefinedValues: true },
  })

  const dbParams: PutCommandInput = {
    TableName: process.env.TABLE_NAME as string,
    Item: event,
  }

  await client.send(new PutCommand(dbParams))
}
