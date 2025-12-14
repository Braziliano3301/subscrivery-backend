# 📋 Estrutura do Projeto Subscrivery - Para a Equipe

**Data:** 14/12/2025  
**Status:** Backend 90% completo (24 endpoints) + Swagger + CRUD Pedidos  
**Banco de Dados:** PostgreSQL (Neon Cloud) ✅  
**Repositórios:** Backend e Frontend separados

---

## 📁 Estrutura de Diretórios

```
Subscrivery/
│
├── .github/
│   └── copilot-instructions.md          # Instruções para desenvolvimento
│
├── backend/                              # API Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js              # ✅ Configuração PostgreSQL
│   │   │
│   │   ├── controllers/
│   │   │   └── auth.controller.js       # ✅ Lógica de autenticação
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js       # ✅ Verificação JWT + permissões
│   │   │   └── validate.middleware.js   # ✅ Validação de requisições
│   │   │
│   │   ├── models/
│   │   │   └── user.model.js            # ✅ Model de usuários
│   │   │
│   │   ├── routes/
│   │   │   └── auth.routes.js           # ✅ Rotas de autenticação
│   │   │
│   │   ├── services/                     # (vazio - para lógica de negócio)
│   │   ├── utils/                        # (vazio - funções auxiliares)
│   │   └── server.js                     # ✅ Servidor Express
│   │
│   ├── .env                              # ✅ Variáveis de ambiente (configurado)
│   ├── .env.example                      # Template de variáveis
│   └── package.json                      # ✅ Dependências instaladas
│
├── [frontend/]                           # ⚠️ MOVIDO PARA REPOSITÓRIO SEPARADO
│   # Repositório: https://github.com/otaviolap/subscrivery-frontend
│
├── docs/                                 # Documentação completa
│   ├── api/
│   │   └── endpoints.md                  # ✅ Documentação API REST
│   │
│   ├── database/
│   │   ├── schema.sql                    # ✅ Schema PostgreSQL (executado)
│   │   └── DER.md                        # ✅ Diagrama Entidade-Relacionamento
│   │
│   ├── design/
│   │   └── design-guide.md               # ✅ Guia de identidade visual
│   │
│   └── SCRUM.md                          # ✅ Planning das 2 sprints
│
├── .gitignore                            # ✅ Configurado
├── README.md                             # ✅ Overview do projeto
└── ROADMAP.md                            # ✅ Passo a passo de desenvolvimento

```

---

## 🛠️ Tecnologias Utilizadas

### Backend (Repositório Atual)
- **Node.js** 18+
- **Express** 4.18 - Framework web
- **PostgreSQL** 16 - Banco de dados (Neon Cloud)
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Express Validator** - Validação de dados
- **CORS** - Controle de acesso
- **Swagger** - Documentação OpenAPI 3.0

### Frontend (Repositório Separado)
- **Repositório:** https://github.com/otaviolap/subscrivery-frontend
- **Tecnologias:** React 18.2, Vite 5.0, Tailwind CSS 3.4, React Router 6.20

### Banco de Dados
- **Neon PostgreSQL** (cloud, grátis)
- **URL:** `postgresql://neondb_owner:npg_8YBpU6jNxuyw@ep-lucky-scene-ahbm60wl-pooler.c-3.us-east-1.aws.neon.tech/neondb`

---

## ✅ O Que Já Está Implementado

### ✅ Backend (90% completo - 24 endpoints)
   ✅ Autenticação JWT (4 endpoints: register, login, profile GET/PUT)  
   ✅ CRUD Fornecedores (6 endpoints com filtros e paginação)  
   ✅ Planos (2 endpoints: listar, detalhes)  
   ✅ CRUD Assinaturas (6 endpoints: criar, pausar, retomar, cancelar)  
   ✅ CRUD Pedidos (6 endpoints: criar, listar, atualizar status, cancelar)  
   ✅ Swagger/OpenAPI 3.0 (documentação completa em /api-docs)  
   ✅ Validações completas (express-validator)  
   ✅ Middlewares de autenticação e permissões  
   ✅ Gestão automática de créditos em pedidos  
   ✅ Interface de testes (test-api.html com 18 botões)

