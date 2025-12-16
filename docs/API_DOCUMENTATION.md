# 📚 Documentação da API Asaas Sandbox

**Documentação completa da integração com Asaas Sandbox para gerenciamento de clientes, pagamentos e assinaturas**

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Endpoints](#endpoints)
4. [Exemplos de Uso](#exemplos-de-uso)
5. [Códigos de Status](#códigos-de-status)
6. [Tratamento de Erros](#tratamento-de-erros)

---

## 🎯 Visão Geral

**API REST** integrada com **Asaas Sandbox** para gerenciar:
- ✅ Clientes (criação, listagem)
- ✅ Pagamentos (criação, listagem, busca)
- ✅ Assinaturas (criação, busca, cancelamento)

**Base URL:** `http://localhost:3000`

**Ambiente:** Sandbox Asaas (testes sem cobranças reais)

---

## 🔐 Autenticação

A API usa **autenticação via Asaas API Key** configurada em `.env`:

```env
ASAAS_API_KEY=seu_token_aqui
ASAAS_API_URL=https://sandbox.asaas.com/api/v3
```

**Todos os requests** automaticamente enviam a chave no header:
```
access_token: ASAAS_API_KEY
```

---

## 📍 Endpoints

### 1. **Health Check**

Verifica se o servidor está funcionando.

**Requisição:**
```http
GET /health
```

**Resposta (200 OK):**
```json
{
  "status": "ok",
  "message": "Servidor está rodando",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

---

### 2. **Clientes (Customers)**

#### 2.1 - Criar Cliente

Cria um novo cliente no Asaas.

**Requisição:**
```http
POST /api/customers
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "document": "12345678901234",
  "mobilePhone": "11987654321"
}
```

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | string | ✅ Sim | Nome do cliente |
| `email` | string | ✅ Sim | Email válido |
| `document` | string | ✅ Sim | CPF/CNPJ (14 dígitos) |
| `mobilePhone` | string | ❌ Não | Telefone com DDD |

**Resposta (201 Created):**
```json
{
  "success": true,
  "customer": {
    "id": "cus_000007314540",
    "name": "João Silva",
    "email": "joao@example.com",
    "document": "12345678901234",
    "mobilePhone": "11987654321",
    "status": "ACTIVE"
  }
}
```

---

#### 2.2 - Listar Clientes

Lista todos os clientes com filtros opcionais.

**Requisição:**
```http
GET /api/customers?limit=10&offset=0
```

**Parâmetros Query:**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `limit` | number | 10 | Quantidade de resultados |
| `offset` | number | 0 | Paginação (deslocamento) |

**Resposta (200 OK):**
```json
{
  "success": true,
  "customers": {
    "object": "list",
    "hasMore": false,
    "totalCount": 2,
    "limit": 10,
    "offset": 0,
    "data": [
      {
        "id": "cus_000007314540",
        "name": "João Silva",
        "email": "joao@example.com",
        "status": "ACTIVE"
      },
      {
        "id": "cus_000007314541",
        "name": "Maria Santos",
        "email": "maria@example.com",
        "status": "ACTIVE"
      }
    ]
  }
}
```

---

### 3. **Pagamentos (Payments)**

#### 3.1 - Criar Pagamento

Cria uma cobrança/fatura para um cliente.

**Requisição:**
```http
POST /api/payments
Content-Type: application/json

{
  "customerId": "cus_000007314540",
  "value": 99.90,
  "description": "Pagamento do Plano Premium",
  "dueDate": "2025-12-25",
  "billingType": "CREDIT_CARD"
}
```

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `customerId` | string | ✅ Sim | ID do cliente |
| `value` | number | ✅ Sim | Valor da cobrança |
| `description` | string | ❌ Não | Descrição |
| `dueDate` | string | ✅ Sim | Data de vencimento (YYYY-MM-DD) |
| `billingType` | string | ❌ Não | Tipo: CREDIT_CARD (padrão) |

**Resposta (201 Created):**
```json
{
  "success": true,
  "payment": {
    "id": "pay_04d3ey0puk0dtfqe",
    "customer": "cus_000007314540",
    "value": 99.90,
    "netValue": 97.43,
    "description": "Pagamento do Plano Premium",
    "billingType": "CREDIT_CARD",
    "status": "PENDING",
    "dueDate": "2025-12-25",
    "dateCreated": "2025-12-16",
    "invoiceUrl": "https://sandbox.asaas.com/i/04d3ey0puk0dtfqe",
    "invoiceNumber": "12308573"
  }
}
```

---

#### 3.2 - Listar Pagamentos

Lista todos os pagamentos com filtros opcionais.

**Requisição:**
```http
GET /api/payments?status=PENDING&limit=10&offset=0
```

**Parâmetros Query:**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `status` | string | - | Filtro: PENDING, CONFIRMED, RECEIVED, CANCELED |
| `customer` | string | - | Filtro por ID do cliente |
| `limit` | number | 10 | Quantidade de resultados |
| `offset` | number | 0 | Paginação |

**Resposta (200 OK):**
```json
{
  "success": true,
  "payments": {
    "object": "list",
    "hasMore": false,
    "totalCount": 3,
    "limit": 10,
    "offset": 0,
    "data": [
      {
        "id": "pay_04d3ey0puk0dtfqe",
        "customer": "cus_000007314540",
        "value": 99.90,
        "status": "PENDING",
        "dueDate": "2025-12-25"
      },
      {
        "id": "pay_o2zrc4vtcndb23nq",
        "customer": "cus_000007314607",
        "value": 99.90,
        "status": "PENDING",
        "dueDate": "2025-12-25"
      }
    ]
  }
}
```

---

#### 3.3 - Buscar Pagamento por ID

Obtém detalhes de um pagamento específico.

**Requisição:**
```http
GET /api/payments/pay_04d3ey0puk0dtfqe
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | string | ID do pagamento |

**Resposta (200 OK):**
```json
{
  "success": true,
  "payment": {
    "id": "pay_04d3ey0puk0dtfqe",
    "customer": "cus_000007314540",
    "value": 99.90,
    "netValue": 97.43,
    "description": "Pagamento do Plano Premium",
    "billingType": "CREDIT_CARD",
    "status": "PENDING",
    "dueDate": "2025-12-25",
    "dateCreated": "2025-12-16",
    "invoiceUrl": "https://sandbox.asaas.com/i/04d3ey0puk0dtfqe",
    "discount": {
      "value": 0,
      "type": "FIXED"
    },
    "fine": {
      "value": 0,
      "type": "FIXED"
    },
    "interest": {
      "value": 0,
      "type": "PERCENTAGE"
    }
  }
}
```

---

### 4. **Assinaturas (Subscriptions)**

#### 4.1 - Criar Assinatura

Cria uma assinatura recorrente para um cliente.

**Requisição:**
```http
POST /api/subscriptions
Content-Type: application/json

{
  "customerId": "cus_000007314540",
  "value": 29.90,
  "nextDueDate": "2025-01-15",
  "description": "Plano Mensal Premium",
  "cycle": "MONTHLY",
  "billingType": "CREDIT_CARD"
}
```

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `customerId` | string | ✅ Sim | ID do cliente |
| `value` | number | ✅ Sim | Valor mensal |
| `nextDueDate` | string | ✅ Sim | Próxima data de vencimento (YYYY-MM-DD) |
| `description` | string | ❌ Não | Descrição |
| `cycle` | string | ❌ Não | MONTHLY, QUARTERLY, SEMI_ANNUAL, YEARLY |
| `billingType` | string | ❌ Não | CREDIT_CARD (padrão) |

**Resposta (201 Created):**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_abc123def456",
    "customer": "cus_000007314540",
    "value": 29.90,
    "nextDueDate": "2025-01-15",
    "description": "Plano Mensal Premium",
    "billingType": "CREDIT_CARD",
    "status": "ACTIVE",
    "cycle": "MONTHLY",
    "dateCreated": "2025-12-16"
  }
}
```

---

#### 4.2 - Buscar Assinatura por ID

Obtém detalhes de uma assinatura específica.

**Requisição:**
```http
GET /api/subscriptions/sub_abc123def456
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | string | ID da assinatura |

**Resposta (200 OK):**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_abc123def456",
    "customer": "cus_000007314540",
    "value": 29.90,
    "nextDueDate": "2025-01-15",
    "description": "Plano Mensal Premium",
    "billingType": "CREDIT_CARD",
    "status": "ACTIVE",
    "cycle": "MONTHLY",
    "dateCreated": "2025-12-16"
  }
}
```

---

#### 4.3 - Cancelar Assinatura

Cancela uma assinatura existente.

**Requisição:**
```http
DELETE /api/subscriptions/sub_abc123def456
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | string | ID da assinatura |

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Assinatura cancelada com sucesso",
  "result": {
    "id": "sub_abc123def456",
    "status": "CANCELED"
  }
}
```

---

## 💻 Exemplos de Uso

### cURL

```bash
# 1. Health Check
curl http://localhost:3000/health

