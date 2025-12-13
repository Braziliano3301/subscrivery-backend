# Guia de Design - Subscrivery

## 🎨 Identidade Visual

### Conceito
Moderna, confiável e acessível. A marca deve transmitir praticidade e economia para os usuários.

### Paleta de Cores

**Primárias:**
- **Azul Principal**: `#0ea5e9` (Primary 500)
- **Azul Escuro**: `#0369a1` (Primary 700)
- **Azul Claro**: `#bae6fd` (Primary 200)

**Secundárias:**
- **Verde Sucesso**: `#10b981` 
- **Amarelo Destaque**: `#f59e0b`
- **Vermelho Alerta**: `#ef4444`

**Neutras:**
- **Cinza Escuro**: `#1f2937` (Textos)
- **Cinza Médio**: `#6b7280` (Textos secundários)
- **Cinza Claro**: `#f3f4f6` (Backgrounds)
- **Branco**: `#ffffff`

### Tipografia

**Família Primária:** Inter, sans-serif
- **Títulos**: 700 (Bold)
- **Subtítulos**: 600 (Semibold)
- **Corpo**: 400 (Regular)

**Tamanhos:**
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### Logo

**Requisitos:**
- Versões: Horizontal, Vertical, Ícone
- Formatos: PNG (fundo transparente), SVG, AI
- Variações: Colorida, Monocromática (branca), Monocromática (preta)

**Elementos:**
- Símbolo relacionado a assinaturas/entregas
- Nome "Subscrivery" legível
- Estilo moderno e minimalista

### Ícones
- Biblioteca: Lucide React / Heroicons
- Estilo: Outline para interface, Solid para destaques
- Tamanho padrão: 24px

## 📱 Componentes UI

### Botões

**Primário:**
```css
background: #0ea5e9
color: #ffffff
padding: 12px 24px
border-radius: 8px
hover: #0369a1
```

**Secundário:**
```css
background: transparent
border: 2px solid #0ea5e9
color: #0ea5e9
padding: 12px 24px
border-radius: 8px
```

### Cards
```css
background: #ffffff
border: 1px solid #e5e7eb
border-radius: 12px
padding: 24px
shadow: 0 1px 3px rgba(0,0,0,0.1)
```

### Inputs
```css
border: 1px solid #d1d5db
border-radius: 8px
padding: 12px 16px
focus: border-color #0ea5e9, shadow
```

## 🖼️ Protótipo Figma

### Telas Principais

**Clientes:**
1. Login/Cadastro
2. Home (busca de fornecedores)
3. Planos de assinatura
4. Checkout/Pagamento
5. Dashboard (minhas entregas)
6. Detalhes da assinatura
7. Perfil do usuário

**Fornecedores:**
1. Login/Cadastro
2. Dashboard (pedidos pendentes)
3. Lista de pedidos
4. Detalhes do pedido
5. Perfil da empresa

### Responsividade
- Desktop: 1440px
- Tablet: 768px
- Mobile: 375px

### Componentes Reutilizáveis
- Header/Navbar
- Footer
- Card de Plano
- Card de Pedido
- Card de Fornecedor
- Formulários
- Modais
- Notificações/Alerts

## 📐 Grid & Espaçamento

**Container:**
- Max-width: 1200px
- Padding lateral: 24px

**Espaçamento:**
- XXS: 4px
- XS: 8px
- SM: 12px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL: 48px

## ✅ Checklist de Design

- [ ] Logo criado (PNG, SVG, AI)
- [ ] Paleta de cores definida
- [ ] Tipografia escolhida
- [ ] Manual de marca (PDF)
- [ ] Protótipo Figma - Telas de clientes
- [ ] Protótipo Figma - Telas de fornecedores
- [ ] Protótipo Figma - Mobile
- [ ] Componentes reutilizáveis documentados
- [ ] Ícones selecionados
- [ ] Estados de interação (hover, active, disabled)
