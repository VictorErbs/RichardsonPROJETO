import prisma from '../config/database';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Deletar todos os usuários, exceto campanhas
    await prisma.user.deleteMany();

    // Criar usuário admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@phishing.com' },
      update: {},
      create: {
        name: 'Administrador',
        email: 'admin@phishing.com',
        password: adminPassword,
        role: 'ADMIN',
        points: 0,
        level: 1
      }
    });
    console.log('✅ Admin criado:', admin.email);

    // Criar campanhas padrão
    const campaigns = [
      {
        title: 'Phishing Banco - Nível Fácil',
        description: 'Campanha simulando um e-mail de banco.',
        emailSubject: '⚠️ Ação necessária: Atualize seus dados cadastrais',
        emailBody: '<p>Olá, {name}. Atualize seus dados clicando <a href="{link}">aqui</a>.</p>',
        senderName: 'Banco Seguro',
        senderEmail: 'noreply@bancoseguro.com',
        targetUrl: 'http://localhost:3000/fake-bank-login.html',
        difficulty: 'EASY',
        points: 10
      },
      {
        title: 'Phishing Netflix - Nível Médio',
        description: 'Campanha simulando um e-mail da Netflix.',
        emailSubject: 'Atualize suas informações de pagamento',
        emailBody: '<p>Olá, {name}. Atualize suas informações clicando <a href="{link}">aqui</a>.</p>',
        senderName: 'Netflix',
        senderEmail: 'noreply@netflix.com',
        targetUrl: 'http://localhost:3000/fake-netflix-login.html',
        difficulty: 'MEDIUM',
        points: 20
      },
      {
        title: 'Phishing Corporativo - Nível Difícil',
        description: 'Campanha simulando um e-mail corporativo.',
        emailSubject: '⚠️ Atualização obrigatória de senha',
        emailBody: '<p>Olá, {name}. Atualize sua senha clicando <a href="{link}">aqui</a>.</p>',
        senderName: 'Equipe de TI',
        senderEmail: 'ti@empresa.com',
        targetUrl: 'http://localhost:3000/fake-corporate-login.html',
        difficulty: 'HARD',
        points: 30
      }
    ];

    for (const campaign of campaigns) {
      await prisma.campaign.upsert({
        where: { title: campaign.title },
        update: {},
        create: campaign
      });
      console.log(`✅ Campanha criada: ${campaign.title}`);
    }

    console.log('🎉 Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  }
};

// Executar seed se chamado diretamente
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seed finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro no seed:', error);
      process.exit(1);
    });
}
