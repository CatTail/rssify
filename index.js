const url = require('url')

const micro = require('micro')
const debug = require('debug')('rssify')

const handlers = require('./handlers')

const server = micro(async (req, res) => {
  const {path} = url.parse(req.url)
  const [, type, ...rest] = path.split('/')
  debug(type, rest)
  if (!handlers[type]) {
    res.writeHead(400)
    res.end('Invalid handler type')
    return
  }

  const feed = await handlers[type](rest)
  res.writeHead(200, {
    'Content-Length': Buffer.byteLength(feed),
    'Content-Type': 'application/rss+xml; charset=utf-8'
  })
  res.end(feed)
})

server.listen(3000)
