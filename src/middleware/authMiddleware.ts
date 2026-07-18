import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/auth';

// Convert Node's IncomingHttpHeaders into a standard Headers object
const toHeaders = (headers: Request['headers']): Headers => {
  const result = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) result.append(key, v);
    } else {
      result.append(key, value);
    }
  }
  return result;
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: toHeaders(req.headers)
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