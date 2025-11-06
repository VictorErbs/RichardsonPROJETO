# 🎤 Guia de Apresentação do Projeto

## 📋 Checklist Antes de Apresentar

### ✅ Configuração
- [ ] Servidor rodando (`npm run dev`)
- [ ] Banco de dados populado (`npx ts-node src/scripts/seed.ts`)
- [ ] Gmail configurado no `.env` (ou use Mailtrap para testes)
- [ ] Postman/Insomnia instalado para demonstrar API
- [ ] Navegador aberto em `http://localhost:3000`

### ✅ Demonstração
- [ ] E-mail de teste pronto para receber phishing
- [ ] Token JWT já copiado
- [ ] Tela dividida: código + navegador/Postman

---

## 🎯 Roteiro de Apresentação (15 minutos)

### **SLIDE 1: Problema (2 min)**

**Fala:**
> "Phishing é responsável por 90% dos ataques cibernéticos. Em 2024, mais de 3 bilhões de e-mails de phishing foram enviados diariamente. O custo médio de um ataque bem-sucedido é de $4.9 milhões por empresa."

**Mostrar:**
- Exemplos reais de e-mails de phishing
- Estatísticas de ataques

---

### **SLIDE 2: Solução Proposta (1 min)**

**Fala:**
> "Este projeto é um simulador de phishing gamificado. A ideia é treinar usuários através de simulações realistas, feedback educativo imediato e gamificação para engajamento."

**Mostrar:**
- Diagrama do fluxo: E-mail → Clique → Página Fake → Feedback

---

### **SLIDE 3: Arquitetura Técnica (2 min)**

**Fala:**
> "Backend em Node.js com TypeScript, usando Express para API RESTful. Banco de dados com Prisma ORM e SQLite em desenvolvimento. Sistema de autenticação com JWT. Nodemailer para envio de e-mails via SMTP."

**Mostrar:**
```
┌─────────────┐
│   Cliente   │ (navegador/e-mail)
└──────┬──────┘
       │
┌──────▼──────┐
│   Express   │ (API REST)
│  TypeScript │
└──────┬──────┘
       │
┌──────▼──────┐     ┌──────────┐
│   Prisma    │────▶│  SQLite  │
│     ORM     │     │    DB    │
└──────┬──────┘     └──────────┘
       │
┌──────▼──────┐     ┌──────────┐
│ Nodemailer  │────▶│   SMTP   │
│   Service   │     │  Server  │
└─────────────┘     └──────────┘
```

---

### **SLIDE 4: Demo - Parte 1 - API (3 min)**

**1. Mostrar Documentação**
```bash
# Abrir navegador
http://localhost:3000
```

**Fala:**
> "Aqui está a API rodando. Temos endpoints para autenticação, gerenciamento de campanhas, tracking de comportamento e estatísticas."

**2. Login no Postman**
```http
POST http://localhost:3000/api/auth/login
{
  "email": "admin@phishing.com",
  "password": "admin123"
}
```

**Fala:**
> "Vou fazer login como administrador e receber um token JWT para autenticação."

**3. Listar Campanhas**
```http
GET http://localhost:3000/api/campaigns
Authorization: Bearer [TOKEN]
```

**Fala:**
> "O sistema tem 3 campanhas pré-cadastradas: phishing de banco, Netflix e e-mail corporativo, com níveis de dificuldade diferentes."

---

### **SLIDE 5: Demo - Parte 2 - Envio de E-mail (3 min)**

**4. Enviar Campanha**
```http
POST http://localhost:3000/api/campaigns/[ID]/send
{
  "userIds": []
}
```

**Fala:**
> "Agora vou disparar a campanha de phishing do banco. O sistema vai enviar e-mail para todos os usuários cadastrados."

**5. Mostrar E-mail Recebido**

**Abrir celular/outro computador e mostrar:**
- E-mail recebido na caixa de entrada
- Remetente aparece como "Banco Seguro"
- Assunto urgente: "Sua conta será bloqueada em 24h"
- Link suspeito

**Fala:**
> "Vejam como o e-mail parece legítimo. Usa táticas de urgência, tem logo do banco, e o link parece real à primeira vista."

---

### **SLIDE 6: Demo - Parte 3 - Página Fake (2 min)**

**6. Clicar no Link do E-mail**

**O que acontece:**
1. Sistema registra o clique automaticamente
2. Redireciona para `http://localhost:3000/fake-bank-login.html`
3. Página fake do banco aparece

**Fala:**
> "Quando o usuário clica, é redirecionado para esta página fake. Ela simula perfeitamente o site de um banco, com logo, formulário de login e mensagem de urgência."

**7. Inserir Credenciais Fake**

**Digitar:**
- Usuário: `usuario123`
- Senha: `senha123`
- Clicar em "Acessar Minha Conta"

**Resultado:**
- Alerta vermelho aparece: "⚠️ ATENÇÃO! Você caiu em um phishing simulado!"
- Lista os sinais de phishing da página

**Fala:**
> "Imediatamente após submeter, o usuário recebe feedback. O sistema explica exatamente o que ele errou e ensina os sinais de alerta."

---

### **SLIDE 7: Demo - Parte 4 - E-mail Educativo (1 min)**

**8. Mostrar E-mail Educativo**

**Abrir e-mail recebido:**
- Título: "⚠️ Você caiu em um phishing simulado - Aprenda aqui!"
- Conteúdo educativo completo
- 5 dicas para identificar phishing

