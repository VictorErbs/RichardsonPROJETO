import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// If using sqlite datasource, check the DB file exists to provide clearer developer guidance
const databaseUrl = process.env.DATABASE_URL ?? '';
if (databaseUrl.startsWith('file:')) {
  // Remove optional wrapping quotes
  const filePath = databaseUrl.replace(/^file:/, '').replace(/^['"]|['"]$/g, '');
  const absolutePath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`SQLite DB file not found at ${absolutePath}.`);
    console.error("Run 'npx prisma migrate dev' (or 'npm run prisma:migrate') and then 'npm run seed' in the backend folder to create the database.");
  }
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'minimal',
});

// Otimização: fechar conexões ao encerrar processo
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
