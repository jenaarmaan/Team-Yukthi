import path from 'path';
import fs from 'fs';
import { createApp } from './app.ts';
import { config } from './config/env.ts';
import { logger } from './utils/logger.ts';
import { initializeDatabaseSeed } from './services/seedService.ts';

export const startServer = async () => {
  const app = createApp();
  const PORT = config.port;
  const isDev = config.nodeEnv !== 'production';

  // Seed baseline drives, demo personas, interviewers, and recoveries into Firestore
  await initializeDatabaseSeed();


  if (isDev) {
    logger.info('Initializing Vite development middleware...');
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      // Vite middlewares handle HMR and serve index.html / client assets
      app.use(vite.middlewares);
      logger.info('Vite development server middleware mounted successfully.');
    } catch (err) {
      logger.error('Failed to initialize Vite development middleware:', err);
      throw err;
    }
  } else {
    logger.info('Configuring production static file serving...');
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use((await import('express')).default.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
      logger.info(`Serving production client bundle from: ${distPath}`);
    } else {
      logger.warn(`Production dist folder not found at ${distPath}. Run 'npm run build' first.`);
    }
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`=======================================================`);
    logger.info(`🚀 NIYOJAN Unified Server running on port ${PORT}`);
    logger.info(`🌐 Mode: ${config.nodeEnv}`);
    logger.info(`📍 Local: http://localhost:${PORT}`);
    logger.info(`📡 API Base: http://localhost:${PORT}/api/v1`);
    logger.info(`🩺 Health: http://localhost:${PORT}/api/v1/health`);
    logger.info(`💾 Database: http://localhost:${PORT}/api/v1/health/database`);
    logger.info(`ℹ️  System Info: http://localhost:${PORT}/api/v1/system/info`);
    logger.info(`=======================================================`);
  });

  const handleShutdown = (signal: string) => {
    logger.info(`Received ${signal}. Gracefully shutting down NIYOJAN server...`);
    server.close(() => {
      logger.info('HTTP server closed. Exiting process.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  return server;
};

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('server.ts')) {
  startServer().catch((err) => {
    logger.error('Fatal startup error in NIYOJAN server:', err);
    process.exit(1);
  });
}
