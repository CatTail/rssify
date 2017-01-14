# rssify
> Convert anything to rss feed

转 RSS 服务，目前支持 Github issues 和知乎专栏

知乎专栏 https://zhuanlan.zhihu.com/junyu，RSS 地址为 https://rssify.now.sh/zhuanlan/junyu

Github 项目 https://github.com/CatTail/rssify 的 issues，RSS 地址为 https://rssify.now.sh/github/CatTail/rssify

## Deploy

    npm install
    npm install -g now
    now secrets add rssify_github_access_token "xxxxxxxxxxxxxxxxxxxxxx"
    npm run deploy

## Credit

lilydjwg for his wonderful project [morerssplz](https://github.com/lilydjwg/morerssplz)
