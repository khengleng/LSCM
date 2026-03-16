import app from './app';
import { ConfigService } from './services/config_service';

const PORT = process.env.PORT || 3000;

ConfigService.warmup().then(() => {
  app.listen(PORT, () => {
    console.log(`[Gateway] Service running on port ${PORT}`);
    console.log(`[Gateway] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});
