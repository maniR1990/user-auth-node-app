import { Request, Response } from 'express';
import { z } from 'zod';
import {
  createUserSchema,
  loginSchema,
  GetAllRegisteredUsersResponse,
} from '../domain/user.schema';
import redis from '../lib/cache/redisClient';
import { registerUser, getAllregisteredUser } from '../services/user.service';
import { verifyUser } from '../services/auth.service';

export const registerController = async (req: Request, res: Response) => {
  try {
    const parsed = createUserSchema.parse(req.body);
    const user = await registerUser(parsed);
    res.status(201).json({ user });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await verifyUser(input);
    if (result) {
      (req.session as any).user = {
        id: result.user.id,
        email: result.user.email,
      };
    }

    res.json(result);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    res.status(401).json({ error: 'Invalid email or password' });
  }
};

export const testController = (_req: Request, res: Response) => {
  res.send('User routes working');
};

export const meController = (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ message: 'You are authenticated', user });
};

export const getAllregisteredUserController = async (req: Request, res: Response) => {
  const cacheKey = 'all_registered_users';
  try {
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log('✅ Served from Redis cache');
      return res.status(200).json(JSON.parse(cachedData));
    }
    const allUsers = await getAllregisteredUser();
    const result: GetAllRegisteredUsersResponse = allUsers;
    await redis.set(cacheKey, JSON.stringify(result), {
      EX: 60 * 5, // cache for 60 seconds
    });
    console.log('📦 Served from DB and cached');
    res.status(200).json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
