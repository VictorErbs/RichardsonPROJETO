import cron from 'node-cron';
import prisma from '../config/database';
import { sendPhishingEmail } from '../services/email.service';

// Simple guard to prevent overlapping runs
let isRunning = false;

export const processAutoCampaigns = async () => {
  if (isRunning) {
    console.log('⏳ Scheduler: run skipped to avoid overlap');
    return;
  }
  isRunning = true;
  try {
    const now = new Date();

    // Fetch campaigns configured for auto send
    const campaigns = await prisma.campaign.findMany({
      where: {
        active: true,
        autoSend: true,
      },
    });

    for (const campaign of campaigns) {
      // If campaign has lastSentAt, avoid sending too frequently (e.g., more than once per day)
      if (campaign.lastSentAt) {
        const diffHours = (now.getTime() - campaign.lastSentAt.getTime()) / (1000 * 60 * 60);
        if (diffHours < 23.5) continue; // throttle ~daily
      }

      // Send to all users (you can filter target audiences here)
      // Otimização: buscar apenas campos necessários
      const users = await prisma.user.findMany({ 
        where: { role: 'USER' },
        select: {
          id: true,
          name: true,
          email: true
        }
      });

      // Otimização: enviar em lotes de 10 para não sobrecarregar
      const batchSize = 10;
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map((user) => sendPhishingEmail(user as any, campaign as any))
        );
        
        const successCount = results.filter((r) => (r as any).success).length;
        console.log(`📨 Batch ${Math.floor(i / batchSize) + 1}: ${successCount}/${batch.length} sent`);
        
        // Aguardar 2 segundos entre lotes
        if (i + batchSize < users.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      console.log(`✅ Scheduler: campaign "${campaign.title}" completed`);

      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { lastSentAt: new Date() },
      });
    }
  } catch (err) {
    console.error('❌ Scheduler error:', err);
  } finally {
    isRunning = false;
  }
};

export const initializeScheduler = async () => {
  const defaultCron = process.env.CRON_DEFAULT || '0 9 * * *'; // everyday at 09:00

  // Global default schedule: process all auto campaigns
  cron.schedule(defaultCron, async () => {
    console.log('⏰ Scheduler tick (default)');
    await processAutoCampaigns();
  });

  console.log(`🗓️  Scheduler initialized with default CRON: ${defaultCron}`);
};
