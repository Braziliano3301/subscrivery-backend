import express from 'express';
import asaasClient from '../config/asaas.js';

const router = express.Router();

/**
 * GET /api/customers
 * Lista todos os clientes
 */
router.get('/customers', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const customers = await asaasClient.listCustomers({
      limit,
      offset,
    });

    res.json({
      success: true,
      customers,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      details: error.asaasError,
    });
  }
});

/**
 * POST /api/customers
 * Cria um novo cliente no Asaas Sandbox
 */
router.post('/customers', async (req, res) => {
  try {
    const { name, email, document, mobilePhone } = req.body;

    if (!name || !email || !document) {
      return res.status(400).json({
        error: 'Nome, email e documento são obrigatórios',
      });
    }

    const customer = await asaasClient.createCustomer({
      name,
      email,
      document,
      mobilePhone,
    });

    res.status(201).json({
      success: true,
      customer,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      details: error.asaasError,
    });
  }
});

/**
 * POST /api/payments
 * Cria uma cobrança no Asaas Sandbox
 */
router.post('/payments', async (req, res) => {
  try {
    const { customerId, value, description, dueDate, billingType } = req.body;

    if (!customerId || !value || !dueDate) {
      return res.status(400).json({
        error: 'customerId, value e dueDate são obrigatórios',
      });
    }

    const payment = await asaasClient.createPayment({
      customerId,
      value,
      description: description || 'Pagamento Subscrivery',
      dueDate,
      billingType: billingType || 'CREDIT_CARD',
    });

    res.status(201).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      details: error.asaasError,
    });
  }
});

/**
 * GET /api/payments/:id
 * Busca uma cobrança pelo ID
 */
router.get('/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await asaasClient.getPayment(id);

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      details: error.asaasError,
    });
  }
});

/**
 * GET /api/payments
 * Lista cobranças com filtros
 */
router.get('/payments', async (req, res) => {
  try {
    const { status, customer, limit = 10, offset = 0 } = req.query;

    const filters = {
      limit,
      offset,
    };

    if (status) filters.status = status;
    if (customer) filters.customer = customer;

    const payments = await asaasClient.listPayments(filters);

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      details: error.asaasError,
    });
  }
});

/**
 * POST /api/subscriptions
 * Cria uma assinatura no Asaas Sandbox
 */
router.post('/subscriptions', async (req, res) => {
  try {
    const {
      customerId,
      value,
      nextDueDate,
      description,
      cycle,
      billingType,
    } = req.body;

    if (!customerId || !value || !nextDueDate) {
      return res.status(400).json({
        error: 'customerId, value e nextDueDate são obrigatórios',
      });
    }

    const subscription = await asaasClient.createSubscription({
      customerId,
      value,
      nextDueDate,
      description: description || 'Assinatura Subscrivery',
      cycle: cycle || 'MONTHLY',
      billingType: billingType || 'CREDIT_CARD',
    });

    res.status(201).json({
      success: true,
      subscription,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      details: error.asaasError,
    });
  }
});

/**
 * GET /api/subscriptions/:id
 * Busca uma assinatura pelo ID
 */
router.get('/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await asaasClient.getSubscription(id);

    res.json({
      success: true,
      subscription,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      details: error.asaasError,
    });
  }
});

/**
 * DELETE /api/subscriptions/:id
 * Cancela uma assinatura
 */
router.delete('/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await asaasClient.cancelSubscription(id);

    res.json({
      success: true,
      message: 'Assinatura cancelada com sucesso',
      result,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      details: error.asaasError,
    });
  }
});

export default router;
