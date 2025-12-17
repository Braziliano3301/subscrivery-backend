# 📋 Estrutura do Projeto Subscrivery - Para a Equipe

**Data:** 14/12/2025  
**Status:** Backend 100% completo (28 endpoints) + Swagger + Git atualizado  
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
   │   │   ├── user.model.js            # ✅ Model de usuários
   │   │   ├── supplier.model.js        # ✅ Model de fornecedores
   │   │   ├── plan.model.js            # ✅ Model de planos
   │   │   ├── subscription.model.js    # ✅ Model de assinaturas
   │   │   ├── order.model.js           # ✅ Model de pedidos
   │   │   └── payment.model.js         # ✅ Model de pagamentos
│   │   │
│   │   ├── routes/
   │   │   ├── auth.routes.js           # ✅ Rotas de autenticação
   │   │   ├── supplier.routes.js       # ✅ Rotas de fornecedores
   │   │   ├── plan.routes.js           # ✅ Rotas de planos
   │   │   ├── subscription.routes.js   # ✅ Rotas de assinaturas
   │   │   ├── order.routes.js          # ✅ Rotas de pedidos
   │   │   └── payment.routes.js        # ✅ Rotas de pagamentos
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

### ✅ Backend (100% completo - 28 endpoints)
   ✅ Autenticação JWT (4 endpoints: register, login, profile GET/PUT)  
   ✅ CRUD Fornecedores (6 endpoints com filtros e paginação)  
   ✅ Planos (2 endpoints: listar, detalhes)  
   ✅ CRUD Assinaturas (6 endpoints: criar, pausar, retomar, cancelar)  
   ✅ CRUD Pedidos (6 endpoints: criar, listar, atualizar status, cancelar)  
   ✅ CRUD Pagamentos (5 endpoints: criar, listar, detalhes, atualizar status, estatísticas)  
   ✅ Swagger/OpenAPI 3.0 (documentação completa em /api-docs)  
   ✅ Validações completas (express-validator)  
   ✅ Middlewares de autenticação e permissões  
   ✅ Gestão automática de créditos em pedidos  
   ✅ Sistema de pagamentos com múltiplos métodos  
   ✅ Interface de testes (test-api.html com 22 botões)

### ⏳ Frontend (Repositório Separado)
   📍 Repositório: https://github.com/otaviolap/subscrivery-frontend  
   ⏳ Em desenvolvimento pela equipe

### ⏳ Design (40% completo - PRIORIDADE ALTA)
   ✅ **Logotipo** (PNG, SVG + fonte utilizada)  
   ⏳ **Manual da marca** (PDF com aplicações corretas)  
   ✅ **Paleta de cores documentada** (códigos hex, RGB, quando usar cada cor)  
   ⏳ **Protótipo completo no Figma** (todas as telas principais)  
   ⏳ **Acesso concedido ao avaliador** (link público ou convite)  
   
   **Ferramentas sugeridas:**
   - Canva (logotipo simples, gratuito)
   - Figma (protótipos, gratuito)
   - Coolors.co (paleta de cores)
   - ChatGPT/Copilot (ajuda com branding, conceito)

