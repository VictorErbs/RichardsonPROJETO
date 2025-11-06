# 🎣 Phishing Simulator - Plataforma de Conscientização

> Projeto desenvolvido para o Professor Richardson - Sistema completo de simulação de ataques de phishing para treinamento e conscientização em segurança cibernética.

## 📋 Sobre o Projeto

Este é um sistema full-stack de simulação de ataques de phishing, desenvolvido para fins educacionais. A plataforma permite que administradores enviem campanhas de phishing simuladas para usuários, rastreiem interações e forneçam feedback educativo imediato.

### 🎯 Objetivos

- Conscientizar usuários sobre ataques de phishing
- Treinar equipes para identificar emails maliciosos
- Medir a vulnerabilidade organizacional através de métricas
- Fornecer feedback educativo após cada interação

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** com SQLite
- **JWT** para autenticação
- **Bcrypt** para hash de senhas
- **Nodemailer** e **Resend** para envio de emails
- **Node-cron** para automação

### Frontend
- **React 18** + **Vite**
- **TypeScript**
- **React Router DOM** para navegação
- **Axios** para requisições HTTP
- **Tailwind CSS** para estilização

## ✨ Funcionalidades

### Para Administradores
- ✅ Criar e gerenciar campanhas de phishing personalizadas
- ✅ Enviar emails sob demanda para usuários cadastrados
- ✅ Dashboard com estatísticas completas
- ✅ Visualizar cliques, submissões e taxa de sucesso
- ✅ Gerenciar usuários e suas métricas

### Para Usuários
- ✅ Receber emails de phishing simulados
- ✅ Dashboard pessoal com estatísticas
- ✅ Sistema de pontuação e gamificação
- ✅ Ranking de performance
- ✅ Feedback educativo após interações

### Sistema
- ✅ Tracking de abertura de emails (pixel invisível)
- ✅ Rastreamento de cliques em links
- ✅ Captura de credenciais em páginas fake
- ✅ Envio automático de email educativo
- ✅ Sistema de pontos e níveis
- ✅ API RESTful completa

## 📦 Estrutura do Projeto

```
RichardsonPROJETO/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/    # Lógica de negócio
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Serviços (email, etc)
│   │   ├── middleware/     # Auth middleware
│   │   ├── jobs/           # Scheduler
│   │   ├── scripts/        # Scripts utilitários
│   │   └── server.ts       # Entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Schema do banco
│   │   └── migrations/     # Migrations
│   └── package.json
│
├── frontend/               # Interface React
│   ├── src/
│   │   ├── pages/         # Páginas (Login, Dashboard, Admin)
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── contexts/      # Context API (Auth)
│   │   ├── services/      # API client
│   │   └── main.tsx       # Entry point
│   └── package.json
│
└── public/                # Páginas fake (phishing)
    └── fake-bank-login.html
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/SEU-USUARIO/RichardsonPROJETO.git
cd RichardsonPROJETO
```

### 2. Instalar dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=seu_secret_jwt_super_seguro
JWT_EXPIRES_IN=7d

# Email (escolha entre SMTP ou Resend)
TRANSPORT_PROVIDER=RESEND
RESEND_API_KEY=sua_chave_resend
EMAIL_FROM=onboarding@resend.dev

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

Crie um arquivo `.env` na pasta `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Configurar banco de dados

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npx ts-node src/scripts/seed.ts
```

### 5. Iniciar os servidores

**Backend (terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (terminal 2):**
```bash
cd frontend
npm run dev
```

Acesse: http://localhost:5173

## 🔐 Credenciais Padrão

Após executar o seed:

**Admin:**
- Email: `admin@phishing.com`
- Senha: `admin123`

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil (requer autenticação)

### Campanhas
- `GET /api/campaigns` - Listar campanhas
- `GET /api/campaigns/:id` - Detalhes da campanha
- `POST /api/campaigns` - Criar campanha (admin)
- `POST /api/campaigns/:id/send-once` - Enviar campanha (admin)

### Usuários
- `GET /api/users` - Listar usuários (admin)
- `GET /api/users/stats/:id` - Estatísticas do usuário
- `GET /api/users/ranking` - Ranking global

### Tracking
- `GET /api/tracking/pixel/:emailLogId` - Pixel de tracking
- `GET /api/tracking/click/:emailLogId` - Registrar clique

## 🎓 Fluxo de Uso

1. **Admin cria campanha** com template de email
2. **Admin envia campanha** para usuários cadastrados
3. **Usuário recebe email** de phishing simulado
4. **Sistema rastreia** abertura (pixel invisível)
5. **Usuário clica no link** → sistema registra
6. **Usuário submete dados** → sistema captura
7. **Sistema envia email educativo** imediatamente
8. **Dashboard atualiza** métricas e pontuação

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Autenticação via JWT
- ✅ Rotas protegidas com middleware
- ✅ Validação de dados no backend
- ✅ CORS configurado
- ✅ Variáveis sensíveis em .env (não versionado)

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curso ministrado pelo Professor Richardson.

## 👨‍💻 Desenvolvedor

**Victor Erbs**
- Email: victorerbs2004@gmail.com
- GitHub: [@SEU-USUARIO](https://github.com/SEU-USUARIO)

## 🙏 Agradecimentos

Projeto desenvolvido sob orientação do **Professor Richardson** para demonstração prática de conceitos de segurança cibernética e desenvolvimento full-stack.

---

⚠️ **AVISO**: Este sistema foi desenvolvido exclusivamente para fins educacionais. O uso inadequado de técnicas de phishing é ilegal e antiético. Use apenas em ambientes controlados e com consentimento dos participantes.
