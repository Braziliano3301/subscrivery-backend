# 🚚 Sistema de Entregas Otimizado - Subscrivery

## 📌 O Problema

Atualmente temos apenas pedidos, mas não temos controle de **QUANDO** e **COMO** entregar.

**Exemplo do caos:**
- Cliente A (Zona Norte): quer receber terça
- Cliente B (Zona Norte): quer receber quinta  
- Cliente C (Zona Sul): quer receber terça
- Cliente D (Zona Sul): quer receber quinta

❌ **Sem sistema**: Precisaríamos de 4 viagens diferentes (caro, lento, ineficiente)

---

## ✅ A Solução

### **Como Funciona:**

```
1️⃣ CLIENTE ESCOLHE O DIA
   └─ "Quero receber toda TERÇA-FEIRA"

2️⃣ SUBSCRIVERY AGRUPA PEDIDOS
   └─ Todas as terças da Zona Norte = 1 rota
   └─ Todas as terças da Zona Sul = 1 rota

3️⃣ ENTREGADOR FAZ ROTA OTIMIZADA
   └─ Sai do depósito → Entrega 8 clientes → Volta
```

---

## 🎯 Exemplo Prático

### **Terça-feira, 17/12/2025**

**Pedidos do dia:**
- Cliente João (Rua A, Zona Norte)
- Cliente Maria (Rua B, Zona Norte)  
- Cliente Pedro (Rua C, Zona Norte)
- Cliente Ana (Rua D, Zona Norte)
- Cliente Carlos (Rua E, Zona Norte)
- Cliente Lucia (Rua F, Zona Sul)
- Cliente Marcos (Rua G, Zona Sul)
- Cliente Julia (Rua H, Zona Sul)

### **Sistema Otimiza Automaticamente:**

**ROTA 1 - Entregador João (Zona Norte):**
```
08:00 → Sai do Depósito
08:30 → Cliente João (Rua A)
08:45 → Cliente Maria (Rua B)
09:00 → Cliente Pedro (Rua C)
09:15 → Cliente Ana (Rua D)
09:30 → Cliente Carlos (Rua E)
10:00 → Volta ao Depósito
```
**Total: 5 entregas, 12km, 2 horas**

**ROTA 2 - Entregador Maria (Zona Sul):**
```
08:00 → Sai do Depósito
08:45 → Cliente Lucia (Rua F)
09:00 → Cliente Marcos (Rua G)
09:15 → Cliente Julia (Rua H)
09:45 → Volta ao Depósito
```
**Total: 3 entregas, 10km, 1h45min**

---

## 📊 Dashboard do Gestor

### **Visão Semanal:**

```
┌────────────────────────────────────────────────┐
│  📅 SEGUNDA (16/12)                            │
│  32 pedidos → 4 entregadores → 4 rotas         │
│  ✅ Tudo planejado                             │
├────────────────────────────────────────────────┤
│  📅 TERÇA (17/12)                              │
│  45 pedidos → 6 entregadores → 6 rotas         │
│  ⚠️  PRECISA CONTRATAR +2 ENTREGADORES         │
├────────────────────────────────────────────────┤
│  📅 QUARTA (18/12)                             │
│  28 pedidos → 4 entregadores → 4 rotas         │
│  ✅ Tudo planejado                             │
└────────────────────────────────────────────────┘
```

**O gestor vê:**
- Quantos pedidos tem cada dia
- Quantos entregadores precisa
- Se precisa contratar mais gente
- Quanto vai custar

---

## 💰 Economia Real

### **Sem Sistema (Caos):**
```
8 clientes espalhados = 8 viagens individuais
8 viagens × 10km × R$ 2/km = R$ 160
8 horas de trabalho × R$ 15/h = R$ 120
CUSTO TOTAL: R$ 280
```

### **Com Sistema (Otimizado):**
```
8 clientes em 1 rota = 1 viagem otimizada
1 viagem × 20km × R$ 2/km = R$ 40
2 horas de trabalho × R$ 15/h = R$ 30
CUSTO TOTAL: R$ 70
```

**💵 ECONOMIA: R$ 210 por dia (75% de redução!)**

**Em 1 mês (20 dias úteis): R$ 4.200 economizados**

---

## 🔄 Fluxo Completo

### **1. Cliente (Quando Assina)**
```
Cliente escolhe:
- Plano: Premium (R$ 149,90/mês)
- Dia de entrega: TERÇA-FEIRA
- Endereço: Rua ABC, 123 - Zona Norte
```

### **2. Sistema (Toda Semana)**
```
Sistema agrega automaticamente:
- Segunda: 32 clientes
- Terça: 45 clientes  
- Quarta: 28 clientes
- Quinta: 38 clientes
- Sexta: 41 clientes
```

### **3. Gestor (Planeja Equipe)**
```
Gestor vê dashboard:
- "Terça tem 45 pedidos → Preciso de 6 entregadores"
- "Só tenho 4 → Preciso contratar +2 freelancers"
```

### **4. Sistema (Cria Rotas)**
```
Sistema cria rotas otimizadas:
- Rota 1: 8 clientes - Zona Norte
- Rota 2: 8 clientes - Zona Norte  
- Rota 3: 8 clientes - Zona Sul
- Rota 4: 7 clientes - Zona Oeste
- Rota 5: 7 clientes - Centro
- Rota 6: 7 clientes - Zona Leste
```

