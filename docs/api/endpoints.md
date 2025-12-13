# Documentação da API - Subscrivery

Base URL: `http://localhost:5000/api`

## 🔐 Autenticação

### POST /auth/register
Cadastro de novo usuário (cliente ou fornecedor)

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "phone": "11999999999",
  "user_type": "cliente"
}
```

**Response (201):**
```json
{
  "message": "Usuário cadastrado com sucesso",
  "userId": "uuid-do-usuario",
  "token": "jwt-token"
}
```

### POST /auth/login
Login de usuário

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "user_type": "cliente"
  }
}
```

## 👤 Usuários

### GET /users/profile
Obter perfil do usuário autenticado

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "id": "uuid",
  "email": "usuario@email.com",
  "name": "Nome do Usuário",
  "phone": "11999999999",
  "user_type": "cliente"
}
```

### PUT /users/profile
Atualizar perfil do usuário

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "name": "Novo Nome",
  "phone": "11888888888"
}
```

## 🏪 Fornecedores

### POST /suppliers
Cadastrar fornecedor (requer user_type='fornecedor')

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "business_name": "Supermercado ABC",
  "cnpj": "12345678901234",
  "category": "supermercado",
  "address": "Rua X, 123",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234567",
  "latitude": -23.5505,
  "longitude": -46.6333
}
```

### GET /suppliers
Listar fornecedores (com filtros opcionais)

**Query Params:**
- `city`: Filtrar por cidade
- `category`: Filtrar por categoria (supermercado, farmacia, petshop)

**Response (200):**
```json
[
  {
    "id": "uuid",
    "business_name": "Supermercado ABC",
    "category": "supermercado",
    "city": "São Paulo",
    "state": "SP",
    "is_active": true
  }
]
```

## 📋 Planos de Assinatura

### GET /plans
Listar todos os planos disponíveis

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Básico",
    "description": "Plano básico com até R$ 200 em produtos",
    "price": 49.90,
    "credit_amount": 200.00
  },
  {
    "id": "uuid",
    "name": "Intermediário",
    "description": "Plano intermediário com até R$ 400 em produtos",
    "price": 89.90,
    "credit_amount": 400.00
  },
  {
    "id": "uuid",
    "name": "Premium",
    "description": "Plano premium com até R$ 700 em produtos",
    "price": 149.90,
    "credit_amount": 700.00
  }
]
```

## 🔄 Assinaturas

### POST /subscriptions
Criar nova assinatura

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "plan_id": "uuid-do-plano"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "plan_id": "uuid-do-plano",
  "status": "ativa",
  "start_date": "2025-12-12",
  "next_billing_date": "2026-01-12",
  "remaining_credit": 200.00
}
```

### GET /subscriptions/my
Obter assinatura ativa do usuário

**Headers:** `Authorization: Bearer {token}`

### PUT /subscriptions/:id/pause
Pausar assinatura

**Headers:** `Authorization: Bearer {token}`

### PUT /subscriptions/:id/cancel
Cancelar assinatura

**Headers:** `Authorization: Bearer {token}`

### PUT /subscriptions/:id/change-plan
Alterar plano da assinatura

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "new_plan_id": "uuid-do-novo-plano"
}
```

## 📦 Pedidos

### POST /orders
Criar novo pedido

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "supplier_id": "uuid-do-fornecedor",
  "delivery_date": "2025-12-20",
  "items": [
    {
      "product_name": "Arroz 5kg",
      "quantity": 2,
      "unit_price": 25.00
    }
  ]
}
```

### GET /orders/my
Listar pedidos do usuário

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
[
  {
    "id": "uuid",
    "supplier_name": "Supermercado ABC",
    "order_date": "2025-12-12T10:00:00",
    "delivery_date": "2025-12-20",
    "status": "pendente",
    "total_amount": 50.00
  }
]
```

### GET /orders/:id
Detalhes de um pedido específico

**Headers:** `Authorization: Bearer {token}`

## 💳 Pagamentos

### POST /payments
Processar pagamento de assinatura

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "subscription_id": "uuid-da-assinatura",
  "payment_method": "credit_card",
  "card_data": {
    "number": "4111111111111111",
    "cvv": "123",
    "expiry_month": "12",
    "expiry_year": "2028"
  }
}
```

## 📊 Dashboard (Fornecedor)

### GET /dashboard/supplier/orders
Listar pedidos do fornecedor

**Headers:** `Authorization: Bearer {token}` (requer user_type='fornecedor')

**Response (200):**
```json
[
  {
    "id": "uuid",
    "customer_name": "Cliente ABC",
    "order_date": "2025-12-12",
    "delivery_date": "2025-12-20",
    "status": "pendente",
    "total_amount": 150.00
  }
]
```

### PUT /dashboard/supplier/orders/:id/status
Atualizar status do pedido

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "status": "confirmado"
}
```

## Códigos de Status HTTP

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Erro na requisição (dados inválidos)
- `401`: Não autenticado
- `403`: Não autorizado (sem permissão)
- `404`: Recurso não encontrado
- `500`: Erro interno do servidor
