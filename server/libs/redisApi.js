const redis = require('redis');
const { promisify } = require('util');

const REDIS_URL = 'redis-13394.c16.us-east-1-3.ec2.cloud.redislabs.com';
const REDIS_PSW = 'yz7fdpaQ1vcVaIvbQgS5lFtUtwxiJA2F';
const REDIS_PORT = 13394;

const makeCacheClient = () => {
  const redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
    auth_pass: REDIS_PSW,
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
