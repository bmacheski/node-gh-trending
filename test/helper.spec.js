'use strict'

const constructUrl = require('../index').constructUrl
const matchTime = require('../index').matchTime
const expect = require('chai').expect

describe('url helper', () => {

  describe('findRepos url', () => {

    it('should have the correct trending url when a time is passed in', () => {
      let trendingReposUrl = 'https://github.com/trending?since=weekly'
      let res = constructUrl('weekly', function() {})
      expect(res.url).to.equal(trendingReposUrl)
    })

    it('should have a callback when a time is passed in', () => {
      let trendingReposUrl = 'https://github.com/trending?since=weekly'
      let res = constructUrl('weekly', function() {})
      expect(res.callback).to.be.a('function')
    })

    it('should have the correct trending url when a time is not passed in', () => {
      let trendingReposUrl = 'https://github.com/trending'
      let res = constructUrl(function() {})
      expect(res.url).to.equal(trendingReposUrl)
    })

    it('should have a callback when a time is not passed in', () => {
      let trendingReposUrl = 'https://github.com/trending?since=weekly'
      let res = constructUrl(function() {})
      expect(res.callback).to.be.a('function')
    })
  })

  describe('findDevs url', () => {

    it('should have the correct trending devs url when time is passed in', () => {
      let trendingDevsUrl = 'https://github.com/trending/developers?since=weekly'
      let res = constructUrl(true, 'weekly', function() {})
      expect(res.url).to.equal(trendingDevsUrl)
    })

    it('should have a callback as a callback property when a time is passed in', () => {
      let res = constructUrl(true, 'weekly', function() {})
      expect(res.callback).to.be.a('function')
    })

    it('should have the correct trending devs url when time is not passed in', () => {
      let url = 'https://github.com/trending/developers'
      let res = constructUrl(true, function() {})
      expect(res.url).to.equal(url)
    })

    it('should have a callback when time is not passed in', () => {
      let url = 'https://github.com/trending/developers'
      let res = constructUrl(true, function() {})
      expect(res.url).to.equal(url)
    })
  })
})

describe('matchTime util', () => {
  it('should return true when a time is passed in', () => {
    let res = matchTime('weekly')
    expect(res).to.equal(true)
  })

  it('should return false when an empty string is not passed in', () => {
    let res = matchTime('')
    expect(res).to.equal(false)
  })

  it('should return true and ignore case with a non-lower case argument', () => {
    let res = matchTime('WeEkLy')
    expect(res).to.equal(true)
  })
})
