import prisma from '../config/database';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

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

    // Criar usuários de teste
    const testUsers = [
      { name: 'João Silva', email: 'joao@teste.com' },
      { name: 'Maria Santos', email: 'maria@teste.com' },
      { name: 'Pedro Oliveira', email: 'pedro@teste.com' }
    ];

    for (const userData of testUsers) {
      const password = await bcrypt.hash('teste123', 10);
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          ...userData,
          password,
          role: 'USER'
        }
      });
      console.log('✅ Usuário criado:', userData.email);
    }

    // Criar campanhas de exemplo
    const campaigns = [
      {
        title: 'Phishing Banco - Nível Fácil',
        description: 'Simulação de e-mail de banco solicitando atualização de dados',
        emailSubject: '⚠️ Ação necessária: Atualize seus dados cadastrais',
        emailBody: `
          <h2>Olá, {name}!</h2>
          <p>Identificamos uma pendência em seu cadastro.</p>
          <p><strong>Sua conta será bloqueada em 24 horas</strong> caso não atualize seus dados.</p>
          <p><a href="{link}" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">ATUALIZAR DADOS AGORA</a></p>
          <p>Atenciosamente,<br>Banco Seguro</p>
        `,
        senderName: 'Banco Seguro',
        senderEmail: 'noreply@bancoseguro.com',
        targetUrl: 'http://localhost:3000/fake-bank-login.html',
        difficulty: 'EASY',
        points: 10
      },
      {
        title: 'Phishing Netflix - Nível Médio',
        description: 'E-mail falso sobre problema no pagamento da Netflix',
        emailSubject: 'Problema com seu pagamento - Netflix',
        emailBody: `
          <div style="font-family:Arial,sans-serif;">
            <h2>Olá {name},</h2>
            <p>Tivemos um problema ao processar seu pagamento.</p>
            <p>Para evitar a suspensão da sua conta, atualize suas informações de pagamento:</p>
            <p><a href="{link}" style="background:#e50914;color:white;padding:12px 24px;text-decoration:none;border-radius:3px;">Atualizar Pagamento</a></p>
            <p style="color:#666;font-size:12px;">Se você não reconhece esta atividade, entre em contato conosco.</p>
          </div>
        `,
        senderName: 'Netflix',
        senderEmail: 'info@netflix.com',
        targetUrl: 'http://localhost:3000/fake-netflix-login.html',
        difficulty: 'MEDIUM',
        points: 20
      },
      {
        title: 'Phishing Email Corporativo - Nível Difícil',
        description: 'E-mail muito realista simulando TI da empresa',
        emailSubject: 'RH: Atualização obrigatória de senha',
        emailBody: `
          <div style="font-family:Arial,sans-serif;">
            <p>Prezado(a) {name},</p>
            <p>Por determinação da diretoria de TI, todos os colaboradores devem atualizar suas senhas até <strong>hoje às 18h</strong>.</p>
            <p>Esta medida visa aumentar a segurança de nossos sistemas.</p>
            <p><a href="{link}">Clique aqui para atualizar sua senha</a></p>
            <p>Em caso de dúvidas, entre em contato com o ramal 1234.</p>
            <br>
            <p>Atenciosamente,<br><strong>Equipe de TI</strong><br>Departamento de Tecnologia da Informação</p>
          </div>
        `,
        senderName: 'TI - Recursos Humanos',
        senderEmail: 'ti@empresa.com.br',
        targetUrl: 'http://localhost:3000/fake-corporate-login.html',
        difficulty: 'HARD',
        points: 30
      }
    ];

    for (const campaignData of campaigns) {
      await prisma.campaign.upsert({
        where: { title: campaignData.title },
        update: {},
        create: campaignData
      });
      console.log('✅ Campanha criada:', campaignData.title);
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
