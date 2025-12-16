# Guia Completo: Instalar PostgreSQL no Windows

## Passo 1: Download (2 minutos)

1. Abra: https://www.postgresql.org/download/windows/
2. Clique em "Download the installer"
3. Escolha: **PostgreSQL 16** para Windows x86-64
4. Baixar o arquivo (aprox. 350MB)

## Passo 2: Instalar (5 minutos)

1. Execute o instalador baixado
2. **Installation Directory**: Deixar padrão (C:\Program Files\PostgreSQL\16)
3. **Select Components**: Marcar TODOS (PostgreSQL Server, pgAdmin 4, Stack Builder, Command Line Tools)
4. **Data Directory**: Deixar padrão
5. **Password**: 
   - ⚠️ **IMPORTANTE**: Crie uma senha SIMPLES para não esquecer
   - Exemplo: `postgres` ou `admin123` ou `senha123`
   - **ANOTE ESSA SENHA!**
6. **Port**: Deixar `5432` (padrão)
7. **Locale**: Deixar padrão
8. Clicar "Next" até finalizar
9. Desmarcar "Launch Stack Builder" no final

## Passo 3: Abrir pgAdmin (1 minuto)

1. Procurar no menu Iniciar: "pgAdmin 4"
2. Abrir pgAdmin
3. Vai pedir uma "Master Password" - criar uma (pode ser a mesma)
4. No menu lateral esquerdo: Servers → PostgreSQL 16
5. Vai pedir a senha que você criou na instalação
6. Marcar "Save Password"

## Passo 4: Criar Database (30 segundos)

1. No pgAdmin, expandir: Servers → PostgreSQL 16
2. Clicar com botão direito em "Databases"
3. Create → Database
4. **Database name**: `subscrivery`
5. Clicar "Save"

## Passo 5: Executar Schema (1 minuto)

1. Clicar com botão direito no database "subscrivery" que você criou
2. Query Tool (ou pressionar Alt+Shift+Q)
3. Clicar no ícone de pasta (Open File)
4. Navegar até: `C:\Users\Usuario\OneDrive\Desktop\Subscrivery\docs\database\schema.sql`
5. Clicar em "Execute" (ícone ▶ ou pressionar F5)
6. Deve aparecer: "Query returned successfully"

## Passo 6: Verificar (30 segundos)

No Query Tool, executar:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

**Deve mostrar:**
- users
- suppliers
- subscription_plans
- subscriptions
- orders
- order_items
- payments

E executar:

```sql
SELECT * FROM subscription_plans;
```

**Deve mostrar 3 planos:**
- Básico - R$ 49.90
- Intermediário - R$ 89.90
- Premium - R$ 149.90

## ✅ Pronto! Agora me avise para configurar o .env

---

## ❌ Se der algum erro, me fale qual!
