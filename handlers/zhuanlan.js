const RSS = require('rss')

const request = require('../request')

module.exports = async ([name]) => {
  const zhuanlan = await request({
    uri: `https://zhuanlan.zhihu.com/api/columns/${name}`,
    json: true
  })
  const posts = await request({
    uri: `https://zhuanlan.zhihu.com/api/columns/${name}/posts?limit=20`,
    json: true
  })

  const feed = new RSS({
    title: `${zhuanlan.title} - 知乎专栏`,
    description: zhuanlan.intro,
    feed_url: `https://rssify.now.sh/zhuanlan/${name}`,
    site_url: `https://zhuanlan.zhihu.com/${name}`,
    image_url: zhuanlan.author.avatar_url,
    generator: 'rssify',
    ttl: 60
  })
  posts.data.forEach((post) => {
    processContent(post)
    feed.item({
      title: post.title,
      description: post.excerpt,
      url: post.url,
      guid: post.url,
      author: post.author.name,
      date: new Date(post.created * 1000)
    })
  })
  return feed
}

function processContent (post) {
  // expand img to absolute url
  post.excerpt = post.excerpt.replace(/<img [^>]*?src="/gi, () => {
    return `<img referrerpolicy="no-referrer" src="${getImageHost()}`
  })
  // prepend titleImage to excerpt
  if (post.title_image) {
    post.excerpt = `<p><img src="${post.title_image}"></p>` + post.excerpt
  }
}

function getImageHost () {
  const id = parseInt(Math.random() * 4, 10) + 1
  return `https://pic${id}.zhimg.com/`
}
