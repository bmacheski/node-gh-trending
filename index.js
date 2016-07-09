'use strict'

const cheerio = require('cheerio')
const request = require('request')

const base_url = 'https://github.com'

const parse = function (el) {
  return el.text().split('\n').join('').replace(/ +/g, ' ').trim()
}

const api = function (url, fn, cb) {
  request.get(url, function (err, res, body) {
    let $ = cheerio.load(body)
    let $body = $('body')

    if (err) {
      throw err
    }

    fn($, $body, cb)
  })
}

const find = function($body, el) {
  let $items = $body.find(el)

  return { items: $items, li: [] }
}

const parseRepos = function ($, $body, cb) {
  let { li, items } = find($body, 'li.repo-list-item')

  $(items).each(function (i, elem) {
    let el = $(elem)
    let name = el.find('h3.repo-list-name')
    let link = el.find('h3.repo-list-name a').attr('href')
    let description = el.find('p.repo-list-description')
    let meta = el.find('p.repo-list-meta')
    let item = {
      name: parse(name),
      link: `${base_url}${link}`,
      description: parse(description),
      meta: parse(meta)
    }

    li.push(item)
  })

  cb(li)
}

const parseDevs = function ($, $body, cb) {
  let { items, li } = find($body, 'li.user-leaderboard-list-item')

  $(items).each(function (i, elem) {
    let el = $(elem)
    let name = el.find('h2.user-leaderboard-list-name')
    let href = el.find('.user-leaderboard-list-name a').attr('href')
    let item = {
      name: parse(name),
      href: base_url + href
    }

    li.push(item)
  })

  cb(li)
}

const matchTime = function (time) {
  switch (time.toLowerCase()) {
    case 'weekly':
    case 'monthly':
    case 'daily':
      return true
    default:
      return false
  }
}

const constructUrl = function (lang, time, cb) {
  let options = {}

  if (typeof (lang) === 'boolean' && typeof (time) === 'string' && typeof (cb) === 'function') {
    options.url = `${base_url}/trending/developers?since=${time}`
    options.callback = cb
  } else if (typeof (lang) === 'boolean' && typeof (time) === 'function') {
    options.url = `${base_url}/trending/developers`
    options.callback = time
  } else if (typeof (lang) === 'string' && typeof (time) === 'string' && typeof (cb) === 'function') {
    options.url = `${base_url}/trending/${lang}?since=${time}`
    options.callback = cb
  } else if (typeof (lang) === 'string' && matchTime(lang) && typeof (time) === 'function') {
    options.url = `${base_url}/trending?since=${lang}`
    options.callback = time
  } else if (typeof (lang) === 'string' && !matchTime(lang) && typeof (time) === 'function') {
    options.url = `${base_url}/trending/${lang}`
    options.callback = time
  } else {
    options.url = `${base_url}/trending`
    options.callback = lang
  }

  return options
}

const findRepos = function (lang, time, cb) {
  util(lang, time, cb, parseRepos)
}

const findDevs = function (time, cb) {
  util(true, time, cb, parseDevs)
}

const util = function (bool, time, cb, fn) {
  let { url, callback } = constructUrl(bool, time, cb)

  api(url, fn, callback)
}

module.exports = {
  findDevs: findDevs,
  findRepos: findRepos,
  constructUrl: constructUrl,
  matchTime: matchTime
}
