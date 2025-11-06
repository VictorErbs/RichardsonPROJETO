import { Request, Response } from 'express';
import prisma from '../config/database';

export const trackClick = async (req: Request, res: Response) => {
  try {
    const { emailLogId } = req.params;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    // Buscar o emailLog
    const emailLog = await prisma.emailLog.findUnique({
      where: { id: emailLogId },
      include: {
        campaign: true,
        user: true
      }
    });

    if (!emailLog) {
      return res.status(404).send('Link inválido');
    }

    // Registrar o clique
    await prisma.click.create({
      data: {
        userId: emailLog.userId,
        emailLogId: emailLog.id,
        ipAddress,
        userAgent
      }
    });

    // Enviar e-mail educativo
    const emailService = await import('../services/email.service');
    await emailService.sendEducationalEmail(emailLog.user, emailLog.campaign, 'click');

    // Redirecionar para a página fake
    res.redirect(emailLog.campaign.targetUrl);
  } catch (error) {
    console.error('Erro ao rastrear clique:', error);
    res.status(500).send('Erro ao processar clique');
  }
};

export const trackEmailOpen = async (req: Request, res: Response) => {
  try {
    const { emailLogId } = req.params;

    await prisma.emailLog.update({
      where: { id: emailLogId },
      data: {
        opened: true,
        openedAt: new Date()
      }
    });

    // Retornar pixel transparente 1x1
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length
    });
    res.end(pixel);
  } catch (error) {
    console.error('Erro ao rastrear abertura:', error);
    res.status(500).end();
  }
};

export const trackSubmission = async (req: Request, res: Response) => {
  try {
    const { emailLogId } = req.params;
    const { username, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    // Buscar o emailLog com usuário e campanha
    const emailLog = await prisma.emailLog.findUnique({
      where: { id: emailLogId },
      include: {
        campaign: true,
        user: true
      }
    });

    if (!emailLog) {
      return res.status(404).json({ error: 'Link inválido' });
    }

    // Registrar a submissão
    const submission = await prisma.submission.create({
      data: {
        userId: emailLog.userId,
        campaignId: emailLog.campaignId,
        username,
        password, // Armazenar como texto (é simulação)
        ipAddress,
        userAgent
      }
    });

    // Enviar e-mail educativo
    const emailService = await import('../services/email.service');
    await emailService.sendEducationalEmail(emailLog.user, emailLog.campaign, 'submission');

    res.json({
      message: 'Dados recebidos',
      warning: '⚠️ ATENÇÃO: Você caiu em um phishing simulado! Verifique seu e-mail.'
    });
  } catch (error) {
    console.error('Erro ao rastrear submissão:', error);
    res.status(500).json({ error: 'Erro ao processar dados' });
  }
};
