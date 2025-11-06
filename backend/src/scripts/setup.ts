import prisma from '../config/database';

(async () => {
  try {
    const campaign = await prisma.campaign.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!campaign) throw new Error('Nenhuma campanha encontrada. Rode o seed primeiro.');

    const updated = await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        autoSend: true,
        cron: '*/5 * * * *', // a cada 5 minutos
      },
    });

    console.log('✅ Campanha habilitada para auto envio:', updated.title, updated.cron);
    process.exit(0);
  } catch (e) {
    console.error('❌ Erro no setup:', e);
    process.exit(1);
  }
})();