### ⏳ Frontend (Repositório Separado)
   📍 Repositório: https://github.com/otaviolap/subscrivery-frontend  
   ⏳ Em desenvolvimento pela equipe

### ⏳ Design (0% completo)
   ⏳ Definir paleta de cores  
   ⏳ Criar logo (Figma/Canva)  
   ⏳ Protótipo Figma (telas principais)  
   ⏳ Design system (componentes)

### ⏳ Deploy (0% completo)
   ⏳ Backend → Railway/Heroku  
   ⏳ Frontend → Vercel  
   ⏳ Testes em produção

---

## 📊 Progresso Detalhado

### Backend ✅✅✅✅✅⚪ (90%)
1. ✅ **Autenticação JWT** (4 endpoints):
   - `POST /api/auth/register` - Cadastro ✅
   - `POST /api/auth/login` - Login ✅
   - `GET /api/auth/profile` - Perfil ✅
   - `PUT /api/auth/profile` - Atualizar perfil ✅

2. ✅ **CRUD Fornecedores** (6 endpoints):
   - `POST /api/suppliers` - Criar ✅
   - `GET /api/suppliers` - Listar (filtros: city, state, category, search, paginação) ✅
   - `GET /api/suppliers/:id` - Detalhes ✅
   - `GET /api/suppliers/me/profile` - Meu perfil ✅
   - `PUT /api/suppliers/:id` - Atualizar ✅
   - `DELETE /api/suppliers/:id` - Deletar (soft delete) ✅

3. ✅ **Planos** (2 endpoints):
   - `GET /api/plans` - Listar 3 planos ✅
   - `GET /api/plans/:id` - Detalhes do plano ✅

4. ✅ **CRUD Assinaturas** (6 endpoints):
   - `POST /api/subscriptions` - Criar assinatura ✅
   - `GET /api/subscriptions/my` - Minha assinatura ativa ✅
   - `GET /api/subscriptions/history` - Histórico ✅
   - `PUT /api/subscriptions/:id/pause` - Pausar ✅
   - `PUT /api/subscriptions/:id/resume` - Retomar ✅
   - `PUT /api/subscriptions/:id/cancel` - Cancelar ✅

5. ✅ **CRUD Pedidos** (6 endpoints):
   - `POST /api/orders` - Criar pedido (valida crédito) ✅
   - `GET /api/orders/my` - Meus pedidos (cliente) ✅
   - `GET /api/orders/:id` - Detalhes do pedido ✅
   - `GET /api/orders/supplier/orders` - Pedidos recebidos (fornecedor) ✅
   - `PUT /api/orders/:id/status` - Atualizar status (fornecedor) ✅
   - `PUT /api/orders/:id/cancel` - Cancelar pedido (devolve crédito) ✅

6. ✅ **Documentação Swagger/OpenAPI**:
   - Rota: `GET /api-docs` - Interface interativa ✅
   - 24 endpoints documentados ✅
   - Schemas definidos (User, Supplier, Plan, Subscription, Order) ✅
   - Autenticação JWT Bearer configurada ✅

7. ✅ **Arquitetura**:
   - 5 Models: User, Supplier, Plan, Subscription, Order ✅
   - 5 Controllers com validações ✅
   - 5 Rotas protegidas (authMiddleware, isClient, isSupplier) ✅
   - Transações de banco para integridade de dados ✅

8. ✅ **Funcionalidades Avançadas**:
   - Gestão automática de créditos (dedução em pedidos) ✅
   - Devolução de crédito em cancelamento ✅
   - Validação de assinatura ativa antes de criar pedido ✅
   - Prevenção de assinaturas duplicadas ✅
   - Soft delete de fornecedores ✅

9. ✅ **Testes**:
   - Interface test-api.html com 18 botões de teste ✅
   - 2 usuários de teste criados ✅
   - 1 fornecedor cadastrado ✅
   - 1 assinatura ativa ✅

