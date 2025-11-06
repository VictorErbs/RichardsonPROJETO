# 🎣 Simulador de Phishing Gamificado

> **Plataforma Educativa de Conscientização contra Ataques de Phishing**

Sistema completo que envia e-mails de phishing simulados, rastreia comportamento dos usuários e envia notificações educativas para treinar pessoas a identificar ataques reais.

---

## 🎯 O Que é Este Projeto?

Este é um **simulador realista de ataques de phishing** criado para fins educacionais. Ele simula todo o fluxo de um ataque real:

1. 📧 **E-mail Falso** é enviado para o usuário
2. 🎣 **Link Suspeito** redireciona para página fake
3. 📊 **Sistema Rastreia** se o usuário:
   - Abriu o e-mail
   - Clicou no link
   - Inseriu credenciais
4. 📩 **E-mail Educativo** é enviado automaticamente explicando o erro
5. 🏆 **Gamificação** com pontos e ranking

**Objetivo:** Treinar usuários a identificar sinais de phishing sem riscos reais.

---

## 🚀 Funcionalidades Principais

### Para Administradores:
- ✅ Criar campanhas de phishing personalizadas
- ✅ Enviar e-mails em massa para usuários
- ✅ Visualizar métricas e estatísticas
- ✅ Gerenciar usuários e campanhas
- ✅ Dashboard com taxa de cliques e submissões

### Para Usuários:
- ✅ Receber e-mails de phishing simulados
- ✅ Aprender com feedback educativo imediato
- ✅ Ganhar pontos por identificar phishing
- ✅ Ver progresso no ranking
- ✅ Certificado de conscientização

### Sistema:
- ✅ Tracking de abertura de e-mails (pixel invisível)
- ✅ Tracking de cliques em links
- ✅ Captura de credenciais em páginas fake
- ✅ Envio automático de e-mail educativo
- ✅ Banco de dados com histórico completo

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|-----------|
| **Backend** | Node.js + Express + TypeScript |
| **Banco de Dados** | SQLite (desenvolvimento) / PostgreSQL (produção) |
| **ORM** | Prisma |
| **Autenticação** | JWT + Bcrypt |
| **E-mail** | Nodemailer (SMTP) |
| **Frontend** | HTML/CSS (páginas fake) |

---

## 📦 Instalação e Configuração

### 1️⃣ Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Conta de e-mail Gmail (para enviar e-mails)

### 2️⃣ Instalar Dependências
```bash
npm install
```

### 3️⃣ Configurar Variáveis de Ambiente
Edite o arquivo `.env` com suas configurações:

```env
# Servidor
PORT=3000

# Banco de Dados
DATABASE_URL="file:./dev.db"

# JWT (troque por uma chave secreta forte)
JWT_SECRET=sua_chave_super_secreta_aqui

# Configuração de E-mail (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app_aqui
EMAIL_FROM=noreply@phishingsimulator.com

# URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

**📧 Como Obter Senha de App do Gmail:**
1. Acesse: https://myaccount.google.com/security
2. Ative "Verificação em duas etapas"
3. Vá em: https://myaccount.google.com/apppasswords
4. Gere uma senha para "Aplicativo de e-mail"
5. Use essa senha no `.env` (campo `SMTP_PASS`)

### 4️⃣ Configurar Banco de Dados
```bash
# Gerar Prisma Client
npx prisma generate

# Criar banco de dados e tabelas
npx prisma migrate dev --name init

# Popular com dados de exemplo
npx ts-node src/scripts/seed.ts
```

### 5️⃣ Iniciar Servidor
```bash
npm run dev
```

O servidor estará rodando em: **http://localhost:3000**

---

## 🎮 Como Usar (Apresentação)

### 📌 Fluxo Completo de Demonstração

#### **PASSO 1: Acessar a API**
Abra o navegador em: `http://localhost:3000`

Você verá a documentação da API com todos os endpoints disponíveis.

