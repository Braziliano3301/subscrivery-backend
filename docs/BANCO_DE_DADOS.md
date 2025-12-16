# 📊 Estrutura do Banco de Dados PostgreSQL

## 🗂️ Arquivos Criados

```
src/
├── database/
│   └── schema.sql                 # Schema SQL com todas as tabelas
├── config/
│   └── database.js                # Configuração de conexão com PostgreSQL
└── models/
    ├── Customer.js                # Model de clientes
    ├── Payment.js                 # Model de pagamentos
    └── Subscription.js            # Model de assinaturas

scripts/
└── seed-database.js               # Script para popular dados de teste

setup-db.sh                         # Script bash para setup do banco
test-database-connection.js         # Teste de conexão
```

## 📋 Tabelas Criadas

### 1. **customers** (Clientes)
Armazena informações de clientes sincronizados do Asaas.

**Campos:**
- `id` (PK) - Identificador único
- `asaas_id` (UNIQUE) - ID do cliente no Asaas
- `name` - Nome do cliente
- `email` (UNIQUE) - E-mail
- `document` (UNIQUE) - CPF/CNPJ
- `mobile_phone` - Telefone
- `status` - active/inactive/deleted
- Campos de endereço (street, number, complement, city, state, postal_code)
- `created_at`, `updated_at` - Timestamps locais
- `asaas_created_at`, `asaas_updated_at` - Timestamps do Asaas

**Índices:**
- asaas_id, email, document, status, created_at

**Relacionamentos:**
```
customers (1) ──→ (N) payments
customers (1) ──→ (N) subscriptions
```

---

### 2. **payments** (Pagamentos)
Armazena todos os pagamentos sincronizados do Asaas.

**Campos:**
- `id` (PK)
- `asaas_id` (UNIQUE) - ID no Asaas
- `customer_id` (FK) - Referência ao cliente
- `value`, `net_value`, `gross_value` - Valores
- `due_date` - Data de vencimento
- `payment_date` - Data do pagamento
- `status` - PENDING/RECEIVED/OVERDUE/EXPIRED/REFUNDED/etc
- `billing_type` - BOLETO/CREDIT_CARD/PIX/DEBIT_ACCOUNT/MONEY
- `subscription_id` - Se é de uma assinatura
- Dados específicos (boleto_barcode, pix_qrcode, etc)
- Descontos, juros, multas
- Datas de sincronização

**Status Possíveis:**
```
PENDING        → Aguardando pagamento
RECEIVED       → Pagamento recebido
OVERDUE        → Vencido
EXPIRED        → Expirado
DELETED        → Deletado
REFUNDED       → Reembolsado
REFUND_REQUESTED → Reembolso solicitado
```

**Índices:**
- asaas_id, customer_id, status, due_date, billing_type, created_at

---

### 3. **subscriptions** (Assinaturas Recorrentes)
Armazena assinaturas de pagamentos recorrentes.

**Campos:**
- `id` (PK)
- `asaas_id` (UNIQUE) - ID no Asaas
- `customer_id` (FK) - Referência ao cliente
- `value` - Valor da assinatura
- `next_due_date` - Próximo vencimento
- `cycle` - DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY/CUSTOM
- `status` - ACTIVE/PAUSED/ENDED/EXPIRED
- `billing_type` - BOLETO/CREDIT_CARD/PIX/DEBIT_ACCOUNT/MONEY
- `max_payments` - Número máximo de pagamentos
- `payments_count` - Contador de pagamentos realizados
- `invoice_by_email` - Enviar fatura por email
- `auto_payment_failure_notifications` - Notificações de falha
- Referências a pagamentos anterior/próximo

**Índices:**
- asaas_id, customer_id, status, next_due_date, created_at

---

### 4. **webhooks** (Eventos do Asaas)
Armazena eventos recebidos via webhooks para processamento assíncrono.

**Campos:**
- `id` (PK)
- `event_type` - Tipo de evento (payment.received, subscription.created, etc)
- `asaas_object_id` - ID do objeto no Asaas
- `asaas_object_type` - Tipo do objeto (payment/subscription/customer)
- `payload` (JSONB) - Dados completos do evento
- `processed` - Flag de processamento
- `processed_at` - Quando foi processado
- `error_message` - Erros durante processamento

**Índices:**
- event_type, asaas_object_id, processed, created_at

---

### 5. **sync_logs** (Log de Sincronização)
Rastreia todas as sincronizações com Asaas.

**Campos:**
- `id` (PK)
- `entity_type` - customers/payments/subscriptions
- `operation` - create/update/delete/list
- `asaas_id` - ID no Asaas
- `local_id` - ID no banco local
- `status` - success/error/pending
- `error_message` - Detalhes de erros
- `request_body` (JSONB) - Requisição
- `response_body` (JSONB) - Resposta

**Índices:**
- entity_type, asaas_id, status, created_at

---

### 6. **users** (Usuários)
Gerencia usuários do sistema.

**Campos:**
- `id` (PK)
- `username` (UNIQUE)
- `email` (UNIQUE)
- `password_hash` - Hash bcrypt
- `full_name` - Nome completo
- `role` - admin/user/support
- `status` - active/inactive/suspended
- `last_login` - Último login
- `created_at`, `updated_at`

