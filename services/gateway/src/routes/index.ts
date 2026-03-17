import { Router, Request, Response } from 'express';
import { handleFacebookWebhook, handleTelegramWebhook, notifyUserOfPayment } from '../controllers/webhooks';
import { platformAuth, requireAuth, adminAuth } from '../middleware/auth';
import { enforceQuota } from '../middleware/quota';
import { AuthRequest } from '../types/auth';

import { 
  getDashboardStats, 
  getAllConfigs, 
  updateConfig, 
  getTransactions,
  getRevenueChartData,
  getUsersList,
  getUsageAnalytics,
  getCustomerJourneys,
  getRetargetingData,
  adjustUserCredits
} from '../controllers/admin_controller';

const router = Router();

// 1. Webhooks (External -> Gateway)
// Facebook
router.get('/webhooks/fb', handleFacebookWebhook);
router.post('/webhooks/fb', handleFacebookWebhook);

// Telegram
router.post('/webhooks/tg', handleTelegramWebhook);

// 2. Internal service-to-service endpoints (no public auth, but only accessible within Railway private network)
router.post('/internal/notify-user', notifyUserOfPayment);

// 3. Admin API (Web Portal -> Gateway)
router.use('/admin', adminAuth);
router.get('/admin/stats', getDashboardStats);
router.get('/admin/configs', getAllConfigs);
router.post('/admin/configs', updateConfig);
router.get('/admin/transactions', getTransactions);
router.get('/admin/revenue-chart', getRevenueChartData);
router.get('/admin/users', getUsersList);
router.get('/admin/usage-stats', getUsageAnalytics);
router.get('/admin/journeys', getCustomerJourneys);
router.get('/admin/retargeting', getRetargetingData);
router.post('/admin/users/adjust-credits', adjustUserCredits);

// 4. Main API (App -> Gateway)
// Protected by AuthMiddleware and QuotaMiddleware
router.post('/query', platformAuth, requireAuth, enforceQuota, (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  res.status(200).json({ 
    message: 'User Context Verified & Quota Checked. Forwarding to Orchestrator.',
    user: authReq.user,
    remaining_quota: res.locals.remainingQuota
  });
});

export default router;
