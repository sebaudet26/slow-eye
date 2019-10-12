const redis = require('redis')
const moment = require('moment')
const { promisify } = require('util')

const getMsUntilFourAM = () => Math.round(
  moment()
    .endOf('week')
    .add(4, 'hours')
    .valueOf() - moment().valueOf(),
)

const makeCacheClient = () => {
  const redisClient = redis.createClient({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    auth_pass: process.env.REDIS_PSW,
  })

  const cache = {
    client: redisClient,
    connected: false,
    get: promisify(redisClient.get).bind(redisClient),
    set: promisify(redisClient.set).bind(redisClient),
  }

  cache.client.on('connect', async () => {
    try {
      cache.connected = true
      console.log('Redis: Connected!')
      const rep = await cache.set('test_key', 'Test succeeded', 'EX', 10)
      console.log(`Redis: Inserted a value to redis ${rep}`)
      const val = await cache.get('test_key')
      console.log(`Redis: ${val}`)

      // FOR DELETING ALL CACHE
      console.log(`Cache will be cleared in ${(getMsUntilFourAM() / 1000 / 60 / 60).toFixed(1)} hours`)
      setTimeout(
        () => cache.client.flushdb((err, succeeded) => {
          console.log('Flushed command was succeessful: ', succeeded)
        }),
        getMsUntilFourAM(),
      )
    } catch (e) {
      throw new Error(`Failed to insert value in redis client ${e.toString()}`)
    }
  })

  return cache
}

class Cache {
  constructor() {
    if (this.instance) return this.instance
    this.instance = makeCacheClient()
    return this.instance
  }
}

module.exports = new Cache()