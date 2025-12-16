# 🏦 Integração Asaas - Documentação Completa

## 📋 Índice
1. [Configuração Inicial](#configuração-inicial)
2. [Arquivos Criados](#arquivos-criados)
3. [Endpoints da API](#endpoints-da-api)
4. [Fluxo de Pagamento](#fluxo-de-pagamento)
5. [Webhooks](#webhooks)
6. [Exemplos de Uso](#exemplos-de-uso)
7. [Testes](#testes)

---

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
cd backend
npm install
```

Isso instalará o `axios` junto com outras dependências.

### 2. Configurar Variáveis de Ambiente

Edite seu arquivo `.env`:

```env
# Asaas Configuration
ASAAS_API_KEY=sua_chave_api_asaas_aqui
ASAAS_WALLET_ID=seu_wallet_id_asaas_aqui
ASAAS_ENV=sandbox  # ou 'production' quando pronto
ASAAS_WEBHOOK_URL=https://seu-dominio.com/api/webhooks/asaas
ASAAS_WEBHOOK_TOKEN=seu_token_webhook_seguro
```

**Onde encontrar essas credenciais:**
- Acesse [Asaas Dashboard](https://dashboard.asaas.com)
- **API_KEY**: Configurações → Integração → API
- **WALLET_ID**: Configurações → Contas Bancárias
- **WEBHOOK_TOKEN**: Gere um token seguro (recomendado: use `openssl rand -base64 32`)

### 3. Executar Migration do Banco de Dados

```bash
psql -U postgres -d subscrivery -f migrations/add_asaas_integration.sql
```

Isso adicionará as colunas necessárias:
- `users.asaas_customer_id`
- `payments.asaas_id` e `payments.asaas_status`
- `subscriptions.asaas_id` e `subscriptions.asaas_status`

### 4. Reiniciar o Servidor

```bash
npm run dev  # ou npm start
```

---

## 📁 Arquivos Criados

```
backend/src/
├── config/
│   └── asaas.js                          # ✨ Configurações Asaas
├── services/
│   ├── asaas.service.js                  # ✨ Serviço HTTP para Asaas
│   └── asaasWebhook.handler.js           # ✨ Handler de webhooks
├── controllers/
│   └── asaasPayment.controller.js        # ✨ Controller de pagamentos Asaas
├── routes/
│   └── asaas.routes.js                   # ✨ Rotas de pagamentos Asaas
└── migrations/
    └── add_asaas_integration.sql         # ✨ Script do banco de dados

server.js                                  # ✏️ Modificado (rotas adicionadas)
package.json                               # ✏️ Modificado (axios adicionado)
.env.example                               # ✏️ Modificado (variáveis Asaas adicionadas)
```

---

## 🔌 Endpoints da API

### Base URL
```
http://localhost:5000/api/payments/asaas
```

### 1. Criar Cobrança Única

**POST** `/charge`

```bash
curl -X POST http://localhost:5000/api/payments/asaas/charge \
  -H "Authorization: Bearer seu_token_jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "subscription_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 99.90,
    "payment_method": "pix",
    "dueDate": "2025-12-25"
  }'
```

**Request:**
```json
{
  "subscription_id": "UUID",           // Obrigatório
  "amount": 99.90,                     // Obrigatório (> 0)
  "payment_method": "pix",             // Obrigatório: pix | cartao_credito | cartao_debito | boleto | transferencia
  "dueDate": "2025-12-25"              // Opcional (YYYY-MM-DD)
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Cobrança criada com sucesso",
  "data": {
    "paymentId": "UUID",
    "asaasId": "pay_123456789",
    "amount": 99.90,
    "status": "PENDING",
    "dueDate": "2025-12-25",
    "billingType": "PIX",
    "url": "https://sandbox.asaas.com/...checkout_url..."
  }
}
```

---

### 2. Criar Assinatura Recorrente

**POST** `/subscription`

```bash
curl -X POST http://localhost:5000/api/payments/asaas/subscription \
  -H "Authorization: Bearer seu_token_jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "subscription_id": "550e8400-e29b-41d4-a716-446655440000",
    "cycle": "mensal"
  }'
```

**Request:**
```json
{
  "subscription_id": "UUID",      // Obrigatório
  "cycle": "mensal"               // Obrigatório: mensal | trimestral | semestral | anual
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Assinatura recorrente criada com sucesso",
  "data": {
    "subscriptionId": "UUID",
    "asaasId": "sub_123456789",
    "planName": "Plano Premium",
    "value": 99.90,
    "cycle": "MONTHLY",
    "status": "ACTIVE",
    "nextDueDate": "2025-01-15"
  }
}
```

---

### 3. Consultar Status de Cobrança

**GET** `/{asaasId}`

```bash
curl -X GET "http://localhost:5000/api/payments/asaas/pay_123456789" \
  -H "Authorization: Bearer seu_token_jwt"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "asaasId": "pay_123456789",
    "status": "RECEIVED",
    "value": 99.90,
    "dueDate": "2025-12-25",
    "billingType": "PIX",
    "url": "https://sandbox.asaas.com/...checkout_url..."
  }
}
```

---

### 4. Reembolsar Pagamento

**POST** `/{asaasId}/refund`

```bash
curl -X POST "http://localhost:5000/api/payments/asaas/pay_123456789/refund" \
  -H "Authorization: Bearer seu_token_jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00
  }'
```

**Request:**
```json
{
  "amount": 50.00  // Opcional. Se omitido, reembolsa o valor total
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reembolso processado com sucesso",
  "data": {
    "refundId": "ref_123456789",
    "amount": 50.00,
    "status": "REFUNDED"
  }
}
```

---

### 5. Webhook (sem autenticação JWT)

**POST** `/api/webhooks/asaas`

Asaas enviará notificações para este endpoint. Pode ser chamado a partir de:
- Seu dashboard Asaas (teste manual)
- Automaticamente quando um pagamento muda de status

**Headers obrigatórios:**
```
x-webhook-token: seu_token_webhook_seguro
```

**Ou via query parameter:**
```
POST /api/webhooks/asaas?token=seu_token_webhook_seguro
```

---

## 💳 Fluxo de Pagamento

### Fluxo 1: Cobrança Única (PIX/Boleto)

```
1. Cliente faz login → JWT obtido
2. Cliente clica em "Pagar"
3. Frontend envia POST /api/payments/asaas/charge
4. Backend:
   - Valida dados
   - Cria/busca cliente no Asaas
   - Cria cobrança no Asaas
   - Retorna URL de pagamento (ou dados para QR Code PIX)
5. Frontend redireciona para URL ou exibe QR Code
6. Cliente paga via PIX/Boleto
7. Asaas envia webhook com atualização de status
8. Backend atualiza status do pagamento no banco local
9. Email de confirmação é enviado
```

### Fluxo 2: Assinatura Recorrente

```
1. Cliente seleciona plano com assinatura
2. Frontend envia POST /api/payments/asaas/subscription
3. Backend:
   - Valida dados
   - Cria cliente no Asaas (se necessário)
   - Cria assinatura recorrente no Asaas
   - Vincula assinatura local com Asaas
4. Asaas cobra automaticamente a cada ciclo
5. Webhooks notificam a cada cobrança
6. Backend atualiza status no banco local
```

---

## 🔔 Webhooks

### Eventos de Pagamento

| Evento | Significado | Status Local |
|--------|-------------|--------------|
| `PAYMENT_CONFIRMED` | Pagamento confirmado | `aprovado` |
| `PAYMENT_RECEIVED` | Pagamento recebido | `aprovado` |
| `PAYMENT_OVERDUE` | Pagamento vencido | `cancelado` |
| `PAYMENT_DELETED` | Pagamento deletado | `cancelado` |
| `PAYMENT_REFUNDED` | Pagamento reembolsado | `reembolsado` |
| `PAYMENT_RECEIVED_IN_CASH` | Pagamento em dinheiro | `aprovado` |

### Eventos de Assinatura

| Evento | Significado |
|--------|-------------|
| `SUBSCRIPTION_CREATED` | Assinatura criada |
| `SUBSCRIPTION_UPDATED` | Assinatura atualizada |
| `SUBSCRIPTION_DELETED` | Assinatura cancelada |
| `SUBSCRIPTION_REMINDER` | Lembrete de cobrança |
| `SUBSCRIPTION_CHARGE_CREATED` | Nova cobrança automática |

### Exemplo de Webhook

```json
{
  "id": "evt_123456789",
  "event": "PAYMENT_RECEIVED",
  "payment": {
    "id": "pay_123456789",
    "customer": "cus_123456789",
    "billingType": "PIX",
    "value": 99.90,
    "status": "RECEIVED",
    "dueDate": "2025-12-25"
  }
}
```

---

## 📝 Exemplos de Uso

### JavaScript/Node.js

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payments/asaas';
const token = 'seu_jwt_token_aqui';

// Criar cobrança
async function criarCobranca() {
  try {
    const response = await axios.post(`${API_URL}/charge`, {
      subscription_id: '550e8400-e29b-41d4-a716-446655440000',
      amount: 99.90,
      payment_method: 'pix'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Cobrança criada:', response.data);
    // Use response.data.data.url para redirecionar
    // Ou exiba QR Code se for PIX
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
}

// Criar assinatura
async function criarAssinatura() {
  try {
    const response = await axios.post(`${API_URL}/subscription`, {
      subscription_id: '550e8400-e29b-41d4-a716-446655440000',
      cycle: 'mensal'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Assinatura criada:', response.data);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
}

// Consultar status
async function consultarStatus(asaasId) {
  try {
    const response = await axios.get(`${API_URL}/${asaasId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Status:', response.data.data.status);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
}

// Reembolsar
async function reembolsar(asaasId, valor) {
  try {
    const response = await axios.post(
      `${API_URL}/${asaasId}/refund`,
      { amount: valor },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Reembolso processado:', response.data);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
}

criarCobranca();
```

### React

```jsx
import { useState } from 'react';
import axios from 'axios';

function PagamentoComponent({ subscriptionId, token }) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);

  const criarCobranca = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/payments/asaas/charge',
        {
          subscription_id: subscriptionId,
          amount: 99.90,
          payment_method: 'pix'
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      setUrl(response.data.data.url);
      // Redirecionar ou exibir QR Code
      window.location.href = response.data.data.url;
    } catch (error) {
      alert('Erro ao criar cobrança: ' + error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={criarCobranca} disabled={loading}>
      {loading ? 'Processando...' : 'Pagar com PIX'}
    </button>
  );
}

export default PagamentoComponent;
```

---

## 🧪 Testes

### 1. Teste de Cobrança (Sandbox)

```bash
# 1. Criar cobrança
curl -X POST http://localhost:5000/api/payments/asaas/charge \
  -H "Authorization: Bearer seu_token_jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "subscription_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 10.00,
    "payment_method": "pix"
  }'

# Salve o "asaasId" retornado

# 2. Simular webhook (teste manual no dashboard Asaas)
curl -X POST http://localhost:5000/api/webhooks/asaas \
  -H "x-webhook-token: seu_token_webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "evt_123",
    "event": "PAYMENT_RECEIVED",
    "payment": {
      "id": "pay_123456789",
      "customer": "cus_123456789",
      "billingType": "PIX",
      "value": 10.00,
      "status": "RECEIVED",
      "dueDate": "2025-12-25"
    }
  }'

# 3. Consultar status
curl -X GET http://localhost:5000/api/payments/asaas/pay_123456789 \
  -H "Authorization: Bearer seu_token_jwt"
```

### 2. Credenciais de Teste Asaas

Para testar em sandbox:
- **Email:** seu@email.com
- **Senha:** Configurada no Asaas
- **Números de teste:**
  - CPF: 11144477735
  - Cartão: 5162 3100 0000 0000 (válido)

### 3. Verificar Logs

```bash
# Ver logs do servidor
npm run dev

# Procurar por "Webhook Asaas recebido" nos logs
```

---

## 🔐 Segurança

### Recomendações

1. **Nunca commitar credenciais:** Use `.env` (gitignored)
2. **Validar tokens de webhook:** Sempre validar `x-webhook-token`
3. **HTTPS em produção:** Use SSL/TLS
4. **Rate limiting:** Implemente limite de requisições
5. **Logging:** Registre todas as transações Asaas
6. **Auditoria:** Rastreie quem criou/modificou pagamentos

### Variáveis Críticas

```env
ASAAS_API_KEY=SEGREDO       # Nunca exponha
ASAAS_WEBHOOK_TOKEN=SEGREDO # Nunca exponha
JWT_SECRET=SEGREDO          # Nunca exponha
```

---

## 📞 Suporte

- **Documentação Asaas:** https://asaas.com/api
- **Status API Asaas:** https://status.asaas.com
- **Email Suporte:** suporte@asaas.com

---

## 🚀 Próximas Melhorias

- [ ] Implementar retry logic para webhooks
- [ ] Adicionar suporte a parcelamento (installments)
- [ ] Integrar QR Code dinâmico para PIX
- [ ] Dashboard de estatísticas de pagamentos
- [ ] Cancelamento automático de pagamentos vencidos
- [ ] Integração com Webhook em produção (tunelamento ngrok ou similar)

---

**Documentação gerada em:** 16/12/2025
**Versão:** 1.0.0
