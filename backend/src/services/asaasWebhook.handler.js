import PaymentModel from '../models/payment.model.js';
import SubscriptionModel from '../models/subscription.model.js';
import { sendEmail } from '../config/email.js';
import { paymentApprovedEmail } from '../templates/emailTemplates.js';
import pool from '../config/database.js';
import ASAAS_CONFIG from '../config/asaas.js';

/**
 * Handler de webhooks do Asaas
 * Processa notificações de pagamentos e assinaturas
 */
class AsaasWebhookHandler {
  /**
   * Validar token do webhook
   * @param {String} token - Token enviado pelo Asaas
   * @returns {Boolean}
   */
  static validateWebhookToken(token) {
    return token === ASAAS_CONFIG.WEBHOOK_TOKEN;
  }

  /**
   * Processar webhook de cobrança
   * @param {Object} payload - Dados do webhook
   * @returns {Promise<Object>}
   */
  static async handlePaymentWebhook(payload) {
    try {
      const { id, event, payment } = payload;
      
      console.log(`📬 Webhook Asaas recebido: ${event} (${payment.id})`);

      // Buscar pagamento pelo asaas_id
      const result = await pool.query(
        'SELECT * FROM payments WHERE asaas_id = $1',
        [payment.id]
      );

      if (result.rows.length === 0) {
        console.warn(`⚠️ Pagamento Asaas não encontrado: ${payment.id}`);
        return { success: false, message: 'Pagamento não encontrado' };
      }

      const paymentRecord = result.rows[0];
      let newStatus = 'pendente';

      // Mapear status do Asaas para status local
      switch (event) {
        case 'PAYMENT_CONFIRMED':
        case 'PAYMENT_RECEIVED':
          newStatus = 'aprovado';
          break;
        case 'PAYMENT_OVERDUE':
        case 'PAYMENT_DELETED':
          newStatus = 'cancelado';
          break;
        case 'PAYMENT_REFUNDED':
          newStatus = 'reembolsado';
          break;
        case 'PAYMENT_RECEIVED_IN_CASH':
          newStatus = 'aprovado';
          break;
        default:
          newStatus = 'pendente';
      }

      // Atualizar status do pagamento
      const updatedPayment = await PaymentModel.updateStatus(
        paymentRecord.id,
        newStatus,
        payment.id
      );

      console.log(`✅ Pagamento atualizado: ${paymentRecord.id} → ${newStatus}`);

      // Se aprovado, enviar email de confirmação
      if (newStatus === 'aprovado') {
        await this.sendPaymentConfirmationEmail(paymentRecord.subscription_id, updatedPayment);
      }

      // Se cancelado ou reembolsado, enviar notificação
      if (newStatus === 'cancelado' || newStatus === 'reembolsado') {
        await this.sendPaymentCancellationEmail(paymentRecord.subscription_id, updatedPayment);
      }

      return {
        success: true,
        message: 'Webhook processado com sucesso',
        paymentId: paymentRecord.id,
        status: newStatus
      };
    } catch (error) {
      console.error('Erro ao processar webhook de pagamento:', error);
      throw error;
    }
  }

