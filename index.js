'use strict'

const cheerio = require('cheerio')
    , request = require('request')

function parse(el) {
  return el.text().split('\n').join('').replace(/ +/g, ' ').trim()
}

function api(url, fn, cb) {
  request.get(url, function(err, res, body) {
    let $ = cheerio.load(body)
    let $body = $('body')

    fn($, $body, cb)
  })
}

function parseRepos($, $body, cb) {
  let $items = $body.find('li.repo-list-item')
  let li = []

  $($items).each(function(i, elem) {
    let name = $(elem).find('h3.repo-list-name')
    let description = $(elem).find('p.repo-list-description')
    let meta = $(elem).find('p.repo-list-meta')
    let item = {
      name: parse(name),
      description: parse(description),
      meta: parse(meta)
    }

    li.push(item)
  })
  cb(li)
}

function parseDevs($, $body, cb) {
  let $items = $body.find('li.user-leaderboard-list-item')
  let li = []

  $($items).each(function(i, elem) {

    let name = $(elem).find('h2.user-leaderboard-list-name')
    let href = $(elem).find('.user-leaderboard-list-name a').attr('href')
    let item = {
      name: parse(name),
      href: href
    }
    li.push(item)
  })
  cb(li)
}

exports.findRepos = function(cb) {
  const url = 'https://github.com/trending'
  api(url, parseRepos, cb)
}

exports.findDevs = function(cb) {
  const url = 'https://github.com/trending/developers'
  api(url, parseDevs, cb)
}
