# rssify
> Convert anything to rss feed (currently only implement Github issues), build with https://zeit.co/now

## Usage

To get Github issues as RSS feed, simpily use pattern

* `expressjs/express` ===> https://rssify.now.sh/github/expressjs/express
* `CatTail/rssify` ===> https://rssify.now.sh/github/CatTail/rssify

## Deploy

    npm install
    npm install -g now
    now secrets add rssify_github_access_token "xxxxxxxxxxxxxxxxxxxxxx"
    npm run deploy
