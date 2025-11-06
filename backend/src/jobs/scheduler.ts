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
      const users = await prisma.user.findMany({ where: {} });
      const results = await Promise.all(
        users.map((user) => sendPhishingEmail(user as any, campaign as any))
      );

      const successCount = results.filter((r) => (r as any).success).length;
      console.log(`📨 Scheduler: campaign "${campaign.title}" sent to ${successCount}/${users.length}`);

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