  /**
   * Processar webhook de assinatura
   * @param {Object} payload - Dados do webhook
   * @returns {Promise<Object>}
   */
  static async handleSubscriptionWebhook(payload) {
    try {
      const { id, event, subscription } = payload;

      console.log(`📬 Webhook Assinatura recebido: ${event} (${subscription.id})`);

      // Buscar assinatura pelo asaas_id
      const result = await pool.query(
        'SELECT * FROM subscriptions WHERE asaas_id = $1',
        [subscription.id]
      );

      if (result.rows.length === 0) {
        console.warn(`⚠️ Assinatura Asaas não encontrada: ${subscription.id}`);
        return { success: false, message: 'Assinatura não encontrada' };
      }

      const subscriptionRecord = result.rows[0];
      let newStatus = subscriptionRecord.status;

      // Mapear status do Asaas
      switch (event) {
        case 'SUBSCRIPTION_CREATED':
          newStatus = 'ativa';
          break;
        case 'SUBSCRIPTION_DELETED':
          newStatus = 'cancelada';
          break;
        case 'SUBSCRIPTION_UPDATED':
          newStatus = 'ativa';
          break;
        case 'SUBSCRIPTION_REMINDER':
          // Apenas uma notificação, não muda status
          console.log('⏰ Lembrete de assinatura próxima');
          break;
        case 'SUBSCRIPTION_CHARGE_CREATED':
          // Nova cobrança automática gerada
          console.log('🔄 Nova cobrança automática gerada');
          break;
      }

      // Atualizar status se necessário
      if (newStatus !== subscriptionRecord.status) {
        await pool.query(
          'UPDATE subscriptions SET status = $1, updated_at = NOW() WHERE id = $2',
          [newStatus, subscriptionRecord.id]
        );

        console.log(`✅ Assinatura atualizada: ${subscriptionRecord.id} → ${newStatus}`);
      }

      return {
        success: true,
        message: 'Webhook de assinatura processado com sucesso',
        subscriptionId: subscriptionRecord.id,
        status: newStatus
      };
    } catch (error) {
      console.error('Erro ao processar webhook de assinatura:', error);
      throw error;
    }
  }

  /**
   * Enviar email de confirmação de pagamento
   * @private
   */
  static async sendPaymentConfirmationEmail(subscriptionId, payment) {
    try {
      const subscriptionQuery = await pool.query(
        `SELECT s.*, u.name as user_name, u.email as user_email, sp.name as plan_name 
         FROM subscriptions s 
         JOIN users u ON s.user_id = u.id 
         JOIN subscription_plans sp ON s.plan_id = sp.id 
         WHERE s.id = $1`,
        [subscriptionId]
      );

      if (subscriptionQuery.rows.length === 0) {
        return;
      }

      const subscription = subscriptionQuery.rows[0];

      const emailContent = paymentApprovedEmail(
        subscription.user_name,
        payment,
        subscription
      );

      await sendEmail({
        to: subscription.user_email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      console.log(`📧 Email de confirmação enviado para: ${subscription.user_email}`);
    } catch (error) {
      console.error('Erro ao enviar email de confirmação:', error);
      // Não lança erro para não bloquear webhook
    }
  }

  /**
   * Enviar email de cancelamento/reembolso
   * @private
   */
  static async sendPaymentCancellationEmail(subscriptionId, payment) {
    try {
      const subscriptionQuery = await pool.query(
        `SELECT s.*, u.name as user_name, u.email as user_email 
         FROM subscriptions s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.id = $1`,
        [subscriptionId]
      );

      if (subscriptionQuery.rows.length === 0) {
        return;
      }

      const subscription = subscriptionQuery.rows[0];

      const emailContent = {
        subject: payment.status === 'reembolsado' 
          ? '💰 Seu pagamento foi reembolsado' 
          : '❌ Seu pagamento foi cancelado',
        html: `
          <h2>${payment.status === 'reembolsado' ? 'Reembolso Processado' : 'Pagamento Cancelado'}</h2>
          <p>Olá, ${subscription.user_name}!</p>
          <p>Informamos que seu pagamento foi ${payment.status === 'reembolsado' ? 'reembolsado' : 'cancelado'}.</p>
          <p><strong>Detalhes:</strong></p>
          <ul>
            <li>Valor: R$ ${payment.amount?.toFixed(2) || 'N/A'}</li>
            <li>ID da Transação: ${payment.transaction_id || 'N/A'}</li>
            <li>Data: ${new Date().toLocaleDateString('pt-BR')}</li>
          </ul>
          <p>Se tiver dúvidas, entre em contato conosco.</p>
        `,
        text: `Seu pagamento foi ${payment.status === 'reembolsado' ? 'reembolsado' : 'cancelado'}. Valor: R$ ${payment.amount?.toFixed(2) || 'N/A'}`
      };

      await sendEmail({
        to: subscription.user_email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      console.log(`📧 Email de cancelamento enviado para: ${subscription.user_email}`);
    } catch (error) {
      console.error('Erro ao enviar email de cancelamento:', error);
    }
  }
}

export default AsaasWebhookHandler;
