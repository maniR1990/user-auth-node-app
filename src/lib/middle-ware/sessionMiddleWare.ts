import session from 'express-session';
import { RedisStore } from 'connect-redis';
import redisClient from '../../lib/cache/redisClient';

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'myapp:',
});

export const sessionMiddleWare = session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || 'DEV_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 15,
  },
});
