import asaasService from '../services/asaas.service.js';
import PaymentModel from '../models/payment.model.js';
import SubscriptionModel from '../models/subscription.model.js';
import AsaasWebhookHandler from '../services/asaasWebhook.handler.js';
import pool from '../config/database.js';

/**
 * Controller para integração com Asaas
 */
class AsaasPaymentController {
  /**
   * Criar cobrança única via Asaas
   * POST /api/payments/asaas/charge
   */
  static async createAsaasCharge(req, res) {
    try {
      const { subscription_id, amount, payment_method, dueDate } = req.body;
      const userId = req.user.userId;

      // Validar assinatura
      const subscription = await SubscriptionModel.findById(subscription_id);
      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Assinatura não encontrada'
        });
      }

      // Verificar permissão
      if (subscription.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para criar cobranças para esta assinatura'
        });
      }

      // Buscar dados do cliente para criar no Asaas
      const userQuery = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );

      if (userQuery.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const user = userQuery.rows[0];

      // Criar ou buscar cliente no Asaas
      let asaasCustomer;
      
      // Verificar se usuário já tem ID Asaas
      if (user.asaas_customer_id) {
        asaasCustomer = { id: user.asaas_customer_id };
      } else {
        // Criar novo cliente
        asaasCustomer = await asaasService.createCustomer({
          name: user.name,
          email: user.email,
          cpfCnpj: user.cpf ? asaasService.constructor.formatDocument(user.cpf) : null,
          phone: user.phone,
          mobilePhone: user.mobile_phone,
          addressStreet: user.address_street,
          addressNumber: user.address_number,
          addressComplement: user.address_complement,
          addressCity: user.address_city,
          addressState: user.address_state,
          addressPostalCode: user.address_postal_code,
          externalReference: userId
        });

        // Atualizar usuário com ID Asaas
        await pool.query(
          'UPDATE users SET asaas_customer_id = $1 WHERE id = $2',
          [asaasCustomer.id, userId]
        );
      }

      // Mapear método de pagamento
      const paymentMethodMap = {
        pix: 'PIX',
        cartao_credito: 'CREDIT_CARD',
        cartao_debito: 'DEBIT_CARD',
        boleto: 'BOLETO',
        transferencia: 'BANK_TRANSFER'
      };

      const asaasPaymentMethod = paymentMethodMap[payment_method] || 'PIX';

      // Criar cobrança no Asaas
      const asaasCharge = await asaasService.createCharge({
        customerId: asaasCustomer.id,
        billingType: asaasPaymentMethod,
        value: amount,
        dueDate: dueDate || asaasService.constructor.generateDueDate(3),
        description: `Assinatura Subscrivery - ${subscription.plan_id}`,
        externalReference: subscription_id,
        remoteIp: req.ip
      });

      // Criar registro de pagamento no banco local
      const payment = await pool.query(
        `INSERT INTO payments (subscription_id, amount, payment_method, status, asaas_id, asaas_status, transaction_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [subscription_id, amount, payment_method, 'pendente', asaasCharge.id, asaasCharge.status, asaasCharge.id]
      );

      return res.status(201).json({
        success: true,
        message: 'Cobrança criada com sucesso',
        data: {
          paymentId: payment.rows[0].id,
          asaasId: asaasCharge.id,
          amount: asaasCharge.value,
          status: asaasCharge.status,
          dueDate: asaasCharge.dueDate,
          billingType: asaasCharge.billingType,
          url: asaasCharge.url // URL de pagamento (se disponível)
        }
      });
    } catch (error) {
      console.error('Erro ao criar cobrança Asaas:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar cobrança',
        error: error.message
      });
    }
  }

  /**
   * Criar assinatura recorrente via Asaas
   * POST /api/payments/asaas/subscription
   */
  static async createAsaasSubscription(req, res) {
    try {
      const { subscription_id, cycle } = req.body;
      const userId = req.user.userId;

      // Validar assinatura local
      const subscription = await SubscriptionModel.findById(subscription_id);
      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Assinatura não encontrada'
        });
      }

      // Verificar permissão
      if (subscription.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para criar assinatura'
        });
      }

      // Buscar plano
      const planQuery = await pool.query(
        'SELECT * FROM subscription_plans WHERE id = $1',
        [subscription.plan_id]
      );

      if (planQuery.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Plano não encontrado'
        });
      }

      const plan = planQuery.rows[0];

      // Buscar dados do usuário
      const userQuery = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );

      const user = userQuery.rows[0];

      // Criar ou buscar cliente no Asaas
      let asaasCustomer;
      if (user.asaas_customer_id) {
        asaasCustomer = { id: user.asaas_customer_id };
      } else {
        asaasCustomer = await asaasService.createCustomer({
          name: user.name,
          email: user.email,
          cpfCnpj: user.cpf ? asaasService.constructor.formatDocument(user.cpf) : null,
          externalReference: userId
        });

        await pool.query(
          'UPDATE users SET asaas_customer_id = $1 WHERE id = $2',
          [asaasCustomer.id, userId]
        );
      }

      // Mapear ciclo
      const cycleMap = {
        mensal: 'MONTHLY',
        trimestral: 'QUARTERLY',
        semestral: 'SEMI_ANNUAL',
        anual: 'ANNUAL'
      };

      const asaasCycle = cycleMap[cycle] || 'MONTHLY';

      // Criar assinatura no Asaas
      const asaasSubscription = await asaasService.createSubscription({
        customerId: asaasCustomer.id,
        billingType: 'PIX',
        value: plan.price,
        cycle: asaasCycle,
        description: `${plan.name} - Subscrivery`,
        nextDueDate: subscription.start_date,
        externalReference: subscription_id,
        remoteIp: req.ip
      });

      // Atualizar assinatura local com ID Asaas
      await pool.query(
        'UPDATE subscriptions SET asaas_id = $1, asaas_status = $2 WHERE id = $3',
        [asaasSubscription.id, asaasSubscription.status, subscription_id]
      );

      return res.status(201).json({
        success: true,
        message: 'Assinatura recorrente criada com sucesso',
        data: {
          subscriptionId: subscription_id,
          asaasId: asaasSubscription.id,
          planName: plan.name,
          value: asaasSubscription.value,
          cycle: asaasSubscription.cycle,
          status: asaasSubscription.status,
          nextDueDate: asaasSubscription.nextDueDate
        }
      });
    } catch (error) {
      console.error('Erro ao criar assinatura Asaas:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar assinatura',
        error: error.message
      });
    }
  }

  /**
   * Processar webhook do Asaas
   * POST /api/webhooks/asaas
   */
  static async handleAsaasWebhook(req, res) {
    try {
      // Validar token de segurança
      const token = req.headers['x-webhook-token'] || req.query.token;
      if (!AsaasWebhookHandler.validateWebhookToken(token)) {
        return res.status(401).json({
          success: false,
          message: 'Token de webhook inválido'
        });
      }

      const { event, payment, subscription } = req.body;

      if (!event) {
        return res.status(400).json({
          success: false,
          message: 'Evento não especificado'
        });
      }

      let result;

      // Rotear para o handler apropriado
      if (event.startsWith('PAYMENT_')) {
        result = await AsaasWebhookHandler.handlePaymentWebhook(req.body);
      } else if (event.startsWith('SUBSCRIPTION_')) {
        result = await AsaasWebhookHandler.handleSubscriptionWebhook(req.body);
      } else {
        console.warn(`⚠️ Evento desconhecido: ${event}`);
        result = { success: true, message: 'Evento não processado' };
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao processar webhook',
        error: error.message
      });
    }
  }

  /**
   * Consultar status de cobrança
   * GET /api/payments/asaas/:asaasId
   */
  static async getAsaasChargeStatus(req, res) {
    try {
      const { asaasId } = req.params;
      const userId = req.user.userId;

      // Verificar se usuário tem acesso a este pagamento
      const paymentQuery = await pool.query(
        `SELECT p.* FROM payments p
         JOIN subscriptions s ON p.subscription_id = s.id
         WHERE p.asaas_id = $1 AND s.user_id = $2`,
        [asaasId, userId]
      );

      if (paymentQuery.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Pagamento não encontrado ou acesso negado'
        });
      }

      // Consultar status no Asaas
      const asaasCharge = await asaasService.getCharge(asaasId);

      return res.status(200).json({
        success: true,
        data: {
          asaasId: asaasCharge.id,
          status: asaasCharge.status,
          value: asaasCharge.value,
          dueDate: asaasCharge.dueDate,
          billingType: asaasCharge.billingType,
          url: asaasCharge.url
        }
      });
    } catch (error) {
      console.error('Erro ao consultar cobrança:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao consultar cobrança',
        error: error.message
      });
    }
  }

  /**
   * Reembolsar pagamento
   * POST /api/payments/asaas/:asaasId/refund
   */
  static async refundAsaasCharge(req, res) {
    try {
      const { asaasId } = req.params;
      const { amount } = req.body;
      const userId = req.user.userId;

      // Verificar permissão
      const paymentQuery = await pool.query(
        `SELECT p.* FROM payments p
         JOIN subscriptions s ON p.subscription_id = s.id
         WHERE p.asaas_id = $1 AND s.user_id = $2`,
        [asaasId, userId]
      );

      if (paymentQuery.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Pagamento não encontrado ou acesso negado'
        });
      }

      // Reembolsar no Asaas
      const refund = await asaasService.refundCharge(asaasId, { amount });

      // Atualizar status local
      await pool.query(
        'UPDATE payments SET status = $1 WHERE asaas_id = $2',
        ['reembolsado', asaasId]
      );

      return res.status(200).json({
        success: true,
        message: 'Reembolso processado com sucesso',
        data: {
          refundId: refund.id,
          amount: refund.amount,
          status: refund.status
        }
      });
    } catch (error) {
      console.error('Erro ao reembolsar:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao processar reembolso',
        error: error.message
      });
    }
  }
}

export default AsaasPaymentController;
