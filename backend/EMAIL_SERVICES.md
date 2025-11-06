Email Providers Setup

This backend supports multiple email providers via an adapter:

- SMTP (default) using Nodemailer
- Resend (recommended for quick start)

Environment variables

- TRANSPORT_PROVIDER=SMTP | RESEND
- EMAIL_FROM=sender@domain
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (if SMTP)
- RESEND_API_KEY (if RESEND)

Quick start with Resend

1) Set in .env:

TRANSPORT_PROVIDER=RESEND
RESEND_API_KEY=your_resend_key
EMAIL_FROM=onboarding@resend.dev

2) Send a test email:

POST /api/email/test (admin only)
{
	"to": "you@example.com",
	"subject": "Hello World",
	"html": "<p>Congrats!</p>"
}

Or run the script:

npx ts-node src/scripts/test-resend.ts

SMTP setup (Gmail)

Use app password:

TRANSPORT_PROVIDER=SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your@gmail.com

