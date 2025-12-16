# 📧 Configuração de Email - Passo a Passo

## 🔑 Opção 1: Gmail (Recomendado para testes)

### 1. Ativar Autenticação de 2 Fatores
1. Acesse: https://myaccount.google.com/security
2. Role até "Como fazer login no Google"
3. Clique em "Verificação em duas etapas"
4. Siga as instruções para ativar

### 2. Gerar Senha de App
1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione "Email"
3. Selecione "Outro (nome personalizado)"
4. Digite: **Subscrivery Backend**
5. Clique **"Gerar"**
6. **COPIE a senha de 16 caracteres** (exemplo: dfwx zjip kuen fkoq)

### 3. Adicionar no .env

Edite o arquivo `backend/.env` e adicione:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-app-16-caracteres
EMAIL_FROM=Subscrivery <noreply@subscrivery.com>
```

⚠️ **Importante:**
- Use SEU email no `EMAIL_USER`
- Use a senha de app de 16 caracteres (SEM espaços) no `EMAIL_PASSWORD`
- NÃO use sua senha normal do Gmail!

---

## 🔑 Opção 2: SendGrid (Recomendado para produção)

### 1. Criar Conta
1. Acesse: https://sendgrid.com
2. Crie conta gratuita (100 emails/dia)

### 2. Gerar API Key
1. Settings → API Keys
2. Create API Key
3. Copie a chave

### 3. Adicionar no .env

```env
# Email Configuration
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SUA_API_KEY_AQUI
EMAIL_FROM=Subscrivery <noreply@subscrivery.com>
```

---

## ✅ Depois de configurar:

1. Reinicie o servidor:
```powershell
npm run dev
```

2. Você verá a mensagem:
```
✅ Servidor de email pronto para enviar mensagens
```

3. Se der erro:
```
❌ Erro na configuração de email
```
→ Verifique EMAIL_USER e EMAIL_PASSWORD no .env

---

**Pronto!** Emails configurados. Continue com o próximo passo do checklist.
