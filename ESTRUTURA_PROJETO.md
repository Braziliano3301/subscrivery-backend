# 📋 Estrutura do Projeto Subscrivery - Para a Equipe

**Data:** 12/12/2025  
**Status:** Estrutura completa + Backend com autenticação implementado  
**Banco de Dados:** PostgreSQL (Neon Cloud) ✅

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
├── frontend/                             # React + Vite + Tailwind
│   ├── public/                           # Arquivos estáticos
│   ├── src/
│   │   ├── assets/                       # Imagens, ícones, fontes
│   │   ├── components/                   # Componentes reutilizáveis
│   │   ├── contexts/                     # Context API (AuthContext)
│   │   ├── hooks/                        # Custom hooks
│   │   ├── pages/                        # Páginas da aplicação
│   │   ├── services/                     # API calls
│   │   ├── utils/                        # Funções utilitárias
│   │   ├── App.jsx                       # ✅ Componente principal
│   │   ├── main.jsx                      # ✅ Entry point
│   │   └── index.css                     # ✅ Estilos globais + Tailwind
│   │
│   ├── index.html                        # ✅ HTML base
│   ├── package.json                      # ✅ Dependências configuradas
│   ├── vite.config.js                    # ✅ Configuração Vite
│   ├── tailwind.config.js                # ✅ Configuração Tailwind
│   └── postcss.config.js                 # ✅ PostCSS
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

### Backend
- **Node.js** 18+
- **Express** 4.18 - Framework web
- **PostgreSQL** 16 - Banco de dados (Neon Cloud)
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Express Validator** - Validação de dados
- **CORS** - Controle de acesso

### Frontend
- **React** 18.2
- **Vite** 5.0 - Build tool
- **React Router** 6.20 - Roteamento
- **Tailwind CSS** 3.4 - Estilização
- **Axios** 1.6 - HTTP client

### Banco de Dados
- **Neon PostgreSQL** (cloud, grátis)
- **URL:** `postgresql://neondb_owner:npg_8YBpU6jNxuyw@ep-lucky-scene-ahbm60wl-pooler.c-3.us-east-1.aws.neon.tech/neondb`

---

## ✅ O Que Já Está Implementado

### Backend ✅ TESTADO E FUNCIONANDO
1. ✅ **Servidor Express** configurado e rodando (porta 3000)
2. ✅ **Conexão com PostgreSQL** (Neon Cloud - Produção)
3. ✅ **Autenticação JWT** completa e testada:
   - `POST /api/auth/register` - Cadastro de usuário ✅ TESTADO
   - `POST /api/auth/login` - Login ✅ TESTADO
   - `GET /api/auth/profile` - Perfil do usuário (protegido) ✅ TESTADO
   - `PUT /api/auth/profile` - Atualizar perfil (protegido) ✅ IMPLEMENTADO
4. ✅ **Middlewares**:
   - Autenticação JWT ✅
   - Validação de dados ✅
   - Verificação de permissões (cliente/fornecedor) ✅
   - CORS configurado ✅
5. ✅ **Models**: UserModel com CRUD completo
6. ✅ **Database Schema**: 7 tabelas criadas no banco
7. ✅ **Página de Testes** (test-api.html) - Interface visual para testar API
8. ✅ **Primeiro usuário criado** no banco de dados (cliente@test.com)

### Banco de Dados (Tabelas Criadas)
- ✅ `users` - Usuários (clientes + fornecedores)
- ✅ `suppliers` - Informações de fornecedores
- ✅ `subscription_plans` - 3 planos (Básico, Intermediário, Premium)
- ✅ `subscriptions` - Assinaturas dos clientes
- ✅ `orders` - Pedidos/entregas
- ✅ `order_items` - Itens de cada pedido
- ✅ `payments` - Histórico de pagamentos

### Frontend
1. ✅ **Estrutura** completa de pastas
2. ✅ **Vite + React** configurado
3. ✅ **Tailwind CSS** configurado
4. ✅ **Componente base** (App.jsx) criado

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

## 📝 Próximos Passos (Para Divisão de Tarefas)

### Design (Dias 1-2)
- [ ] Criar logo (PNG, SVG, AI)
- [ ] Definir paleta de cores final
- [ ] Manual de marca (PDF)
- [ ] Protótipo Figma (desktop + mobile)

### Backend (Dias 3-5)
- [ ] CRUD de Fornecedores
- [ ] CRUD de Assinaturas
- [ ] CRUD de Pedidos
- [ ] Listagem de Planos (GET /api/plans)
- [ ] Documentação Swagger/Postman

### Frontend (Dias 6-10)
- [ ] Páginas de Login/Cadastro
- [ ] AuthContext e rotas protegidas
- [ ] Página de Planos
- [ ] Dashboard Cliente
- [ ] Dashboard Fornecedor
- [ ] Responsividade

### DevOps (Dias 11-14)
- [ ] Deploy Backend (Railway/Heroku)
- [ ] Deploy Frontend (Vercel)
- [ ] Configurar CI/CD
- [ ] Testes finais em produção

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
3. **Git:** Recomendado criar branches por feature (GitFlow)
4. **Commits:** Usar mensagens descritivas (ex: `feat: adiciona login de usuário`)
5. **Code Review:** Todo PR deve ser revisado antes de merge

---

**Última Atualização:** 12/12/2025 às 19h  
**Responsável pelo Setup:** [Seu Nome]  
**Status Geral:** ✅ Backend funcionando | ⏳ Frontend estruturado | 📋 Docs completas
