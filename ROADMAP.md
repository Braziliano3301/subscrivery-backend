# 🗺️ Roadmap de Desenvolvimento - Subscrivery

Guia passo a passo para desenvolvimento completo do projeto separado por setores.

---

## 🚀 Setup Inicial (Para Todos)

### 1. Preparar Ambiente de Desenvolvimento

**Ferramentas Necessárias:**
- [ ] Node.js 18+ instalado
- [ ] PostgreSQL 14+ instalado
- [ ] Git instalado
- [ ] VS Code (ou IDE preferida)
- [ ] Figma (conta gratuita)
- [ ] ClickUp/Bitrix24 (gerenciamento)

**Configurar Repositório Git:**
```bash
cd C:\Users\Usuario\OneDrive\Desktop\Subscrivery
git init
git add .
git commit -m "Initial commit: estrutura do projeto"
git branch -M main
git remote add origin <URL-DO-SEU-REPO>
git push -u origin main
```

**Configurar GitFlow:**
```bash
git checkout -b develop
git push -u origin develop
```

---

## 🎨 SETOR 1: DESIGN

### Objetivo
Criar identidade visual completa e protótipo navegável em 2 dias.

### Dia 1 - Identidade Visual

#### Passo 1: Criar Logo (3-4 horas)
- [ ] Abrir Figma e criar novo projeto "Subscrivery - Branding"
- [ ] Pesquisar referências de logos (subscription, delivery, e-commerce)
- [ ] Sketches iniciais (pelo menos 5 variações)
- [ ] Escolher melhor conceito
- [ ] Refinar digitalmente no Figma
- [ ] Criar 3 versões:
  - Versão colorida (principal)
  - Versão branca (fundo escuro)
  - Versão preta (fundo claro)
- [ ] Exportar em PNG (2x), SVG e AI/PDF

**Entregável:** `logo-colorida.png`, `logo-branca.png`, `logo-preta.png`, `logo.svg`

