# node-gh-trending

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Access GitHub trending repositories / developers

## Install

``` js
$ npm install --save node-gh-trending
```

## Usage

``` js
const trending = require('node-gh-trending')

trending.findRepos(function(res) {
  console.log('top repos: ', res)
})

trending.findReposByLang('javascript', function(res) {
  console.log('top javascript repos: ', res)
})

trending.findDevs(function(res) {
  console.log('top devs: ', res)
})
```