#### **PASSO 2: Fazer Login como Admin**
Use Postman, Insomnia ou cURL:

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@phishing.com",
  "password": "admin123"
}
```

**Resposta:** Você receberá um `token` JWT. Copie-o!

#### **PASSO 3: Listar Campanhas Disponíveis**
```bash
GET http://localhost:3000/api/campaigns
Authorization: Bearer SEU_TOKEN_AQUI
```

Você verá 3 campanhas pré-cadastradas:
- 🏦 Phishing Banco - Nível Fácil
- 🎬 Phishing Netflix - Nível Médio
- 💼 Phishing Email Corporativo - Nível Difícil

#### **PASSO 4: Enviar Campanha de Phishing**
Escolha uma campanha e pegue o `id`:

```bash
POST http://localhost:3000/api/campaigns/ID_DA_CAMPANHA/send
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "userIds": []
}
```

**⚠️ IMPORTANTE:** Configure um e-mail real no `.env` antes!

O sistema enviará e-mails para todos os usuários (ou específicos se passar IDs).

#### **PASSO 5: Verificar E-mail Recebido**
O usuário receberá um e-mail como este:

```
De: Banco Seguro
Assunto: ⚠️ Ação necessária: Atualize seus dados cadastrais

Olá, João!

Identificamos uma pendência em seu cadastro.
Sua conta será bloqueada em 24 horas caso não atualize seus dados.

[ATUALIZAR DADOS AGORA]

Atenciosamente,
Banco Seguro
```

#### **PASSO 6: Usuário Clica no Link**
Quando o usuário clica:
1. ✅ Sistema registra o clique
2. ✅ Redireciona para página fake
3. ✅ Envia e-mail educativo

#### **PASSO 7: Página Fake Captura Dados**
O usuário vê uma página realista de banco:

![Página Fake](http://localhost:3000/fake-bank-login.html)

Se inserir credenciais:
1. ✅ Sistema registra a submissão
2. ✅ Mostra alerta: "Você caiu em um phishing!"
3. ✅ Envia e-mail educativo

#### **PASSO 8: E-mail Educativo**
O usuário recebe automaticamente:

```
⚠️ ALERTA DE SEGURANÇA
Você acabou de cair em um phishing simulado!

O que aconteceu?
Você clicou no link suspeito da campanha "Phishing Banco - Nível Fácil".

⚠️ Se este fosse um ataque real, seus dados teriam sido roubados!

🛡️ Como identificar um e-mail de phishing:
1. Verifique o remetente
2. Passe o mouse sobre os links
3. Desconfie de urgência
4. Erros de português
5. Pedidos de informações sensíveis
```

#### **PASSO 9: Ver Estatísticas**
```bash
GET http://localhost:3000/api/users/ranking
Authorization: Bearer SEU_TOKEN_AQUI
```

Veja quantos usuários:
- Abriram o e-mail
- Clicaram no link
- Inseriram credenciais

---

## 📊 Estrutura do Banco de Dados

```
User (Usuários)
├── id, name, email, password
├── role (USER/ADMIN)
├── points, level
└── Relacionamentos: emailLogs, clicks, submissions

Campaign (Campanhas de Phishing)
├── id, title, description
├── emailSubject, emailBody
├── senderName, senderEmail
├── targetUrl, difficulty, points
└── Relacionamentos: emailLogs

EmailLog (Log de E-mails Enviados)
├── id, userId, campaignId
├── sentAt, opened, openedAt
└── Relacionamentos: clicks

Click (Cliques em Links)
├── id, userId, emailLogId
├── clickedAt, ipAddress, userAgent

Submission (Credenciais Enviadas)
├── id, userId, campaignId
├── username, password (fake)
├── submittedAt, ipAddress, userAgent
```

---

## 🎤 Como Apresentar Este Projeto

### 🎯 Roteiro de Apresentação (10-15 minutos)

#### **1. Introdução (2 min)**
- "Phishing é responsável por 90% dos ataques cibernéticos"
- "Este projeto simula ataques para treinar usuários"
- "Sistema completo: e-mail → página fake → feedback educativo"

#### **2. Demonstração Técnica (5 min)**
- Mostrar arquitetura (Node.js, Prisma, Nodemailer)
- Abrir `http://localhost:3000` e mostrar API
- Fazer login como admin via Postman
- Listar campanhas disponíveis

#### **3. Demonstração Prática (5 min)**
- Enviar campanha de phishing para seu próprio e-mail
- Abrir e-mail recebido no celular/outro computador
- Clicar no link e ser redirecionado
- Mostrar página fake realista
- Inserir credenciais fake
- Mostrar e-mail educativo recebido

