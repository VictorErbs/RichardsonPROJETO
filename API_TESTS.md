# 🧪 Testes da API - Simulador de Phishing

## 📋 Pré-requisitos
- Servidor rodando em `http://localhost:3000`
- Use Postman, Insomnia ou cURL para testar

---

## 1️⃣ Autenticação

### Registrar Novo Usuário
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Teste Usuario",
  "email": "teste@exemplo.com",
  "password": "senha123"
}
```

### Login (Obter Token)
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@phishing.com",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "...",
    "name": "Administrador",
    "email": "admin@phishing.com",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**⚠️ IMPORTANTE: Copie o `token` para usar nos próximos requests!**

### Ver Perfil
```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 2️⃣ Campanhas

### Listar Todas as Campanhas
```http
GET http://localhost:3000/api/campaigns
Authorization: Bearer SEU_TOKEN_AQUI
```

### Criar Nova Campanha (Admin)
```http
POST http://localhost:3000/api/campaigns
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "title": "Phishing Teste - Amazon",
  "description": "Simulação de e-mail da Amazon",
  "emailSubject": "Problema com seu pedido #12345",
  "emailBody": "<h2>Olá {name}!</h2><p>Detectamos um problema com seu último pedido.</p><p><a href='{link}'>Clique aqui para resolver</a></p>",
  "senderName": "Amazon Brasil",
  "senderEmail": "noreply@amazon.com.br",
  "targetUrl": "http://localhost:3000/fake-amazon-login.html",
  "difficulty": "MEDIUM",
  "points": 20
}
```

### Ver Detalhes de uma Campanha
```http
GET http://localhost:3000/api/campaigns/ID_DA_CAMPANHA
Authorization: Bearer SEU_TOKEN_AQUI
```

### Enviar E-mails da Campanha (Admin)
```http
POST http://localhost:3000/api/campaigns/ID_DA_CAMPANHA/send
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "userIds": []
}
```

**Nota:** Array vazio envia para todos os usuários. Para enviar para usuários específicos:
```json
{
  "userIds": ["user-id-1", "user-id-2"]
}
```

---

## 3️⃣ Usuários

### Listar Todos os Usuários (Admin)
```http
GET http://localhost:3000/api/users
Authorization: Bearer SEU_TOKEN_AQUI
```

### Ver Estatísticas de um Usuário
```http
GET http://localhost:3000/api/users/stats/USER_ID
Authorization: Bearer SEU_TOKEN_AQUI
```

### Ver Ranking
```http
GET http://localhost:3000/api/users/ranking
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 4️⃣ Tracking (Públicos - não requerem autenticação)

### Simular Clique em Link de E-mail
```http
GET http://localhost:3000/api/tracking/click/EMAIL_LOG_ID
```

### Simular Abertura de E-mail
```http
GET http://localhost:3000/api/tracking/open/EMAIL_LOG_ID
```

### Submeter Credenciais (Página Fake)
```http
POST http://localhost:3000/api/tracking/submit/CAMPAIGN_ID
Content-Type: application/json

{
  "userId": "USER_ID",
  "username": "usuario_teste",
  "password": "senha_teste"
}
```

---

## 🔧 Exemplos com cURL (Terminal)

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@phishing.com","password":"admin123"}'
```

### Listar Campanhas:
```bash
curl http://localhost:3000/api/campaigns \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📧 Testando Envio de E-mails

1. Configure o arquivo `.env` com suas credenciais SMTP
2. Faça login como admin
3. Envie uma campanha para um e-mail seu
4. Verifique sua caixa de entrada
5. Clique no link do e-mail
6. Você será redirecionado para a página fake
7. Receba o e-mail educativo explicando o ataque

---

## 🎯 Fluxo Completo de Teste

1. **Login como Admin** → Obter token
2. **Criar/Listar Campanhas** → Escolher uma campanha
3. **Enviar E-mail** → Para seu próprio e-mail
4. **Abrir E-mail** → Verificar recebimento
5. **Clicar no Link** → Ser redirecionado para página fake
6. **Inserir Credenciais** → Página fake captura dados
7. **Receber E-mail Educativo** → Sistema envia explicação
8. **Ver Estatísticas** → Dashboard mostra métricas

---

## ⚠️ Credenciais de Teste

- **Admin:** admin@phishing.com / admin123
- **Usuário 1:** joao@teste.com / teste123
- **Usuário 2:** maria@teste.com / teste123
- **Usuário 3:** pedro@teste.com / teste123
