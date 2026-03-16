import { query } from './db_service';
import { UserContext, Platform } from '../types/auth';

export class UserRepository {
  /**
   * Finds or creates a user based on their platform ID.
   */
  static async findOrCreateUser(platformId: string, platform: Platform): Promise<UserContext> {
    const platformColumn = this.getPlatformColumn(platform);
    
    // 1. Try to find user
    const findRes = await query(
      `SELECT u.id, u.name, p.credit_balance 
       FROM users u 
       JOIN user_profiles p ON u.id = p.user_id 
       WHERE u.${platformColumn} = $1`,
      [platformId]
    );

    if (findRes.rows.length > 0) {
      const row = findRes.rows[0];
      return {
        userId: row.id,
        platform,
        platformId,
        name: row.name
      };
    }

    // 2. Create user if not found
    const insertUserRes = await query(
      `INSERT INTO users (${platformColumn}, name) VALUES ($1, $2) RETURNING id`,
      [platformId, `User_${platformId.substring(0, 5)}`]
    );
    const userId = insertUserRes.rows[0].id;

    await query(
      `INSERT INTO user_profiles (user_id, credit_balance) VALUES ($1, $2)`,
      [userId, 0] // Start with 0 credits
    );

    return {
      userId,
      platform,
      platformId,
      name: `User_${platformId.substring(0, 5)}`
    };
  }

  private static getPlatformColumn(platform: Platform): string {
    switch (platform) {
      case 'WING': return 'wing_user_id';
      case 'FACEBOOK': return 'fb_psid';
      case 'TELEGRAM': return 'telegram_id';
      default: return 'wing_user_id';
    }
  }
}
