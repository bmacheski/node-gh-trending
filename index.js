'use strict'

const cheerio = require('cheerio')
const request = require('request')

const base_url = 'https://github.com'

function parse (el) {
  return el.text().split('\n').join('').replace(/ +/g, ' ').trim()
}

function api (url, fn, cb) {
  request.get(url, function (err, res, body) {

    let $ = cheerio.load(body)
    let $body = $('body')

    if (err) {
      throw err
    }
    fn($, $body, cb)
  })
}

function parseRepos ($, $body, cb) {
  let $items = $body.find('li.repo-list-item')
  let li = []

  $($items).each(function (i, elem) {
    let name = $(elem).find('h3.repo-list-name')
    let link = $(elem).find('h3.repo-list-name a').attr('href')
    let description = $(elem).find('p.repo-list-description')
    let meta = $(elem).find('p.repo-list-meta')
    let item = {
      name: parse(name),
      link: base_url + link,
      description: parse(description),
      meta: parse(meta)
    }

    li.push(item)
  })

  if (~~li) {
    console.log('Could not find any repos. Github could be `dissecting` trending repos.')
  } else {
    cb(li)
  }
}

function parseDevs ($, $body, cb) {
  let $items = $body.find('li.user-leaderboard-list-item')
  let li = []

  $($items).each(function (i, elem) {
    let name = $(elem).find('h2.user-leaderboard-list-name')
    let href = $(elem).find('.user-leaderboard-list-name a').attr('href')
    let item = {
      name: parse(name),
      href: base_url + href
    }

    li.push(item)
  })
  cb(li)
}

exports.findRepos = function (cb) {
  const url = base_url + '/trending'
  api(url, parseRepos, cb)
}

exports.findReposByLang = function (lang, cb) {
  if (typeof(lang) === 'function') throw Error('A language is required as the first argument.')
  const url = base_url + '/trending?l=' + lang
  api(url, parseRepos, cb)
}

exports.findDevs = function (cb) {
  const url = base_url + '/trending/developers'
  api(url, parseDevs, cb)
}