### ✅ Deploy Backend (100% completo)
   ✅ Backend → Railway (https://subscrivery-backend-production.up.railway.app)  
   ✅ 28 endpoints testados e funcionando em produção  
   ✅ Swagger disponível: /api-docs  
   ⏳ Frontend → Vercel (aguardando equipe)  
   ⏳ Integração frontend + backend

---

## 🎨 Mapeamento de Telas (Design + Frontend)

### 📱 Versões: Desktop + Mobile Responsivo

---

### **1. TELAS PÚBLICAS (Sem Login)**

#### 1.1 Landing Page / Home
- **Desktop:**
  - Hero section com proposta de valor
  - Como funciona (3 passos)
  - Planos de assinatura (cards comparativos)
  - Fornecedores parceiros (carrossel)
  - Depoimentos/Reviews
  - FAQ
  - Footer (links, redes sociais)
  - CTA: "Começar Agora" → Cadastro
  
- **Mobile:**
  - Menu hamburguer
  - Hero simplificado
  - Sections empilhadas verticalmente
  - Cards de planos em carrossel
  - CTA fixo no rodapé

#### 1.2 Sobre Nós
- **Desktop/Mobile:**
  - Missão, Visão, Valores
  - Time (opcional)
  - Impacto social/sustentabilidade
  - CTA para cadastro

#### 1.3 Marketplace Público (Lista de Fornecedores)
- **Desktop:**
  - Grade de cards de fornecedores (3-4 colunas)
  - Filtros laterais: Categoria, Cidade, Estado
  - Barra de busca no topo
  - Paginação
  
- **Mobile:**
  - Lista vertical (1 coluna)
  - Filtros em modal/drawer
  - Busca expansível
  - Scroll infinito ou paginação

#### 1.4 Detalhes do Fornecedor (Público)
- **Desktop/Mobile:**
  - Logo/foto do estabelecimento
  - Nome, categoria, endereço
  - Descrição
  - Produtos disponíveis (se aplicável)
  - CTA: "Assinar para comprar"

---

### **2. AUTENTICAÇÃO**

#### 2.1 Login
- **Desktop:**
  - Split screen (imagem esquerda + formulário direita)
  - Email, Senha
  - "Esqueci minha senha"
  - "Não tem conta? Cadastre-se"
  
- **Mobile:**
  - Formulário full screen
  - Logo no topo
  - Inputs empilhados

#### 2.2 Cadastro (Cliente)
- **Desktop/Mobile:**
  - Nome, Email, Telefone, Senha, Confirmar Senha
  - User Type = "cliente" (oculto ou pré-selecionado)
  - Checkbox "Li e aceito os termos"
  - "Já tem conta? Faça login"

#### 2.3 Cadastro (Fornecedor)
- **Desktop/Mobile:**
  - Etapa 1: Dados do usuário (igual cliente)
  - Etapa 2: Dados do negócio (Nome fantasia, CNPJ, Categoria, Endereço, CEP)
  - Progresso visual (2 steps)

#### 2.4 Esqueci Minha Senha
- **Desktop/Mobile:**
  - Campo email
  - "Enviar link de recuperação"
  - Mensagem de sucesso

---

### **3. ÁREA DO CLIENTE**

#### 3.1 Dashboard Cliente
- **Desktop:**
  - Sidebar navegação (Home, Assinaturas, Pedidos, Pagamentos, Perfil)
  - Cards de resumo: Assinatura ativa, Crédito disponível, Pedidos pendentes
  - Gráfico de gastos (opcional)
  - Últimos pedidos (tabela)
  - CTA: "Fazer Novo Pedido"
  
- **Mobile:**
  - Bottom navigation bar ou menu hamburguer
  - Cards empilhados
  - Lista de últimos pedidos

#### 3.2 Minha Assinatura
- **Desktop/Mobile:**
  - Card do plano atual (nome, preço, crédito)
  - Status (ativa/pausada/cancelada)
  - Próxima cobrança
  - Crédito restante (progress bar)
  - Botões: Pausar, Retomar, Cancelar, Alterar Plano
  - Histórico de assinaturas (tabela)

#### 3.3 Marketplace (Cliente Logado)
- **Desktop/Mobile:**
  - Igual marketplace público
  - Mas cards de fornecedores têm CTA "Fazer Pedido"
  - Indicador de crédito disponível no topo

#### 3.4 Criar Pedido
- **Desktop:**
  - Seleção de fornecedor (se não veio do marketplace)
  - Lista de produtos (tabela editável)
  - Adicionar item: Nome, Quantidade, Preço unitário
  - Subtotal e Total automático
  - Data de entrega
  - Validação de crédito em tempo real
  - Botão: "Confirmar Pedido"
  
- **Mobile:**
  - Formulário step-by-step
  - Items em lista com botão "+"
  - Resumo do pedido fixo no rodapé

#### 3.5 Meus Pedidos
- **Desktop:**
  - Tabela: Data, Fornecedor, Total, Status, Ações
  - Filtros: Status, Período
  - Paginação
  - Ação: Ver Detalhes, Cancelar (se pendente)
  
- **Mobile:**
  - Cards verticais
  - Filtros em modal
  - Swipe para ações rápidas

#### 3.6 Detalhes do Pedido
- **Desktop/Mobile:**
  - ID do pedido
  - Fornecedor
  - Items (tabela)
  - Status (timeline visual)
  - Data de entrega
  - Total
  - Botão Cancelar (se aplicável)

#### 3.7 Pagamentos
- **Desktop:**
  - Tabela: Data, Método, Valor, Status
  - Filtros: Status, Período
  - Cards de estatísticas: Total pago, Pendente, Ticket médio
  
- **Mobile:**
  - Lista de cards
  - Stats no topo
  - Filtros em modal

#### 3.8 Criar Pagamento
- **Desktop/Mobile:**
  - Selecionar assinatura
  - Valor (pré-preenchido com valor do plano)
  - Método: PIX, Cartão, Boleto, Transferência
  - QR Code PIX (se PIX)
  - Botão: "Confirmar Pagamento"

#### 3.9 Perfil do Cliente
- **Desktop/Mobile:**
  - Foto de perfil (upload)
  - Nome, Email, Telefone
  - Botão: "Salvar Alterações"
  - "Alterar Senha"
  - "Excluir Conta"

---

### **4. ÁREA DO FORNECEDOR**

#### 4.1 Dashboard Fornecedor
- **Desktop:**
  - Sidebar navegação (Home, Pedidos, Perfil)
  - Cards: Pedidos pendentes, Pedidos hoje, Total do mês
  - Gráfico de vendas (opcional)
  - Lista de pedidos recentes (tabela)
  
- **Mobile:**
  - Bottom nav
  - Cards empilhados
  - Lista simplificada

#### 4.2 Pedidos Recebidos
- **Desktop:**
  - Tabela: Data, Cliente, Items, Total, Status, Ações
  - Filtros: Status, Período
  - Ação: Ver Detalhes, Atualizar Status
  
- **Mobile:**
  - Cards verticais
  - Badge de status colorido
  - Botões de ação rápida

#### 4.3 Detalhes do Pedido (Fornecedor)
- **Desktop/Mobile:**
  - Cliente (nome, telefone)
  - Items (tabela)
  - Total
  - Status atual
  - Botões: Confirmar, Pronto para Entrega, Entregar, Cancelar
  - Timeline de status

#### 4.4 Perfil do Fornecedor
- **Desktop/Mobile:**
  - Logo (upload)
  - Nome fantasia, CNPJ (não editável)
  - Categoria
  - Endereço completo, CEP
  - Descrição do negócio
  - Botão: "Salvar Alterações"
  - "Desativar Perfil"

---

### **5. COMPONENTES COMPARTILHADOS**

- **Header/Navbar**
  - Desktop: Logo, Menu, Avatar dropdown
  - Mobile: Logo, Hamburguer, Avatar

- **Footer**
  - Links, Redes sociais, Copyright

- **Modals**
  - Confirmação (Cancelar pedido, Pausar assinatura, etc)
  - Sucesso/Erro

- **Toast Notifications**
  - Feedback de ações (sucesso, erro, info)

- **Loading States**
  - Skeleton screens
  - Spinners

- **Empty States**
  - "Nenhum pedido encontrado"
  - "Nenhum fornecedor disponível"
  - Ilustrações + CTA

---

### **📊 RESUMO**

**Total de Telas Principais:** 23 telas
- Públicas: 4
- Autenticação: 4
- Cliente: 9
- Fornecedor: 4
- Compartilhadas: 2

**Todas com versão Desktop + Mobile responsivo**

---

## 📊 Progresso Detalhado

### Backend ✅✅✅✅✅✅ (100%)
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

6. ✅ **CRUD Pagamentos** (5 endpoints):
   - `POST /api/payments` - Criar pagamento (PIX, cartão, boleto, transferência) ✅
   - `GET /api/payments/my` - Listar meus pagamentos ✅
   - `GET /api/payments/:id` - Detalhes do pagamento ✅
   - `PUT /api/payments/:id/status` - Atualizar status (pendente/aprovado/recusado) ✅
   - `GET /api/payments/stats` - Estatísticas de pagamentos ✅

7. ✅ **Documentação Swagger/OpenAPI**:
   - Rota: `GET /api-docs` - Interface interativa ✅
   - 28 endpoints documentados ✅
   - Schemas definidos (User, Supplier, Plan, Subscription, Order, Payment) ✅
   - Autenticação JWT Bearer configurada ✅

8. ✅ **Arquitetura**:
   - 6 Models: User, Supplier, Plan, Subscription, Order, Payment ✅
   - 6 Controllers com validações ✅
   - 6 Rotas protegidas (authMiddleware, isClient, isSupplier) ✅
   - Transações de banco para integridade de dados ✅

8. ✅ **Funcionalidades Avançadas**:
   - Gestão automática de créditos (dedução em pedidos) ✅
   - Devolução de crédito em cancelamento ✅
   - Validação de assinatura ativa antes de criar pedido ✅
   - Prevenção de assinaturas duplicadas ✅
   - Soft delete de fornecedores ✅
   - Sistema de pagamentos com múltiplos métodos ✅
   - Estatísticas de pagamentos (total pago, pendente, ticket médio) ✅
   - Schema preparado para futura integração Asaas ✅

9. ✅ **Testes**:
   - Interface test-api.html com 22 botões de teste ✅
   - 2 usuários de teste criados ✅
   - 1 fornecedor cadastrado ✅
   - 1 assinatura ativa ✅
   - 1 pagamento de teste aprovado ✅

10. ✅ **Git**:
   - 5 commits: Fornecedores, Assinaturas, Swagger, Pedidos, Pagamentos ✅
   - Repositório: https://github.com/otaviolap/subscrivery-backend ✅
   - Autor: Leonardo Cabral (biowcabral1995@gmail.com) ✅

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

### Backend (Opcionais - Melhorias Futuras)
- ✅ ~~CRUD Pagamentos~~ **COMPLETO** (5 endpoints implementados)

- [ ] **Integração Gateway de Pagamento (Opcional)**
  - Integrar Asaas API (sandbox) para pagamentos de teste
  - Webhook para receber notificações de status
  - Apenas 2 ALTER TABLE + service file necessários

- [ ] **Renovação Automática de Assinaturas (Opcional)**
  - Cron job para verificar next_billing_date
  - Renovar crédito automaticamente
  - Enviar notificação por email

- [ ] **Relatórios e Dashboards (Opcional)**
  - GET /api/reports/supplier/:id - Vendas do fornecedor
  - GET /api/reports/client - Gastos do cliente
  - Gráficos de consumo mensal

- [ ] **Melhorias Opcionais**
  - Upload de imagem de perfil (Cloudinary)
  - Envio de email (Nodemailer)
  - Rate limiting (express-rate-limit)
  - Logs estruturados (Winston)

### Design (PRIORIDADE ALTA - 40% Concluído)
- ✅ **Logotipo Subscrivery**
  - ✅ Formato PNG (alta resolução, fundo transparente)
  - ✅ Formato SVG (vetorial, escalável)
  - ✅ Documentar fonte utilizada (nome + link)
  
- [ ] **Manual da Marca** (PDF)
  - Aplicações corretas do logo (fundos claros/escuros)
  - Aplicações incorretas (o que NÃO fazer)
  - Espaçamento mínimo e tamanhos
  - Versões (colorida, monocromática, simplificada)
  
- ✅ **Paleta de Cores Documentada**
  - ✅ Cores primárias (hex, RGB, CMYK)
  - ✅ Cores secundárias
  - ✅ Cores de estado (sucesso, erro, aviso)
  - ✅ Quando usar cada cor
  - ✅ Combinações permitidas
  
- [ ] **Protótipo Completo no Figma**
  - Tela de Login/Cadastro
  - Dashboard Cliente (visão geral, assinaturas, pedidos, pagamentos)
  - Dashboard Fornecedor (pedidos recebidos, perfil)
  - Marketplace de fornecedores
  - Tela de checkout/pagamento
  - Versão mobile responsiva
  
- [ ] **Acesso ao Avaliador**
  - Link público do Figma (view only)
  - OU convite por email do avaliador
  - Arquivos do logo em pasta compartilhada (Google Drive/GitHub)

**Ferramentas Recomendadas:**
- 🎨 **Canva** (gratuito) - Criar logotipo simples
- 🎨 **Figma** (gratuito) - Protótipos e design system
- 🎨 **Coolors.co** - Gerar paleta de cores harmoniosa
- 🎨 **Adobe Color** - Validar contraste e acessibilidade
- 💡 **ChatGPT/Copilot** - Ajuda com branding, conceito, naming

**Sugestão de Identidade Visual:**
- **Tema:** Sustentabilidade + Comunidade Local + Conveniência
- **Cores sugeridas:** Verde (sustentável) + Azul (confiança) + Laranja (energia)
- **Estilo:** Moderno, limpo, amigável, acessível

### Frontend (Em outro repositório - Prioridade Alta)
- [ ] Integração completa com API backend (28 endpoints)
- [ ] Páginas de Login/Cadastro
- [ ] Dashboard Cliente (assinaturas, pedidos, pagamentos)
- [ ] Dashboard Fornecedor (pedidos recebidos, perfil)
- [ ] Marketplace de fornecedores
- [ ] Gestão de assinaturas e pedidos
- [ ] Histórico de pagamentos

### DevOps (Deploy Backend Completo ✅)
- ✅ Preparar backend para produção (CORS, .gitignore, scripts)
- ✅ Deploy Backend → Railway
- ✅ Configurar variáveis de ambiente em produção
- ✅ Gerar domínio Railway (subscrivery-backend-production.up.railway.app)
- ✅ Testar endpoints em produção (health, status, plans funcionando)
- ✅ Documentar URL da API para equipe frontend
- ✅ Fix: Escutar em 0.0.0.0 para aceitar conexões externas
- [ ] Deploy Frontend → Vercel
- [ ] Atualizar FRONTEND_URL no Railway após deploy do frontend
- [ ] Testes de integração completos
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
