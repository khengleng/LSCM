import { Request, Response, NextFunction } from 'express';
import { AuthRequest, Platform } from '../types/auth';
import { UserRepository } from '../services/user_repository';
import { ConfigService } from '../services/config_service';

/**
 * Authenticates requests from different platforms.
 */
export const platformAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const platformId = req.headers['x-platform-id'] as string;
  const platform = req.headers['x-platform'] as Platform;

  // For Local Development & MVP
  if (process.env.NODE_ENV === 'development' && !platformId) {
    authReq.user = {
      userId: 'dev-user-000',
      platform: 'WING',
      platformId: 'mock-wing-123',
      name: 'Local Dev User'
    };
    return next();
  }

  if (!platformId || !platform) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Missing platform context headers (x-platform, x-platform-id)' 
    });
  }

  try {
    const user = await UserRepository.findOrCreateUser(platformId, platform);
    authReq.user = user;
    next();
  } catch (err) {
    console.error('[Auth-Middleware] Database Error:', err);
    res.status(500).json({ error: 'Internal Server Error during Authentication' });
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    return res.status(401).json({ error: 'Authentication Required' });
  }
  next();
};

/**
 * Secures admin-only endpoints.
 */
export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  const dbToken = await ConfigService.get('admin_access_token');
  const envToken = process.env.ADMIN_TOKEN || 'lifestyle-machine-ultra-secret-2026';
  const adminToken = dbToken || envToken;
  
  const providedToken = req.headers['x-admin-token'];

  if (!providedToken || providedToken !== adminToken) {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Invalid or missing Admin Access Token' 
    });
  }
  next();
};
