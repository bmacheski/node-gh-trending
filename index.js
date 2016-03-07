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

  li.length === 0
    ? console.log('Could not find any repos. Github could be \'dissecting\' trending repos.')
    : cb(li)
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

const constructUrl = function (lang, time, cb) {
  let options = {}
  if (lang && typeof (lang) === 'boolean' && typeof (time) === 'string' && typeof (cb) === 'function') {
    options.url = base_url + '/trending/developers?since=' + time
    options.callback = cb
  } else if (lang && typeof (lang) === 'boolean' && typeof (time) === 'function') {
    options.url = base_url + '/trending/developers'
    options.callback = time
  } else if (!lang && typeof (lang) === 'boolean' && typeof (time) === 'string' && typeof (cb) === 'function') {
    options.url = base_url + '/trending?since=' + time
    options.callback = cb
  } else if (!lang && typeof (lang) === 'boolean' && typeof (time) === 'function') {
    options.url = base_url + '/trending'
    options.callback = time
  } else if (typeof (lang) === 'string' && typeof (time) === 'string' && typeof (cb) === 'function') {
    options.url = base_url + '/trending/' + lang + '?since=' + time
    options.callback = cb
  } else if (typeof (lang) === 'string' && typeof (time) === 'function') {
    options.url = base_url + '/trending/' + lang
    options.callback = time
  }

  return options
}

const findRepos = function (time, cb) {
  let res = constructUrl(false, time, cb)
  let url = res.url
  let callback = res.callback
  api(url, parseRepos, callback)
}

const findReposByLang = function (lang, time, cb) {
  let res = constructUrl(lang, time, cb)
  let url = res.url
  let callback = res.callback
  api(url, parseRepos, callback)
}

const findDevs = function (time, cb) {
  let res = constructUrl(true, time, cb)
  let url = res.url
  let callback = res.callback
  api(url, parseDevs, callback)
}

module.exports = {
  findDevs: findDevs,
  findRepos: findRepos,
  findReposByLang: findReposByLang,
  constructUrl: constructUrl
}