10. ✅ **Git**:
   - 4 commits: Fornecedores, Assinaturas, Swagger, Pedidos ✅
   - Repositório: https://github.com/otaviolap/subscrivery-backend ✅

### Banco de Dados (Tabelas Criadas)
- ✅ `users` - Usuários (clientes + fornecedores)
- ✅ `suppliers` - Informações de fornecedores
- ✅ `subscription_plans` - 3 planos (Básico, Intermediário, Premium)
- ✅ `subscriptions` - Assinaturas dos clientes
- ✅ `orders` - Pedidos/entregas
- ✅ `order_items` - Itens de cada pedido
- ✅ `payments` - Histórico de pagamentos

### Frontend (Repositório Separado)
1. 📍 **Repositório:** https://github.com/otaviolap/subscrivery-frontend
2. ⏳ **Em desenvolvimento** pela equipe de frontend

### Documentação
1. ✅ **README.md** - Overview completo
2. ✅ **ROADMAP.md** - Guia passo a passo por setor
3. ✅ **API Endpoints** - Documentação REST
4. ✅ **Database Schema** - SQL completo
5. ✅ **DER** - Diagrama de relacionamentos
6. ✅ **Design Guide** - Paleta de cores, tipografia
7. ✅ **SCRUM Planning** - 2 sprints detalhadas

---

## 🚀 Como Configurar (Para Novos Membros)

### 1. Clonar o Repositório
```bash
git clone <URL-DO-REPO>
cd Subscrivery
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Já está configurado no .env com credenciais do Neon

# Iniciar servidor
node src/server.js
# ou
npm run dev
```

**Servidor rodará em:** `http://localhost:3000`

**Testar API:**
- Abra no navegador: `backend/test-api.html`
- Clique nos botões para testar cada endpoint

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar dev server
npm run dev
```

**Frontend rodará em:** `http://localhost:5173`

---

## 🗄️ Banco de Dados (Neon PostgreSQL)

**Status:** ✅ Configurado e rodando em produção

### Acesso ao Banco
- **Console:** https://console.neon.tech/app/projects/summer-forest-78163588
- **Connection String:** (já configurada no `.env`)
- **SQL Editor:** Disponível no console do Neon

### Planos Cadastrados
| Nome           | Preço   | Crédito |
|----------------|---------|---------|
| Básico         | R$ 49.90| R$ 200  |
| Intermediário  | R$ 89.90| R$ 400  |
| Premium        | R$149.90| R$ 700  |

---

## 📝 Próximos Passos

### Backend (Pendente - 10%)
- [ ] **CRUD Pagamentos** (payments table)
  - POST /api/payments - Registrar pagamento
  - GET /api/payments/my - Meu histórico
  - GET /api/payments/:id - Detalhes

- [ ] **Renovação Automática de Assinaturas**
  - Cron job para verificar next_billing_date
  - Renovar crédito automaticamente
  - Enviar notificação (opcional)

- [ ] **Relatórios e Dashboards**
  - GET /api/reports/supplier/:id - Vendas do fornecedor
  - GET /api/reports/client - Gastos do cliente

- [ ] **Melhorias Opcionais**
  - Upload de imagem de perfil (Cloudinary)
  - Envio de email (Nodemailer)
  - Rate limiting (express-rate-limit)
  - Logs estruturados (Winston)

### Frontend (Em outro repositório)
- [ ] Integração com API backend
- [ ] Páginas de Login/Cadastro
- [ ] Dashboard Cliente
- [ ] Dashboard Fornecedor
- [ ] Marketplace de fornecedores
- [ ] Gestão de assinaturas e pedidos

### DevOps
- [ ] Deploy Backend → Railway/Render
- [ ] Deploy Frontend → Vercel
- [ ] Configurar variáveis de ambiente em produção
- [ ] Testes de integração
- [ ] Monitoramento (opcional)

---