---

### 7. **audit_logs** (Auditoria)
Registra operações importantes para rastreabilidade.

**Campos:**
- `id` (PK)
- `user_id` (FK) - Quem fez
- `entity_type` - customers/payments/subscriptions
- `entity_id` - ID da entidade
- `action` - CREATE/UPDATE/DELETE
- `old_values` (JSONB) - Valores anteriores
- `new_values` (JSONB) - Valores novos
- `ip_address` - IP de origem
- `user_agent` - Cliente HTTP

---

## 🔍 Views Úteis

### `v_customers_payment_summary`
Resumo de clientes com totais de pagamentos por status.

```sql
SELECT * FROM v_customers_payment_summary;
```

**Retorna:**
```
name    | email           | total_payments | total_received | total_pending | total_overdue
--------|-----------------|----------------|----------------|---------------|---------------
João    | joao@example.com| 5              | 3500.00        | 2000.00       | 0.00
Maria   | maria@example.com| 3             | 1500.00        | 500.00        | 0.00
```

---

### `v_active_subscriptions`
Lista assinaturas ativas com informações do cliente.

```sql
SELECT * FROM v_active_subscriptions;
```

---

### `v_pending_payments`
Pagamentos pendentes com dias de atraso.

```sql
SELECT * FROM v_pending_payments;
```

---

## ⚙️ Como Usar

### 1. Criar as Tabelas

**Opção A: Com bash script**
```bash
npm run db:setup
```

**Opção B: Manualmente**
```bash
psql -h localhost -U postgres -d subscrivery -f src/database/schema.sql
```

**Opção C: Via SQL direto**
```sql
\i src/database/schema.sql
```

---

### 2. Testar Conexão

```bash
npm run db:test
```

**Output esperado:**
```
✅ Conectado ao PostgreSQL com sucesso!
📋 Tabelas no banco:

  • audit_logs
  • customers
  • payments
  • subscriptions
  • sync_logs
  • users
  • webhooks

✅ Total: 7 tabelas
```

---

### 3. Popular com Dados de Teste

```bash
npm run db:seed
```

---

### 4. Usar os Models

```javascript
import Customer from './src/models/Customer.js';
import Payment from './src/models/Payment.js';
import Subscription from './src/models/Subscription.js';

// Criar cliente
const customer = await Customer.create({
  asaas_id: 'cus_123',
  name: 'João',
  email: 'joao@example.com',
  document: '123.456.789-00',
  mobile_phone: '(11) 98765-4321'
});

// Listar clientes
const customers = await Customer.findAll(50, 0);

// Encontrar por email
const found = await Customer.findByEmail('joao@example.com');

// Criar pagamento
const payment = await Payment.create({
  asaas_id: 'pay_123',
  customer_id: customer.id,
  asaas_customer_id: 'cus_123',
  value: 100.00,
  due_date: new Date(),
  billing_type: 'BOLETO',
  description: 'Pagamento teste'
});

// Listar pagamentos de um cliente
const payments = await Payment.findByCustomerId(customer.id);

// Criar assinatura
const subscription = await Subscription.create({
  asaas_id: 'sub_123',
  customer_id: customer.id,
  asaas_customer_id: 'cus_123',
  value: 99.90,
  next_due_date: new Date(),
  cycle: 'MONTHLY',
  billing_type: 'BOLETO',
  description: 'Plano Premium'
});

// Listar assinaturas ativas
const active = await Subscription.findActive();
```

---

## 📝 Variáveis de Ambiente

Adicionar ao `.env`:

```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=subscrivery
DB_USER=postgres
DB_PASSWORD=sua_senha

# Asaas
ASAAS_API_KEY=$aact_hmlg_...
ASAAS_API_URL=https://sandbox.asaas.com/api/v3

# Servidor
NODE_ENV=development
PORT=3000
```

---

## 🔗 Fluxo de Sincronização

```
┌─────────────────┐
│  Asaas API      │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────┐
│   Nossas Rotas da API (Express)     │
│  - POST /api/customers              │
│  - POST /api/payments               │
│  - POST /api/subscriptions          │
└────────┬────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│    Models (Customer/Payment/...)     │
│    - Validação de dados              │
│    - Operações CRUD                  │
│    - Queries otimizadas              │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│     PostgreSQL Database              │
│  - Tabelas (customers, payments...)  │
│  - Views (resumos)                   │
│  - Índices (performance)             │
│  - Logs (auditoria)                  │
└──────────────────────────────────────┘
```

---

## 🚀 Próximas Integrações

1. **Webhooks**
   - Receber eventos do Asaas
   - Atualizar registros automaticamente
   - Processar fila de eventos

2. **Sincronização em Background**
   - Rotinas periódicas de sync
   - Tratamento de conflitos
   - Retry automático

3. **Autenticação**
   - JWT tokens
   - Permissões por role
   - Refresh tokens

4. **API REST Completa**
   - Endpoints para CRUD de clientes
   - Endpoints para pagamentos
   - Endpoints para assinaturas

---

## 📞 Documentação

- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Node.js pg library](https://node-postgres.com/)
- [Asaas API Docs](https://docs.asaas.com/)
