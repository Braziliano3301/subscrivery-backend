import dotenv from 'dotenv';

dotenv.config();

// Configurações do Asaas
const ASAAS_CONFIG = {
  // URLs
  API_URL: process.env.ASAAS_ENV === 'production' 
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/v3',
  
  // Chaves
  API_KEY: process.env.ASAAS_API_KEY,
  WALLET_ID: process.env.ASAAS_WALLET_ID, // ID da carteira para receber pagamentos
  
  // Ambiente
  ENVIRONMENT: process.env.ASAAS_ENV || 'sandbox',
  
  // Webhook
  WEBHOOK_URL: process.env.ASAAS_WEBHOOK_URL || 'https://seu-dominio.com/api/webhooks/asaas',
  WEBHOOK_TOKEN: process.env.ASAAS_WEBHOOK_TOKEN,
  
  // Configurações padrão
  INSTALLMENTS: {
    MAX: 12, // Número máximo de parcelamentos
    MIN_VALUE: 50 // Valor mínimo por parcela
  },
  
  // Métodos de pagamento aceitos
  PAYMENT_METHODS: {
    PIX: 'PIX',
    CREDIT_CARD: 'CREDIT_CARD',
    BOLETO: 'BOLETO',
    DEBIT_CARD: 'DEBIT_CARD',
    BANK_TRANSFER: 'BANK_TRANSFER',
    UNDEFINED: 'UNDEFINED'
  },
  
  // Ciclos de recorrência
  CYCLES: {
    MONTHLY: 'MONTHLY',
    QUARTERLY: 'QUARTERLY',
    SEMI_ANNUAL: 'SEMI_ANNUAL',
    ANNUAL: 'ANNUAL',
    WEEKLY: 'WEEKLY',
    BIWEEKLY: 'BIWEEKLY'
  }
};

// Validar configuração
const validateAsaasConfig = () => {
  if (!ASAAS_CONFIG.API_KEY) {
    console.warn('⚠️ ASAAS_API_KEY não configurada. Funcionalidades do Asaas desabilitadas.');
    return false;
  }
  
  console.log(`✅ Asaas configurado em modo: ${ASAAS_CONFIG.ENVIRONMENT}`);
  return true;
};

// Validar ao inicializar
validateAsaasConfig();

export default ASAAS_CONFIG;
export { validateAsaasConfig };
