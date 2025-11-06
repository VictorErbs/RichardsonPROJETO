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

class SmtpProvider implements MailProvider {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

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

export const getMailProvider = (): MailProvider => {
  const provider = (process.env.TRANSPORT_PROVIDER || 'SMTP').toUpperCase();
  if (provider === 'RESEND') {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND selected but RESEND_API_KEY is missing. Falling back to SMTP.');
    } else {
      return new ResendProvider();
    }
  }
  return new SmtpProvider();
};
