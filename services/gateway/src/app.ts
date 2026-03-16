import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
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
