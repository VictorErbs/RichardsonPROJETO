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
    const { campaignId } = req.params;
    const { username, password, userId } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    // Registrar a submissão
    const submission = await prisma.submission.create({
      data: {
        userId,
        campaignId,
        username,
        password, // Armazenar como texto (é simulação)
        ipAddress,
        userAgent
      },
      include: {
        user: true
      }
    });

    // Enviar e-mail educativo
    const emailService = await import('../services/email.service');
    await emailService.sendEducationalEmail(submission.user, campaign, 'submission');

    res.json({
      message: 'Dados recebidos',
      warning: '⚠️ ATENÇÃO: Você caiu em um phishing simulado! Verifique seu e-mail.'
    });
  } catch (error) {
    console.error('Erro ao rastrear submissão:', error);
    res.status(500).json({ error: 'Erro ao processar dados' });
  }
};
