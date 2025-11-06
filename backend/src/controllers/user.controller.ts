import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
        level: true,
        createdAt: true,
        _count: {
          select: {
            clicks: true,
            submissions: true,
            emailLogs: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ users });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        emailLogs: {
          include: {
            campaign: true,
            clicks: true
          }
        },
        clicks: true,
        submissions: {
          include: {
            user: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const stats = {
      emailsReceived: user.emailLogs.length,
      emailsOpened: user.emailLogs.filter(log => log.opened).length,
      linksClicked: user.clicks.length,
      credentialsSubmitted: user.submissions.length,
      points: user.points,
      level: user.level
    };

    res.json({ user, stats });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

export const getRanking = async (req: Request, res: Response) => {
  try {
    const ranking = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        level: true,
        _count: {
          select: {
            clicks: true,
            submissions: true
          }
        }
      },
      orderBy: { points: 'desc' },
      take: 50
    });

    res.json({ ranking });
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
};
