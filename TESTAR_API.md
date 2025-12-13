# 🧪 Guia de Testes - API Subscrivery

## ✅ Servidor está rodando!

**URL Base:** `http://localhost:5000/api`

---

## 🔍 Teste 1: Health Check (já testado!)

Abra no navegador: http://localhost:5000/api/health

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "Subscrivery API está rodando",
  "timestamp": "2025-12-12T..."
}
```

---

## 🧪 Teste 2: Registrar Usuário (Cliente)

### Opção A: No Navegador (Console DevTools)

1. Abra: http://localhost:5000
2. Pressione **F12** (DevTools)
3. Vá na aba **Console**
4. Cole e execute:

```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'cliente@test.com',
    password: 'senha123',
    name: 'Cliente Teste',
    phone: '11999999999',
    user_type: 'cliente'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

**Resposta esperada:**
```json
{
  "message": "Usuário cadastrado com sucesso",
  "user": {
    "id": "uuid...",
    "email": "cliente@test.com",
    "name": "Cliente Teste",
    "user_type": "cliente"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Opção B: PowerShell

```powershell
$body = @{
    email = "cliente@test.com"
    password = "senha123"
    name = "Cliente Teste"
    phone = "11999999999"
    user_type = "cliente"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

---

## 🔐 Teste 3: Login

### No Console do Navegador:

```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'cliente@test.com',
    password: 'senha123'
  })
})
.then(res => res.json())
.then(data => {
  console.log(data);
  // Copie o token que aparecer!
});
```

**Copie o TOKEN retornado!**

---

## 🔒 Teste 4: Rota Protegida (Profile)

### No Console (cole o TOKEN que você copiou):

```javascript
const token = "COLE_SEU_TOKEN_AQUI";

fetch('http://localhost:5000/api/auth/profile', {
  headers: { 
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📊 Teste 5: Listar Planos

### No Navegador ou Console:

```javascript
fetch('http://localhost:5000/api/plans')
.then(res => res.json())
.then(data => console.log(data));
```

**Aguarde!** Ainda não criamos essa rota. Quer que eu crie agora? 😊

---

## 🎯 PRÓXIMOS PASSOS:

1. ✅ Teste o registro de usuário (Teste 2)
2. ✅ Teste o login (Teste 3)
3. ✅ Teste a rota protegida (Teste 4)

**Me avise quando testar! Vou criar as próximas rotas.**

---

## 🐛 Se der erro:

**Erro de CORS?**
- Normal se testar de outro domínio
- Use o Console do navegador em localhost:5000

**Token inválido?**
- Certifique que copiou o token completo
- Token tem 7 dias de validade

**Usuário já existe?**
- Troque o email para: `cliente2@test.com`
