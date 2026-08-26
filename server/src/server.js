import app from './app.js';
import { ENV } from './config/env.js';
import prisma from './config/prisma.js';

const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ SQLite/PostgreSQL Database connected successfully via Prisma.');

    const server = app.listen(ENV.PORT, () => {
      console.log(`🚀 ResumeIQ AI Backend Server running on port ${ENV.PORT}`);
      console.log(`📡 Healthcheck available at: http://localhost:${ENV.PORT}/api/health`);
    });

    // Graceful Shutdown Handlers
    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        console.log('🔒 HTTP server closed.');
        await prisma.$disconnect();
        console.log('📦 Database connections closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
