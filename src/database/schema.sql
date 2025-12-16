-- ============================================================
-- BANCO DE DADOS: Subscrivery
-- DESCRIÇÃO: Schema para integração com Asaas
-- CRIADO: 2025-12-16
-- ============================================================

-- Tabela de Clientes (Customers)
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    asaas_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    document VARCHAR(20) NOT NULL UNIQUE,
    mobile_phone VARCHAR(20),
    address_street VARCHAR(255),
    address_number VARCHAR(20),
    address_complement VARCHAR(255),
    address_neighborhood VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(2),
    address_postal_code VARCHAR(10),
    company_name VARCHAR(255),
    company_website VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, deleted
    cpf_cnpj VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_user_id INTEGER,
    asaas_created_at TIMESTAMP,
    asaas_updated_at TIMESTAMP
);

-- Índices para customers
CREATE INDEX idx_customers_asaas_id ON customers(asaas_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_document ON customers(document);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_created_at ON customers(created_at);

-- Tabela de Pagamentos (Payments)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    asaas_id VARCHAR(255) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    asaas_customer_id VARCHAR(255) NOT NULL,
    value DECIMAL(15, 2) NOT NULL,
    net_value DECIMAL(15, 2),
    gross_value DECIMAL(15, 2),
    due_date DATE NOT NULL,
    original_due_date DATE,
    payment_date DATE,
    description VARCHAR(500),
    billing_type VARCHAR(50) NOT NULL, -- BOLETO, CREDIT_CARD, PIX, DEBIT_ACCOUNT, MONEY
    status VARCHAR(50) DEFAULT 'pending', -- PENDING, RECEIVED, OVERDUE, EXPIRED, DELETED, REFUNDED, REFUND_REQUESTED, REFUND_IN_PROGRESS
    subscription_id INTEGER,
    subscription_asaas_id VARCHAR(255),
    installment_number INTEGER,
    invoice_number VARCHAR(50),
    invoice_series VARCHAR(50),
    external_reference_id VARCHAR(255),
    discount_value DECIMAL(15, 2),
    interest_value DECIMAL(15, 2),
    fine_value DECIMAL(15, 2),
    credit_date DATE,
    estimated_credit_date DATE,
    pix_qrcode TEXT,
    pix_url_image TEXT,
    pix_expiration_date TIMESTAMP,
    boleto_barcode VARCHAR(100),
    boleto_url_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    asaas_created_at TIMESTAMP,
    asaas_updated_at TIMESTAMP,
    last_sync_at TIMESTAMP
);

-- Índices para payments
CREATE INDEX idx_payments_asaas_id ON payments(asaas_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_billing_type ON payments(billing_type);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);

-- Tabela de Assinaturas/Subscrições (Subscriptions)
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    asaas_id VARCHAR(255) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    asaas_customer_id VARCHAR(255) NOT NULL,
    value DECIMAL(15, 2) NOT NULL,
    next_due_date DATE NOT NULL,
    description VARCHAR(500),
    billing_type VARCHAR(50) NOT NULL, -- BOLETO, CREDIT_CARD, PIX, DEBIT_ACCOUNT, MONEY
    cycle VARCHAR(50) NOT NULL, -- DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, SEMIANNUALLY, YEARLY, CUSTOM
    status VARCHAR(50) DEFAULT 'active', -- ACTIVE, PAUSED, ENDED, EXPIRED
    end_date DATE,
    max_payments INTEGER,
    payments_count INTEGER DEFAULT 0,
    invoice_by_email BOOLEAN DEFAULT FALSE,
    auto_payment_failure_notifications BOOLEAN DEFAULT TRUE,
    cycle_custom_day INTEGER,
    discount_value DECIMAL(15, 2),
    interest_value DECIMAL(15, 2),
    fine_value DECIMAL(15, 2),
    split_configs JSONB,
    external_reference_id VARCHAR(255),
    next_payment_id VARCHAR(255),
    previous_payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    asaas_created_at TIMESTAMP,
    asaas_updated_at TIMESTAMP,
    last_sync_at TIMESTAMP
);

-- Índices para subscriptions
CREATE INDEX idx_subscriptions_asaas_id ON subscriptions(asaas_id);
CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_due_date ON subscriptions(next_due_date);
CREATE INDEX idx_subscriptions_created_at ON subscriptions(created_at);
CREATE INDEX idx_subscriptions_cycle ON subscriptions(cycle);

