-- Script SQL para adicionar suporte a recuperação de senha

-- Adicionar colunas para tokens de recuperação
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_password_token);

-- Verificar se as colunas foram criadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('reset_password_token', 'reset_password_expires');
