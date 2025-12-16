# 🚀 Guia Rápido - Sistema de Emails

## Para Desenvolvedores da Equipe

### ✅ Email já está configurado!

Se você puxou as últimas mudanças do GitHub, o sistema de email já está pronto. Basta configurar no seu `.env` local.

---

## 📋 Configuração Rápida (5 minutos)

### 1️⃣ Copie as variáveis para seu .env

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-app-16-caracteres
EMAIL_FROM=Subscrivery <noreply@subscrivery.com>
```

> ⚠️ **IMPORTANTE**: Use as credenciais fornecidas pela equipe (não commitadas no Git por segurança). Em produção (Railway) já estão configuradas.

### 2️⃣ Teste se está funcionando

```bash
npm run dev
```

Você deve ver:
```
✅ Servidor de email pronto para enviar mensagens
```

### 3️⃣ Teste enviando emails reais

```bash
node src/testEmails.js
```

Isso enviará 6 emails de teste para `biowcabral1995@gmail.com`.

---

## 📧 Como Usar nos seus Endpoints

### Importar as funções

```javascript
import { sendEmail } from '../config/email.js';
import { welcomeEmail, /* outros templates */ } from '../templates/emailTemplates.js';
```

### Enviar um email

```javascript
// 1. Gerar conteúdo do template
const emailContent = welcomeEmail(userName);

// 2. Enviar email (não-bloqueante)
sendEmail({
  to: userEmail,
  subject: emailContent.subject,
  html: emailContent.html,
  text: emailContent.text
}).catch(err => console.error('Erro ao enviar email:', err));
```

> 💡 **Importante**: Use `.catch()` para não quebrar a aplicação se o email falhar!

---

## 📬 Templates Disponíveis

### 1. `welcomeEmail(userName)`
Email de boas-vindas para novos usuários.

### 2. `forgotPasswordEmail(userName, resetToken)`
Email com link para redefinir senha.

### 3. `orderCreatedClientEmail(userName, order, supplierName)`
Confirmação de pedido para o cliente.

### 4. `orderReceivedSupplierEmail(supplierName, order, clientName)`
Notificação de novo pedido para o fornecedor.

### 5. `paymentApprovedEmail(userName, payment, subscription)`
Confirmação de pagamento aprovado.

### 6. `passwordResetConfirmationEmail(userName)`
Confirmação de senha alterada com sucesso.

---

## 🔧 Novos Endpoints Disponíveis

### Esqueci minha senha
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "usuario@exemplo.com"
}
```

### Redefinir senha
```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "novaSenha123"
}
```

---

## 🗄️ Mudanças no Banco de Dados

### Tabela `users` - Novas colunas

```sql
ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255);
ALTER TABLE users ADD COLUMN reset_password_expires TIMESTAMP;
CREATE INDEX idx_users_reset_token ON users(reset_password_token);
```

> ✅ Já aplicado em produção (Neon PostgreSQL)

Se você usa banco local, rode:
```bash
psql -U seu_usuario -d subscrivery < backend/migrations/add_password_reset.sql
```

---

## 🎨 Personalizar Templates

### Localização
Todos os templates estão em:
```
backend/src/templates/emailTemplates.js
```

### Estrutura
```javascript
export const nomeDoTemplate = (parametros) => {
  const subject = 'Assunto do email';
  const html = baseTemplate('Título', `
    <!-- Conteúdo HTML aqui -->
  `);
  const text = 'Versão texto alternativa';
  
  return { subject, html, text };
};
```

### Design System
- **Cores**: Gradiente roxo (#7c3aed) para azul (#2563eb)
- **Fonte**: System fonts (seguro para emails)
- **Botões**: Estilo consistente com hover effect
- **Largura**: Máximo 600px (padrão email)

---

## 🐛 Troubleshooting

### ❌ "Erro na configuração de email"

**Causa**: Variáveis de ambiente incorretas

**Solução**:
1. Verifique se as 5 variáveis EMAIL_* estão no `.env`
2. Certifique-se que não há espaços na senha
3. Reinicie o servidor

---

### ❌ Email não está chegando

**Soluções**:
1. Verifique a pasta SPAM
2. Teste com `node src/testEmails.js`
3. Verifique os logs do servidor
4. Confirme que o email do destinatário está correto

---

### ❌ "Cannot find module '../config/email.js'"

**Causa**: Você não puxou as últimas mudanças do GitHub

**Solução**:
```bash
git pull origin main
npm install
```

---

## 📚 Documentação Completa

Para detalhes técnicos completos, veja:
- [API_EMAILS.md](./docs/API_EMAILS.md) - Documentação técnica detalhada
- [CONFIGURAR_EMAIL.md](../CONFIGURAR_EMAIL.md) - Guia de configuração do zero

---

## 🤝 Trabalhando em Equipe

### Antes de commitar código com emails

1. ✅ Teste localmente com `testEmails.js`
2. ✅ Verifique que usa `.catch()` para não bloquear
3. ✅ Documente no commit se adicionou novo template
4. ✅ Atualize esta doc se necessário

### Conflitos de merge

Se houver conflito em arquivos de email:
1. Não remova templates existentes
2. Adicione seu novo template ao lado
3. Peça review de quem criou o sistema original

---

## ✨ Exemplos Práticos

### Exemplo 1: Enviar email em um controller novo

```javascript
// meuController.js
import { sendEmail } from '../config/email.js';
import { welcomeEmail } from '../templates/emailTemplates.js';

export const minhaFuncao = async (req, res) => {
  try {
    // ... lógica do seu endpoint
    
    // Enviar email
    const emailContent = welcomeEmail(req.user.name);
    sendEmail({
      to: req.user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    }).catch(err => console.error('Erro email:', err));
    
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
```

### Exemplo 2: Criar novo template

```javascript
// templates/emailTemplates.js

export const meuNovoEmail = (userName, dadosCustom) => {
  const subject = '🎉 Título do Meu Email';
  
  const html = baseTemplate('Olá!', `
    <p>Olá <strong>${userName}</strong>,</p>
    <p>Conteúdo do email aqui...</p>
    <a href="${dadosCustom.link}" class="button">
      Clique Aqui
    </a>
  `);
  
  const text = `
    Olá ${userName},
    
    Conteúdo do email em texto puro...
    
    Link: ${dadosCustom.link}
  `;
  
  return { subject, html, text };
};
```

---

## 📞 Dúvidas?

Entre em contato com quem implementou o sistema de emails ou consulte a documentação completa.

**Sistema implementado por**: Bruno Cabral  
**Data**: 16/12/2025  
**Commit**: `3a8ee7d`

---

**Última atualização**: 16/12/2025
