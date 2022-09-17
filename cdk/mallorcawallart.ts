#!/usr/bin/env node
import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { MallorcaWallArtStack } from './mallorcawallart-stack'

const app = new App()
new MallorcaWallArtStack(app, 'MallorcaWallArtStack', {
  wordpressApiSecret: process.env.WP_SECRET ?? '',
  wordpressApiEndpoint: process.env.WP_ENDPOINT ?? '',
  wordpressApiKey: process.env.WP_KEY ?? '',
})
