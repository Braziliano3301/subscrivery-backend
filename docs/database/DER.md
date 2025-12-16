# Diagrama Entidade-Relacionamento (DER) - Subscrivery

## Entidades Principais

### 1. USERS (Usuários)
- **id** (UUID, PK)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- name (VARCHAR)
- phone (VARCHAR)
- **user_type** (ENUM: 'cliente', 'fornecedor')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 2. SUPPLIERS (Fornecedores)
- **id** (UUID, PK)
- user_id (UUID, FK → USERS)
- business_name (VARCHAR)
- cnpj (VARCHAR, UNIQUE)
- **category** (ENUM: 'supermercado', 'farmacia', 'petshop')
- address (TEXT)
- city (VARCHAR)
- state (VARCHAR)
- zip_code (VARCHAR)
- latitude (DECIMAL)
- longitude (DECIMAL)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 3. SUBSCRIPTION_PLANS (Planos)
- **id** (UUID, PK)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- credit_amount (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 4. SUBSCRIPTIONS (Assinaturas)
- **id** (UUID, PK)
- user_id (UUID, FK → USERS)
- plan_id (UUID, FK → SUBSCRIPTION_PLANS)
- **status** (ENUM: 'ativa', 'pausada', 'cancelada')
- start_date (DATE)
- next_billing_date (DATE)
- remaining_credit (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 5. ORDERS (Pedidos)
- **id** (UUID, PK)
- subscription_id (UUID, FK → SUBSCRIPTIONS)
- supplier_id (UUID, FK → SUPPLIERS)
- order_date (TIMESTAMP)
- delivery_date (DATE)
- **status** (ENUM: 'pendente', 'confirmado', 'entregue', 'cancelado')
- total_amount (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 6. ORDER_ITEMS (Itens do Pedido)
- **id** (UUID, PK)
- order_id (UUID, FK → ORDERS)
- product_name (VARCHAR)
- quantity (INTEGER)
- unit_price (DECIMAL)
- total_price (DECIMAL)
- created_at (TIMESTAMP)

### 7. PAYMENTS (Pagamentos)
- **id** (UUID, PK)
- subscription_id (UUID, FK → SUBSCRIPTIONS)
- amount (DECIMAL)
- payment_method (VARCHAR)
- payment_date (TIMESTAMP)
- **status** (ENUM: 'pendente', 'aprovado', 'recusado')
- transaction_id (VARCHAR)
- created_at (TIMESTAMP)

## Relacionamentos

```
USERS (1) ────── (0,N) SUPPLIERS
  │
  │
  ├─── (1) ────── (0,N) SUBSCRIPTIONS
  │
SUBSCRIPTION_PLANS (1) ────── (0,N) SUBSCRIPTIONS
  │
SUBSCRIPTIONS (1) ────── (0,N) ORDERS
  │                              │
  │                              │
  └────── (1) ────── (0,N) PAYMENTS
                                 │
SUPPLIERS (1) ────── (0,N) ORDERS
  │
ORDERS (1) ────── (1,N) ORDER_ITEMS
```

## Regras de Negócio

1. Um **USERS** pode ser 'cliente' ou 'fornecedor'
2. Apenas usuários tipo 'fornecedor' têm registro em **SUPPLIERS**
3. Um cliente pode ter múltiplas **SUBSCRIPTIONS** (mas apenas 1 ativa por vez)
4. Cada **SUBSCRIPTION** pertence a um **SUBSCRIPTION_PLAN**
5. **ORDERS** são criados dentro de uma assinatura ativa
6. Cada pedido é vinculado a um **SUPPLIER**
7. **PAYMENTS** são registrados mensalmente para cada assinatura
8. **ORDER_ITEMS** representa os produtos de cada pedido

## Índices de Performance

- `idx_users_email`: Busca rápida por email (login)
- `idx_suppliers_city`: Filtro de fornecedores por cidade
- `idx_suppliers_category`: Filtro por categoria (supermercado, farmácia, etc)
- `idx_subscriptions_status`: Filtro de assinaturas ativas
- `idx_orders_status`: Busca de pedidos por status