#### **4. Dashboard de Métricas (2 min)**
- Mostrar endpoint de ranking
- Mostrar estatísticas de usuários
- Explicar gamificação

#### **5. Conclusão (1 min)**
- "Plataforma 100% funcional para treinamento"
- "Código aberto, extensível e personalizável"
- "Próximos passos: frontend React, mais páginas fake"

---

## 📁 Estrutura de Arquivos

```
RichardsonPROJETO/
├── src/
│   ├── server.ts                  # Servidor Express principal
│   ├── controllers/               # Lógica de negócio
│   │   ├── auth.controller.ts     # Login, registro
│   │   ├── campaign.controller.ts # CRUD de campanhas
│   │   ├── tracking.controller.ts # Rastreamento
│   │   └── user.controller.ts     # Estatísticas
│   ├── routes/                    # Rotas da API
│   │   ├── auth.routes.ts
│   │   ├── campaign.routes.ts
│   │   ├── tracking.routes.ts
│   │   └── user.routes.ts
│   ├── services/
│   │   └── email.service.ts       # Envio de e-mails
│   ├── middleware/
│   │   └── auth.middleware.ts     # Autenticação JWT
│   ├── config/
│   │   └── database.ts            # Conexão Prisma
│   └── scripts/
│       └── seed.ts                # Popular banco
├── prisma/
│   ├── schema.prisma              # Modelo de dados
│   └── migrations/                # Histórico do banco
├── public/
│   └── fake-bank-login.html       # Página fake
├── .env                           # Variáveis de ambiente
├── package.json
├── tsconfig.json
├── README.md                      # Este arquivo
└── API_TESTS.md                   # Exemplos de requisições
```

---

## 🔐 Credenciais de Teste

Após rodar o seed, estes usuários estarão disponíveis:

| Tipo | E-mail | Senha |
|------|--------|-------|
| **Admin** | admin@phishing.com | admin123 |
| Usuário | joao@teste.com | teste123 |
| Usuário | maria@teste.com | teste123 |
| Usuário | pedro@teste.com | teste123 |

---

## 📚 Endpoints da API

Veja documentação completa em: **`API_TESTS.md`**

**Principais rotas:**
- `POST /api/auth/register` - Cadastrar usuário
- `POST /api/auth/login` - Login
- `GET /api/campaigns` - Listar campanhas
- `POST /api/campaigns/:id/send` - Enviar e-mails
- `GET /api/users/ranking` - Ver ranking

---

## 🎓 Conceitos Aprendidos

Este projeto demonstra conhecimento em:

✅ **Backend:** Node.js, Express, TypeScript  
✅ **Banco de Dados:** Prisma ORM, SQLite, modelagem relacional  
✅ **Autenticação:** JWT, Bcrypt, middlewares  
✅ **E-mail:** Nodemailer, SMTP, templates HTML  
✅ **Segurança:** Hashing de senhas, tokens, CORS  
✅ **Arquitetura:** MVC, separação de responsabilidades  
✅ **DevOps:** Migrations, seeds, variáveis de ambiente  

---

## 🚧 Próximos Passos (Roadmap)

- [ ] Frontend React com dashboard visual
- [ ] Mais templates de páginas fake (Facebook, Instagram, etc.)
- [ ] Sistema de certificados ao completar treinamento
- [ ] Métricas avançadas e gráficos
- [ ] Suporte a múltiplos idiomas
- [ ] Deploy em produção (Heroku, Railway, Vercel)
- [ ] Testes automatizados (Jest)

---

## ⚠️ Aviso Legal

**Este projeto é estritamente educacional.**

- ❌ **NUNCA** use para ataques reais
- ❌ **NUNCA** envie para pessoas sem consentimento
- ✅ Use apenas em ambiente controlado
- ✅ Obtenha permissão antes de testar

Phishing é crime previsto em lei. Use responsavelmente.

---

## 👨‍💻 Desenvolvedor

**Richardson** - Projeto Final de Conscientização de Segurança  
Desenvolvido em: Novembro/2025

---

## 📞 Suporte

Dúvidas? Consulte:
- `API_TESTS.md` - Exemplos de requisições
- `http://localhost:3000` - Documentação da API
- Prisma Studio: `npm run prisma:studio`

---

## 📄 Licença

MIT License - Use livremente para fins educacionais.
