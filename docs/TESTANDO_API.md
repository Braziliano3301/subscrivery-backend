# 📚 Guia Completo: Testando os Endpoints da API Asaas

**Aprenda a testar todos os endpoints da API Asaas Sandbox**

---

## 🚀 Pré-requisitos

1. ✅ Servidor rodando: `npm run dev`
2. ✅ `.env` configurado com `ASAAS_API_KEY`
3. ✅ Escolha seu método de teste (REST Client, cURL ou Postman)

---

## 📋 Endpoints Disponíveis

### 1. **Health Check** (Status do Servidor)
- **Método:** `GET`
- **URL:** `http://localhost:3000/health`
- **Corpo:** Nenhum
- **Resposta:** `{"status":"ok","message":"Servidor está rodando"}`

### 2. **Clientes (Customers)**
- `POST /api/customers` - Criar novo cliente
- `GET /api/customers` - Listar todos os clientes

### 3. **Pagamentos (Payments)**
- `POST /api/payments` - Criar pagamento
- `GET /api/payments` - Listar pagamentos
- `GET /api/payments/:id` - Buscar pagamento por ID

### 4. **Assinaturas (Subscriptions)**
- `POST /api/subscriptions` - Criar assinatura
- `GET /api/subscriptions/:id` - Buscar assinatura por ID
- `DELETE /api/subscriptions/:id` - Cancelar assinatura

---

## 🧪 Método 1: REST Client (VS Code) ⭐ RECOMENDADO

### Instalação
1. Abra VS Code
2. Extensions → Busque "REST Client"
3. Instale a extensão (REST Client by Huachao Mao)

### Como Usar
1. Crie arquivo `test.http` na raiz
2. Cole os exemplos abaixo
3. Clique "Send Request" acima de cada bloco

### Exemplo Completo

```http
### 1. Health Check
GET http://localhost:3000/health

### 2. Criar Cliente
POST http://localhost:3000/api/customers
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "document": "12345678901234",
  "mobilePhone": "11987654321"
}

### 3. Listar Clientes
GET http://localhost:3000/api/customers

### 4. Criar Pagamento
# ⚠️ Substitua cus_000000000000001 pelo ID obtido no passo 2
POST http://localhost:3000/api/payments
Content-Type: application/json

{
  "customerId": "cus_000000000000001",
  "value": 99.90,
  "description": "Teste Pagamento",
  "dueDate": "2025-12-25"
}

### 5. Listar Pagamentos
GET http://localhost:3000/api/payments

### 6. Buscar Pagamento por ID
# ⚠️ Substitua pay_123456 pelo ID obtido no passo 4
GET http://localhost:3000/api/payments/pay_123456

### 7. Criar Assinatura
# ⚠️ Substitua cus_000000000000001 pelo ID obtido no passo 2
POST http://localhost:3000/api/subscriptions
Content-Type: application/json

{
  "customerId": "cus_000000000000001",
  "value": 29.90,
  "nextDueDate": "2025-01-15",
  "description": "Plano Mensal",
  "cycle": "MONTHLY"
}

### 8. Buscar Assinatura por ID
# ⚠️ Substitua sub_123456 pelo ID obtido no passo 7
GET http://localhost:3000/api/subscriptions/sub_123456

### 9. Cancelar Assinatura
# ⚠️ Substitua sub_123456 pelo ID obtido no passo 7
DELETE http://localhost:3000/api/subscriptions/sub_123456
```

---

## 🖥️ Método 2: cURL (Terminal)

### Health Check
```bash
curl http://localhost:3000/health
```

### Criar Cliente
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@example.com",
    "document": "98765432100000",
    "mobilePhone": "21987654321"
  }'
```

**Copie o `id` da resposta!**

### Listar Clientes
```bash
curl http://localhost:3000/api/customers
```

### Criar Pagamento
```bash
# Substitua cus_000000000000001 pelo ID que você copiou
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cus_000000000000001",
    "value": 99.90,
    "description": "Teste",
    "dueDate": "2025-12-25"
  }'
```

### Listar Pagamentos
```bash
curl http://localhost:3000/api/payments
```

### Buscar Pagamento por ID
```bash
# Substitua pay_123456 pelo ID do pagamento
curl http://localhost:3000/api/payments/pay_123456
```

### Criar Assinatura
```bash
# Substitua cus_000000000000001 pelo ID do cliente
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cus_000000000000001",
    "value": 29.90,
    "nextDueDate": "2025-01-15",
    "description": "Plano Mensal",
    "cycle": "MONTHLY"
  }'
```

### Buscar Assinatura por ID
```bash
# Substitua sub_123456 pelo ID da assinatura
curl http://localhost:3000/api/subscriptions/sub_123456
```

### Cancelar Assinatura
```bash
# Substitua sub_123456 pelo ID da assinatura
curl -X DELETE http://localhost:3000/api/subscriptions/sub_123456
```

---

## 📱 Método 3: Postman

### Instalação
1. Baixe [Postman](https://www.postman.com/downloads/)
2. Crie uma conta gratuita

### Importar Collection
Se tiver arquivo `Asaas-Sandbox.postman_collection.json`:
1. Abra Postman
2. Click "Import"
3. Selecione o arquivo JSON
4. Todos os endpoints aparecem automaticamente

### Criar Requisição Manual

#### 1. Health Check
- **Método:** GET
- **URL:** `http://localhost:3000/health`
- **Headers:** Nenhum
- **Body:** Nenhum
- **Click:** Send

