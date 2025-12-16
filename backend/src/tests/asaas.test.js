// Test file for Asaas Integration
// Use este arquivo para testar os endpoints localmente

import axios from 'axios';

// ========================
// CONFIGURAÇÕES
// ========================

const API_BASE_URL = 'http://localhost:5000/api';
const JWT_TOKEN = 'seu_token_jwt_aqui'; // Obtém após fazer login

// IDs para teste (altere conforme necessário)
const TEST_SUBSCRIPTION_ID = 'seu_subscription_id_aqui';
const TEST_USER_ID = 'seu_user_id_aqui';

// ========================
// UTILIDADES
// ========================

const createAxiosInstance = () => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_TOKEN}`
    }
  });
};

const logResponse = (title, response) => {
  console.log('\n' + '='.repeat(60));
  console.log(`✅ ${title}`);
  console.log('='.repeat(60));
  console.log(JSON.stringify(response.data, null, 2));
};

const logError = (title, error) => {
  console.log('\n' + '='.repeat(60));
  console.log(`❌ ${title}`);
  console.log('='.repeat(60));
  console.log('Status:', error.response?.status);
  console.log('Message:', error.response?.data?.message);
  console.log('Error:', error.response?.data?.error);
};

// ========================
// TESTES
// ========================

/**
 * Teste 1: Criar Cobrança Única
 */
async function testCreateCharge() {
  try {
    const api = createAxiosInstance();
    
    const response = await api.post('/payments/asaas/charge', {
      subscription_id: TEST_SUBSCRIPTION_ID,
      amount: 10.00, // Valor pequeno para testes
      payment_method: 'pix',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0] // 3 dias a partir de hoje
    });

    logResponse('Cobrança Criada', response);
    return response.data.data.asaasId; // Retorna ID para testes subsequentes
  } catch (error) {
    logError('Erro ao Criar Cobrança', error);
  }
}

/**
 * Teste 2: Criar Assinatura Recorrente
 */
async function testCreateSubscription() {
  try {
    const api = createAxiosInstance();
    
    const response = await api.post('/payments/asaas/subscription', {
      subscription_id: TEST_SUBSCRIPTION_ID,
      cycle: 'mensal'
    });

    logResponse('Assinatura Criada', response);
    return response.data.data.asaasId;
  } catch (error) {
    logError('Erro ao Criar Assinatura', error);
  }
}

/**
 * Teste 3: Consultar Status de Cobrança
 */
async function testGetChargeStatus(asaasId) {
  try {
    const api = createAxiosInstance();
    
    const response = await api.get(`/payments/asaas/${asaasId}`);

    logResponse('Status da Cobrança', response);
    return response.data.data;
  } catch (error) {
    logError('Erro ao Consultar Cobrança', error);
  }
}

/**
 * Teste 4: Reembolsar Pagamento
 */
async function testRefundCharge(asaasId, amount) {
  try {
    const api = createAxiosInstance();
    
    const response = await api.post(
      `/payments/asaas/${asaasId}/refund`,
      { amount } // Omitir amount para reembolsar tudo
    );

    logResponse('Reembolso Processado', response);
    return response.data.data;
  } catch (error) {
    logError('Erro ao Reembolsar', error);
  }
}

/**
 * Teste 5: Simular Webhook
 */
async function testWebhook() {
  try {
    const webhook_token = 'seu_webhook_token_aqui';
    
    const response = await axios.post(
      `${API_BASE_URL}/webhooks/asaas`,
      {
        id: 'evt_test_12345',
        event: 'PAYMENT_RECEIVED',
        payment: {
          id: 'pay_test_12345',
          customer: 'cus_test_12345',
          billingType: 'PIX',
          value: 10.00,
          status: 'RECEIVED',
          dueDate: new Date().toISOString().split('T')[0]
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-token': webhook_token
        }
      }
    );

    logResponse('Webhook Processado', response);
  } catch (error) {
    logError('Erro ao Processar Webhook', error);
  }
}

/**
 * Teste 6: Fluxo Completo
 */
async function testCompleteFlow() {
  console.log('\n\n');
  console.log('╔' + '═'.repeat(58) + '╗');
  console.log('║' + ' TESTE COMPLETO - INTEGRAÇÃO ASAAS '.padEnd(59) + '║');
  console.log('╚' + '═'.repeat(58) + '╝');

  console.log('\n📝 Pré-requisitos:');
  console.log('  ✓ JWT_TOKEN configurado');
  console.log('  ✓ TEST_SUBSCRIPTION_ID válido');
  console.log('  ✓ Servidor rodando em http://localhost:5000');

  console.log('\n🚀 Iniciando testes...\n');

  // Teste 1: Criar cobrança
  console.log('1️⃣  Teste: Criar Cobrança Única');
  const asaasChargeId = await testCreateCharge();

  if (!asaasChargeId) {
    console.log('\n❌ Testes interrompidos: Falha ao criar cobrança');
    return;
  }

  // Pequeno delay
  await new Promise(r => setTimeout(r, 1000));

  // Teste 2: Consultar status
  console.log('\n2️⃣  Teste: Consultar Status da Cobrança');
  await testGetChargeStatus(asaasChargeId);

  // Teste 3: Criar assinatura
  console.log('\n3️⃣  Teste: Criar Assinatura Recorrente');
  const asaasSubscriptionId = await testCreateSubscription();

  // Teste 4: Simular webhook
  console.log('\n4️⃣  Teste: Simular Webhook');
  await testWebhook();

  // Teste 5: Reembolsar (opcional - descomente se quiser testar)
  // console.log('\n5️⃣  Teste: Reembolsar Pagamento');
  // await testRefundCharge(asaasChargeId, 5.00);

  console.log('\n\n' + '═'.repeat(60));
  console.log('✅ Testes Concluídos!');
  console.log('═'.repeat(60));

  console.log('\n📊 Resumo:');
  console.log(`  • Cobrança criada: ${asaasChargeId}`);
  console.log(`  • Assinatura criada: ${asaasSubscriptionId || 'N/A'}`);
  console.log('\n💡 Próximos passos:');
  console.log('  1. Verificar registros no banco de dados');
  console.log('  2. Validar notificações de webhook');
  console.log('  3. Testar fluxo em ambiente de produção');
}

// ========================
// EXECUTAR
// ========================

// Descomente para rodar os testes
// testCompleteFlow();

export {
  testCreateCharge,
  testCreateSubscription,
  testGetChargeStatus,
  testRefundCharge,
  testWebhook,
  testCompleteFlow
};
