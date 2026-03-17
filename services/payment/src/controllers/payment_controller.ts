import { Request, Response } from 'express';
import axios from 'axios';
import { KHQRService, KHQRData } from '../services/khqr_service';
import { ConfigService, query } from '../services/config_service';

// Credit packages: how many credits each top-up package grants
const CREDIT_PACKAGES: Record<string, number> = {
  'starter':  5,
  'basic':   15,
  'pro':     35,
  'elite':   80,
};

// Derive credits from amount when packageId is not a named package
const creditsFromAmount = (amount: number): number => {
  if (amount >= 20) return 80;
  if (amount >= 10) return 35;
  if (amount >= 5)  return 15;
  return 5;
};

export const requestTopUp = async (req: Request, res: Response) => {
  try {
    const { userId, packageId, amount, currency, platform } = req.body;

    // 1. Validate input
    if (!userId || !amount || !packageId) {
      return res.status(400).json({ error: 'Missing required fields: userId, packageId, amount' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // 2. Determine payment provider from route (fallback to wing)
    const provider = (req.path.includes('bakong')) ? 'bakong' : 'wing';

    // 3. Generate a unique order reference
    const orderId = `LSCM-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    // 4. Insert pending transaction into DB
    await query(
      `INSERT INTO transactions (user_id, amount, currency, type, status, provider, provider_ref)
       VALUES ($1, $2, $3, 'topup', 'pending', $4, $5)`,
      [userId, parsedAmount, currency || 'USD', provider, orderId]
    );
    console.log(`[Payment-Controller] Created pending transaction: ${orderId} for user ${userId}`);

    // 5. Build Bakong ID for KHQR
    const bakongId = await ConfigService.get('bakong_id', 'lifestyle_machine@wing');

    // 6. Generate KHQR
    const khqrData: KHQRData = {
      bakongId: bakongId!,
      merchantName: 'Lifestyle Machine',
      merchantCity: 'Phnom Penh',
      amount: parsedAmount,
      currency: (currency as 'USD' | 'KHR') || 'USD',
      orderId,
    };

    const khqrString  = KHQRService.generateKHQRString(khqrData);
    const qrCodeImage = await KHQRService.generateQRCodeBase64(khqrString);

    return res.status(200).json({
      orderId,
      khqrString,
      qrCodeImage,
      credits: CREDIT_PACKAGES[packageId] ?? creditsFromAmount(parsedAmount),
      message: 'Please scan the QR code to complete your top-up.',
    });

  } catch (error: any) {
    console.error('[Payment-Controller] Top-up error:', error.message);
    return res.status(500).json({ error: 'Failed to initiate top-up' });
  }
};

export const handlePaymentWebhook = async (req: Request, res: Response) => {
  /**
   * Called by Wing / Bakong when a payment is confirmed or fails.
   * Expected body: { orderId, status ('success'|'failed'), transactionId, amount? }
   */
  const { orderId, status, transactionId, amount } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ error: 'Missing orderId or status in webhook payload' });
  }

  console.log(`[Payment-Webhook] orderId=${orderId}  status=${status}  providerRef=${transactionId}`);

  try {
    // 1. Look up the pending transaction by provider_ref (our orderId)
    const txRes = await query(
      `SELECT id, user_id, amount FROM transactions WHERE provider_ref = $1`,
      [orderId]
    );

    if (txRes.rows.length === 0) {
      console.warn(`[Payment-Webhook] No transaction found for orderId: ${orderId}`);
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const tx = txRes.rows[0];

    if (status === 'success') {
      // 2a. Mark transaction as successful, store provider's own transaction ID
      await query(
        `UPDATE transactions
         SET status = 'success', provider_ref = $1
         WHERE id = $2`,
        [transactionId || orderId, tx.id]
      );

      // 2b. Calculate credits to award
      const paidAmount = parseFloat(amount ?? tx.amount);
      const creditsToAdd = creditsFromAmount(paidAmount);

      // 2c. Add credits to user's balance
      await query(
        `UPDATE user_profiles
         SET credit_balance = credit_balance + $1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2`,
        [creditsToAdd, tx.user_id]
      );

      console.log(`[Payment-Webhook] ✅ Credited ${creditsToAdd} credits to user ${tx.user_id} (order ${orderId})`);

      // 2d. Log credit event in usage_events for audit trail
      await query(
        `INSERT INTO usage_events (user_id, event_type, metadata)
         VALUES ($1, 'credit_topup', $2)`,
        [tx.user_id, JSON.stringify({ orderId, credits: creditsToAdd, amount: paidAmount, transactionId })]
      );

      // 2e. Notify Gateway to confirm to the user on their platform
      try {
        const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:3000';
        await axios.post(`${gatewayUrl}/api/v1/internal/notify-user`, {
          userId:  tx.user_id,
          message: `✅ Top-up successful! ${creditsToAdd} credits have been added to your account.`,
        }, { timeout: 5000 });
      } catch (notifyErr: any) {
        // Non-fatal — the credits are already added; the user will see balance on next query
        console.warn(`[Payment-Webhook] Could not notify user ${tx.user_id}:`, notifyErr.message);
      }

    } else {
      // 3. Mark as failed
      await query(
        `UPDATE transactions SET status = 'failed' WHERE id = $1`,
        [tx.id]
      );
      console.log(`[Payment-Webhook] ❌ Payment failed for order ${orderId}`);
    }

    return res.status(200).json({ status: 'OK' });

  } catch (err: any) {
    console.error('[Payment-Webhook] Error processing webhook:', err.message);
    return res.status(500).json({ error: 'Failed to process payment webhook' });
  }
};
