# ⚡ Quick Start: Testar em 5 Minutos

**Comece a testar AGORA, sem complicações**

---

## 🚀 3 Passos = Pronto

### ✅ Passo 1: Certifique que o Servidor Está Rodando

```bash
# Terminal 1: Inicie o servidor
npm run dev

# Você deve ver:
# 🚀 Servidor rodando em http://localhost:3000
```

### ✅ Passo 2: Escolha Seu Método

**Opção A: REST Client (VS Code) ⭐ RECOMENDADO**
1. Abra arquivo: `api-examples.http`
2. Veja "Send Request" acima de cada bloco
3. Clique nela!

**Opção B: Postman (desktop)**
1. Abra Postman
2. File → Import → `Asaas-Sandbox.postman_collection.json`
3. Clique em "Send"

**Opção C: cURL (terminal)**
```bash
# Terminal 2: Cole e execute
curl http://localhost:3000/health
```

### ✅ Passo 3: Veja Resposta

Você deve ver algo assim:

```json
{
  "status": "ok",
  "message": "Servidor está rodando"
}
```

✅ **Funcionou!**

---

## 🎯 Testes Rápidos (Copie e Cole)

### Test 1: Health Check (0 segundos)

```bash
curl http://localhost:3000/health
```

### Test 2: Criar Cliente (10 segundos)

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com","document":"12345678901234","mobilePhone":"11987654321"}'
```

**Salve o ID retornado!**

### Test 3: Criar Pagamento (10 segundos)

Substitua `cus_000000000000001` pelo ID acima:

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"customerId":"cus_000000000000001","value":99.90,"description":"Teste","dueDate":"2025-12-25"}'
```

### Test 4: Listar Pagamentos (5 segundos)

```bash
curl http://localhost:3000/api/payments
```

---

## 📋 Checklist Visual

```
✅ npm run dev rodando?
   └─ Veja: "🚀 Servidor rodando em http://localhost:3000"

✅ curl http://localhost:3000/health funciona?
   └─ Veja: {"status":"ok",...}

✅ Conseguiu criar cliente (POST /api/customers)?
   └─ Veja: "success": true

✅ Conseguiu criar pagamento (POST /api/payments)?
   └─ Veja: ID do pagamento

✅ Conseguiu listar pagamentos (GET /api/payments)?
   └─ Veja: Array com pagamentos

🎉 TUDO FUNCIONA!
```

---

## 🆘 Algo Não Funciona?

### Erro: "Connection refused"
```
✅ Solução: npm run dev deve estar rodando
```

### Erro: "Cannot POST /api/customers"
```
✅ Solução: Certifique URL está correta
curl -X POST http://localhost:3000/api/customers
(com -X POST, importante!)
```

### Erro: "ASAAS_API_KEY não configurada"
```
✅ Solução: Edite .env e adicione sua chave
ASAAS_API_KEY=aac_sua_chave_aqui
Reinicie: npm run dev
```

---

## 🎓 Próximo Passo

Depois que testes básicos funcionam:

1. **Leia:** [TESTANDO_API.md](TESTANDO_API.md) (guia completo)
2. **Se erro:** [TROUBLESHOOTING_API.md](TROUBLESHOOTING_API.md)
3. **IDs:** [OBTER_CUSTOMER_ID.md](OBTER_CUSTOMER_ID.md)

---

**✅ Tudo pronto? Teste agora!** 🚀

```bash
# Terminal 1:
npm run dev

# Terminal 2:
curl http://localhost:3000/health
```

**Viu `{"status":"ok"}`? Parabéns!** 🎉
