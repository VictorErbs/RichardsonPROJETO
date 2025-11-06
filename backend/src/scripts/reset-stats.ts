import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Resetando estatísticas...');

  // Deletar todos os registros de tracking
  const deletedClicks = await prisma.click.deleteMany();
  console.log(`✅ ${deletedClicks.count} cliques deletados`);

  const deletedSubmissions = await prisma.submission.deleteMany();
  console.log(`✅ ${deletedSubmissions.count} submissões deletadas`);

  const deletedEmailLogs = await prisma.emailLog.deleteMany();
  console.log(`✅ ${deletedEmailLogs.count} logs de email deletados`);

  // Resetar pontos e níveis dos usuários (mantém usuários, apenas reseta stats)
  const updatedUsers = await prisma.user.updateMany({
    data: {
      points: 0,
      level: 1,
    },
  });
  console.log(`✅ ${updatedUsers.count} usuários resetados (pontos=0, level=1)`);

  // Resetar lastSentAt das campanhas
  const updatedCampaigns = await prisma.campaign.updateMany({
    data: {
      lastSentAt: null,
    },
  });
  console.log(`✅ ${updatedCampaigns.count} campanhas resetadas (lastSentAt=null)`);

  console.log('\n🎉 Estatísticas resetadas com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao resetar estatísticas:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
