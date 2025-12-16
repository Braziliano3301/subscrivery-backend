# Subscrivery

Plataforma de gerenciamento de assinaturas que conecta consumidores a fornecedores locais (supermercados, farmácias, pet shops).

## 📋 Sobre o Projeto

Subscrivery é uma plataforma que permite aos usuários assinarem planos mensais para receber produtos de fornecedores locais. Os fornecedores podem gerenciar pedidos e os clientes podem acompanhar suas entregas.

### Planos Disponíveis
- **Básico**: R$ 49,90/mês - até R$ 200 em produtos
- **Intermediário**: R$ 89,90/mês - até R$ 400 em produtos
- **Premium**: R$ 149,90/mês - até R$ 700 em produtos

## 🚀 Tecnologias

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express
- PostgreSQL
- JWT (autenticação)
- Bcrypt
- Nodemailer (sistema de emails)

### Ferramentas
- Git (GitFlow)
- ClickUp (gestão de projeto)
- Postman/Swagger (documentação API)
- Gmail SMTP (envio de emails)

## 📁 Estrutura do Projeto

```
Subscrivery/
├── frontend/          # Aplicação React
│   ├── public/        # Arquivos estáticos
│   ├── src/
│   │   ├── assets/    # Imagens, ícones, fontes
│   │   ├── components/# Componentes reutilizáveis
│   │   ├── pages/     # Páginas da aplicação
│   │   ├── services/  # API calls
│   │   ├── contexts/  # Context API
│   │   ├── hooks/     # Custom hooks
│   │   └── utils/     # Funções utilitárias
│   └── package.json
│
├── backend/           # API Node.js
│   ├── src/
│   │   ├── config/    # Configurações (DB, JWT, Email)
│   │   ├── controllers/# Lógica de negócio
│   │   ├── models/    # Modelos do banco
│   │   ├── routes/    # Rotas da API
│   │   ├── middlewares/# Autenticação, validações
│   │   ├── templates/ # Templates de email
│   │   ├── services/  # Serviços externos
│   │   └── utils/     # Funções auxiliares
│   ├── migrations/    # Scripts SQL
│   └── package.json
│
└── docs/              # Documentação
    ├── design/        # Logo, manual de marca, protótipo
    ├── api/           # Documentação API
    └── database/      # DER, scripts SQL
```

## 🎯 Funcionalidades Principais

### Para Clientes
- [x] Cadastro e login com JWT
- [x] Email de boas-vindas ao se cadastrar
- [x] Recuperação de senha por email
- [ ] Buscar fornecedores por localização
- [ ] Escolher plano de assinatura
- [ ] Gerenciar assinatura (pausar, cancelar, modificar)
- [ ] Dashboard com histórico de entregas
- [x] Notificação de pedido criado
- [x] Notificação de pagamento aprovado
- [ ] Pagamento com cartão

### Para Fornecedores
- [x] Cadastro e login
- [x] Notificação de novo pedido recebido
- [ ] Dashboard de pedidos
- [ ] Gerenciar entregas
- [ ] Visualizar assinantes

## 🔧 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Backend
```bash
cd backend
npm install (DATABASE, JWT, EMAIL)
npm run dev
```

**Variáveis de ambiente necessárias:**
- `DATABASE_URL` - Conexão PostgreSQL
- `JWT_SECRET` - Chave secreta JWT
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM` - Configuração de email

Para configurar emails, veja: [CONFIGURAR_EMAIL.md](./CONFIGURAR_EMAIL.md)onfigure as variáveis de ambiente
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📅 Timeline do Projeto

**Período**: 12/12/2025 - 26/12/2025 (14 dias)

### Sprint 1 (Semana 1)
- **Dias 1-2**: Design (logo, identidade visual, protótipo Figma)
- **Dias 3-4**: Setup do projeto + autenticação + modelagem DB
- **Dias 5-7**: Features core (listagem planos, busca fornecedores)

### Sprint 2 (Semana 2)
- **Dias 8-10**: Fluxo completo de assinatura + dashboards
- **Dias 11-12**: Testes + documentação API
- **Dias 13-14**: Deploy + preparação apresentação

**Apresentação Final**: 29/12/2025 às 19h

## 👥 Metodologia

- **Framework**: SCRUM
- **Sprints**: 2 sprints de 1 semana cada
- **Ferramentas**: ClickUp/Bitrix24/OKRFlow
- **Versionamento**: Git com GitFlow

## 📦 Entregáveis

### Design
- Logo (PNG, SVG, AI)
- Manual de marca (PDF)
- Protótipo Figma (alta fidelidade)

### Desenvolvimento
- Frontend responsivo
- Backend API REST
- Banco de dados modelado
- Documentação completa

### SCRUM
- Product Backlog
- Sprint BackloRailway (https://subscrivery-backend-production.up.railway.app)
- **Banco**: Neon PostgreSQL (cloud)
- **Swagger**: https://subscrivery-backend-production.up.railway.app/api-docs

### Status do Backend em Produção
- ✅ 30 endpoints funcionais
- ✅ Sistema de autenticação JWT
- ✅ Sistema de emails (Nodemailer + Gmail)
- ✅ Recuperação de senha
- ✅ Notificações automáticas
- Burndown charts

## 🌐 Deploy

## 📧 Sistema de Emails

O sistema envia automaticamente emails para:

### Emails Transacionais
- **Boas-vindas**: Enviado ao cadastrar novo usuário
- **Recuperação de senha**: Link para redefinir senha (expira em 1 hora)
- **Confirmação de alteração**: Enviado após redefinir senha

### Notificações de Pedidos
- **Pedido criado**: Cliente recebe confirmação do pedido
- **Pedido recebido**: Fornecedor é notificado do novo pedido

### Notificações Financeiras
- **Pagamento aprovado**: Cliente recebe confirmação de pagamento

Todos os emails incluem:
- Design responsivo e profissional
- Gradiente roxo/azul da marca
- Links de ação claros
- Versão texto alternativa

---

**Status**: 🚧 Em desenvolvimento

**Última atualização**: 16

Projeto desenvolvido para o processo seletivo Coding2U.

---

**Status**: 🚧 Em desenvolvimento

**Última atualização**: 12/12/2025
