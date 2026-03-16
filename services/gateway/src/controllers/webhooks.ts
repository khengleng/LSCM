import { Request, Response } from 'express';
import axios from 'axios';

/**
 * Controller for handling Messenger and Telegram Webhooks.
 */
export const handleFacebookWebhook = (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
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

/**
 * Internal message mapping and forwarding to AI Orchestrator.
 */
const handleIncomingMessage = async (platformId: string, message: any, platform: string) => {
  try {
    const orchestratorUrl = process.env.ORCHESTRATOR_URL || 'http://localhost:8000';
    
    // Check if voice or text
    let payload = {
      platform,
      platformId,
      text: message.text || null,
      voice_url: message.voice?.file_id || message.attachments?.[0]?.payload?.url || null,
    };

    console.log(`[Gateway] Dispatching ${platform} request to Orchestrator:`, platformId);
    
    // Forward to Python Orchestrator
    const response = await axios.post(`${orchestratorUrl}/api/v1/query`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    // TODO: Send reply back to Messaging Platform
  } catch (err: any) {
    console.error(`[Gateway] Error forwarding message from ${platformId}:`, err.message);
  }
};