### **5. Entregador (Executa Rota)**
```
Entregador abre o app:
- Vê sua rota do dia (8 paradas)
- Navega para cada endereço
- Marca como "entregue"
- Tira foto de comprovação
- Cliente recebe notificação
```

---

## 📱 Telas do Sistema

### **Tela do Cliente (Web/App):**
```
┌─────────────────────────────┐
│  Minha Assinatura           │
├─────────────────────────────┤
│  Plano: Premium             │
│  Crédito: R$ 450,00         │
│                             │
│  📅 Dia de Entrega:         │
│  [ Terça-feira ▼ ]          │
│                             │
│  📍 Endereço de Entrega:    │
│  Rua ABC, 123               │
│  [Alterar Endereço]         │
│                             │
│  Próxima entrega: 17/12     │
│  Status: Rota planejada ✅  │
└─────────────────────────────┘
```

### **Tela do Gestor (Dashboard):**
```
┌─────────────────────────────┐
│  Demanda Semanal            │
├─────────────────────────────┤
│  Seg: 32 pedidos [OK]       │
│  Ter: 45 pedidos [⚠️ +2]    │
│  Qua: 28 pedidos [OK]       │
│  Qui: 38 pedidos [OK]       │
│  Sex: 41 pedidos [OK]       │
│                             │
│  [Criar Rotas Automáticas]  │
│  [Contratar Entregadores]   │
└─────────────────────────────┘
```

### **Tela do Entregador (App Mobile):**
```
┌─────────────────────────────┐
│  Minha Rota - 17/12         │
├─────────────────────────────┤
│  🏁 Depósito (08:00)        │
│  ↓ 3.2 km                   │
│  1️⃣ João Silva              │
│     Rua A, 123              │
│     [Navegar] [Entregue ✓]  │
│  ↓ 1.5 km                   │
│  2️⃣ Maria Santos            │
│     Rua B, 456              │
│     [Navegar]               │
│  ↓ 0.8 km                   │
│  3️⃣ Pedro Lima              │
│     Rua C, 789              │
│                             │
│  ... +5 entregas            │
│                             │
│  Total: 8 entregas, 15.3km  │
│  Tempo estimado: 2h15min    │
└─────────────────────────────┘
```

---

## ✅ Benefícios

### **Para a Empresa:**
- ✅ Reduz custo de entrega em 75%
- ✅ Sabe exatamente quantos entregadores precisa
- ✅ Planejamento semanal automático
- ✅ Rotas otimizadas (menos km, menos tempo)

### **Para o Cliente:**
- ✅ Escolhe o dia que quer receber
- ✅ Rastreamento em tempo real
- ✅ Notificação quando sair para entrega
- ✅ Foto de comprovação

### **Para o Entregador:**
- ✅ Rota clara e organizada
- ✅ GPS integrado
- ✅ Sem desperdício de tempo
- ✅ Mais entregas = mais comissão

---

## 🎯 MVP (O que vamos fazer AGORA)

### **Versão Simples (até 26/12):**

1. ✅ Cliente escolhe dia de entrega na assinatura
2. ✅ Sistema mostra demanda por dia (quantos pedidos)
3. ✅ Gestor vê quantos entregadores precisa
4. ✅ Sistema agrupa pedidos por região
5. ✅ Sistema cria rota simples (mais próximo)

### **Versão Futura (2025):**
6. ⏳ Otimização avançada com Google Maps
7. ⏳ App mobile para entregador
8. ⏳ Rastreamento em tempo real
9. ⏳ Múltiplos veículos (moto, carro, van)
10. ⏳ IA para prever demanda

---

## 🚀 Próximos Passos

1. **Backend** (Bruno): Criar sistema de rotas (7-8 horas)
2. **Frontend** (Equipe): Tela de escolha de dia + Dashboard
3. **Design** (Equipe): Protótipo do app do entregador
4. **Testes**: Simular semana de entregas

---

## ❓ Perguntas Frequentes

**P: E se o cliente quiser mudar o dia?**  
R: Pode alterar até 48h antes da próxima entrega.

**P: E se não tiver pedidos suficientes em um dia?**  
R: Sugerimos ao cliente outro dia com mais entregas (desconto).

**P: Quanto custa 1 entregador?**  
R: Estimativa: R$ 100/dia (8 entregas) = R$ 12,50 por entrega.

**P: Quantos pedidos cabem em 1 rota?**  
R: Média: 8 pedidos (pode variar de 6 a 10 dependendo da distância).

**P: E se o cliente não estiver em casa?**  
R: Deixa com porteiro/vizinho ou agenda nova tentativa.

---

## 📈 Projeção (6 meses)

```
Mês 1: 100 clientes → 5 entregadores → Custo R$ 2.500/mês
Mês 3: 300 clientes → 12 entregadores → Custo R$ 6.000/mês
Mês 6: 600 clientes → 20 entregadores → Custo R$ 10.000/mês

Receita Mês 6: 600 × R$ 100 (média) = R$ 60.000
Custo Entrega: R$ 10.000
Lucro Operacional: R$ 50.000
```

---

**💡 Resumo em 1 frase:**
> "Cliente escolhe o dia, sistema agrupa pedidos próximos, entregador faz rota otimizada = menos custo, mais eficiência, cliente feliz."

---

**Criado em**: 16/12/2025  
**Autor**: Bruno Cabral - Backend Lead
