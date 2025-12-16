# ⚠️ AÇÃO NECESSÁRIA: Instalar PostgreSQL

## Você precisa instalar o PostgreSQL antes de continuar

### Opção 1: Instalador Oficial (Recomendado)
1. **Download**: https://www.postgresql.org/download/windows/
2. Baixar PostgreSQL 16 (ou 14+)
3. Executar instalador
4. **IMPORTANTE**: Anotar a senha que você criar para o usuário `postgres`
5. Porta padrão: `5432` (deixar como está)
6. Incluir **pgAdmin** (interface gráfica)

### Opção 2: Docker (Alternativa)
```powershell
# Se você tiver Docker instalado
docker run --name subscrivery-postgres -e POSTGRES_PASSWORD=senha123 -p 5432:5432 -d postgres:16
```

---

## Após instalar PostgreSQL:

### 1. Abrir pgAdmin (ou psql)

### 2. Criar o banco de dados
```sql
CREATE DATABASE subscrivery;
```

### 3. Executar o schema (criar tabelas)
**No pgAdmin:**
- Conectar ao servidor
- Clicar com botão direito em "subscrivery" → Query Tool
- Abrir arquivo: `C:\Users\Usuario\OneDrive\Desktop\Subscrivery\docs\database\schema.sql`
- Clicar em Execute (F5)

**Ou via linha de comando:**
```powershell
cd C:\Users\Usuario\OneDrive\Desktop\Subscrivery
psql -U postgres -d subscrivery -f docs/database/schema.sql
```

### 4. Verificar se tabelas foram criadas
```sql
-- No Query Tool do pgAdmin
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Deve retornar: users, suppliers, subscription_plans, subscriptions, orders, order_items, payments
```

### 5. Verificar se os 3 planos foram inseridos
```sql
SELECT * FROM subscription_plans;

-- Deve mostrar: Básico (R$49.90), Intermediário (R$89.90), Premium (R$149.90)
```

---

## ✅ Quando terminar, volte aqui e me avise!

Enquanto isso, vou preparar o resto do código do backend.

**Sua senha do PostgreSQL será usada no arquivo `.env`**