**Fala:**
> "Automaticamente, o sistema envia um e-mail educativo. Ele não apenas avisa sobre o erro, mas ensina como evitar cair novamente."

---

### **SLIDE 8: Demo - Parte 5 - Estatísticas (1 min)**

**9. Ver Estatísticas**
```http
GET http://localhost:3000/api/users/ranking
Authorization: Bearer [TOKEN]
```

**Mostrar:**
- Quantos usuários receberam e-mail
- Quantos abriram
- Quantos clicaram
- Quantos submeteram credenciais

**Fala:**
> "O sistema rastreia tudo: abertura de e-mail via pixel invisível, cliques em links, e submissão de dados. Perfeito para empresas avaliarem vulnerabilidade da equipe."

---

## 💡 Perguntas Frequentes (Prepare-se!)

### **P: Como você garante que não é usado para mal?**
R: "O código está configurado apenas para localhost. Em produção, requer autenticação de admin e logs auditáveis. É como um teste de penetração controlado."

### **P: Funciona com qualquer provedor de e-mail?**
R: "Sim! Usa Nodemailer que suporta qualquer SMTP: Gmail, Outlook, SendGrid, Mailgun, etc."

### **P: E se o usuário não cair no phishing?**
R: "Ótimo! Significa que está treinado. O sistema registra isso também e pode aumentar a dificuldade gradualmente."

### **P: Como escala para milhares de usuários?**
R: "Usa filas de e-mail assíncronas. Em produção, recomendo Bull.js com Redis para processar envios em background."

### **P: Quais métricas um gestor veria?**
R: "Taxa de cliques, tempo médio até clicar, tipos de phishing mais efetivos, evolução do usuário ao longo do tempo, usuários de alto risco."

---

## 🎨 Dicas de Apresentação

### ✅ Faça
- Fale devagar e explique cada passo
- Use termos técnicos mas explique-os
- Mostre o código fonte em momentos chave
- Destaque o aspecto educacional
- Mencione aplicações reais (empresas, escolas)

### ❌ Evite
- Correr demais na demo
- Assumir conhecimento técnico da audiência
- Focar só no código sem mostrar resultado visual
- Esquecer de mencionar aspectos éticos

---

## 🎯 Pontos Fortes para Destacar

1. **Sistema Completo End-to-End**
   - "Não é apenas conceito, é 100% funcional"

2. **Tracking Avançado**
   - "Pixel invisível rastreia abertura, links têm IDs únicos"

3. **Feedback Educativo Imediato**
   - "Não apenas pune, ensina no momento certo"

4. **Arquitetura Profissional**
   - "TypeScript, Prisma, JWT - stack moderna de mercado"

5. **Extensível**
   - "Fácil adicionar novos tipos de phishing: SMS, WhatsApp, etc."

---

## 📊 Slides Recomendados (PowerPoint/Google Slides)

### Slide 1: Título
```
🎣 SIMULADOR DE PHISHING GAMIFICADO
Plataforma de Conscientização em Segurança Cibernética

[Seu Nome]
[Data]
```

### Slide 2: Problema
- Estatísticas de phishing
- Custo de ataques
- Vulnerabilidade humana

### Slide 3: Solução
- Treinamento prático
- Feedback imediato
- Gamificação

### Slide 4: Arquitetura
- Diagrama técnico
- Stack utilizada
- Fluxo de dados

### Slide 5-9: Demo
- Screenshots de cada etapa
- Ou demonstração ao vivo

### Slide 10: Resultados Esperados
- Redução de cliques em phishing
- Aumento de conscientização
- ROI para empresas

### Slide 11: Próximos Passos
- Frontend React
- Machine Learning para personalização
- Integração com Active Directory

### Slide 12: Conclusão
- Recap dos destaques
- Agradecimentos
- Contato

---

## 🚀 Alternativas para Demonstração (Se não tiver SMTP)

### Opção 1: Mailtrap (Recomendado)
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=seu_user_mailtrap
SMTP_PASS=sua_senha_mailtrap
```
- E-mails não chegam de verdade, mas aparecem no Mailtrap
- Perfeito para demo sem riscos

### Opção 2: Simular com Mock
- Mostrar o código que geraria o e-mail
- Mostrar template HTML renderizado
- Pular direto para a página fake

---

## ⏰ Gestão de Tempo

| Seção | Tempo | Acumulado |
|-------|-------|-----------|
| Introdução | 2 min | 2 min |
| Arquitetura | 2 min | 4 min |
| Demo - API | 3 min | 7 min |
| Demo - E-mail | 3 min | 10 min |
| Demo - Página Fake | 2 min | 12 min |
| Estatísticas | 1 min | 13 min |
| Conclusão | 2 min | 15 min |

**Buffer:** 5 minutos para perguntas

---

## 🎬 Frase de Abertura

> "Imaginem que vocês recebem um e-mail do banco dizendo que sua conta será bloqueada em 24 horas. Você clicaria? Estatisticamente, 30% das pessoas clicam. Este projeto ensina os outros 70% a fazer o mesmo - de forma segura."

## 🎬 Frase de Encerramento

> "Phishing é inevitável. Mas com treinamento adequado, podemos transformar nosso maior risco - o fator humano - em nossa melhor defesa. Este sistema faz exatamente isso."

---

**Boa sorte na apresentação! 🚀**