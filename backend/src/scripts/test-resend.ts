import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY não configurada no .env');

    const resend = new Resend(apiKey);

    const to = process.env.TEST_EMAIL_TO || 'victorerbs2004@gmail.com';
    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    const result = await resend.emails.send({
      from,
      to,
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
    });

    console.log('✅ Resend OK:', result);
  } catch (e) {
    console.error('❌ Resend falhou:', e);
    process.exit(1);
  }
})();
