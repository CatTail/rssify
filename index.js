const url = require('url')

const micro = require('micro')
const debug = require('debug')('rssify')

const handlers = require('moder')(`${__dirname}/handlers`)

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
  const xml = feed.xml({indent: true})
  res.writeHead(200, {
    'Content-Length': Buffer.byteLength(xml),
    'Content-Type': 'text/xml'
  })
  res.end(xml)
})

server.listen(env === 'production' ? 443 : 3000)
