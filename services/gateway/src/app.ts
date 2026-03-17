import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

// 1. CORS (Must be at the very top to handle preflights)
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://lifestyle.cambobia.com',
      'http://localhost',
      'railway.app'
    ];

    const isAllowed = allowedOrigins.some(ao => origin.includes(ao));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(null, false); // Don't throw error, just disallow
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token', 'x-platform', 'x-platform-id']
}));

// 2. Security & Logging
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
app.use('/api/v1', routes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', service: 'Gateway' });
});

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'Lifestyle Machine API Gateway',
    version: '1.0.0'
  });
});

export default app;
