import { Request, Response } from 'express';
import { KHQRService, KHQRData } from '../services/khqr_service';
import { ConfigService } from '../services/config_service';

export const requestTopUp = async (req: Request, res: Response) => {
  try {
    const { userId, packageId, amount, currency, platform } = req.body;

    // 1. Validate input
    if (!userId || !amount || !packageId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 2. Create Order in Database
    const orderId = `LSCM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // TODO: Insert into transactions table with 'pending' status

    const bakongId = await ConfigService.get('bakong_id', 'lifestyle_machine@wing');

    // 3. Generate KHQR for External Platforms (Messenger/Telegram)
    const khqrData: KHQRData = {
      bakongId: bakongId!,
      merchantName: 'Lifestyle Machine',
      merchantCity: 'Phnom Penh',
      amount: amount,
      currency: currency || 'USD',
      orderId: orderId
    };

    const khqrString = KHQRService.generateKHQRString(khqrData);
    const qrCodeImage = await KHQRService.generateQRCodeBase64(khqrString);

    return res.status(200).json({
      orderId,
      khqrString,
      qrCodeImage,
      message: 'Please scan the QR code to complete your top-up.'
    });

  } catch (error: any) {
    console.error('[Payment-Controller] Top-up error:', error.message);
    res.status(500).json({ error: 'Failed to initiate top-up' });
  }
};

export const handlePaymentWebhook = async (req: Request, res: Response) => {
  // Logic to receive confirmation from Wing or Bakong
  const { orderId, status, transactionId } = req.body;

  console.log(`[Payment-Webhook] Received payment for Order: ${orderId}, Status: ${status}`);

  // TODO: Update transaction status in DB
  // TODO: If success, add credits to user_profiles table
  // TODO: Notify Gateway/User via Webhook

  return res.status(200).json({ status: 'OK' });
};
