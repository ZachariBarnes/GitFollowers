/* eslint-disable*/
// This file is Auto-generated from claudia, and does not conform to my ESlint rules
'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./src/index')
const binaryMimeTypes = [
	'application/octet-stream',
	'font/eot',
	'font/opentype',
	'font/otf',
	'image/jpeg',
	'image/png',
	'image/svg+xml'
]
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)
