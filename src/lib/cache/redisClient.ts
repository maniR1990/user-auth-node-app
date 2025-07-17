import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('❌ REDIS_URL is not defined in the .env file');
}

const redisClient = createClient({
  url: ' redis://localhost:6379', // default redis URL
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('redis connected');
  }
}

export default redisClient;
