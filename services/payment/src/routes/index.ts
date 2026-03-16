import { Router } from 'express';
import { requestTopUp, handlePaymentWebhook } from '../controllers/payment_controller';

const router = Router();

router.post('/topup/request', requestTopUp);
router.post('/webhook/wing', handlePaymentWebhook);
router.post('/webhook/bakong', handlePaymentWebhook);

export default router;