-- Tabela de Webhooks (para processar eventos do Asaas)
CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL, -- payment.received, payment.overdue, subscription.created, etc
    asaas_object_id VARCHAR(255) NOT NULL,
    asaas_object_type VARCHAR(50) NOT NULL, -- payment, subscription, customer, etc
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para webhooks
CREATE INDEX idx_webhooks_event_type ON webhooks(event_type);
CREATE INDEX idx_webhooks_asaas_object_id ON webhooks(asaas_object_id);
CREATE INDEX idx_webhooks_processed ON webhooks(processed);
CREATE INDEX idx_webhooks_created_at ON webhooks(created_at);

-- Tabela de Log de Sincronização (para rastrear sincronizações com Asaas)
CREATE TABLE IF NOT EXISTS sync_logs (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- customers, payments, subscriptions
    operation VARCHAR(50) NOT NULL, -- create, update, delete, list
    asaas_id VARCHAR(255),
    local_id INTEGER,
    status VARCHAR(50) DEFAULT 'success', -- success, error, pending
    error_message TEXT,
    request_body JSONB,
    response_body JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para sync_logs
CREATE INDEX idx_sync_logs_entity_type ON sync_logs(entity_type);
CREATE INDEX idx_sync_logs_asaas_id ON sync_logs(asaas_id);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);
CREATE INDEX idx_sync_logs_created_at ON sync_logs(created_at);

-- Tabela de Usuários (para controle de acesso)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user', -- admin, user, support
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);

-- Tabela de Auditoria (para registrar todas as operações importantes)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR(100) NOT NULL, -- customers, payments, subscriptions
    entity_id INTEGER,
    action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================
-- VIEWS ÚTEIS
-- ============================================================

-- View: Clientes com total de pagamentos
CREATE OR REPLACE VIEW v_customers_payment_summary AS
SELECT 
    c.id,
    c.asaas_id,
    c.name,
    c.email,
    c.status,
    COUNT(p.id) as total_payments,
    SUM(CASE WHEN p.status = 'RECEIVED' THEN p.value ELSE 0 END) as total_received,
    SUM(CASE WHEN p.status = 'PENDING' THEN p.value ELSE 0 END) as total_pending,
    SUM(CASE WHEN p.status = 'OVERDUE' THEN p.value ELSE 0 END) as total_overdue,
    MAX(p.created_at) as last_payment_date
FROM customers c
LEFT JOIN payments p ON c.id = p.customer_id
GROUP BY c.id, c.asaas_id, c.name, c.email, c.status;

-- View: Assinaturas ativas por cliente
CREATE OR REPLACE VIEW v_active_subscriptions AS
SELECT 
    s.id,
    s.asaas_id,
    c.id as customer_id,
    c.name as customer_name,
    c.email,
    s.value,
    s.next_due_date,
    s.cycle,
    s.payments_count,
    s.created_at
FROM subscriptions s
JOIN customers c ON s.customer_id = c.id
WHERE s.status = 'ACTIVE';

-- View: Pagamentos pendentes
CREATE OR REPLACE VIEW v_pending_payments AS
SELECT 
    p.id,
    p.asaas_id,
    c.id as customer_id,
    c.name as customer_name,
    c.email,
    p.value,
    p.due_date,
    p.billing_type,
    p.status,
    CURRENT_DATE - p.due_date as days_overdue,
    p.created_at
FROM payments p
JOIN customers c ON p.customer_id = c.id
WHERE p.status IN ('PENDING', 'OVERDUE');

-- ============================================================
-- COMENTÁRIOS NAS TABELAS
-- ============================================================

COMMENT ON TABLE customers IS 'Clientes sincronizados do Asaas';
COMMENT ON TABLE payments IS 'Pagamentos sincronizados do Asaas';
COMMENT ON TABLE subscriptions IS 'Assinaturas recorrentes sincronizadas do Asaas';
COMMENT ON TABLE webhooks IS 'Eventos recebidos via webhooks do Asaas';
COMMENT ON TABLE sync_logs IS 'Log de todas as sincronizações com Asaas';
COMMENT ON TABLE users IS 'Usuários do sistema';
COMMENT ON TABLE audit_logs IS 'Auditoria de operações no sistema';