## 🔑 Credenciais e Acessos

### Banco de Dados (Neon)
- **Email de acesso:** (da conta que criou)
- **Projeto:** summer-forest-78163588
- **Database:** neondb

### Variáveis de Ambiente (.env)
```env
PORT=3000
NODE_ENV=development
DB_HOST=ep-lucky-scene-ahbm60wl-pooler.c-3.us-east-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=npg_8YBpU6jNxuyw
JWT_SECRET=subscrivery_secret_key_2025_production_ready
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

⚠️ **Nota**: COR ✅ TESTADOS
- **POST** `/api/auth/register` - Cadastro ✅
- **POST** `/api/auth/login` - Login ✅
- **GET** `/api/auth/profile` - Perfil (requer token) ✅
- **PUT** `/api/auth/profile` - Atualizar perfil (requer token) ✅

### Health Check ✅ TESTADO
- **GET** `/api/health` - Verificar se API está rodando ✅

### Exemplos de Teste

**Registrar usuário:**
```json
POST http://localhost:3000/api/auth/register
{
  "email": "usuario@test.com",
  "password": "senha123",
  "name": "Nome Usuário",
  "phone": "11999999999",
  "user_type": "cliente"
}
```

**Login:**
```json
POST http://localhost:3000/api/auth/login
{
  "email": "usuario@test.com",
  "password": "senha123"
}
```Porta do Servidor:** Backend roda na porta **3000** (não 5000)
4. **CORS:** Configurado para aceitar todas origens em desenvolvimento (`origin: '*'`)
5. **Testes:** Use `backend/test-api.html` para testar visualmente os endpoints
6. **Git:** Recomendado criar branches por feature (GitFlow)
7. **Commits:** Usar mensagens descritivas (ex: `feat: adiciona login de usuário`)
8. **Code Review:** Todo PR deve ser revisado antes de merge
9. **Primeiro Usuário:** Já existe um usuário de teste (cliente@test.com / senha123)

---

**Última Atualização:** 13/12/2025 às 01h  
**Responsável pelo Setup:** Equipe Subscrivery  
**Status Geral:** ✅ Backend funcionando + testal (requer token)
- **PUT** `/api/auth/profile` - Atualizar perfil (requer token)

### Health Check
- **GET** `/api/health` - Verificar se API está rodando

---

## 📞 Contatos e Recursos

- **Documentação Completa:** Ver pasta `docs/`
- **Roadmap Detalhado:** `ROADMAP.md`
- **SCRUM Planning:** `docs/SCRUM.md`
- **API Docs:** `docs/api/endpoints.md`

---

## ⚠️ Observações Importantes

1. **Banco de Dados:** Já está em produção (Neon), não precisa instalar PostgreSQL local
2. **Dependências:** Todas instaladas, basta rodar `npm install` em cada pasta
3. **Porta do Servidor:** Backend roda na porta **3000** (não 5000)
4. **CORS:** Configurado para aceitar todas origens em desenvolvimento (`origin: '*'`)
5. **Testes:** Use `backend/test-api.html` para testar visualmente os endpoints
6. **Git:** Recomendado criar branches por feature (GitFlow)
7. **Commits:** Usar mensagens descritivas (ex: `feat: adiciona login de usuário`)
8. **Code Review:** Todo PR deve ser revisado antes de merge
9. **Primeiro Usuário:** Já existe um usuário de teste (cliente@test.com / senha123)

---

**Última Atualização:** 14/12/2025 às 02h30  
**Responsável:** Equipe Subscrivery  
**Status Geral:** ✅ Backend 90% (24 endpoints + Swagger) | ⏳ Frontend (repo separado) | ⏳ Deploy 0%  
**Próximo:** CRUD Pagamentos OU Deploy backend OU integração com frontend  
**Deadline:** 26/12/2025 (12 dias restantes)  
**Repositórios:**  
- Backend: https://github.com/otaviolap/subscrivery-backend  
- Frontend: https://github.com/otaviolap/subscrivery-frontend
