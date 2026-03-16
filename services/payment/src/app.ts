import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/payment', routes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', service: 'Payment' });
});

export default app;
