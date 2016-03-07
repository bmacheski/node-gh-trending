'use strict'

const constructUrl = require('../index').constructUrl
const expect = require('chai').expect

describe('url helper', () => {

  describe('findRepos url', () => {

    it('should have the correct trending url when a time is passed in', () => {
      let trendingReposUrl = 'https://github.com/trending?since=weekly'
      let res = constructUrl(false, 'weekly', function() {})
      expect(res.url).to.equal(trendingReposUrl)
    })

    it('should have a callback when a time is passed in', () => {
      let trendingReposUrl = 'https://github.com/trending?since=weekly'
      let res = constructUrl(false, 'weekly', function() {})
      expect(res.callback).to.be.a('function')
    })

    it('should have the correct trending url when a time is not passed in', () => {
      let trendingReposUrl = 'https://github.com/trending'
      let res = constructUrl(false, function() {})
      expect(res.url).to.equal(trendingReposUrl)
    })

    it('should have a callback when a time is not passed in', () => {
      let trendingReposUrl = 'https://github.com/trending?since=weekly'
      let res = constructUrl(false, function() {})
      expect(res.callback).to.be.a('function')
    })
  })

  describe('findReposByLang url', () => {

    it('should have the correct trending language url when time and language are passed in', () => {
      let trendingReposUrl = 'https://github.com/trending/javascript?since=weekly'
      let res = constructUrl('javascript', 'weekly', function() {})
      expect(res.url).to.equal(trendingReposUrl)
    })

    it('should have a callback when time and language are passed in', () => {
      let res = constructUrl('javascript', function() {})
      expect(res.callback).to.be.a('function')
    })

    it('should have the correct trending language url when just a language is passed in', () => {
      let trendingReposUrl = 'https://github.com/trending/javascript'
      let res = constructUrl('javascript', function() {})
      expect(res.url).to.equal(trendingReposUrl)
    })

    it('should have a callback when just a language is passed in', () => {
      let res = constructUrl('javascript', function() {})
      expect(res.callback).to.be.a('function')
    })
  })

  describe('findDevs url', () => {

    it('should have the correct trending devs url when time is passed in', () => {
      let trendingDevsUrl = 'https://github.com/trending/developers?since=weekly'
      let res = constructUrl(true, 'weekly', function() {}, true)
      expect(res.url).to.equal(trendingDevsUrl)
    })

    it('should have a callback as a callback property when a time is passed in', () => {
      let res = constructUrl(true, 'weekly', function() {}, true)
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
