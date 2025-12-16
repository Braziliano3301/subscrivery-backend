/**
 * Exemplo de integração do banco de dados com as rotas Express
 * Este arquivo mostra como usar os models com as rotas da API
 */

import express from 'express';
import Customer from '../models/Customer.js';
import Payment from '../models/Payment.js';
import Subscription from '../models/Subscription.js';
import AsaasClient from '../config/asaas.js';

const router = express.Router();
const asaas = new AsaasClient();

// ==================== CUSTOMERS ====================

/**
 * GET /api/customers
 * Lista clientes do banco local
 */
router.get('/customers', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const customers = await Customer.findAll(limit, offset);

    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/customers/:id/summary
 * Resume com pagamentos de um cliente
 */
router.get('/customers/:id/summary', async (req, res) => {
  try {
    const customer = await Customer.findWithPaymentSummary(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Erro ao buscar resumo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/customers/sync
 * Sincroniza clientes do Asaas para o banco local
 */
router.post('/customers/sync', async (req, res) => {
  try {
    // Buscar clientes no Asaas
    const asaasCustomers = await asaas.listCustomers({
      limit: 100
    });

    let created = 0;
    let updated = 0;
    let errors = [];

    // Sincronizar cada cliente
    for (const asaasCustomer of asaasCustomers.data) {
      try {
        const existing = await Customer.findByAsaasId(asaasCustomer.id);

        if (existing) {
          // Atualizar cliente existente
          await Customer.update(existing.id, {
            name: asaasCustomer.name,
            email: asaasCustomer.email,
            mobile_phone: asaasCustomer.mobilePhone,
            asaas_updated_at: new Date(asaasCustomer.updated)
          });
          updated++;
        } else {
          // Criar novo cliente
          await Customer.create({
            asaas_id: asaasCustomer.id,
            name: asaasCustomer.name,
            email: asaasCustomer.email,
            document: asaasCustomer.document,
            mobile_phone: asaasCustomer.mobilePhone,
            address_street: asaasCustomer.addressStreet,
            address_number: asaasCustomer.addressNumber,
            address_complement: asaasCustomer.addressComplement,
            address_neighborhood: asaasCustomer.addressNeighborhood,
            address_city: asaasCustomer.addressCity,
            address_state: asaasCustomer.addressState,
            address_postal_code: asaasCustomer.postalCode,
            company_name: asaasCustomer.companyName,
            cpf_cnpj: asaasCustomer.cpfCnpj,
            asaas_created_at: new Date(asaasCustomer.created),
            asaas_updated_at: new Date(asaasCustomer.updated)
          });
          created++;
        }
      } catch (error) {
        errors.push({
          asaasId: asaasCustomer.id,
          name: asaasCustomer.name,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Sincronização de clientes concluída',
      stats: {
        created,
        updated,
        errors: errors.length
      },
      errors: errors.length > 0 ? errors : null
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== PAYMENTS ====================

/**
 * GET /api/payments
 * Lista pagamentos do banco local
 */
router.get('/payments', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const status = req.query.status;

    let payments;
    if (status) {
      payments = await Payment.findByStatus(status, limit, offset);
    } else {
      payments = await Payment.findAll(limit, offset);
    }

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/customers/:customerId/payments
 * Pagamentos de um cliente específico
 */
router.get('/customers/:customerId/payments', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const payments = await Payment.findByCustomerId(
      req.params.customerId,
      limit,
      offset
    );

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/payments/pending
 * Pagamentos pendentes/atrasados
 */
router.get('/payments/pending', async (req, res) => {
  try {
    const pending = await Payment.findPending();

    res.json({
      success: true,
      count: pending.length,
      data: pending
    });
  } catch (error) {
    console.error('Erro ao listar pagamentos pendentes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/payments/summary
 * Resumo de pagamentos por status
 */
router.get('/payments/summary', async (req, res) => {
  try {
    const summary = await Payment.getSummaryByStatus();

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Erro ao buscar resumo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/payments/sync
 * Sincroniza pagamentos do Asaas para o banco local
 */
router.post('/payments/sync', async (req, res) => {
  try {
    const asaasPayments = await asaas.listPayments({
      limit: 100
    });

    let created = 0;
    let updated = 0;
    let errors = [];

    for (const asaasPayment of asaasPayments.data) {
      try {
        const existing = await Payment.findByAsaasId(asaasPayment.id);

        // Buscar cliente local
        const customer = await Customer.findByAsaasId(asaasPayment.customer);

        if (!customer) {
          errors.push({
            asaasId: asaasPayment.id,
            error: 'Cliente não encontrado no banco local'
          });
          continue;
        }

        if (existing) {
          // Atualizar pagamento
          await Payment.update(existing.id, {
            status: asaasPayment.status,
            payment_date: asaasPayment.paymentDate
              ? new Date(asaasPayment.paymentDate)
              : null,
            value: asaasPayment.value,
            asaas_updated_at: new Date(asaasPayment.updated)
          });
          updated++;
        } else {
          // Criar novo pagamento
          await Payment.create({
            asaas_id: asaasPayment.id,
            customer_id: customer.id,
            asaas_customer_id: asaasPayment.customer,
            value: asaasPayment.value,
            due_date: new Date(asaasPayment.dueDate),
            payment_date: asaasPayment.paymentDate
              ? new Date(asaasPayment.paymentDate)
              : null,
            description: asaasPayment.description,
            billing_type: asaasPayment.billingType,
            status: asaasPayment.status,
            boleto_barcode: asaasPayment.barcode,
            asaas_created_at: new Date(asaasPayment.created),
            asaas_updated_at: new Date(asaasPayment.updated)
          });
          created++;
        }
      } catch (error) {
        errors.push({
          asaasId: asaasPayment.id,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Sincronização de pagamentos concluída',
      stats: {
        created,
        updated,
        errors: errors.length
      },
      errors: errors.length > 0 ? errors : null
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== SUBSCRIPTIONS ====================

/**
 * GET /api/subscriptions/active
 * Lista assinaturas ativas
 */
router.get('/subscriptions/active', async (req, res) => {
  try {
    const active = await Subscription.findActive();

    res.json({
      success: true,
      count: active.length,
      data: active
    });
  } catch (error) {
    console.error('Erro ao listar assinaturas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/subscriptions/due-today
 * Assinaturas vencendo hoje
 */
router.get('/subscriptions/due-today', async (req, res) => {
  try {
    const due = await Subscription.findDuToday();

    res.json({
      success: true,
      count: due.length,
      data: due
    });
  } catch (error) {
    console.error('Erro ao listar assinaturas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/subscriptions/summary
 * Resumo de assinaturas por ciclo
 */
router.get('/subscriptions/summary', async (req, res) => {
  try {
    const summary = await Subscription.getSummaryByCycle();

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Erro ao buscar resumo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== DASHBOARD ====================

/**
 * GET /api/dashboard/overview
 * Overview geral do negócio
 */
router.get('/dashboard/overview', async (req, res) => {
  try {
    // Clientes
    const customers = await Customer.findAll(1);
    const totalCustomers = customers.length;

    // Pagamentos
    const paymentSummary = await Payment.getSummaryByStatus();

    // Assinaturas
    const subscriptions = await Subscription.findActive();
    const totalActiveSubscriptions = subscriptions.length;

    // Próximos vencimentos
    const dueToday = await Subscription.findDuToday();

    res.json({
      success: true,
      data: {
        totalCustomers,
        payments: {
          summary: paymentSummary,
          pending: paymentSummary.find(p => p.status === 'PENDING')?.total_value || 0,
          received: paymentSummary.find(p => p.status === 'RECEIVED')?.total_value || 0,
          overdue: paymentSummary.find(p => p.status === 'OVERDUE')?.total_value || 0
        },
        subscriptions: {
          active: totalActiveSubscriptions,
          dueToday: dueToday.length
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
