import { sendEmail } from './config/email.js';
import {
  welcomeEmail,
  forgotPasswordEmail,
  orderCreatedClientEmail,
  orderReceivedSupplierEmail,
  paymentApprovedEmail,
  passwordResetConfirmationEmail
} from './templates/emailTemplates.js';
import dotenv from 'dotenv';

dotenv.config();

// Email de destino (seu email)
const TEST_EMAIL = process.env.EMAIL_USER;

// Dados mockados para testes
const mockUser = {
  name: 'João Silva',
  email: TEST_EMAIL
};

const mockOrder = {
  id: '00000123',
  total_amount: 1500.00,
  delivery_date: '2025-12-20',
  status: 'pendente',
  created_at: new Date()
};

const mockPayment = {
  id: '00000456',
  amount: 299.90,
  payment_method: 'cartao_credito',
  status: 'aprovado',
  transaction_id: 'TXN-2025-12-16-001',
  created_at: new Date()
};

const mockSubscription = {
  plan_type: 'premium',
  start_date: '2025-01-01',
  end_date: '2025-12-31',
  monthly_credit: 5000.00,
  remaining_credit: 3500.00
};

const mockResetToken = 'abc123def456ghi789jkl012mno345pqr678';

async function testAllEmails() {
  console.log('\n🧪 INICIANDO TESTES DE EMAIL\n');
  console.log(`📧 Todos os emails serão enviados para: ${TEST_EMAIL}\n`);
  console.log('⏳ Aguarde enquanto os emails são enviados...\n');

  const tests = [
    {
      name: '1. Email de Boas-vindas',
      template: welcomeEmail(mockUser.name),
      emoji: '👋'
    },
    {
      name: '2. Email de Esqueci Senha',
      template: forgotPasswordEmail(mockUser.name, mockResetToken),
      emoji: '🔐'
    },
    {
      name: '3. Email de Pedido Criado (Cliente)',
      template: orderCreatedClientEmail(mockUser.name, mockOrder, 'Fornecedor XYZ'),
      emoji: '🛒'
    },
    {
      name: '4. Email de Pedido Recebido (Fornecedor)',
      template: orderReceivedSupplierEmail('Fornecedor ABC', mockOrder, mockUser.name),
      emoji: '📦'
    },
    {
      name: '5. Email de Pagamento Aprovado',
      template: paymentApprovedEmail(mockUser.name, mockPayment, mockSubscription),
      emoji: '💳'
    },
    {
      name: '6. Email de Confirmação de Senha Alterada',
      template: passwordResetConfirmationEmail(mockUser.name),
      emoji: '✅'
    }
  ];

  let successCount = 0;
  let failCount = 0;

  for (const test of tests) {
    try {
      const result = await sendEmail({
        to: TEST_EMAIL,
        subject: test.template.subject,
        html: test.template.html,
        text: test.template.text
      });

      if (result.success) {
        console.log(`${test.emoji} ${test.name}`);
        console.log(`   ✅ Enviado com sucesso!`);
        console.log(`   📧 Assunto: ${test.template.subject}`);
        console.log(`   🆔 Message ID: ${result.messageId}\n`);
        successCount++;
      } else {
        console.log(`${test.emoji} ${test.name}`);
        console.log(`   ❌ Falha ao enviar: ${result.error}\n`);
        failCount++;
      }

      // Aguardar 1 segundo entre emails para não sobrecarregar o servidor SMTP
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.log(`${test.emoji} ${test.name}`);
      console.log(`   ❌ Erro: ${error.message}\n`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DOS TESTES');
  console.log('='.repeat(60));
  console.log(`✅ Enviados com sucesso: ${successCount}`);
  console.log(`❌ Falhas: ${failCount}`);
  console.log(`📧 Total: ${tests.length}`);
  console.log('='.repeat(60));
  console.log('\n💡 Dica: Verifique sua caixa de entrada em:', TEST_EMAIL);
  console.log('💡 Verifique também a pasta de SPAM caso não encontre os emails!\n');

  process.exit(0);
}

// Executar testes
testAllEmails().catch(error => {
  console.error('\n❌ Erro fatal ao executar testes:', error);
  process.exit(1);
});
