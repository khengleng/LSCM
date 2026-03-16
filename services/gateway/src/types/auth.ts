import { Request } from 'express';

export type Platform = 'WING' | 'FACEBOOK' | 'TELEGRAM';

export interface UserContext {
  userId: string; // Internal User ID (UUID)
  platform: Platform;
  platformId: string; // The ID from WingID, FB PSID, or Telegram ID
  name?: string;
}

export interface AuthRequest extends Request {
  user?: UserContext;
}
