import nodemailer from 'nodemailer';
import prisma from '../config/database';

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

interface User {
  id: string;
  name: string;
  email: string;
}

interface Campaign {
  id: string;
  title: string;
  emailSubject: string;
  emailBody: string;
  senderName: string;
  senderEmail: string;
  targetUrl: string;
}

export const sendPhishingEmail = async (user: User, campaign: Campaign) => {
  try {
    // Criar log do e-mail
    const emailLog = await prisma.emailLog.create({
      data: {
        userId: user.id,
        campaignId: campaign.id
      }
    });

    // Gerar URLs de tracking
    const trackingUrl = `${process.env.BACKEND_URL}/api/tracking/click/${emailLog.id}`;
    const openTrackingUrl = `${process.env.BACKEND_URL}/api/tracking/open/${emailLog.id}`;

    // Substituir variáveis no template
    let emailBody = campaign.emailBody
      .replace(/\{name\}/g, user.name)
      .replace(/\{email\}/g, user.email)
      .replace(/\{link\}/g, trackingUrl);

    // Adicionar pixel de tracking
    emailBody += `<img src="${openTrackingUrl}" width="1" height="1" style="display:none;" />`;

    // Enviar e-mail
    await transporter.sendMail({
      from: `"${campaign.senderName}" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: campaign.emailSubject,
      html: emailBody,
      replyTo: campaign.senderEmail
    });

    console.log(`✅ E-mail de phishing enviado para ${user.email}`);
    return { success: true, emailLogId: emailLog.id };
  } catch (error) {
    console.error(`❌ Erro ao enviar e-mail para ${user.email}:`, error);
    return { success: false, error };
  }
};

export const sendEducationalEmail = async (
  user: User,
  campaign: Campaign,
  action: 'click' | 'submission'
) => {
  try {
    const actionText = action === 'click' 
      ? 'clicou no link suspeito'
      : 'inseriu suas credenciais em um site falso';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d32f2f; color: white; padding: 20px; text-align: center; }
          .content { background: #f5f5f5; padding: 20px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .tips { background: white; padding: 20px; margin: 20px 0; }
          .tip { margin: 10px 0; padding-left: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          h1 { margin: 0; }
          h2 { color: #d32f2f; }
          .btn { display: inline-block; padding: 10px 20px; background: #1976d2; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ ALERTA DE SEGURANÇA</h1>
          </div>
          
          <div class="content">
            <h2>Você acabou de cair em um phishing simulado!</h2>
            
            <div class="warning">
              <strong>O que aconteceu?</strong><br>
              Você ${actionText} da campanha "<strong>${campaign.title}</strong>".
              <br><br>
              ⚠️ Se este fosse um ataque real, seus dados poderiam ter sido comprometidos!
            </div>

            <div class="tips">
              <h3>🛡️ Como identificar um e-mail de phishing:</h3>
              
              <div class="tip">
                <strong>1. Verifique o remetente</strong><br>
                Confira se o domínio do e-mail é legítimo (ex: @banco.com vs @banca.com)
              </div>
              
              <div class="tip">
                <strong>2. Passe o mouse sobre os links</strong><br>
                Antes de clicar, veja para onde o link realmente aponta
              </div>
              
              <div class="tip">
                <strong>3. Desconfie de urgência</strong><br>
                Phishing usa táticas de pressão: "Sua conta será bloqueada em 24h!"
              </div>
              
              <div class="tip">
                <strong>4. Erros de português</strong><br>
                E-mails profissionais raramente têm erros gramaticais
              </div>
              
              <div class="tip">
                <strong>5. Pedidos de informações sensíveis</strong><br>
                Bancos NUNCA pedem senha por e-mail
              </div>
            </div>

            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">
                Ver meu Progresso
              </a>
            </p>
          </div>
          
          <div class="footer">
            <p>Este é um e-mail educativo do Simulador de Phishing</p>
            <p>Seu objetivo é treinar você a identificar ataques reais</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Simulador de Phishing - Educação" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: '⚠️ Você caiu em um phishing simulado - Aprenda aqui!',
      html
    });

    console.log(`📧 E-mail educativo enviado para ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Erro ao enviar e-mail educativo:`, error);
    return { success: false, error };
  }
};

// Testar configuração de e-mail
export const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Servidor de e-mail conectado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao servidor de e-mail:', error);
    return false;
  }
};
