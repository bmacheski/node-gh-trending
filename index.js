const cheerio = require('cheerio')
const request = require('request')

const base_url = 'https://github.com'

const api = (url, fn, cb) => {
  request.get(url, (err, res, body) => {
    const $ = cheerio.load(body)
    const $body = $('body')

    if (err) throw err

    fn($, $body, cb)
  })
}

const find = ($body, el) => {
  const $items = $body.find(el)

  return { items: $items, li: [] }
}

const parseRepos = ($, $body, cb) => {
  const { li, items } = find($body, 'li.repo-list-item')

  $(items).each((i, elem) => {
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

const parseDevs = ($, $body, cb) => {
  const { items, li } = find($body, 'li.user-leaderboard-list-item')

  $(items).each((i, elem) => {
    let el = $(elem)
    let name = el.find('h2.user-leaderboard-list-name')
    let href = el.find('.user-leaderboard-list-name a').attr('href')
    let item = {
      name: parse(name),
      href: `${base_url}${href}`
    }

    li.push(item)
  })

  cb(li)
}

const constructUrl = (lang, time, cb) => {
  const options = {}

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

const parse = el =>
  el.text().split('\n').join('').replace(/ +/g, ' ').trim()

const matchTime = time =>
  /weekly|monthly|daily/i.test(time)

const findRepos = (lang, time, cb) =>
  util(lang, time, cb, parseRepos)

const findDevs = (time, cb) =>
  util(true, time, cb, parseDevs)

const util = (bool, time, cb, fn) => {
  const { url, callback } = constructUrl(bool, time, cb)

  api(url, fn, callback)
}

module.exports = {
  findDevs,
  findRepos,
  constructUrl,
  matchTime
}
