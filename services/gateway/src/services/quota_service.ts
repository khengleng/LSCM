import { UserContext } from '../types/auth';
import { query } from './db_service';

export class QuotaService {
  /**
   * Checks and deducts user quota.
   * Free users: 3 daily questions.
   * Premium users: 10 daily questions.
   * Credits: 1 credit per question if daily limit reached.
   */
  static async checkAndDeductQuota(user: UserContext, actionType: 'QUERY' | 'READING'): Promise<{ allowed: boolean; remaining: number }> {
    console.log(`[Quota-Service] Checking quota for User: ${user.userId}`);

    // 1. Fetch user profile and subscription
    const profileRes = await query(
      `SELECT p.credit_balance, s.plan_name 
       FROM user_profiles p 
       LEFT JOIN subscriptions s ON p.user_id = s.user_id AND s.status = 'active'
       WHERE p.user_id = $1`,
      [user.userId]
    );

    if (profileRes.rows.length === 0) return { allowed: false, remaining: 0 };

    const { credit_balance, plan_name } = profileRes.rows[0];
    const isPremium = plan_name === 'premium';
    const dailyLimit = isPremium ? 10 : 3;

    // 2. Check daily usage (Mocked for now, in production use Redis or usage_events table)
    const usageCountRes = await query(
      `SELECT COUNT(*) FROM usage_events WHERE user_id = $1 AND created_at >= CURRENT_DATE`,
      [user.userId]
    );
    const usageToday = parseInt(usageCountRes.rows[0].count);

    if (usageToday < dailyLimit) {
      // Allow under daily limit
      await this.logUsage(user.userId, actionType, 0);
      return { allowed: true, remaining: dailyLimit - usageToday - 1 };
    }

    // 3. Fallback to credits
    if (credit_balance > 0) {
      await query(
        `UPDATE user_profiles SET credit_balance = credit_balance - 1 WHERE user_id = $1`,
        [user.userId]
      );
      await this.logUsage(user.userId, actionType, 1);
      return { allowed: true, remaining: credit_balance - 1 };
    }

    return { allowed: false, remaining: 0 };
  }

  private static async logUsage(userId: string, type: string, cost: number) {
    await query(
      `INSERT INTO usage_events (user_id, request_type, estimated_cost) VALUES ($1, $2, $3)`,
      [userId, type, cost]
    );
  }
}
