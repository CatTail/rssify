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
    title: `${zhuanlan.name} - 知乎专栏`,
    description: zhuanlan.intro,
    feed_url: `https://rssify.now.sh/zhuanlan/${name}`,
    site_url: `https://zhuanlan.zhihu.com/${name}`,
    image_url: `${getImageHost()}${zhuanlan.avatar.id}_xl.jpg`,
    generator: 'rssify',
    ttl: 60
  })
  posts.forEach((post) => {
    processContent(post)
    feed.item({
      title: post.title,
      description: post.content,
      url: `https://zhuanlan.zhihu.com${post.url}`,
      guid: `https://zhuanlan.zhihu.com${post.url}`,
      author: post.author.name,
      date: post.publishedTime
    })
  })
  return feed
}

function processContent (post) {
  // expand img to absolute url
  post.content = post.content.replace(/<img [^>]*?src="/gi, () => {
    return `<img referrerpolicy="no-referrer" src="${getImageHost()}`
  })
  // prepend titleImage to content
  if (post.titleImage) {
    post.content = `<p><img src="${post.titleImage}"></p>` + post.content
  }
}

function getImageHost () {
  const id = parseInt(Math.random() * 4, 10) + 1
  return `https://pic${id}.zhimg.com/`
}
