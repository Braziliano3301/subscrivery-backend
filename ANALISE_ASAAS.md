# 📋 ANÁLISE COMPLETA - Configuração Asaas

## ✅ ARQUIVOS JÁ EXISTENTES (MAPEAMENTO)

### Backend - Estrutura Base
```
backend/
├── src/
│   ├── server.js                           # Servidor Express principal
│   ├── config/
│   │   ├── database.js                    # Conexão PostgreSQL ✅
│   │   ├── email.js                       # Configuração Nodemailer ✅
│   │   ├── swagger.js                     # Documentação Swagger ✅
│   │   └── asaas.js                       # ✨ NOVO - Configuração Asaas
│   ├── controllers/
│   │   ├── auth.controller.js             # Autenticação JWT ✅
│   │   ├── payment.controller.js          # Controller de pagamentos ✅
│   │   ├── subscription.controller.js     # Assinaturas ✅
│   │   └── ... (outros controllers) ✅
│   ├── models/
│   │   ├── payment.model.js               # Model de pagamentos ✅
│   │   ├── user.model.js                  # Model de usuários ✅
│   │   └── ... (outros models) ✅
│   ├── routes/
│   │   ├── payment.routes.js              # Rotas de pagamentos ✅
│   │   └── ... (outras rotas) ✅
│   ├── middlewares/
│   │   ├── auth.middleware.js             # JWT middleware ✅
│   │   └── validate.middleware.js         # Validação ✅
│   ├── services/
│   │   └── asaas.service.js              # ✨ NOVO - Serviço Asaas
│   ├── templates/
│   │   └── emailTemplates.js              # Templates de email ✅
│   └── testEmails.js
├── package.json                            # ⚠️ PRECISA adicionar axios
├── .env.example                            # ⚠️ PRECISA adicionar Asaas vars
└── .env                                    # ⚠️ PRECISA adicionar Asaas vars

```

## 📊 ARQUIVOS CRIADOS/MODIFICADOS

### 1️⃣ `/backend/src/config/asaas.js` ✅ CRIADO
- Configurações do Asaas (URLs, API_KEY, ambiente sandbox/prod)
- Constantes de métodos de pagamento
- Ciclos de recorrência
- Configurações de webhook
- Função de validação

### 2️⃣ `/backend/src/services/asaas.service.js` ✅ CRIADO
- **Classe AsaasService** com métodos para:
  - **Clientes:** createCustomer, getCustomer, updateCustomer, listCustomers
  - **Cobranças:** createCharge, getCharge, updateCharge, refundCharge, confirmCharge, listCharges
  - **Assinaturas:** createSubscription, getSubscription, updateSubscription, cancelSubscription, listSubscriptions
  - **Utilities:** formatDocument, generateDueDate, isSandbox

## ⚠️ ARQUIVOS QUE PRECISA DE MODIFICAÇÕES

### 1. `/backend/package.json`
**PRECISA:** Adicionar `axios` como dependência
```json
"dependencies": {
  "axios": "^1.6.0",  // ← ADICIONAR
  ...
}
```

### 2. `/backend/.env.example`
**PRECISA:** Adicionar variáveis Asaas
```
# Asaas Configuration
ASAAS_API_KEY=your_asaas_api_key
ASAAS_WALLET_ID=your_asaas_wallet_id
ASAAS_ENV=sandbox
ASAAS_WEBHOOK_URL=https://seu-dominio.com/api/webhooks/asaas
ASAAS_WEBHOOK_TOKEN=your_webhook_token
```

### 3. `/backend/.env` (seu arquivo real)
**PRECISA:** Adicionar as mesmas variáveis com seus valores reais

### 4. `/backend/src/controllers/payment.controller.js`
**PRECISA:** Adicionar métodos para integrar com Asaas:
- `createPaymentWithAsaas()` - Criar cobrança via Asaas
- `createSubscriptionWithAsaas()` - Criar assinatura recorrente
- `handleAsaasWebhook()` - Processar notificações do Asaas

### 5. `/backend/src/routes/payment.routes.js`
**PRECISA:** Adicionar rotas para:
- POST `/api/payments/asaas/charge` - Criar cobrança
- POST `/api/payments/asaas/subscription` - Criar assinatura
- POST `/api/webhooks/asaas` - Webhook para notificações

### 6. `/backend/src/server.js`
**PRECISA:** Registrar rota de webhook (sem validação de token para webhooks)

## 🗄️ DATABASE - CONSIDERAÇÕES

O banco atual tem a tabela `payments` com:
- id (UUID)
- subscription_id (FK)
- amount (float)
- payment_method (string)
- status (pendente, aprovado, recusado)
- transaction_id (string)
- payment_date (timestamp)
- created_at (timestamp)

**NOVO CAMPO A CONSIDERAR:**
```sql
ALTER TABLE payments ADD COLUMN asaas_id VARCHAR(255) UNIQUE;
ALTER TABLE payments ADD COLUMN asaas_status VARCHAR(50);
```

## 🚀 PRÓXIMOS PASSOS (RECOMENDADO)

1. ✅ Instalar axios: `npm install axios`
2. ✅ Atualizar `.env.example` com variáveis Asaas
3. ✅ Atualizar `.env` com valores reais
4. ✅ Criar novos métodos no payment.controller.js
5. ✅ Adicionar rotas no payment.routes.js
6. ✅ Criar webhook handler em novo arquivo
7. ✅ Registrar rota de webhook no server.js
8. ✅ Testar integração no Asaas sandbox

## 📝 TEMPLATE DO ASAAS SERVICE

O arquivo `asaas.service.js` está pronto com:
- ✅ Criação de clientes
- ✅ Cobrança única
- ✅ Assinatura recorrente
- ✅ Reembolsos
- ✅ Cancelamentos
- ✅ Listagem e atualização

## ⚡ IMPORTANTE: SEGURANÇA

- ✅ Nunca commitar `.env` com credenciais reais
- ✅ Usar `.env.example` como template
- ✅ Validar tokens de webhook
- ✅ Logar todas as transações Asaas
- ✅ Usar sandbox para testes

---

**RESUMO:** 2 arquivos criados, 6 arquivos que precisam ser modificados/criados
