import { Request, Response } from 'express';
import { query } from '../services/db_service';
import { ConfigService } from '../services/config_service';

/**
 * Admin Controller for Business Operations
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Total Users
    const usersCount = await query('SELECT COUNT(*) FROM users');
    
    // 2. Total Transactions (Success)
    const revenueRes = await query("SELECT SUM(amount) FROM transactions WHERE status = 'success'");
    
    // 3. User interactions (Usage Events)
    const usageCount = await query('SELECT COUNT(*) FROM usage_events');

    res.status(200).json({
      total_users: usersCount.rows[0].count,
      total_revenue: revenueRes.rows[0].sum || 0,
      total_queries: usageCount.rows[0].count,
      active_threshold: 'Live'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

export const getAllConfigs = async (req: Request, res: Response) => {
  try {
    const configs = await query('SELECT * FROM system_configs ORDER BY category, key');
    res.status(200).json(configs.rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch configurations' });
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  const { key, value } = req.body;
  if (!key || value === undefined) return res.status(400).json({ error: 'Key and value required' });

  try {
    await ConfigService.set(key, value);
    res.status(200).json({ message: 'Configuration updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update configuration' });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await query(`
      SELECT t.*, u.name as user_name 
      FROM transactions t 
      JOIN users u ON t.user_id = u.id 
      ORDER BY t.created_at DESC 
      LIMIT 50
    `);
    res.status(200).json(transactions.rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};
