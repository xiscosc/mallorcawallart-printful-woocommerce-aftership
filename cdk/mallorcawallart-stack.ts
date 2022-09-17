import { Duration, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Runtime, Tracing } from 'aws-cdk-lib/aws-lambda'
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'

export interface MWAProps extends StackProps {
  wordpressApiKey: string
  wordpressApiSecret: string
  wordpressApiEndpoint: string
}

export class MallorcaWallArtStack extends Stack {
  private readonly props: MWAProps

  constructor(scope: Construct, id: string, props: MWAProps) {
    super(scope, id, props)
    this.props = props

    const eventsTable = new Table(this, 'eventsTable', {
      tableName: 'eventsTableFromPrintful',
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'eventId', type: AttributeType.STRING },
    })

    const storeEventLambda = new NodejsFunction(this, 'storeEvent', {
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler',
      memorySize: 256,
      functionName: 'storeEvent',
      entry: `${__dirname}/../src/lambda/store-event.lambda.ts`,
      timeout: Duration.seconds(15),
      tracing: Tracing.ACTIVE,
      environment: {
        TABLE_NAME: eventsTable.tableName,
        NODE_OPTIONS: '--enable-source-maps',
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    })

    const updateWordpressLambda = new NodejsFunction(this, 'updateWordpress', {
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler',
      memorySize: 256,
      functionName: 'updateWordpress',
      entry: `${__dirname}/../src/lambda/update-wordpress.lambda.ts`,
      timeout: Duration.seconds(15),
      tracing: Tracing.ACTIVE,
      environment: {
        WORDPRESS_API_ENDPOINT: this.props.wordpressApiEndpoint,
        WORDPRESS_API_KEY: this.props.wordpressApiKey,
        WORDPRESS_API_SECRET: this.props.wordpressApiSecret,
        NODE_OPTIONS: '--enable-source-maps',
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    })

    const hookProcessorLambda = new NodejsFunction(this, 'hookProcessor', {
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler',
      memorySize: 256,
      functionName: 'hookProcessor',
      entry: `${__dirname}/../src/lambda/process-hook.lambda.ts`,
      timeout: Duration.seconds(15),
      tracing: Tracing.ACTIVE,
      environment: {
        WORDPRESS_LAMBDA: updateWordpressLambda.functionName,
        DB_LAMBDA: storeEventLambda.functionName,
        NODE_OPTIONS: '--enable-source-maps',
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    })

    updateWordpressLambda.grantInvoke(hookProcessorLambda)
    storeEventLambda.grantInvoke(hookProcessorLambda)
    eventsTable.grantReadWriteData(storeEventLambda)

    new LambdaRestApi(this, 'hookApi', {
      handler: hookProcessorLambda,
    })
  }
}
