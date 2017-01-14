const request = require('request-promise')

const pkg = require('./package')

module.exports = request.defaults({
  headers: {
    'User-Agent': `rssify/${pkg.version}`
  }
})
