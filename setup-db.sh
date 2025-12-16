#!/bin/bash
# Script para criar as tabelas no PostgreSQL

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações padrão
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-subscrivery}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}PostgreSQL - Setup das Tabelas${NC}"
echo -e "${YELLOW}========================================${NC}\n"

# Verificar se o PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL não está instalado ou não está no PATH${NC}"
    echo "Instale PostgreSQL: https://www.postgresql.org/download/"
    exit 1
fi

echo -e "${YELLOW}Configurações:${NC}"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER\n"

# Teste de conexão
echo -e "${YELLOW}🔌 Testando conexão com PostgreSQL...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -tc "SELECT 1;" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao conectar ao PostgreSQL${NC}"
    echo "Verifique:"
    echo "  - PostgreSQL está rodando?"
    echo "  - Host/Port/User/Password estão corretos?"
    echo "  - Variáveis de ambiente DB_HOST, DB_PORT, DB_USER, DB_PASSWORD?"
    exit 1
fi

echo -e "${GREEN}✅ Conectado ao PostgreSQL${NC}\n"

# Criar banco de dados se não existir
echo -e "${YELLOW}📦 Criando banco de dados '$DB_NAME' se não existir...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -tc \
    "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" | grep -q 1 || \
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c \
    "CREATE DATABASE $DB_NAME;"

echo -e "${GREEN}✅ Banco de dados pronto${NC}\n"

# Executar schema
echo -e "${YELLOW}🗂️  Criando tabelas...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f src/database/schema.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Tabelas criadas com sucesso!${NC}\n"
else
    echo -e "${RED}❌ Erro ao criar tabelas${NC}"
    exit 1
fi

# Exibir informações das tabelas
echo -e "${YELLOW}📋 Tabelas criadas:${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"

echo ""
echo -e "${YELLOW}🔍 Views criadas:${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dv"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Próximos passos:"
echo "1. Instalar dependências: npm install pg"
echo "2. Configurar variáveis de ambiente no .env"
echo "3. Testar conexão: npm run db:test"
echo "4. Implementar modelos e rotas"
echo ""
