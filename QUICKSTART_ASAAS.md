# 🚀 GUIA DE INÍCIO RÁPIDO - ASAAS

## ⏱️ Tempo Estimado: 5 minutos

### ✅ O que você precisa:
- [ ] Conta Asaas (criar em https://asaas.com)
- [ ] Arquivo `.env` editável
- [ ] Terminal/CMD aberto na pasta `backend`

---

## 📝 PASSO 1: Obter Credenciais (2 min)

### 1. Acessar Asaas
```
1. Vá para https://dashboard.asaas.com
2. Faça login ou crie uma conta (gratuito)
3. No menu, clique em "Configurações"
4. Selecione "Integração"
5. Copie sua "API Key" (começará com "aac_")
```

### 2. Obter Wallet ID
```
1. Volte para "Configurações"
2. Clique em "Contas Bancárias"
3. Copie o ID da conta (ou crie uma)
```

---

## 🔧 PASSO 2: Configurar Ambiente (1 min)

### Editar `backend/.env`:

```bash
# Adicione NO FINAL do arquivo:

# Asaas Configuration
ASAAS_API_KEY=aac_sua_chave_aqui
ASAAS_WALLET_ID=seu_wallet_id_aqui
ASAAS_ENV=sandbox
ASAAS_WEBHOOK_TOKEN=segredo_seu_webhook_123
ASAAS_WEBHOOK_URL=https://seu-dominio.com/api/webhooks/asaas
```

**⚠️ NÃO ESQUEÇA:**
- Substitua `aac_sua_chave_aqui` pela sua chave real
- Mantenha `ASAAS_ENV=sandbox` para testes
- Gere um token seguro: `openssl rand -base64 32`

---

## 📦 PASSO 3: Instalar & Executar (1 min)

```bash
# Na pasta backend
npm install

# Reiniciar servidor
npm run dev
```

**Você verá:**
```
✅ Asaas configurado em modo: sandbox
```

---

## 🗄️ PASSO 4: Banco de Dados (1 min)

```bash
# Execute a migration
psql -U postgres -d subscrivery -f migrations/add_asaas_integration.sql
```

**Ou se preferir manualmente:**
```bash
# Conecte ao PostgreSQL
psql -U postgres -d subscrivery

# Cole o conteúdo de migrations/add_asaas_integration.sql
\quit
```

---

## 🧪 PASSO 5: Testar (1 min)

### Teste Rápido com cURL:

```bash
# 1. Faça login primeiro para obter JWT token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "password": "sua_senha"
  }'

# Copie o "token" da resposta

# 2. Criar cobrança
curl -X POST http://localhost:5000/api/payments/asaas/charge \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "subscription_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 10.00,
    "payment_method": "pix"
  }'

# Você verá:
# {
#   "success": true,
#   "data": {
#     "asaasId": "pay_123456789",
#     "url": "https://sandbox.asaas.com/...",
#     "status": "PENDING"
#   }
# }
```

---

## ✨ Pronto! Você está integrado! 🎉

### Próximas Ações:

1. **Ler documentação completa:**
   - Abra: `INTEGRACAO_ASAAS.md`

2. **Executar testes automáticos:**
   ```bash
   # Edite backend/src/tests/asaas.test.js com seus dados
   # Depois execute:
   node src/tests/asaas.test.js
   ```

3. **Integrar no Frontend:**
   - Veja exemplos em: `INTEGRACAO_ASAAS.md` → Seção "Exemplos de Uso"

4. **Configurar Webhooks em Produção:**
   - Quando fizer deploy, atualize `ASAAS_WEBHOOK_URL` com seu domínio real

---

## 🆘 Troubleshooting Rápido

### ❌ "ASAAS_API_KEY não configurada"
**Solução:**
```
1. Verifique se .env existe
2. Verifique se ASAAS_API_KEY está preenchida
3. Reinicie o servidor (npm run dev)
```

### ❌ "Erro ao criar cobrança: subscription não encontrada"
**Solução:**
```
1. Use um subscription_id válido do seu banco
2. SELECT * FROM subscriptions LIMIT 1;
3. Use um ID que existe
```

### ❌ "Token de webhook inválido"
**Solução:**
```
1. Verifique se ASAAS_WEBHOOK_TOKEN está definido
2. Use o mesmo token no header: x-webhook-token
3. Valores devem ser idênticos
```

---

## 📚 Links Importantes

| Recurso | Link |
|---------|------|
| **Documentação Completa** | [INTEGRACAO_ASAAS.md](INTEGRACAO_ASAAS.md) |
| **Análise Técnica** | [ANALISE_ASAAS.md](ANALISE_ASAAS.md) |
| **Sumário Executivo** | [ASAAS_SUMARIO.md](ASAAS_SUMARIO.md) |
| **Documentação Asaas** | https://asaas.com/api |
| **Dashboard Asaas** | https://dashboard.asaas.com |

---

## 🎯 Próximos Passos Recomendados

### Hoje (0-1 hora)
- [x] Configurar credenciais ✅
- [x] Testar cobrança simples ✅
- [ ] Testar webhook localmente

### Esta Semana
- [ ] Integrar no frontend
- [ ] Testar fluxo completo
- [ ] Configurar emails de notificação

### Próximas Semanas
- [ ] Configurar em produção
- [ ] Implementar testes automáticos
- [ ] Monitorar transações

---

## 💡 Dicas Profissionais

1. **Use Sandbox primeiro:** Sempre teste com `ASAAS_ENV=sandbox`
2. **Gere tokens únicos:** Cada webhook token deve ser único
3. **Logging:** Monitore os logs para erros de webhook
4. **Rate limiting:** Implemente limite de requisições
5. **Testes de carga:** Teste com múltiplas cobranças

---

## ✅ Checklist de Conclusão

- [ ] Credenciais Asaas obtidas
- [ ] `.env` configurado
- [ ] `npm install` executado
- [ ] Servidor rodando
- [ ] Migration executada
- [ ] Primeiro teste bem-sucedido
- [ ] Documentação lida

**Quando tudo acima estiver marcado: PARABÉNS! 🎉**

---

**Tempo Total: ~5-10 minutos**

Para ajuda: Leia o arquivo `INTEGRACAO_ASAAS.md` (seção Troubleshooting)
