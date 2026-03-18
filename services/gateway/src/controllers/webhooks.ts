import { Request, Response } from 'express';
import axios from 'axios';
import { ConfigService } from '../services/config_service';

/**
 * Controller for handling Messenger and Telegram Webhooks.
 */
export const handleFacebookWebhook = (req: Request, res: Response) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Verification Step
  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.FB_VERIFY_TOKEN) {
      console.log('[FB-Webhook] Verified successfully');
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  // Handle Incoming Event
  const body = req.body;
  if (body.object === 'page') {
    body.entry.forEach((entry: any) => {
      const webhook_event = entry.messaging[0];
      console.log('[FB-Webhook] Received Event:', webhook_event);

      const sender_psid = webhook_event.sender.id;
      if (webhook_event.message) {
        handleIncomingMessage(sender_psid, webhook_event.message, 'FACEBOOK');
      }
    });
    return res.status(200).send('EVENT_RECEIVED');
  } else {
    return res.sendStatus(404);
  }
};

export const handleTelegramWebhook = (req: Request, res: Response) => {
  const body = req.body;
  if (body.message) {
    const telegram_id = body.message.chat.id;
    console.log('[TG-Webhook] Received Event from Chat:', telegram_id);
    handleIncomingMessage(telegram_id, body.message, 'TELEGRAM');
  }
  return res.status(200).send('OK');
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal: Send message back to Facebook Messenger
// ─────────────────────────────────────────────────────────────────────────────
const sendFacebookMessage = async (recipientId: string, text: string, audioUrl?: string) => {
  const pageToken = await ConfigService.get('facebook_messenger_page_token')
    || process.env.FB_PAGE_TOKEN;

  if (!pageToken) {
    console.error('[FB-Reply] No Facebook Page Token configured. Cannot send reply.');
    return;
  }

  const FB_API = 'https://graph.facebook.com/v18.0/me/messages';

  // Send text response
  await axios.post(FB_API, {
    recipient: { id: recipientId },
    message:   { text },
  }, { params: { access_token: pageToken } });

  // Audio: only send if it's a real hosted URL (not a data: URI)
  // Facebook requires publicly accessible URLs for audio attachments
  if (audioUrl && audioUrl.startsWith('http')) {
    await axios.post(FB_API, {
      recipient: { id: recipientId },
      message: {
        attachment: {
          type:    'audio',
          payload: { url: audioUrl, is_reusable: false },
        },
      },
    }, { params: { access_token: pageToken } });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal: Send message back to Telegram
// ─────────────────────────────────────────────────────────────────────────────
const sendTelegramMessage = async (chatId: string | number, text: string, audioUrl?: string) => {
  const botToken = await ConfigService.get('telegram_bot_token')
    || process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.error('[TG-Reply] No Telegram Bot Token configured. Cannot send reply.');
    return;
  }

  const TG_API = `https://api.telegram.org/bot${botToken}`;

  // Send text response
  await axios.post(`${TG_API}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  });

  // Send audio if present
  if (audioUrl) {
    if (audioUrl.startsWith('data:audio')) {
      // TTS returned a base64 data URI — decode and upload directly as a file
      // Telegram's sendVoice accepts multipart/form-data file uploads
      try {
        const base64Data = audioUrl.split(',')[1];
        const audioBuffer = Buffer.from(base64Data, 'base64');
        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('chat_id', String(chatId));
        form.append('voice', audioBuffer, { filename: 'voice.mp3', contentType: 'audio/mp3' });
        await axios.post(`${TG_API}/sendVoice`, form, {
          headers: form.getHeaders(),
        });
      } catch (audioErr: any) {
        console.warn('[TG-Reply] Could not send voice audio:', audioErr.message);
      }
    } else if (audioUrl.startsWith('http')) {
      // Hosted URL — send directly
      await axios.post(`${TG_API}/sendVoice`, {
        chat_id: chatId,
        voice:   audioUrl,
      });
    }
  }
};

import { UserRepository } from '../services/user_repository';
import { QuotaService } from '../services/quota_service';
import { query } from '../services/db_service';
import { Platform } from '../types/auth';

// ─────────────────────────────────────────────────────────────────────────────
// Main message handler: receive → authenticate → orchestrate → reply
// ─────────────────────────────────────────────────────────────────────────────
const handleIncomingMessage = async (
  platformId: string,
  message:    any,
  platform:   Platform,
) => {
  try {
    // 1. Authenticate / Identify User
    const user = await UserRepository.findOrCreateUser(platformId, platform);

    // 2. Enforce Daily Quota / Credit Check
    const actionType = (message.text?.toLowerCase().includes('reading') || !!message.photo || !!message.attachments) ? 'READING' : 'QUERY';
    const { allowed, remaining } = await QuotaService.checkAndDeductQuota(user, actionType);

    if (!allowed) {
      const outOfCreditsMsg = "⚠️ អ្នកបានប្រើប្រាស់កូតាឥតគិតថ្លៃអស់ហើយ។ សូមបញ្ចូលទឹកប្រាក់ (Top-up) ដើម្បីបន្តការសួរ! \n\n starter: $1 (5 questions) \n basic: $2 (15 questions)";
      if (platform === 'FACEBOOK') await sendFacebookMessage(platformId, outOfCreditsMsg);
      else if (platform === 'TELEGRAM') await sendTelegramMessage(platformId, outOfCreditsMsg);
      return;
    }

    // 3. Extract Multi-modal inputs (Image/Voice)
    let voice_url = null;
    let image_url = null;

    if (platform === 'TELEGRAM') {
      voice_url = message.voice?.file_id;
      if (message.photo) {
        // Telegram photos are an array of sizes, pick the largest
        const largestPhoto = message.photo[message.photo.length - 1];
        image_url = largestPhoto.file_id; 
        // Note: In production, you'd call getFile to get the actual public path
      }
    } else if (platform === 'FACEBOOK') {
      const attachment = message.attachments?.[0];
      if (attachment?.type === 'audio') voice_url = attachment.payload.url;
      if (attachment?.type === 'image') image_url = attachment.payload.url;
    }

    const orchestratorUrl = process.env.ORCHESTRATOR_URL || 'http://localhost:8000';

    const payload = {
      userId: user.userId,
      platform,
      platformId,
      text:      message.text || message.caption || null,
      voice_url,
      image_url
    };

    console.log(`[Gateway] Dispatching ${platform} request to Orchestrator for User: ${user.userId}`);

    // 4. Forward to AI Orchestrator
    const response = await axios.post(`${orchestratorUrl}/api/v1/query`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 45000,
    });

    const { response_text, audio_url, intent, transcript } = response.data;

    // 5. Log the journey (for the Admin Feed)
    await query(
      `INSERT INTO usage_events (user_id, event_type, metadata) 
       VALUES ($1, 'JOURNEY_STEP', $2)`,
      [user.userId, JSON.stringify({
        intent,
        platform,
        has_voice: !!voice_url,
        has_image: !!image_url,
        transcript,
        response_text,
        orchestration_time: new Date().toISOString()
      })]
    );

    // 6. Send Reply
    if (platform === 'FACEBOOK') {
      await sendFacebookMessage(platformId, response_text, audio_url);
    } else if (platform === 'TELEGRAM') {
      await sendTelegramMessage(platformId, response_text, audio_url);
    }

  } catch (err: any) {
    console.error(`[Gateway] Fatal Error for ${platformId}:`, err.message);
    const errorMsg = "សូមអភ័យទោស! ម៉ាស៊ីនជីវិតកំពុងមានបច្ចេកទេសបន្តិចបន្តួច។ សូមព្យាយាមម្តងទៀតនៅពេលបន្តិចទៀត!";
    if (platform === 'FACEBOOK') await sendFacebookMessage(platformId, errorMsg);
    else if (platform === 'TELEGRAM') await sendTelegramMessage(platformId, errorMsg);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal endpoint: Payment service notifications
// ─────────────────────────────────────────────────────────────────────────────
export const notifyUserOfPayment = async (req: Request, res: Response) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required' });
  }

  try {
    const userRes = await query(
      `SELECT fb_psid, telegram_id FROM users WHERE id = $1`,
      [userId]
    );

    if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const { fb_psid, telegram_id } = userRes.rows[0];
    const promises: Promise<any>[] = [];

    if (fb_psid)      promises.push(sendFacebookMessage(fb_psid,  message));
    if (telegram_id)  promises.push(sendTelegramMessage(telegram_id, message));

    await Promise.allSettled(promises);
    return res.status(200).json({ status: 'OK' });

  } catch (err: any) {
    console.error('[Gateway] Failed to notify user:', err.message);
    return res.status(500).json({ error: 'Failed' });
  }
};