#### Passo 2: Definir Paleta de Cores (1 hora)
- [ ] Definir cor primária (sugestão: Azul #0ea5e9)
- [ ] Definir cores secundárias (verde sucesso, amarelo destaque, vermelho erro)
- [ ] Definir escala de cinzas (backgrounds, textos)
- [ ] Documentar no Figma com códigos HEX
- [ ] Testar contraste de acessibilidade (WCAG AA)

**Entregável:** Arquivo Figma com paleta de cores

#### Passo 3: Tipografia (30 min)
- [ ] Escolher fonte principal (sugestão: Inter, Poppins, ou Roboto)
- [ ] Definir pesos: Regular (400), Medium (500), Semibold (600), Bold (700)
- [ ] Definir escala de tamanhos (h1: 40px, h2: 32px, h3: 24px, body: 16px)
- [ ] Documentar no Figma

#### Passo 4: Manual de Marca (2 horas)
- [ ] Criar documento PDF no Figma ou Canva
- [ ] Incluir:
  - Apresentação da marca
  - Logo e variações (com área de respiro)
  - Paleta de cores com códigos
  - Tipografia e hierarquia
  - Usos corretos e incorretos
  - Aplicações (mockups de cartão, site, etc)
- [ ] Exportar como PDF

**Entregável:** `manual-de-marca.pdf`

### Dia 2 - Protótipo Figma

#### Passo 5: Wireframes (2 horas)
- [ ] Criar novo arquivo Figma "Subscrivery - Protótipo"
- [ ] Criar frames para desktop (1440px)
- [ ] Wireframes de baixa fidelidade:
  - Login/Cadastro
  - Home (busca fornecedores)
  - Tela de planos
  - Checkout
  - Dashboard cliente
  - Dashboard fornecedor
- [ ] Definir fluxo de navegação

#### Passo 6: Design System (2 horas)
- [ ] Criar página "Components" no Figma
- [ ] Criar componentes reutilizáveis:
  - Botões (primário, secundário, outline)
  - Inputs (text, email, password, select)
  - Cards (plano, fornecedor, pedido)
  - Header/Navbar
  - Footer
  - Modais
  - Alerts/Notificações
- [ ] Aplicar cores e tipografia definidas

#### Passo 7: Alta Fidelidade Desktop (3 horas)
- [ ] Aplicar design system aos wireframes
- [ ] Adicionar:
  - Logo no header
  - Imagens ilustrativas (Unsplash)
  - Ícones (Lucide/Heroicons)
  - Efeitos (sombras, bordas arredondadas)
  - Interações (hover states)
- [ ] Revisar consistência visual
- [ ] Criar protótipo clicável (links entre telas)

#### Passo 8: Versão Mobile (1-2 horas)
- [ ] Criar frames mobile (375px)
- [ ] Adaptar telas principais:
  - Home mobile
  - Planos mobile
  - Dashboard mobile
- [ ] Menu hambúrguer
- [ ] Ajustar espaçamentos e tamanhos

#### Passo 9: Revisão e Entrega
- [ ] Testar fluxo completo no protótipo
- [ ] Compartilhar link do Figma com permissão "pode visualizar"
- [ ] Gerar link de apresentação (modo apresentação)

**Entregáveis Finais do Design:**
- ✅ Logo (PNG, SVG, AI)
- ✅ Manual de marca (PDF)
- ✅ Protótipo Figma (desktop + mobile)
- ✅ Link compartilhável do Figma

**Mover para:** `docs/design/` no repositório

---

## 🔧 SETOR 2: BACKEND

### Objetivo
Criar API REST completa com autenticação JWT e CRUD de todas entidades.

### Setup Inicial do Backend

#### Passo 1: Instalar Dependências (5 min)
```bash
cd backend
npm install
```

**Dependências instaladas:**
- express (servidor)
- pg (PostgreSQL)
- bcryptjs (hash de senhas)
- jsonwebtoken (JWT)
- dotenv (variáveis de ambiente)
- cors (CORS)
- express-validator (validação)

#### Passo 2: Configurar Banco de Dados (10 min)
```bash
# Abrir PostgreSQL (pgAdmin ou psql)
# Criar database
CREATE DATABASE subscrivery;

# Executar schema
psql -U postgres -d subscrivery -f ../docs/database/schema.sql
```

**Verificar tabelas criadas:**
```sql
\dt  -- listar todas as tabelas
SELECT * FROM subscription_plans;  -- deve retornar 3 planos
```

#### Passo 3: Configurar Variáveis de Ambiente (5 min)
```bash
# Copiar arquivo de exemplo
cp .env.example .env
```

**Editar `.env`:**
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=subscrivery
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI
JWT_SECRET=subscrivery_secret_key_2025_change_in_prod
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

#### Passo 4: Testar Servidor (2 min)
```bash
npm run dev
```

**Testar no navegador:** `http://localhost:5000/api/health`

Deve retornar:
```json
{
  "status": "ok",
  "message": "Subscrivery API está rodando"
}
```

### Dia 1 - Autenticação (JWT)

#### Passo 5: Criar Model de User (15 min)
**Criar:** `backend/src/models/user.model.js`

```javascript
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class UserModel {
  static async create({ email, password, name, phone, user_type }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (email, password_hash, name, phone, user_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, name, phone, user_type, created_at
    `;
    const values = [email, hashedPassword, name, phone, user_type];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, name, phone, user_type FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default UserModel;
```

#### Passo 6: Criar Controller de Auth (20 min)
**Criar:** `backend/src/controllers/auth.controller.js`

```javascript
import UserModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, name, phone, user_type } = req.body;

      // Verificar se usuário já existe
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Criar usuário
      const user = await UserModel.create({ email, password, name, phone, user_type });

      // Gerar token
      const token = jwt.sign(
        { userId: user.id, userType: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: 'Usuário cadastrado com sucesso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type
        },
        token
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuário
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const isValidPassword = await UserModel.comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token
      const token = jwt.sign(
        { userId: user.id, userType: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type
        },
        token
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }
}

