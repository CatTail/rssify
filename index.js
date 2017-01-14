const fs = require('fs')
const url = require('url')

const micro = require('micro')
const debug = require('debug')('rssify')

const handlers = require('moder')(`${__dirname}/handlers`)

const env = process.env.NODE_ENV
const index = fs.readFileSync('index.html')

const server = micro(async (req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(index),
      'Content-Type': 'text/html'
    })
    res.end(index)
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
