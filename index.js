const fs = require('fs')
const url = require('url')

const micro = require('micro')
const debug = require('debug')('rssify')
const morgan = require('morgan')

const logger = require('./logger')
const handlers = require('moder')(`${__dirname}/handlers`)

const index = fs.readFileSync('public/index.html')
const notfound = fs.readFileSync('public/404.html')
const accesslog = morgan('combined', {stream: {write: (message) => { logger.info(message) }}})

const server = micro(async (req, res) => {
  // record accesslog
  await new Promise((resolve, reject) => {
    accesslog(req, res, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })

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

  try {
    const feed = await handlers[type](rest)
    const xml = feed.xml({indent: true})
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(xml),
      'Content-Type': 'text/xml'
    })
    res.end(xml)
  } catch (err) {
    if (err.statusCode === 404) {
      res.writeHead(404, {
        'Content-Length': Buffer.byteLength(notfound),
        'Content-Type': 'text/html'
      })
      res.end(notfound)
      return
    }
    throw err
  }
})

server.listen(8000)
