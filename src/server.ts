import express from 'express';
import { connectRedis } from './lib/cache/redisClient';
import dotenv from 'dotenv';
import { sessionMiddleWare } from './lib/middle-ware/sessionMiddleWare';
import userRoutes from './api/user.route';

dotenv.config();

const app = express();
app.use(express.json());
app.use(sessionMiddleWare);

app.use('/api', userRoutes);
app.use('/api/auth', userRoutes);
app.get('/', (req, res) => {
  res.send('Hello World');
});

async function bootStrap() {
  await connectRedis();
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootStrap();
