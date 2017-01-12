const url = require('url')

const micro = require('micro')
const debug = require('debug')('rssify')

const handlers = require('./handlers')

const env = process.env.NODE_ENV

const server = micro(async (req, res) => {
  if (req.url === '/') {
    res.writeHead(302, {
      'Location': 'https://github.com/CatTail/rssify'
    })
    res.end()
    return
  }

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
    'Content-Type': 'text/xml'
  })
  res.end(feed)
})

server.listen(env === 'production' ? 443 : 3000)