# 2. Criar Cliente
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "document": "12345678901234",
    "mobilePhone": "11987654321"
  }'

# 3. Listar Clientes
curl http://localhost:3000/api/customers

# 4. Criar Pagamento
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cus_000007314540",
    "value": 99.90,
    "description": "Pagamento",
    "dueDate": "2025-12-25"
  }'

# 5. Listar Pagamentos
curl http://localhost:3000/api/payments

# 6. Criar Assinatura
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cus_000007314540",
    "value": 29.90,
    "nextDueDate": "2025-01-15",
    "description": "Plano Mensal"
  }'

# 7. Cancelar Assinatura
curl -X DELETE http://localhost:3000/api/subscriptions/sub_abc123def456
```

### JavaScript/Node.js

```javascript
// Criar cliente
const response = await fetch('http://localhost:3000/api/customers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'João Silva',
    email: 'joao@example.com',
    document: '12345678901234',
    mobilePhone: '11987654321'
  })
});

const { customer } = await response.json();
console.log('Customer ID:', customer.id);
```

### REST Client (VS Code)

```http
### Criar Cliente
POST http://localhost:3000/api/customers
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "document": "12345678901234",
  "mobilePhone": "11987654321"
}

### Listar Pagamentos
GET http://localhost:3000/api/payments

