const winston = require('winston')
require('winston-loggly-bulk')

winston.add(winston.transports.Loggly, {
  token: process.env.RSSIFY_LOGGLY_ACCESS_TOKEN,
  subdomain: 'cattail',
  tags: ['rssify'],
  json: true
})

module.exports = winston
