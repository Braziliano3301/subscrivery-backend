# Sprint Planning - Subscrivery

## 📅 Timeline Geral
**Período**: 12/12/2025 - 26/12/2025 (14 dias)  
**Apresentação**: 29/12/2025 às 19h

---

## 🏃‍♂️ Sprint 1 - Semana 1 (Dias 1-7)

### Objetivo
Criar identidade visual, estruturar projeto e implementar autenticação + CRUD básico

### Daily Standup
- **Horário**: 9h (15min)
- **Formato**: O que fiz ontem / O que farei hoje / Impedimentos

### Tarefas

#### Dias 1-2: Design & Branding
**Product Backlog:**
- [ ] Criar logo (3 versões: colorida, branca, preta)
- [ ] Definir paleta de cores
- [ ] Escolher tipografia
- [ ] Criar manual de marca (PDF)
- [ ] Protótipo Figma - Wireframes
- [ ] Protótipo Figma - Alta fidelidade (desktop)
- [ ] Protótipo Figma - Alta fidelidade (mobile)

**Responsável**: Designer  
**Pontos**: 13

#### Dias 3-4: Setup & Autenticação
**Product Backlog:**
- [ ] Configurar PostgreSQL local
- [ ] Executar schema.sql (criar tabelas)
- [ ] Implementar registro de usuário (backend)
- [ ] Implementar login (backend)
- [ ] Criar middleware de autenticação JWT
- [ ] Criar rotas protegidas
- [ ] Tela de login (frontend)
- [ ] Tela de cadastro (frontend)
- [ ] Integração frontend-backend (auth)

**Responsável**: Dev Backend + Frontend  
**Pontos**: 21

#### Dias 5-7: Features Core
**Product Backlog:**
- [ ] CRUD de fornecedores (backend)
- [ ] Listar planos de assinatura (backend)
- [ ] Criar assinatura (backend)
- [ ] Tela de listagem de fornecedores (frontend)
- [ ] Tela de planos (frontend)
- [ ] Filtro de fornecedores por cidade/categoria
- [ ] Página de checkout
- [ ] Integração pagamento (mock)

**Responsável**: Dev Fullstack  
**Pontos**: 21

### Sprint Review (Dia 7 - 17h)
**Demonstração:**
- Logo e identidade visual
- Protótipo Figma navegável
- Sistema de login funcionando
- Listagem de fornecedores e planos

### Sprint Retrospective (Dia 7 - 18h)
**O que funcionou bem?**  
**O que pode melhorar?**  
**Ações para próxima sprint**

---

## 🏃‍♂️ Sprint 2 - Semana 2 (Dias 8-14)

### Objetivo
Completar funcionalidades, dashboard, testes e deploy

### Tarefas

#### Dias 8-10: Dashboards & Features Avançadas
**Product Backlog:**
- [ ] Dashboard do cliente (frontend)
- [ ] Histórico de entregas (backend + frontend)
- [ ] Gerenciar assinatura (pausar/cancelar)
- [ ] Alterar plano
- [ ] Dashboard do fornecedor (frontend)
- [ ] Listar pedidos do fornecedor (backend)
- [ ] Atualizar status do pedido
- [ ] Notificações básicas

**Responsável**: Dev Fullstack  
**Pontos**: 21

#### Dias 11-12: Testes & Documentação
**Product Backlog:**
- [ ] Testes de integração (backend)
- [ ] Validação de formulários (frontend)
- [ ] Tratamento de erros global
- [ ] Documentação API (Postman/Swagger)
- [ ] README atualizado
- [ ] Ajustes de UX/UI
- [ ] Validar responsividade

**Responsável**: QA + Dev  
**Pontos**: 13

#### Dias 13-14: Deploy & Preparação
**Product Backlog:**
- [ ] Deploy backend (Heroku/Railway)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Configurar banco de dados em produção
- [ ] Configurar variáveis de ambiente
- [ ] Testar aplicação em produção
- [ ] Criar apresentação (slides)
- [ ] Gravar demo em vídeo (opcional)
- [ ] Documentar acesso ao ClickUp

**Responsável**: DevOps + Product Owner  
**Pontos**: 13

### Sprint Review (Dia 14 - 17h)
**Demonstração:**
- Aplicação completa funcionando
- Fluxo cliente: cadastro → escolha plano → pagamento → dashboard
- Fluxo fornecedor: login → pedidos → atualização status
- Documentação API
- Deploy em produção

### Sprint Retrospective (Dia 14 - 18h)
**Lições aprendidas**  
**Desafios superados**  
**Próximos passos (pós-entrega)**

---

## 📊 Gestão de Projeto (ClickUp)

### Estrutura de Listas
1. **Backlog** - Todas as tarefas pendentes
2. **Sprint 1** - Tarefas da primeira sprint
3. **Sprint 2** - Tarefas da segunda sprint
4. **In Progress** - Em desenvolvimento
5. **Review** - Em revisão
6. **Done** - Concluído

### Campos Personalizados
- **Pontos**: Estimativa de esforço (Fibonacci: 1, 2, 3, 5, 8, 13, 21)
- **Prioridade**: Alta / Média / Baixa
- **Sprint**: 1 ou 2
- **Tipo**: Design / Frontend / Backend / DevOps / Docs

### Burndown Chart
- Atualizar diariamente
- Acompanhar velocidade da equipe
- Identificar impedimentos cedo

---

## 🎯 Definition of Done (DoD)

**Para cada tarefa estar "Done":**
- [ ] Código implementado e funcional
- [ ] Testado localmente (sem erros)
- [ ] Code review aprovado (se equipe)
- [ ] Documentado (se necessário)
- [ ] Commitado no Git com mensagem clara
- [ ] Integrado ao branch principal (sem conflitos)

**Para a Sprint estar "Done":**
- [ ] Todas as tarefas do Sprint Backlog concluídas
- [ ] Aplicação testada e funcionando
- [ ] Documentação atualizada
- [ ] Sprint Review realizada
- [ ] Retrospectiva documentada

---

## 📈 Métricas de Sucesso

### Técnicas
- **Cobertura de testes**: > 70%
- **Tempo de resposta API**: < 500ms
- **Uptime em produção**: > 99%

### Negócio
- **Fluxo de cadastro completo**: Funcional
- **3 planos disponíveis**: Implementados
- **Dashboard responsivo**: Desktop + Mobile

### Processo
- **Dailies realizadas**: 100%
- **Tarefas concluídas no prazo**: > 85%
- **Burndown dentro do previsto**: Sim
