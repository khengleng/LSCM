import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth';
import { QuotaService } from '../services/quota_service';

/**
 * Middleware to enforce AI request quotas.
 */
export const enforceQuota = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) return res.status(401).json({ error: 'Auth context missing' });

  try {
    const actionType = req.path.includes('reading') ? 'READING' : 'QUERY';
    const { allowed, remaining } = await QuotaService.checkAndDeductQuota(authReq.user, actionType);

    if (!allowed) {
      return res.status(403).json({
        error: 'Quota Exceeded',
        message: 'You have reached your limit. Please top up your credits to continue.',
        topUpOptions: [
          { id: 'starter', price: 1, questions: 5 },
          { id: 'basic', price: 2, questions: 15 },
          { id: 'pro', price: 5, questions: 50 }
        ]
      });
    }

    res.locals.remainingQuota = remaining;
    next();
  } catch (error) {
    console.error('[Quota-Middleware] Error:', error);
    next();
  }
};
