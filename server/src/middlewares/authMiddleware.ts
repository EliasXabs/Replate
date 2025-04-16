import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or malformed' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as { sub: string; role: string };
    // Map sub to id for easier access in later middleware/controllers.
    (req as any).user = { id: decoded.sub, role: decoded.role };
    next();
  } catch (error) {
    console.error('JWT error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;
