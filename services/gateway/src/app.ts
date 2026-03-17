import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow images/resources across origins
}));
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow: no origin (server-to-server), custom domain, localhost, and any Railway app
    if (
      !origin ||
      origin === 'https://lifestyle.cambobia.com' ||
      origin.includes('railway.app') ||
      origin.startsWith('http://localhost')
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' not allowed`));
    }
  },
  credentials: true
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
