import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Cache para tokens já verificados (10 minutos)
const tokenCache = new Map<string, { payload: JwtPayload; expiry: number }>();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Verificar cache
    const cached = tokenCache.get(token);
    if (cached && cached.expiry > Date.now()) {
      req.user = cached.payload;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Adicionar ao cache
    tokenCache.set(token, {
      payload: decoded,
      expiry: Date.now() + 10 * 60 * 1000 // 10 minutos
    });

    // Limpar cache periodicamente
    if (tokenCache.size > 1000) {
      const now = Date.now();
      for (const [key, value] of tokenCache.entries()) {
        if (value.expiry < now) {
          tokenCache.delete(key);
        }
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};
