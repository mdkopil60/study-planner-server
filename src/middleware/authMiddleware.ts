import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/auth';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
        headers: req.headers
    });
    
    if (!session || !session.user) {
        res.status(401).json({ error: 'Unauthorized. Please log in.' });
        return;
    }
    
    req.user = session.user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};
