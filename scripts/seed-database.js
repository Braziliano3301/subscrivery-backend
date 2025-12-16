import Customer from '../src/models/Customer.js';
import Payment from '../src/models/Payment.js';
import Subscription from '../src/models/Subscription.js';

/**
 * Script para popular o banco com dados de teste
 * Uso: npm run db:seed
 */

const customers = [
  {
    asaas_id: 'cus_test_001',
    name: 'João Silva',
    email: 'joao@example.com',
    document: '123.456.789-00',
    mobile_phone: '(11) 98765-4321',
    address_street: 'Rua A',
    address_number: '123',
    address_city: 'São Paulo',
    address_state: 'SP',
    address_postal_code: '01234-567',
    asaas_created_at: new Date(),
    asaas_updated_at: new Date()
  },
  {
    asaas_id: 'cus_test_002',
    name: 'Maria Santos',
    email: 'maria@example.com',
    document: '987.654.321-00',
    mobile_phone: '(11) 99876-5432',
    address_street: 'Rua B',
    address_number: '456',
    address_city: 'Rio de Janeiro',
    address_state: 'RJ',
    address_postal_code: '20000-000',
    asaas_created_at: new Date(),
    asaas_updated_at: new Date()
  }
];

const payments = [
  {
    asaas_id: 'pay_test_001',
    customer_id: 1,
    asaas_customer_id: 'cus_test_001',
    value: 100.00,
    net_value: 95.00,
    gross_value: 100.00,
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    description: 'Pagamento teste 1',
    billing_type: 'BOLETO',
    status: 'PENDING',
    boleto_barcode: '12345.67890 12345.678901 12345.678901 1 12345678901234',
    asaas_created_at: new Date(),
    asaas_updated_at: new Date()
  },
  {
    asaas_id: 'pay_test_002',
    customer_id: 1,
    asaas_customer_id: 'cus_test_001',
    value: 250.50,
    net_value: 240.00,
    gross_value: 250.50,
    due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    description: 'Pagamento teste 2',
    billing_type: 'PIX',
    status: 'PENDING',
    pix_qrcode: 'mock-qrcode-data',
    asaas_created_at: new Date(),
    asaas_updated_at: new Date()
  },
  {
    asaas_id: 'pay_test_003',
    customer_id: 2,
    asaas_customer_id: 'cus_test_002',
    value: 150.00,
    net_value: 145.00,
    gross_value: 150.00,
    due_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    payment_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    description: 'Pagamento teste 3',
    billing_type: 'CREDIT_CARD',
    status: 'RECEIVED',
    credit_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    asaas_created_at: new Date(),
    asaas_updated_at: new Date()
  }
];

const subscriptions = [
  {
    asaas_id: 'sub_test_001',
    customer_id: 1,
    asaas_customer_id: 'cus_test_001',
    value: 99.90,
    next_due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    description: 'Plano Premium Mensal',
    billing_type: 'BOLETO',
    cycle: 'MONTHLY',
    status: 'ACTIVE',
    max_payments: 12,
    invoice_by_email: true,
    asaas_created_at: new Date(),
    asaas_updated_at: new Date()
  },
  {
    asaas_id: 'sub_test_002',
    customer_id: 2,
    asaas_customer_id: 'cus_test_002',
    value: 199.90,
    next_due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    description: 'Plano Enterprise Anual',
    billing_type: 'PIX',
    cycle: 'YEARLY',
    status: 'ACTIVE',
    max_payments: 1,
    invoice_by_email: true,
    asaas_created_at: new Date(),
    asaas_updated_at: new Date()
  }
];

async function seedDatabase() {
  try {
    console.log('\n🌱 Populando banco de dados com dados de teste...\n');

    // Criar clientes
    console.log('👥 Criando clientes...');
    const createdCustomers = [];
    for (const customer of customers) {
      const created = await Customer.create(customer);
      createdCustomers.push(created);
      console.log(`  ✅ Cliente: ${created.name} (${created.email})`);
    }
    console.log(`\n✅ ${createdCustomers.length} clientes criados\n`);

    // Criar pagamentos
    console.log('💳 Criando pagamentos...');
    const createdPayments = [];
    for (const payment of payments) {
      const created = await Payment.create(payment);
      createdPayments.push(created);
      console.log(`  ✅ Pagamento: ${created.description} (${created.value})`);
    }
    console.log(`\n✅ ${createdPayments.length} pagamentos criados\n`);

    // Criar assinaturas
    console.log('🔄 Criando assinaturas...');
    const createdSubscriptions = [];
    for (const subscription of subscriptions) {
      const created = await Subscription.create(subscription);
      createdSubscriptions.push(created);
      console.log(`  ✅ Assinatura: ${created.description} (${created.cycle})`);
    }
    console.log(`\n✅ ${createdSubscriptions.length} assinaturas criadas\n`);

    // Resumo
    console.log('📊 Resumo dos dados criados:');
    console.log(`  • Clientes: ${createdCustomers.length}`);
    console.log(`  • Pagamentos: ${createdPayments.length}`);
    console.log(`  • Assinaturas: ${createdSubscriptions.length}`);
    console.log(`\n✅ Seed completo!\n`);

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