#### 2. Criar Cliente
- **Método:** POST
- **URL:** `http://localhost:3000/api/customers`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "name": "Pedro Costa",
  "email": "pedro@example.com",
  "document": "11122233344455",
  "mobilePhone": "85987654321"
}
```
- **Click:** Send
- **Copie:** O `id` da resposta

#### 3. Listar Clientes
- **Método:** GET
- **URL:** `http://localhost:3000/api/customers`
- **Headers:** Nenhum
- **Body:** Nenhum
- **Click:** Send

#### 4. Criar Pagamento
- **Método:** POST
- **URL:** `http://localhost:3000/api/payments`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "customerId": "cus_000000000000001",
  "value": 99.90,
  "description": "Teste Postman",
  "dueDate": "2025-12-25"
}
```
- **Click:** Send

#### 5. Listar Pagamentos
- **Método:** GET
- **URL:** `http://localhost:3000/api/payments`
- **Click:** Send

#### 6. Buscar Pagamento
- **Método:** GET
- **URL:** `http://localhost:3000/api/payments/pay_123456`
- **Click:** Send

#### 7. Criar Assinatura
- **Método:** POST
- **URL:** `http://localhost:3000/api/subscriptions`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "customerId": "cus_000000000000001",
  "value": 29.90,
  "nextDueDate": "2025-01-15",
  "description": "Plano Mensal",
  "cycle": "MONTHLY"
}
```
- **Click:** Send

#### 8. Buscar Assinatura
- **Método:** GET
- **URL:** `http://localhost:3000/api/subscriptions/sub_123456`
- **Click:** Send

#### 9. Cancelar Assinatura
- **Método:** DELETE
- **URL:** `http://localhost:3000/api/subscriptions/sub_123456`
- **Click:** Send

---

## 📊 Campos Obrigatórios por Endpoint

### POST /api/customers
| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| `name` | string | ✅ Sim | "João Silva" |
| `email` | string | ✅ Sim | "joao@example.com" |
| `document` | string | ✅ Sim | "12345678901234" |
| `mobilePhone` | string | ❌ Não | "11987654321" |

### POST /api/payments
| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| `customerId` | string | ✅ Sim | "cus_000000000000001" |
| `value` | number | ✅ Sim | 99.90 |
| `dueDate` | string | ✅ Sim | "2025-12-25" |
| `description` | string | ❌ Não | "Teste" |
| `billingType` | string | ❌ Não | "CREDIT_CARD" |

### POST /api/subscriptions
| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| `customerId` | string | ✅ Sim | "cus_000000000000001" |
| `value` | number | ✅ Sim | 29.90 |
| `nextDueDate` | string | ✅ Sim | "2025-01-15" |
| `description` | string | ❌ Não | "Plano Mensal" |
| `cycle` | string | ❌ Não | "MONTHLY" |
| `billingType` | string | ❌ Não | "CREDIT_CARD" |

---

## ✅ Fluxo Completo de Testes

```
1. GET /health
   └─ Verifica se servidor está rodando

2. POST /api/customers
   └─ Cria um cliente novo
   └─ COPIE o ID retornado

3. GET /api/customers
   └─ Verifica se cliente aparece na lista

4. POST /api/payments (com customerId do passo 2)
   └─ Cria um pagamento
   └─ COPIE o ID retornado

5. GET /api/payments
   └─ Verifica se pagamento aparece na lista

6. GET /api/payments/:id (com ID do passo 4)
   └─ Busca detalhes do pagamento

7. POST /api/subscriptions (com customerId do passo 2)
   └─ Cria uma assinatura
   └─ COPIE o ID retornado

8. GET /api/subscriptions/:id (com ID do passo 7)
   └─ Busca detalhes da assinatura

9. DELETE /api/subscriptions/:id (com ID do passo 7)
   └─ Cancela a assinatura

✅ TUDO FUNCIONANDO!
```

---

## 🆘 Erros Comuns e Soluções

### Erro: "Connection refused"
```
❌ Problema: Servidor não está rodando
✅ Solução: npm run dev em um terminal
```

### Erro: "ASAAS_API_KEY não configurada"
```
❌ Problema: .env não existe ou está vazio
✅ Solução: Crie .env com:
   ASAAS_API_KEY=sua_chave_aqui
   Reinicie: npm run dev
```

### Erro: "customerId, value e dueDate são obrigatórios"
```
❌ Problema: Faltam campos obrigatórios
✅ Solução: Verifique se enviou todos os campos
   POST /api/payments precisa de:
   - customerId
   - value
   - dueDate
```

### Erro: "Cannot POST /api/customers"
```
❌ Problema: URL ou método incorretos
✅ Solução: Verifique:
   - Método: POST (não GET)
   - URL: http://localhost:3000/api/customers
   - Header: Content-Type: application/json
```

### Erro: "Email inválido"
```
❌ Problema: Email não segue formato correto
✅ Solução: Use: seu@email.com
   Não use: seu@, email@
```

---

## 🎯 Teste Automatizado

Para testar todos os endpoints de uma vez:

```bash
npm test
```

Retorna relatório completo com:
- ✅ Testes que passaram
- ❌ Testes que falharam
- 📊 Resumo final

---

## 📚 Arquivos Relacionados

- [TESTE_RAPIDO.md](TESTE_RAPIDO.md) - Quick start (5 min)
- [OBTER_CUSTOMER_ID.md](OBTER_CUSTOMER_ID.md) - Como obter IDs
- [SETUP.md](SETUP.md) - Configuração inicial
- [TROUBLESHOOTING_API.md](TROUBLESHOOTING_API.md) - Solução de problemas

---

## 🚀 Próximos Passos

1. ✅ Escolha seu método de teste favorito
2. ✅ Siga o fluxo completo acima
3. ✅ Teste todos os endpoints
4. ✅ Se tudo funcionar, você está pronto para colocar em produção!

---

**Pronto para começar? Escolha seu método e comece a testar!** 🎉
