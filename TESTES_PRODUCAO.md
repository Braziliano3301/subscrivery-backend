# 🧪 Testes da API em Produção

## URL Base da API
```
https://subscrivery-backend-production.up.railway.app
```

---

## 1. Health Check
```powershell
# PowerShell
Invoke-RestMethod -Uri "https://subscrivery-backend-production.up.railway.app/api/health"
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "Subscrivery API está rodando",
  "timestamp": "2025-12-15T..."
}
```

---

## 2. Status Detalhado
```powershell
Invoke-RestMethod -Uri "https://subscrivery-backend-production.up.railway.app/api/status"
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "service": "Subscrivery Backend API",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "...",
  "endpoints": {
    "auth": "/api/auth",
    "suppliers": "/api/suppliers",
    ...
  }
}
```

---

## 3. Criar Usuário de Teste
```powershell
$body = @{
  email = "teste@producao.com"
  password = "senha123"
  name = "Teste Producao"
  phone = "11999999999"
  user_type = "cliente"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://subscrivery-backend-production.up.railway.app/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

**Resposta esperada:**
```json
{
  "message": "Usuário cadastrado com sucesso",
  "userId": 123
}
```

---

## 4. Login
```powershell
$loginBody = @{
  email = "teste@producao.com"
  password = "senha123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://subscrivery-backend-production.up.railway.app/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"
```

**Resposta esperada:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "name": "Teste Producao",
    "email": "teste@producao.com",
    "user_type": "cliente"
  }
}
```

---

## 5. Listar Planos (sem autenticação)
```powershell
Invoke-RestMethod -Uri "https://subscrivery-backend-production.up.railway.app/api/plans"
```

**Resposta esperada:**
```json
{
  "plans": [
    {
      "id": 1,
      "name": "Básico",
      "price": "49.90",
      "credit_amount": "200.00"
    },
    ...
  ]
}
```

---

## 6. Ver Perfil (com autenticação)
```powershell
$headers = @{
  "Authorization" = "Bearer $token"
  "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "https://subscrivery-backend-production.up.railway.app/api/auth/profile" -Headers $headers
```

---

## 7. Acessar Swagger
Abra no navegador:
```
https://subscrivery-backend-production.up.railway.app/api-docs
```

✅ Deve mostrar a interface Swagger com todos os 28 endpoints documentados.

---

## ✅ Checklist de Validação

- [ ] `/api/health` retorna status ok
- [ ] `/api/status` mostra informações corretas
- [ ] POST `/api/auth/register` cria usuário
- [ ] POST `/api/auth/login` retorna token JWT
- [ ] GET `/api/plans` lista 3 planos
- [ ] GET `/api/auth/profile` com token funciona
- [ ] `/api-docs` mostra Swagger UI
- [ ] Logs no Railway sem erros

---

## 📝 Anotar URL da API

**URL de Produção:**
```
https://subscrivery-backend-production.up.railway.app
```

**Swagger Docs:**
```
https://subscrivery-backend-production.up.railway.app/api-docs
```

Compartilhe essas URLs com a equipe de frontend!
