# Backend — Simulador de Phishing

API REST em Node.js/TypeScript com envio de e-mails (SMTP/Resend), automação por CRON, tracking de cliques/abertura e páginas fake.

## Requisitos

- Node.js 18+
- Conta SMTP (Gmail/Mailtrap) ou Resend API Key

## Setup rápido

1) Instale dependências

```powershell
cd backend
npm install
```

2) Configure variáveis de ambiente

```powershell
cp .env.example .env
```

Edite `.env` (Exemplos):

SMTP (Gmail App Password)

```
TRANSPORT_PROVIDER=SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
EMAIL_FROM=seu_email@gmail.com
```

Resend (rápido para testar)

```
TRANSPORT_PROVIDER=RESEND
RESEND_API_KEY=chave_resend
EMAIL_FROM=onboarding@resend.dev
TEST_EMAIL_TO=seu_email@exemplo.com
```

CRON (automação)

```
CRON_DEFAULT=0 9 * * *
```

3) Banco de dados

```powershell
npx prisma generate
npx prisma migrate dev --name init
npx ts-node src/scripts/seed.ts
```

4) Rodar a API

```powershell
npm run dev
```

Abra: http://localhost:3000

## Testar envio de e-mail

Script Resend (usa .env):

```powershell
npx ts-node src/scripts/test-resend.ts
```

Via API (admin):

- Login: POST /api/auth/login (admin@phishing.com / admin123)
- Enviar teste: POST /api/email/test { to, subject?, html? }

## Automação por CRON

- Scheduler inicializa com o servidor (ver `src/server.ts` e `src/jobs/scheduler.ts`)
- Ajuste `CRON_DEFAULT` no `.env` (p.ex. `*/5 * * * *` a cada 5 minutos)
- Para habilitar envio automático numa campanha, defina `autoSend=true` e opcionalmente `cron` específico na campanha

Script de configuração (exemplo) em `src/scripts/setup.ts` pode marcar uma campanha de exemplo para auto envio.

## Estrutura

```
backend/
	prisma/
	public/
	src/
		config/
		controllers/
		jobs/
		middleware/
		routes/
		scripts/
		services/
		server.ts
```

## Páginas Fake

Arquivos HTML em `public/` (ex.: `fake-bank-login.html`). Servidos em `http://localhost:3000/fake-bank-login.html`.

## Segurança

- Projeto educacional. Não usar para fins maliciosos.
- Nunca enviar campanhas sem consentimento/controlado.

## Troubleshooting

- Resend erro de domínio: use `EMAIL_FROM=onboarding@resend.dev` para testes
- Gmail: use senha de app (2FA obrigatório)
- Porta ocupada: altere `PORT` no `.env`

# 🎣 Backend — Simulador de Phishing (Automatizado)

API Node.js/TypeScript com envio de e-mails de phishing simulados, tracking e agora com automação via CRON e suporte a provedores (SMTP/Resend).

## ⚙️ Tecnologias

- Express + TypeScript
- Prisma (SQLite dev / PostgreSQL prod)
- Nodemailer (SMTP) ou Resend (API)
- node-cron (agendador)

## 🚀 Rodando local

```powershell
cd .\backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx ts-node src\scripts\seed.ts
npm run dev
```

Abra http://localhost:3000

## 📧 Provedores de E-mail

No arquivo `.env` (veja `.env.example`):

```
TRANSPORT_PROVIDER=SMTP   # ou RESEND

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
EMAIL_FROM=noreply@phishingsimulator.com

# Resend
RESEND_API_KEY=
```

Mais detalhes em `EMAIL_SERVICES.md`.

## 🗓️ Automação (Agendador)

- O agendador é inicializado junto ao servidor (`src/jobs/scheduler.ts`).
- Variável `.env` opcional: `CRON_DEFAULT` (padrão: `0 9 * * *` — todos os dias 09:00).
- O agendador envia e-mails das campanhas com `autoSend = true`.

### Habilitar envio automático para uma campanha

Use o endpoint de update (Admin):

```
PUT /api/campaigns/:id
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
	"autoSend": true,
	"cron": "*/2 * * * *"  // opcional: a cada 2 minutos (para testes)
}
```

Observação: nesta versão o CRON global (`CRON_DEFAULT`) roda `processAutoCampaigns()` e respeita `lastSentAt` para não disparar mais de 1x/dia por campanha. O campo `cron` é armazenado para uso futuro em schedules por campanha (extensível).* 

## 📚 Endpoints principais

- `POST /api/auth/login`
- `GET /api/campaigns`
- `POST /api/campaigns/:id/send` (Admin — envio manual)
- `PUT /api/campaigns/:id` (Admin — pode ativar `autoSend`)
- `GET /api/users/ranking`

## 🗂️ Estrutura

```
backend/
	prisma/
	public/
	src/
		jobs/
			scheduler.ts
		services/
			email.service.ts
			mail.provider.ts
		controllers/ routes/ middleware/ config/ scripts/
```

## 🔁 Renomear pasta para "back-end" (opcional)

Se você quiser a pasta com hífen, pode renomear via PowerShell (pare o servidor antes):

```powershell
Rename-Item -Path .\backend -NewName back-end
```

Depois, acesse `back-end` normalmente e rode `npm run dev`.
