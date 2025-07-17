import { Request, Response, NextFunction } from 'express';

export function isSessionAuthenticated(req: Request, res: Response, next: NextFunction) {
  const session = req.session as any; // 👈 local cast to bypass TS check

  console.log('ssession');
  if (session && session.user) {
    console.log('ssession dssd');
    return next(); // ✅ User is logged in
  }

  return res.status(401).json({ error: 'Unauthorized: Please log in' });
}
