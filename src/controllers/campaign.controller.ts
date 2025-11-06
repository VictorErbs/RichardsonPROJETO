import { Request, Response } from 'express';
import prisma from '../config/database';

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      emailSubject,
      emailBody,
      senderName,
      senderEmail,
      targetUrl,
      difficulty,
      points
    } = req.body;

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        emailSubject,
        emailBody,
        senderName,
        senderEmail,
        targetUrl,
        difficulty: difficulty || 'EASY',
        points: points || 10
      }
    });

    res.status(201).json({
      message: 'Campanha criada com sucesso',
      campaign
    });
  } catch (error) {
    console.error('Erro ao criar campanha:', error);
    res.status(500).json({ error: 'Erro ao criar campanha' });
  }
};

export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            emailLogs: true
          }
        }
      }
    });

    res.json({ campaigns });
  } catch (error) {
    console.error('Erro ao buscar campanhas:', error);
    res.status(500).json({ error: 'Erro ao buscar campanhas' });
  }
};

export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        emailLogs: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            clicks: true
          }
        }
      }
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    res.json({ campaign });
  } catch (error) {
    console.error('Erro ao buscar campanha:', error);
    res.status(500).json({ error: 'Erro ao buscar campanha' });
  }
};

export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const campaign = await prisma.campaign.update({
      where: { id },
      data
    });

    res.json({
      message: 'Campanha atualizada com sucesso',
      campaign
    });
  } catch (error) {
    console.error('Erro ao atualizar campanha:', error);
    res.status(500).json({ error: 'Erro ao atualizar campanha' });
  }
};

export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.campaign.delete({
      where: { id }
    });

    res.json({ message: 'Campanha deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar campanha:', error);
    res.status(500).json({ error: 'Erro ao deletar campanha' });
  }
};

export const sendCampaignEmails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userIds } = req.body; // Array de IDs de usuários ou vazio para enviar para todos

    const campaign = await prisma.campaign.findUnique({
      where: { id }
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    // Buscar usuários
    const users = await prisma.user.findMany({
      where: userIds && userIds.length > 0 ? { id: { in: userIds } } : {}
    });

    // Importar serviço de e-mail dinamicamente
    const emailService = await import('../services/email.service');

    // Enviar e-mails
    const results = await Promise.all(
      users.map(user => emailService.sendPhishingEmail(user, campaign))
    );

    const successCount = results.filter(r => r.success).length;

    res.json({
      message: `E-mails enviados: ${successCount} de ${users.length}`,
      sent: successCount,
      total: users.length
    });
  } catch (error) {
    console.error('Erro ao enviar e-mails:', error);
    res.status(500).json({ error: 'Erro ao enviar e-mails da campanha' });
  }
};
