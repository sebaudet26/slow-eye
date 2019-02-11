const redis = require('redis');
const { promisify } = require('util');

const makeCacheClient = () => {
  const redisClient = redis.createClient({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    auth_pass: process.env.REDIS_PSW,
  });

  const cache = {
    connected: false,
    get: promisify(redisClient.get).bind(redisClient),
    set: promisify(redisClient.set).bind(redisClient),
  };

  redisClient.on('connect', async () => {
    try {
      cache.connected = true;
      console.log('Redis: Connected!');
      const rep = await cache.set('test_key', 'value!', 'EX', 10);
      console.log(`Redis: Inserting a value to redis went ${rep}`);
      const val = await cache.get('test_key');
      console.log(`Redis: Value is... ${val}`);
      // FOR DELETING ALL CACHE
      // redisClient.flushdb((err, succeeded) => {
      //   console.log('Flushed command was succeessful: ', succeeded);
      // });
    } catch (e) {
      throw new Error(`Failed to insert value in redis client ${e.toString()}`);
    }
  });

  return cache;
};

let cache;
const getSingleton = () => {
  if (cache) {
    return cache;
  }
  return makeCacheClient();
};

module.exports = getSingleton();
