-- Migration: Adicionar campos Asaas
-- Este script adiciona as colunas necessárias para integração com Asaas

-- Adicionar coluna asaas_customer_id à tabela users
ALTER TABLE users ADD COLUMN asaas_customer_id VARCHAR(255) UNIQUE NULL;
ALTER TABLE users ADD COLUMN cpf VARCHAR(14) NULL;
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL;
ALTER TABLE users ADD COLUMN mobile_phone VARCHAR(20) NULL;
ALTER TABLE users ADD COLUMN address_street VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN address_number VARCHAR(10) NULL;
ALTER TABLE users ADD COLUMN address_complement VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN address_city VARCHAR(100) NULL;
ALTER TABLE users ADD COLUMN address_state VARCHAR(2) NULL;
ALTER TABLE users ADD COLUMN address_postal_code VARCHAR(10) NULL;

-- Adicionar colunas à tabela payments
ALTER TABLE payments ADD COLUMN asaas_id VARCHAR(255) UNIQUE NULL;
ALTER TABLE payments ADD COLUMN asaas_status VARCHAR(50) NULL;

-- Adicionar colunas à tabela subscriptions
ALTER TABLE subscriptions ADD COLUMN asaas_id VARCHAR(255) UNIQUE NULL;
ALTER TABLE subscriptions ADD COLUMN asaas_status VARCHAR(50) NULL;

-- Criar índices para melhor performance
CREATE INDEX idx_users_asaas_customer_id ON users(asaas_customer_id);
CREATE INDEX idx_payments_asaas_id ON payments(asaas_id);
CREATE INDEX idx_subscriptions_asaas_id ON subscriptions(asaas_id);

-- Adicionar coluna de status reembolsado aos pagamentos (se não existir)
-- Nota: Verificar se a coluna status aceita o valor 'reembolsado'
-- Se necessário, alterar a constraint CHECK na tabela payments

COMMENT ON COLUMN users.asaas_customer_id IS 'ID do cliente no Asaas';
COMMENT ON COLUMN payments.asaas_id IS 'ID da cobrança no Asaas';
COMMENT ON COLUMN payments.asaas_status IS 'Status da cobrança no Asaas (não sincronizado automaticamente)';
COMMENT ON COLUMN subscriptions.asaas_id IS 'ID da assinatura recorrente no Asaas';
COMMENT ON COLUMN subscriptions.asaas_status IS 'Status da assinatura no Asaas (não sincronizado automaticamente)';
