import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import campaignRoutes from './routes/campaign.routes';
import trackingRoutes from './routes/tracking.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static('public'));

// Rota principal com documentação
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simulador de Phishing - API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 15px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          padding: 40px;
        }
        h1 { color: #667eea; margin-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; margin-bottom: 15px; font-size: 22px; }
        p { color: #666; line-height: 1.6; margin-bottom: 15px; }
        .status { 
          background: #d4edda; 
          color: #155724; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #28a745;
        }
        .endpoint {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          border-left: 4px solid #667eea;
        }
        .method {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 12px;
          margin-right: 10px;
        }
        .post { background: #28a745; color: white; }
        .get { background: #007bff; color: white; }
        .put { background: #ffc107; color: black; }
        .delete { background: #dc3545; color: white; }
        code { 
          background: #f4f4f4; 
          padding: 2px 6px; 
          border-radius: 3px; 
          font-family: 'Courier New', monospace;
          font-size: 14px;
        }
        .credentials {
          background: #fff3cd;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          border-left: 4px solid #ffc107;
        }
        .credentials h3 { color: #856404; font-size: 16px; margin-bottom: 10px; }
        .cred-item { margin: 8px 0; color: #856404; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎣 Simulador de Phishing Gamificado</h1>
        <p>API para treinamento e conscientização contra ataques de phishing</p>
        
        <div class="status">
          ✅ Servidor rodando com sucesso!
        </div>

        <div class="credentials">
          <h3>🔐 Credenciais de Teste</h3>
          <div class="cred-item"><strong>Admin:</strong> admin@phishing.com / admin123</div>
          <div class="cred-item"><strong>Usuário:</strong> joao@teste.com / teste123</div>
          <div class="cred-item"><strong>Usuário:</strong> maria@teste.com / teste123</div>
        </div>

        <h2>📡 Endpoints Disponíveis</h2>

        <h3 style="color: #667eea; margin-top: 25px;">Autenticação</h3>
        <div class="endpoint">
          <span class="method post">POST</span>
          <code>/api/auth/register</code>
          <p style="margin-top: 8px; color: #666;">Registrar novo usuário</p>
        </div>
        <div class="endpoint">
          <span class="method post">POST</span>
          <code>/api/auth/login</code>
          <p style="margin-top: 8px; color: #666;">Fazer login e receber token JWT</p>
        </div>
        <div class="endpoint">
          <span class="method get">GET</span>
          <code>/api/auth/profile</code>
          <p style="margin-top: 8px; color: #666;">Ver perfil do usuário logado (requer token)</p>
        </div>

        <h3 style="color: #667eea; margin-top: 25px;">Campanhas</h3>
        <div class="endpoint">
          <span class="method get">GET</span>
          <code>/api/campaigns</code>
          <p style="margin-top: 8px; color: #666;">Listar todas as campanhas</p>
        </div>
        <div class="endpoint">
          <span class="method post">POST</span>
          <code>/api/campaigns</code>
          <p style="margin-top: 8px; color: #666;">Criar nova campanha (Admin)</p>
        </div>
        <div class="endpoint">
          <span class="method post">POST</span>
          <code>/api/campaigns/:id/send</code>
          <p style="margin-top: 8px; color: #666;">Enviar e-mails da campanha (Admin)</p>
        </div>

        <h3 style="color: #667eea; margin-top: 25px;">Usuários</h3>
        <div class="endpoint">
          <span class="method get">GET</span>
          <code>/api/users</code>
          <p style="margin-top: 8px; color: #666;">Listar todos os usuários (Admin)</p>
        </div>
        <div class="endpoint">
          <span class="method get">GET</span>
          <code>/api/users/ranking</code>
          <p style="margin-top: 8px; color: #666;">Ver ranking de pontuação</p>
        </div>

        <h3 style="color: #667eea; margin-top: 25px;">Páginas Fake</h3>
        <div class="endpoint">
          <span class="method get">GET</span>
          <code>/fake-bank-login.html</code>
          <p style="margin-top: 8px; color: #666;">Exemplo de página fake de banco</p>
        </div>

        <h2>🚀 Como Testar</h2>
        <p>1. Use Postman, Insomnia ou cURL para testar os endpoints</p>
        <p>2. Faça login em <code>/api/auth/login</code> para obter o token</p>
        <p>3. Use o token no header: <code>Authorization: Bearer SEU_TOKEN</code></p>
        <p>4. Configure o SMTP no arquivo <code>.env</code> para enviar e-mails reais</p>

        <h2>📧 Configuração de E-mail</h2>
        <p>Para enviar e-mails reais, edite o arquivo <code>.env</code>:</p>
        <ul style="margin-left: 20px; color: #666;">
          <li>Gmail: Use senha de app (não a senha normal)</li>
          <li>Ative verificação em 2 etapas</li>
          <li>Gere senha de app em: myaccount.google.com/apppasswords</li>
        </ul>

        <p style="margin-top: 30px; text-align: center; color: #999;">
          Desenvolvido para fins educacionais • Nunca use para ataques reais
        </p>
      </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Phishing Simulator API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/users', userRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Phishing Simulator API started successfully`);
});

export default app;
