#!/usr/bin/env node

/**
 * 🧪 Test All Asaas Endpoints
 * Testa automaticamente todos os endpoints e retorna relatório
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

const tests = [];
let customerId = null;
let paymentId = null;
let subscriptionId = null;

// Função para registrar resultado
function logTest(name, success, details = '') {
  const status = success ? `${colors.green}✅ PASSOU${colors.reset}` : `${colors.red}❌ FALHOU${colors.reset}`;
  console.log(`${status} | ${name}`);
  if (details) console.log(`     └─ ${details}`);
  tests.push({ name, success, details });
}

// Função para fazer requisição
async function makeRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: { 'Content-Type': 'application/json' },
    };
    if (data) config.data = data;

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return { success: false, error: message, status: error.response?.status };
  }
}

// Main
async function runTests() {
  console.log(`\n${colors.bold}${colors.blue}🧪 TESTE AUTOMÁTICO - ASAAS SANDBOX${colors.reset}\n`);
  console.log(`${colors.yellow}⏱️  Iniciando testes em ${new Date().toLocaleTimeString()}${colors.reset}\n`);

  // 1. Health Check
  console.log(`${colors.bold}📍 1. Health Check${colors.reset}`);
  let result = await makeRequest('GET', '/health');
  logTest('GET /health', result.success, result.success ? 'Servidor respondeu' : result.error);

  if (!result.success) {
    console.log(`\n${colors.red}${colors.bold}❌ Servidor não está respondendo!${colors.reset}`);
    console.log(`   Execute: npm run dev\n`);
    process.exit(1);
  }

  // 2. Create Customer
  console.log(`\n${colors.bold}📍 2. Customers${colors.reset}`);
  const customerData = {
    name: `Test Customer ${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    document: '12345678901234',
    mobilePhone: '11987654321',
  };

  result = await makeRequest('POST', '/api/customers', customerData);
  logTest('POST /api/customers', result.success, result.success ? `ID: ${result.data?.customer?.id}` : result.error);

  if (result.success) {
    customerId = result.data.customer.id;
  } else {
    console.log(`   ${colors.yellow}⚠️  Não será possível testar pagamentos/assinaturas sem customerId${colors.reset}`);
  }

  // 3. List Customers
  result = await makeRequest('GET', '/api/customers');
  logTest('GET /api/customers', result.success, result.success ? `${result.data?.customers?.length || 0} clientes` : result.error);

  // 4. Create Payment
  console.log(`\n${colors.bold}📍 3. Payments${colors.reset}`);
  if (customerId) {
    const paymentData = {
      customerId,
      value: 99.90,
      description: 'Teste Automatizado',
      dueDate: '2025-12-25',
    };
    result = await makeRequest('POST', '/api/payments', paymentData);
    logTest('POST /api/payments', result.success, result.success ? `ID: ${result.data?.payment?.id}` : result.error);

    if (result.success) {
      paymentId = result.data.payment.id;
    }
  } else {
    logTest('POST /api/payments', false, 'customerId não disponível');
  }

  // 5. List Payments
  result = await makeRequest('GET', '/api/payments');
  logTest('GET /api/payments', result.success, result.success ? `${result.data?.payments?.length || 0} pagamentos` : result.error);

  // 6. Get Payment Details
  if (paymentId) {
    result = await makeRequest('GET', `/api/payments/${paymentId}`);
    logTest(`GET /api/payments/:id`, result.success, result.success ? `Status: ${result.data?.payment?.status}` : result.error);
  } else {
    logTest(`GET /api/payments/:id`, false, 'paymentId não disponível');
  }

  // 7. Create Subscription
  console.log(`\n${colors.bold}📍 4. Subscriptions${colors.reset}`);
  if (customerId) {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextDueDate = nextMonth.toISOString().split('T')[0];

    const subscriptionData = {
      customerId,
      value: 29.90,
      nextDueDate,
      description: 'Teste Assinatura',
      cycle: 'MONTHLY',
    };
    result = await makeRequest('POST', '/api/subscriptions', subscriptionData);
    logTest('POST /api/subscriptions', result.success, result.success ? `ID: ${result.data?.subscription?.id}` : result.error);

    if (result.success) {
      subscriptionId = result.data.subscription.id;
    }
  } else {
    logTest('POST /api/subscriptions', false, 'customerId não disponível');
  }

  // 8. Get Subscription Details
  if (subscriptionId) {
    result = await makeRequest('GET', `/api/subscriptions/${subscriptionId}`);
    logTest(`GET /api/subscriptions/:id`, result.success, result.success ? `Status: ${result.data?.subscription?.status}` : result.error);
  } else {
    logTest(`GET /api/subscriptions/:id`, false, 'subscriptionId não disponível');
  }

  // 9. Cancel Subscription
  if (subscriptionId) {
    result = await makeRequest('DELETE', `/api/subscriptions/${subscriptionId}`);
    logTest(`DELETE /api/subscriptions/:id`, result.success, result.success ? 'Assinatura cancelada' : result.error);
  } else {
    logTest(`DELETE /api/subscriptions/:id`, false, 'subscriptionId não disponível');
  }

  // Resumo
  console.log(`\n${colors.bold}${colors.blue}📊 RESUMO DOS TESTES${colors.reset}\n`);

  const passed = tests.filter(t => t.success).length;
  const failed = tests.filter(t => !t.success).length;
  const total = tests.length;

  console.log(`${colors.green}✅ Passou: ${passed}/${total}${colors.reset}`);
  console.log(`${colors.red}❌ Falhou: ${failed}/${total}${colors.reset}`);

  if (failed > 0) {
    console.log(`\n${colors.yellow}⚠️  Testes com Falha:${colors.reset}`);
    tests.filter(t => !t.success).forEach(t => {
      console.log(`   • ${t.name}: ${t.details}`);
    });
  }

  // Resultado final
  console.log(`\n${colors.yellow}⏱️  Testes finalizados em ${new Date().toLocaleTimeString()}${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}${colors.bold}🎉 TODOS OS TESTES PASSARAM!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bold}⚠️  ALGUNS TESTES FALHARAM${colors.reset}\n`);
    process.exit(1);
  }
}

// Executar
runTests().catch(error => {
  console.error(`${colors.red}Erro fatal:${colors.reset}`, error.message);
  process.exit(1);
});
