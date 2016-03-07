# node-gh-trending

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/bmacheski/node-gh-trending.svg?branch=master)](https://travis-ci.org/bmacheski/node-gh-trending)

Access GitHub trending repositories / developers

## Install

```
$ npm install --save node-gh-trending
```

## API

#### `findRepos([time], callback)`

#### `findReposByLang(language, [time], callback)`

#### `findDevs([time], callback)`

If you would like trending weekly or monthly results, you can provide those as the time option and
if a time is not provided, the daily trending repositories will be given.

## Usage

``` js
var trending = require("node-gh-trending")

trending.findRepos(function (res) {
  console.log("Today's top repos: ", res)
})

trending.findReposByLang("javascript", "weekly", function (res) {
  console.log("This week's top javascript repos: ", res)
})

trending.findDevs("monthly", function (res) {
  console.log("This month's top devs: ", res)
})
```

## License

  MIT
