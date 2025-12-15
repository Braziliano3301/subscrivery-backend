# 📱 Guia de Integração Frontend - Subscrivery API

> **Para:** Equipe de Frontend  
> **Autor:** Leonardo Cabral (Backend)  
> **Data:** 15/12/2025  
> **Status:** Backend em produção ✅

---

## 🌐 URLs da API

### Produção (Railway)
```
Base URL: https://subscrivery-backend-production.up.railway.app
Swagger:  https://subscrivery-backend-production.up.railway.app/api-docs
```

### Desenvolvimento Local (opcional)
```
Base URL: http://localhost:3000
Swagger:  http://localhost:3000/api-docs
```

---

## 🔑 Autenticação

### Como funciona
1. Usuário faz login → recebe **token JWT**
2. Frontend salva token (localStorage ou sessionStorage)
3. Todas as requisições protegidas enviam token no header `Authorization`

### Exemplo de Login

**Request:**
```javascript
const response = await fetch('https://subscrivery-backend-production.up.railway.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@exemplo.com',
    password: 'senha123'
  })
});

const data = await response.json();
const token = data.token; // Guardar isso!
```

**Response:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "user_type": "cliente"
  }
}
```

### Usando o Token

```javascript
const response = await fetch('https://subscrivery-backend-production.up.railway.app/api/auth/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 📚 Endpoints Disponíveis (28 total)

### 🔐 Autenticação (4 endpoints)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/api/auth/register` | ❌ Não | Cadastrar novo usuário |
| POST | `/api/auth/login` | ❌ Não | Login (recebe token) |
| GET | `/api/auth/profile` | ✅ Sim | Ver meu perfil |
| PUT | `/api/auth/profile` | ✅ Sim | Atualizar meu perfil |

### 🏪 Fornecedores (6 endpoints)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/api/suppliers` | ✅ Fornecedor | Criar perfil de fornecedor |
| GET | `/api/suppliers` | ❌ Não | Listar fornecedores (marketplace) |
| GET | `/api/suppliers/:id` | ❌ Não | Detalhes de um fornecedor |
| GET | `/api/suppliers/me/profile` | ✅ Fornecedor | Meu perfil de fornecedor |
| PUT | `/api/suppliers/:id` | ✅ Fornecedor | Atualizar meu perfil |
| DELETE | `/api/suppliers/:id` | ✅ Fornecedor | Deletar perfil |

**Filtros disponíveis em GET `/api/suppliers`:**
- `?city=São Paulo`
- `?state=SP`
- `?category=Alimentação`
- `?search=padaria`
- `?page=1&limit=10`

### 💎 Planos (2 endpoints)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| GET | `/api/plans` | ❌ Não | Listar 3 planos disponíveis |
| GET | `/api/plans/:id` | ❌ Não | Detalhes de um plano |

### 📝 Assinaturas (6 endpoints)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/api/subscriptions` | ✅ Cliente | Criar assinatura |
| GET | `/api/subscriptions/my` | ✅ Cliente | Minha assinatura ativa |
| GET | `/api/subscriptions/history` | ✅ Cliente | Histórico de assinaturas |
| PUT | `/api/subscriptions/:id/pause` | ✅ Cliente | Pausar assinatura |
| PUT | `/api/subscriptions/:id/resume` | ✅ Cliente | Retomar assinatura |
| PUT | `/api/subscriptions/:id/cancel` | ✅ Cliente | Cancelar assinatura |

### 📦 Pedidos (6 endpoints)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/api/orders` | ✅ Cliente | Criar pedido |
| GET | `/api/orders/my` | ✅ Cliente | Meus pedidos |
| GET | `/api/orders/:id` | ✅ Cliente/Fornecedor | Detalhes do pedido |
| GET | `/api/orders/supplier/orders` | ✅ Fornecedor | Pedidos recebidos |
| PUT | `/api/orders/:id/status` | ✅ Fornecedor | Atualizar status |
| PUT | `/api/orders/:id/cancel` | ✅ Cliente | Cancelar pedido |

### 💳 Pagamentos (5 endpoints)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/api/payments` | ✅ Cliente | Criar pagamento |
| GET | `/api/payments/my` | ✅ Cliente | Meus pagamentos |
| GET | `/api/payments/:id` | ✅ Cliente | Detalhes do pagamento |
| PUT | `/api/payments/:id/status` | ✅ Cliente | Atualizar status |
| GET | `/api/payments/stats` | ✅ Cliente | Estatísticas de pagamentos |

---

## 🛠️ Exemplos de Integração

### Setup Inicial (Axios ou Fetch)

**Opção 1: Axios (Recomendado)**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://subscrivery-backend-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Opção 2: Fetch Wrapper**
```javascript
const API_URL = 'https://subscrivery-backend-production.up.railway.app/api';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }
  
  return response.json();
}
```

### Exemplo: Tela de Login

```javascript
// LoginPage.jsx
import { useState } from 'react';
import api from './services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Salvar token e dados do usuário
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirecionar para dashboard
      window.location.href = '/dashboard';
      
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao fazer login');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
```

### Exemplo: Listar Fornecedores (Marketplace)

```javascript
// MarketplacePage.jsx
import { useState, useEffect } from 'react';
import api from './services/api';

function MarketplacePage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await api.get('/suppliers?page=1&limit=20');
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="marketplace">
      {suppliers.map(supplier => (
        <div key={supplier.id} className="supplier-card">
          <h3>{supplier.business_name}</h3>
          <p>{supplier.category}</p>
          <p>{supplier.city}, {supplier.state}</p>
          <button>Ver Detalhes</button>
        </div>
      ))}
    </div>
  );
}
```

### Exemplo: Criar Pedido

```javascript
// CreateOrderPage.jsx
const createOrder = async (supplierId, items, deliveryDate) => {
  try {
    const response = await api.post('/orders', {
      supplier_id: supplierId,
      delivery_date: deliveryDate,
      items: items.map(item => ({
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price
      }))
    });

    alert('Pedido criado com sucesso!');
    return response.data.order;
    
  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Erro ao criar pedido';
    alert(errorMsg);
  }
};
```

---

## ⚠️ Tratamento de Erros

A API retorna erros no formato:
```json
{
  "error": "Mensagem de erro clara",
  "details": [] // (opcional) validações específicas
}
```

**Status Codes:**
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação (dados inválidos)
- `401` - Não autenticado (token ausente/inválido)
- `403` - Não autorizado (sem permissão)
- `404` - Não encontrado
- `500` - Erro interno do servidor

**Exemplo de tratamento:**
```javascript
try {
  const response = await api.post('/orders', orderData);
  // Sucesso
} catch (error) {
  if (error.response?.status === 401) {
    // Token expirou, redirecionar para login
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else if (error.response?.status === 400) {
    // Mostrar erros de validação
    alert(error.response.data.error);
  } else {
    // Erro genérico
    alert('Algo deu errado. Tente novamente.');
  }
}
```

---

## 🔄 Estados dos Recursos

### Status de Assinatura
- `ativa` - Assinatura ativa e funcionando
- `pausada` - Temporariamente pausada
- `cancelada` - Cancelada definitivamente

### Status de Pedido
- `pendente` - Aguardando confirmação do fornecedor
- `confirmado` - Fornecedor confirmou
- `pronto` - Pedido pronto para entrega/retirada
- `entregue` - Pedido concluído
- `cancelado` - Pedido cancelado

### Status de Pagamento
- `pendente` - Aguardando confirmação
- `aprovado` - Pagamento confirmado
- `recusado` - Pagamento recusado

### Métodos de Pagamento
- `pix`
- `cartao_credito`
- `cartao_debito`
- `boleto`
- `transferencia`

---

## 🧪 Variáveis de Ambiente do Frontend

Crie arquivo `.env` no frontend:

```env
# URL da API
VITE_API_URL=https://subscrivery-backend-production.up.railway.app/api

# Outras configs (se necessário)
VITE_APP_NAME=Subscrivery
```

Use no código:
```javascript
const API_URL = import.meta.env.VITE_API_URL; // Vite
// ou
const API_URL = process.env.REACT_APP_API_URL; // Create React App
```

---

## 📞 Suporte

- **Documentação Completa:** https://subscrivery-backend-production.up.railway.app/api-docs
- **Dúvidas Backend:** Leonardo Cabral (biowcabral1995@gmail.com)
- **Repositório Backend:** https://github.com/otaviolap/subscrivery-backend
- **Repositório Frontend:** https://github.com/otaviolap/subscrivery-frontend

---

## ✅ Checklist de Integração

### Autenticação
- [ ] Implementar tela de login
- [ ] Implementar tela de cadastro (cliente)
- [ ] Implementar tela de cadastro (fornecedor)
- [ ] Salvar token no localStorage
- [ ] Adicionar token em todas requisições protegidas
- [ ] Implementar logout (limpar localStorage)
- [ ] Redirecionar para login se token expirar (401)

### Área Pública
- [ ] Landing page
- [ ] Listar fornecedores (marketplace)
- [ ] Detalhes do fornecedor
- [ ] Listar planos disponíveis

### Área do Cliente
- [ ] Dashboard (resumo assinatura + crédito)
- [ ] Ver/editar perfil
- [ ] Minha assinatura (pausar/retomar/cancelar)
- [ ] Criar pedido
- [ ] Listar meus pedidos
- [ ] Detalhes do pedido
- [ ] Cancelar pedido
- [ ] Criar pagamento
- [ ] Histórico de pagamentos
- [ ] Estatísticas de gastos

### Área do Fornecedor
- [ ] Dashboard fornecedor
- [ ] Ver/editar perfil do negócio
- [ ] Listar pedidos recebidos
- [ ] Detalhes do pedido
- [ ] Atualizar status do pedido

### Geral
- [ ] Tratamento de erros global
- [ ] Loading states
- [ ] Toasts de sucesso/erro
- [ ] Validação de formulários
- [ ] Responsividade mobile

---

**Última atualização:** 15/12/2025  
**Backend em produção:** ✅ Railway  
**28 endpoints disponíveis**
