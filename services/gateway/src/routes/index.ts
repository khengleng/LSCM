import { Router, Request, Response } from 'express';
import { handleFacebookWebhook, handleTelegramWebhook, notifyUserOfPayment } from '../controllers/webhooks';
import { platformAuth, requireAuth, adminAuth } from '../middleware/auth';
import { enforceQuota } from '../middleware/quota';
import { AuthRequest } from '../types/auth';
import { query } from '../services/db_service';

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
  getDashboardBlob,
  adjustUserCredits,
  approveTransaction,
  checkSystemHealth
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
router.get('/admin/dashboard-blob', getDashboardBlob);
router.get('/admin/health', checkSystemHealth);
router.post('/admin/users/adjust-credits', adjustUserCredits);
router.post('/admin/transactions/approve', approveTransaction);

import axios from 'axios';

// 4. Main API (App -> Gateway)
// Protected by AuthMiddleware and QuotaMiddleware
router.post('/query', platformAuth, requireAuth, enforceQuota, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { text, voice_url, image_url, platformId, platform } = req.body;

  if (!authReq.user) return res.status(401).json({ error: 'User Context Required' });

  try {
    const orchestratorUrl = process.env.ORCHESTRATOR_URL || 'http://localhost:8000';
    console.log(`[Gateway] Dispatching AI Query to Orchestrator: ${orchestratorUrl}`);

    const response = await axios.post(`${orchestratorUrl}/api/v1/query`, {
      userId: authReq.user.userId,
      platformId: platformId || authReq.user.platformId,
      platform: platform || authReq.user.platform,
      text,
      voice_url,
      image_url
    }, { timeout: 45000 });

    // Log the journey for analytics/audit
    await query(
      `INSERT INTO usage_events (user_id, event_type, metadata) 
       VALUES ($1, 'JOURNEY_STEP', $2)`,
      [authReq.user.userId, JSON.stringify({
        intent: response.data.intent,
        has_voice: !!voice_url,
        has_image: !!image_url,
        orchestration_time: new Date().toISOString()
      })]
    );

    res.status(200).json({
      ...response.data,
      remaining_quota: res.locals.remainingQuota
    });

  } catch (error: any) {
    console.error('[Gateway-Orchestrator-Forward] AI Hub Failure:', error.message);
    res.status(502).json({ 
      error: 'AI Engine Latency', 
      message: 'The Lifestyle Machine is deep in thought. Please try again in a moment.' 
    });
  }
});

export default router;
