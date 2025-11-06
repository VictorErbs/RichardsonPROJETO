import { PrismaClient } from '@prisma/client';
import { sendPhishingEmail } from '../services/email.service';

const prisma = new PrismaClient();

async function main() {
  const campaigns = await prisma.campaign.findMany({ where: { autoSend: true } });

  if (!campaigns || campaigns.length === 0) {
    console.log('No campaigns found with autoSend=true');
    return;
  }

  for (const campaign of campaigns) {
    console.log(`Processing campaign ${campaign.id} - ${campaign.title}`);

    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users to send to.`);

    for (const user of users) {
      try {
        await sendPhishingEmail(user as any, campaign as any);
        console.log(`Sent to ${user.email}`);
      } catch (err) {
        console.error(`Failed to send to ${user.email}:`, err instanceof Error ? err.message : err);
      }
    }

    // After sending once, disable autoSend and mark lastSentAt
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { autoSend: false, lastSentAt: new Date() },
    });

    console.log(`Campaign ${campaign.id} sent once and autoSend disabled.`);
  }
}

main()
  .catch((e) => {
    console.error('Script failed:', e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
