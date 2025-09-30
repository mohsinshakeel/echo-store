import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true,
};

const redis = new Redis(redisConfig);

redis.on('connect', () => {
  console.log('Redis client connected');
});

redis.on('ready', () => {
  console.log('Redis client ready');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

redis.on('close', () => {
  console.log('Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('Redis client reconnecting...');
});

process.on('SIGINT', () => {
  redis.disconnect();
});

process.on('SIGTERM', () => {
  redis.disconnect();
});

export default redis;
