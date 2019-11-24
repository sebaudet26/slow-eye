const moment = require('moment-timezone')
const nodeFetch = require('node-fetch')
const cache = require('./../redis')

// technically 2AM to leave some time for Western coast to be at end of day
const getSecondsUntilMidnight = () => Math.round((moment.tz('America/New_York').endOf('day').add(2, 'hours').valueOf() - moment.tz('America/New_York').valueOf()) / 1000)

const APIS = {
  NHL: {
    BASIC: 'BASIC',
    RECORDS_API: 'RECORDS_API',
    STATS_API: 'STATS_API',
  },
  MLB: {
    BASIC: 'BASIC',
    LOOKUP: 'LOOKUP',
  }
}

const BASE_URLS = {
  NHL: {
    BASIC: 'https://api.nhle.com/stats/rest',
    RECORDS_API: 'https://records.nhl.com/site/api',
    STATS_API: 'https://statsapi.web.nhl.com/api/v1',
  },
  MLB: {
    BASIC: 'https://statsapi.mlb.com/api/v1',
    LOOKUP: 'https://lookup-service-prod.mlb.com/json',
  }
}

class ApiRequest {
  constructor({ apiType, expiration, resource, league, skipCache = false }) {
    if (!league) throw new Error('you must set the league')
    if (!apiType) throw new Error('you must set the apiType')
    if (!resource) throw new Error('you must set the resource')
    if (!BASE_URLS[league][apiType]) throw new Error('invalid league or apiType')
    this.league = league
    this.apiType = apiType
    this.resource = resource
    this.expiration = expiration || getSecondsUntilMidnight()
    this.url = `${BASE_URLS[league][apiType]}${this.resource}`
    this.skipCache = skipCache || process.env.SKIP_CACHE
    this.cache = cache.instance
  }

  async tryCache() {
    if (this.skipCache) return this
    if (!this.resource) throw new Error('you must set the resource')
    const cachedValue = await this.cache.get(this.url)
    this.data = JSON.parse(cachedValue)
    // console.log(`fetched from cache ${this.resource}`)
    return this.data
  }

  async saveToCache() {
    if (this.skipCache) return this
    if (!this.url || !this.expiration) {
      throw new Error('you must set the resource and expiration')
    }
    if (!this.data) throw new Error('you must have data to save to cache')
    this
      .cache
      .set(
        this.url,
        JSON.stringify(this.data),
        'EX',
        this.expiration
      )
    return this
  }

  async fetch() {
    console.log(this.url)
    await this.tryCache()
    if (this.data) return this.data
    const response = await nodeFetch(this.url)
    const data = await response.json()
    this.data = data
    await this.saveToCache()
    return this.data
  }
}

module.exports = ApiRequest