### Criar Pagamento
POST http://localhost:3000/api/payments
Content-Type: application/json

{
  "customerId": "cus_000007314540",
  "value": 99.90,
  "description": "Pagamento",
  "dueDate": "2025-12-25"
}
```

---

## 📊 Códigos de Status HTTP

| Código | Significado | Descrição |
|--------|-------------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos ou faltantes |
| 404 | Not Found | Recurso não encontrado |
| 500 | Server Error | Erro interno do servidor |

---

## ⚠️ Tratamento de Erros

Todos os erros retornam JSON com informações detalhadas:

### Erro de Validação (400)

```json
{
  "error": "Nome, email e documento são obrigatórios"
}
```

### Erro do Asaas (400)

```json
{
  "error": "Email inválido",
  "details": {
    "errors": [
      {
        "code": "invalid_email",
        "description": "Email inválido"
      }
    ]
  }
}
```

### Erro do Servidor (500)

```json
{
  "error": "Erro interno do servidor"
}
```

---

## 🧪 Teste Automatizado

Para testar todos os endpoints automaticamente:

```bash
npm test
```

Retorna relatório com:
- ✅ Endpoints que funcionam
- ❌ Erros encontrados
- 📊 Resumo final

---

## 📂 Estrutura de Arquivos

```
src/
├── server.js              # Servidor Express
├── config/
│   └── asaas.js          # Cliente Asaas
└── routes/
    └── asaas.js          # Endpoints da API

test-all-endpoints.js      # Teste automatizado
.env                       # Variáveis de ambiente
package.json               # Dependências
```

---

## 🔗 Recursos Relacionados

- [TESTE_RAPIDO.md](TESTE_RAPIDO.md) - Quick start (5 min)
- [TESTANDO_API.md](TESTANDO_API.md) - Guia completo de testes
- [OBTER_CUSTOMER_ID.md](OBTER_CUSTOMER_ID.md) - Como obter IDs
- [SETUP.md](SETUP.md) - Configuração inicial

---

## 📞 Suporte

Para problemas com a integração:

1. Verifique [TROUBLESHOOTING_API.md](TROUBLESHOOTING_API.md)
2. Confirme que `.env` tem `ASAAS_API_KEY` válida
3. Teste com `npm run dev` e `npm test`
4. Consulte docs do Asaas: https://docs.asaas.com

---

**Última atualização:** 16 de dezembro de 2025

**Status:** ✅ Funcionando 100%
