import { PrismaClient } from '@prisma/client';
import { ENV } from './env.js';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ENV.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (ENV.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
