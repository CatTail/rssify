const request = require('request-promise')
const RSS = require('rss')
const marked = require('marked')

const pkg = require('./package')

exports.github = async ([owner, repo]) => {
  const headers = {'User-Agent': `rssify/${pkg.version}`}
  const repository = await request({
    uri: `https://api.github.com/repos/${owner}/${repo}/issues`,
    headers,
    json: true
  })
  const issues = await request({
    uri: `https://api.github.com/repos/${owner}/${repo}/issues`,
    headers,
    json: true
  })

  const feed = new RSS({
    title: repository.name,
    description: repository.description,
    site_url: `https://github.com/${owner}/${repo}/issues`
  })
  issues.forEach((issue) => {
    feed.item({
      title: issue.title,
      description: marked(issue.body),
      url: issue.url,
      guid: issue.url,
      author: issue.user.login,
      date: issue.created_at
    })
  })
  const xml = feed.xml({indent: true})
  return xml
}