export default AuthController;
```

#### Passo 7: Criar Middleware de Autenticação (15 min)
**Criar:** `backend/src/middlewares/auth.middleware.js`

```javascript
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const isSupplier = (req, res, next) => {
  if (req.user.userType !== 'fornecedor') {
    return res.status(403).json({ error: 'Acesso negado. Apenas fornecedores.' });
  }
  next();
};

export const isClient = (req, res, next) => {
  if (req.user.userType !== 'cliente') {
    return res.status(403).json({ error: 'Acesso negado. Apenas clientes.' });
  }
  next();
};
```

#### Passo 8: Criar Rotas de Auth (10 min)
**Criar:** `backend/src/routes/auth.routes.js`

```javascript
import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

const registerValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('user_type').isIn(['cliente', 'fornecedor']).withMessage('Tipo de usuário inválido')
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
];

router.post('/register', registerValidation, validate, AuthController.register);
router.post('/login', loginValidation, validate, AuthController.login);

export default router;
```

#### Passo 9: Criar Middleware de Validação (10 min)
**Criar:** `backend/src/middlewares/validate.middleware.js`

```javascript
import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
```

#### Passo 10: Integrar Rotas no Server (5 min)
**Editar:** `backend/src/server.js`

Adicionar após os middlewares:
```javascript
import authRoutes from './routes/auth.routes.js';

app.use('/api/auth', authRoutes);
```

#### Passo 11: Testar Autenticação (10 min)
**No Postman ou Insomnia:**

**Teste 1 - Registro:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "cliente@test.com",
  "password": "senha123",
  "name": "Cliente Teste",
  "phone": "11999999999",
  "user_type": "cliente"
}
```

**Teste 2 - Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "cliente@test.com",
  "password": "senha123"
}
```

**Copiar o token retornado para próximos testes.**

### Dia 2 - CRUD de Entidades

#### Passo 12: CRUD de Fornecedores (1 hora)
**Criar arquivos:**
1. `models/supplier.model.js`
2. `controllers/supplier.controller.js`
3. `routes/supplier.routes.js`

**Implementar métodos:**
- `POST /api/suppliers` - Criar fornecedor (requer auth + user_type=fornecedor)
- `GET /api/suppliers` - Listar fornecedores (com filtros cidade/categoria)
- `GET /api/suppliers/:id` - Detalhes do fornecedor
- `PUT /api/suppliers/:id` - Atualizar fornecedor (apenas próprio)
- `DELETE /api/suppliers/:id` - Desativar fornecedor

#### Passo 13: CRUD de Planos (30 min)
**Criar arquivos:**
1. `models/plan.model.js`
2. `controllers/plan.controller.js`
3. `routes/plan.routes.js`

**Implementar:**
- `GET /api/plans` - Listar todos os planos (público)
- `GET /api/plans/:id` - Detalhes de um plano

#### Passo 14: CRUD de Assinaturas (1 hora)
**Criar arquivos:**
1. `models/subscription.model.js`
2. `controllers/subscription.controller.js`
3. `routes/subscription.routes.js`

**Implementar:**
- `POST /api/subscriptions` - Criar assinatura (requer auth cliente)
- `GET /api/subscriptions/my` - Assinatura do usuário logado
- `PUT /api/subscriptions/:id/pause` - Pausar assinatura
- `PUT /api/subscriptions/:id/cancel` - Cancelar assinatura
- `PUT /api/subscriptions/:id/change-plan` - Alterar plano

#### Passo 15: CRUD de Pedidos (1 hora)
**Criar arquivos:**
1. `models/order.model.js`
2. `controllers/order.controller.js`
3. `routes/order.routes.js`

**Implementar:**
- `POST /api/orders` - Criar pedido (cliente)
- `GET /api/orders/my` - Listar pedidos do cliente
- `GET /api/orders/:id` - Detalhes do pedido
- `PUT /api/orders/:id/status` - Atualizar status (fornecedor)

### Dia 3 - Finalizações

#### Passo 16: Tratamento de Erros Global (30 min)
**Criar:** `middlewares/errorHandler.middleware.js`

#### Passo 17: Documentação Swagger (1 hora)
**Instalar:**
```bash
npm install swagger-ui-express swagger-jsdoc
```

**Configurar Swagger** e documentar todos endpoints.

#### Passo 18: Testes (2 horas)
- Testar todos endpoints no Postman
- Criar coleção Postman
- Exportar coleção para `docs/api/Subscrivery.postman_collection.json`

**Entregáveis Finais do Backend:**
- ✅ API completa funcionando
- ✅ Autenticação JWT
- ✅ Todos os CRUDs implementados
- ✅ Coleção Postman
- ✅ Documentação Swagger

---

## 💻 SETOR 3: FRONTEND

### Objetivo
Criar interface React completa e responsiva integrada com a API.

### Setup Inicial do Frontend

#### Passo 1: Instalar Dependências (5 min)
```bash
cd frontend
npm install
```

#### Passo 2: Configurar Tailwind CSS (já configurado)
Verificar se `tailwind.config.js` e `postcss.config.js` estão corretos.

#### Passo 3: Testar Servidor de Desenvolvimento (2 min)
```bash
npm run dev
```

Abrir: `http://localhost:5173`

