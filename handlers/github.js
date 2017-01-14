const RSS = require('rss')
const marked = require('marked')

const request = require('../request')

module.exports = async ([owner, repo]) => {
  const headers = {
    'Authorization': `token ${process.env.RSSIFY_GITHUB_ACCESS_TOKEN}`
  }
  const repository = await request({
    uri: `https://api.github.com/repos/${owner}/${repo}`,
    headers,
    json: true
  })
  const issues = await request({
    uri: `https://api.github.com/repos/${owner}/${repo}/issues`,
    headers,
    json: true
  })

  const feed = new RSS({
    title: repository.description,
    description: repository.description,
    feed_url: `https://rssify.now.sh/github/${owner}/${repo}`,
    site_url: `https://github.com/${owner}/${repo}/issues`,
    image_url: `https://github.com/${owner}.png`,
    generator: 'rssify',
    ttl: 60
  })
  issues.forEach((issue) => {
    feed.item({
      title: issue.title,
      description: marked(issue.body),
      url: issue.html_url,
      guid: issue.url,
      author: issue.user.login,
      date: issue.created_at
    })
  })
  return feed
}
