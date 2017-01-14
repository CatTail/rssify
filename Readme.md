# rssify
> Convert anything to rss feed

转 RSS 服务，目前支持 Github issues 和知乎专栏

---

## Usage

To get Github issues as RSS feed, simpily use pattern

* `expressjs/express` ===> https://rssify.now.sh/github/expressjs/express
* `CatTail/rssify` ===> https://rssify.now.sh/github/CatTail/rssify

## Deploy

    npm install
    npm install -g now
    now secrets add rssify_github_access_token "xxxxxxxxxxxxxxxxxxxxxx"
    npm run deploy

## Credit

lilydjwg for his wonderful project [morerssplz](https://github.com/lilydjwg/morerssplz)
