# 🆔 Como Obter Customer_id Para Testes

**Guia passo a passo para obter o ID do cliente necessário para testar pagamentos e assinaturas**

---

## 🎯 Por Que Preciso de Customer_id?

Para criar **pagamentos** ou **assinaturas**, você **PRECISA** de um `customerId` válido.

Sem ele, você perde 50% dos testes! Então vamos obter um.

---

## 📋 Opção 1: REST Client (VS Code) ⭐ RECOMENDADO

### Step 1: Abra `api-examples.http`
```
Arquivo: api-examples.http
No VS Code
```

### Step 2: Encontre "Create Customer"
```http
POST http://localhost:3000/api/customers
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "document": "12345678901234",
  "mobilePhone": "11987654321"
}
```

### Step 3: Clique "Send Request"
- **Localização:** Azul acima do bloco POST
- **Resultado:** Resposta JSON

### Step 4: Copie o ID
Você verá algo como:
```json
{
  "success": true,
  "customer": {
    "id": "cus_000000000000001",
    "name": "João Silva",
    "email": "joao@example.com",
    "status": "ACTIVE"
  }
}
```

✅ **Copie:** `cus_000000000000001`

---

## 🖥️ Opção 2: cURL (Terminal)

### Comando Completo:
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

### Resposta:
```json
{
  "success": true,
  "customer": {
    "id": "cus_000000000000002",
    "name": "Maria Santos",
    "email": "maria@example.com",
    "status": "ACTIVE"
  }
}
```

✅ **Copie:** `cus_000000000000002`

---

## 📱 Opção 3: Postman

### Step 1: Importe Collection
```
Menu → File → Import
Arquivo → Asaas-Sandbox.postman_collection.json
```

### Step 2: Encontre "Create Customer"
```
Pasta: Customers
Request: POST Create Customer
```

### Step 3: Configure Body (JSON)
```json
{
  "name": "Pedro Costa",
  "email": "pedro@example.com",
  "document": "11122233344455",
  "mobilePhone": "85987654321"
}
```

### Step 4: Clique "Send"
- **Resultado:** Resposta JSON com ID

✅ **Copie:** O campo `id`

---

## 📝 Campos Obrigatórios

| Campo | Tipo | Exemplo | Nota |
|-------|------|---------|------|
| `name` | string | "João Silva" | Nome do cliente |
| `email` | string | "joao@example.com" | Email válido |
| `document` | string | "12345678901234" | CPF/CNPJ (14 dígitos para teste) |
| `mobilePhone` | string | "11987654321" | Celular com DDD |

---

## ✅ Verificar Clientes Criados

Se criar múltiplos clientes, você pode listá-los:

### REST Client:
```http
GET http://localhost:3000/api/customers
```

### cURL:
```bash
curl http://localhost:3000/api/customers
```

### Resposta:
```json
{
  "success": true,
  "customers": [
    {
      "id": "cus_000000000000001",
      "name": "João Silva",
      "status": "ACTIVE"
    },
    {
      "id": "cus_000000000000002",
      "name": "Maria Santos",
      "status": "ACTIVE"
    }
  ]
}
```

---

## 🚀 Próximo Passo: Use o ID

Agora que você tem um `customerId`, use-o para:

### ✅ Criar Pagamento:
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cus_000000000000001",
    "value": 99.90,
    "description": "Primeiro Pagamento",
    "dueDate": "2025-12-25"
  }'
```

### ✅ Criar Assinatura:
```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cus_000000000000001",
    "value": 29.90,
    "nextDueDate": "2025-02-01",
    "description": "Plano Mensal"
  }'
```

---

## 🎓 Resumo Rápido

```
1. Crie um cliente (POST /api/customers)
   └─ Obtém: customerId (ex: cus_000000000000001)

2. Copie o customerId

3. Use-o em pagamentos/assinaturas
   └─ Substitua {customerId} pelo valor copiado
```

---

## 🆘 Erros Comuns

### ❌ "Servidor não responde"
```
✅ Solução: npm run dev precisa estar rodando
```

### ❌ "POST /api/customers não encontrado"
```
✅ Solução: Certifique URL: http://localhost:3000/api/customers
```

### ❌ "Erro 400: email inválido"
```
✅ Solução: Use um email válido (ex: seu@email.com)
```

### ❌ "Erro 400: document deve ter 14 dígitos"
```
✅ Solução: Document deve ter 14 caracteres
Exemplo correto: "12345678901234"
```

---

## 📚 Recursos

- [TESTE_RAPIDO.md](TESTE_RAPIDO.md) - Quick start (5 min)
- [TESTANDO_API.md](TESTANDO_API.md) - Guia completo
- [TROUBLESHOOTING_API.md](TROUBLESHOOTING_API.md) - Solução de problemas
- [SETUP.md](SETUP.md) - Configuração Asaas

---

**✅ Pronto? Crie seu primeiro cliente agora!** 🚀

```bash
npm run dev
# Em outro terminal:
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","document":"12345678901234","mobilePhone":"11987654321"}'
```

**Copie o ID da resposta!** 🎉