### Dia 1 - Estrutura e Autenticação

#### Passo 4: Criar API Service (15 min)
**Criar:** `frontend/src/services/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### Passo 5: Criar Context de Autenticação (20 min)
**Criar:** `frontend/src/contexts/AuthContext.jsx`

```javascript
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      // Verificar se token expirou
      if (decoded.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUser(decoded);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    setUser(jwtDecode(token));
    return userData;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { token } = response.data;
    localStorage.setItem('token', token);
    setUser(jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

#### Passo 6: Criar Páginas de Login e Cadastro (1 hora)
**Criar:**
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Register.jsx`

Incluir:
- Formulários com validação
- Tratamento de erros
- Redirecionamento após login

#### Passo 7: Criar Rotas Protegidas (15 min)
**Criar:** `frontend/src/components/PrivateRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, requiredType }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (requiredType && user.userType !== requiredType) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
```

#### Passo 8: Configurar Rotas no App (15 min)
**Editar:** `frontend/src/App.jsx`

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<Plans />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

### Dia 2 - Páginas Principais

#### Passo 9: Criar Componentes Reutilizáveis (1 hora)
**Criar em `components/`:**
- `Header.jsx` - Navbar com logo e menu
- `Footer.jsx`
- `PlanCard.jsx` - Card de plano de assinatura
- `SupplierCard.jsx` - Card de fornecedor
- `OrderCard.jsx` - Card de pedido
- `Button.jsx` - Botão reutilizável
- `Input.jsx` - Input reutilizável

#### Passo 10: Página Home (1 hora)
**Criar:** `pages/Home.jsx`

Incluir:
- Hero section
- Busca de fornecedores
- Chamada para ação (CTA)
- Listagem de fornecedores próximos

#### Passo 11: Página de Planos (1 hora)
**Criar:** `pages/Plans.jsx`

Incluir:
- Listagem dos 3 planos (fetch de `/api/plans`)
- Cards com preço e benefícios
- Botão "Assinar" que redireciona para checkout

#### Passo 12: Página de Checkout (1 hora)
**Criar:** `pages/Checkout.jsx`

Incluir:
- Resumo do plano escolhido
- Formulário de pagamento (mock)
- Criação da assinatura via API

### Dia 3 - Dashboards

#### Passo 13: Dashboard do Cliente (2 horas)
**Criar:** `pages/client/Dashboard.jsx`

Incluir:
- Resumo da assinatura ativa
- Crédito restante
- Próximo billing
- Histórico de entregas
- Botões: Pausar/Cancelar/Alterar Plano

#### Passo 14: Dashboard do Fornecedor (2 horas)
**Criar:** `pages/supplier/Dashboard.jsx`

Incluir:
- Lista de pedidos pendentes
- Filtros por status
- Botão para atualizar status do pedido
- Estatísticas (total de pedidos, faturamento)

### Dia 4 - Responsividade e Ajustes

#### Passo 15: Tornar Todas Páginas Responsivas (2 horas)
- Testar em mobile (375px)
- Testar em tablet (768px)
- Ajustar espaçamentos e tamanhos
- Menu hambúrguer no mobile

#### Passo 16: Tratamento de Erros e Loading (1 hora)
- Adicionar spinners de loading
- Toasts de sucesso/erro
- Validação de formulários
- Mensagens amigáveis

#### Passo 17: Testes de Integração (1 hora)
- Testar fluxo completo:
  1. Cadastro → Login
  2. Buscar fornecedores
  3. Escolher plano → Checkout
  4. Ver dashboard
  5. Fazer pedido
  6. Logout

**Entregáveis Finais do Frontend:**
- ✅ Interface completa e responsiva
- ✅ Integração total com API
- ✅ Fluxos de cliente e fornecedor
- ✅ Validações e tratamento de erros

---

## 🚀 INTEGRAÇÃO E DEPLOY

### Dia 13 - Deploy Backend

#### Passo 18: Preparar Backend para Produção (1 hora)
```bash
# Criar .env.production
# Configurar variáveis de produção
```

#### Passo 19: Deploy no Railway/Heroku (1 hora)
```bash
# Exemplo Railway
railway login
railway init
railway add postgres
railway up
```

**Configurar:**
- Variáveis de ambiente
- Database PostgreSQL
- Executar migrations

#### Passo 20: Testar API em Produção (30 min)
- Testar todos endpoints
- Verificar CORS
- Checar conexão com banco

### Dia 14 - Deploy Frontend

#### Passo 21: Configurar Variável de API (10 min)
**Criar:** `frontend/.env.production`
```
VITE_API_URL=https://sua-api-no-railway.up.railway.app
```

**Atualizar:** `services/api.js`
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});
```

#### Passo 22: Build e Deploy no Vercel (30 min)
```bash
cd frontend
npm run build
vercel --prod
```

#### Passo 23: Testes Finais (1 hora)
- Testar aplicação completa em produção
- Verificar responsividade
- Testar todos fluxos
- Corrigir bugs encontrados

---

## ✅ Checklist Final de Entrega

### Design
- [ ] Logo (PNG, SVG, AI) na pasta `docs/design/`
- [ ] Manual de marca (PDF)
- [ ] Link do Figma compartilhado
- [ ] Protótipo desktop + mobile

### Backend
- [ ] API rodando em produção
- [ ] Banco de dados configurado
- [ ] Documentação Swagger/Postman
- [ ] README com instruções de instalação
- [ ] Variáveis de ambiente documentadas

### Frontend
- [ ] Aplicação rodando em produção
- [ ] Todas as telas implementadas
- [ ] Responsivo (mobile + desktop)
- [ ] Integrado com API
- [ ] Tratamento de erros

### Metodologia
- [ ] ClickUp/Bitrix24 configurado
- [ ] Product Backlog documentado
- [ ] Sprint Backlogs completos
- [ ] Dailies registradas
- [ ] Burndown charts atualizados
- [ ] Repositório Git organizado

### Apresentação (29/12)
- [ ] Slides preparados
- [ ] Demo funcional
- [ ] Vídeo de apresentação (opcional)
- [ ] Acesso ao ClickUp para avaliadores
- [ ] Links de produção (frontend + backend)

---

## 📞 Suporte

**Dúvidas durante o desenvolvimento:**
- Consultar documentação em `docs/`
- Revisar `SCRUM.md` para prazos
- Verificar `README.md` para overview

**Boa sorte no desenvolvimento! 🚀**
