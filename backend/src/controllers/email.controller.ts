import { Request, Response } from 'express';
import { sendRawEmail, testEmailConnection } from '../services/email.service';

export const sendTestEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, html, from } = req.body;

    if (!to) return res.status(400).json({ error: 'Campo "to" é obrigatório' });

    await sendRawEmail({
      to,
      subject: subject || 'Hello World',
      html: html || '<p>Congrats on sending your <strong>first email</strong>!</p>',
      from: from || 'onboarding@resend.dev',
    });

    res.json({ message: 'Email enviado com sucesso via provider configurado' });
  } catch (error: any) {
    console.error('Erro ao enviar e-mail de teste:', error);
    res.status(500).json({ error: error?.message || 'Erro ao enviar e-mail' });
  }
};

export const verifyEmailProvider = async (_req: Request, res: Response) => {
  try {
    const ok = await testEmailConnection();
    res.json({ ok });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error?.message });
  }
};
