import nodemailer from 'nodemailer';

// Optional providers via dynamic import to avoid hard deps
let resendClient: any | null = null;

export type MailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export interface MailProvider {
  send(options: MailOptions): Promise<void>;
  verify?(): Promise<void>;
}

// Singleton pattern para reutilizar conexões
class SmtpProvider implements MailProvider {
  private static instance: SmtpProvider | null = null;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: true, // Usar connection pool
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000, // Taxa de envio
      rateLimit: 5, // 5 emails por segundo
    });
  }

  static getInstance(): SmtpProvider {
    if (!SmtpProvider.instance) {
      SmtpProvider.instance = new SmtpProvider();
    }
    return SmtpProvider.instance;
  }

  async send(options: MailOptions) {
    await this.transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
  }

  async verify() {
    await this.transporter.verify();
  }
}

class ResendProvider implements MailProvider {
  private static instance: ResendProvider | null = null;

  private constructor() {}

  static getInstance(): ResendProvider {
    if (!ResendProvider.instance) {
      ResendProvider.instance = new ResendProvider();
    }
    return ResendProvider.instance;
  }

  private async getClient() {
    if (!resendClient) {
      const { Resend } = await import('resend');
      resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return resendClient;
  }

  async send(options: MailOptions) {
    const client = await this.getClient();
    const result = await client.emails.send({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      reply_to: options.replyTo,
    });
    if (result.error) throw result.error;
  }
}

// Singleton para o provider
let cachedProvider: MailProvider | null = null;

export const getMailProvider = (): MailProvider => {
  if (cachedProvider) return cachedProvider;

  const provider = (process.env.TRANSPORT_PROVIDER || 'SMTP').toUpperCase();
  if (provider === 'RESEND') {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND selected but RESEND_API_KEY is missing. Falling back to SMTP.');
      cachedProvider = SmtpProvider.getInstance();
    } else {
      cachedProvider = ResendProvider.getInstance();
    }
  } else {
    cachedProvider = SmtpProvider.getInstance();
  }
  
  return cachedProvider;
};
