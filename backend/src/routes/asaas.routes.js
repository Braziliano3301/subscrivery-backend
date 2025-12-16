import express from 'express';
import { body, param } from 'express-validator';
import AsaasPaymentController from '../controllers/asaasPayment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

// Validações
const createAsaasChargeValidation = [
  body('subscription_id').isUUID().withMessage('subscription_id deve ser um UUID válido'),
  body('amount').isFloat({ min: 0.01 }).withMessage('amount deve ser maior que zero'),
  body('payment_method').isIn(['pix', 'cartao_credito', 'cartao_debito', 'boleto', 'transferencia'])
    .withMessage('payment_method inválido'),
  body('dueDate').optional().isISO8601().withMessage('dueDate deve estar em formato ISO 8601'),
  validate
];

const createAsaasSubscriptionValidation = [
  body('subscription_id').isUUID().withMessage('subscription_id deve ser um UUID válido'),
  body('cycle').isIn(['mensal', 'trimestral', 'semestral', 'anual'])
    .withMessage('cycle deve ser: mensal, trimestral, semestral ou anual'),
  validate
];

const asaasIdValidation = [
  param('asaasId').isString().withMessage('asaasId deve ser uma string'),
  validate
];

const refundValidation = [
  param('asaasId').isString().withMessage('asaasId deve ser uma string'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('amount deve ser maior que zero'),
  validate
];

/**
 * @swagger
 * /api/payments/asaas/charge:
 *   post:
 *     summary: Criar cobrança via Asaas
 *     description: Cria uma cobrança única integrada com Asaas
 *     tags: [Pagamentos Asaas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscription_id
 *               - amount
 *               - payment_method
 *             properties:
 *               subscription_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID da assinatura
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Valor da cobrança
 *                 example: 99.90
 *               payment_method:
 *                 type: string
 *                 enum: [pix, cartao_credito, cartao_debito, boleto, transferencia]
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Data de vencimento (YYYY-MM-DD). Se não informada, será 3 dias a partir de hoje
 *     responses:
 *       201:
 *         description: Cobrança criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentId:
 *                       type: string
 *                       format: uuid
 *                     asaasId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     status:
 *                       type: string
 *                     dueDate:
 *                       type: string
 *                     billingType:
 *                       type: string
 *                     url:
 *                       type: string
 *                       description: URL de pagamento (se disponível)
 */
router.post('/charge', authMiddleware, createAsaasChargeValidation, AsaasPaymentController.createAsaasCharge);

/**
 * @swagger
 * /api/payments/asaas/subscription:
 *   post:
 *     summary: Criar assinatura recorrente via Asaas
 *     description: Configura uma assinatura recorrente no Asaas
 *     tags: [Pagamentos Asaas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscription_id
 *               - cycle
 *             properties:
 *               subscription_id:
 *                 type: string
 *                 format: uuid
 *               cycle:
 *                 type: string
 *                 enum: [mensal, trimestral, semestral, anual]
 *     responses:
 *       201:
 *         description: Assinatura recorrente criada com sucesso
 */
router.post('/subscription', authMiddleware, createAsaasSubscriptionValidation, AsaasPaymentController.createAsaasSubscription);

/**
 * @swagger
 * /api/payments/asaas/{asaasId}:
 *   get:
 *     summary: Consultar status de cobrança
 *     description: Retorna o status atual de uma cobrança no Asaas
 *     tags: [Pagamentos Asaas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: asaasId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da cobrança no Asaas
 *     responses:
 *       200:
 *         description: Status da cobrança
 */
router.get('/:asaasId', authMiddleware, asaasIdValidation, AsaasPaymentController.getAsaasChargeStatus);

/**
 * @swagger
 * /api/payments/asaas/{asaasId}/refund:
 *   post:
 *     summary: Reembolsar pagamento
 *     description: Processa um reembolso total ou parcial de um pagamento
 *     tags: [Pagamentos Asaas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: asaasId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Valor a reembolsar. Se omitido, reembolsa o valor total
 *     responses:
 *       200:
 *         description: Reembolso processado com sucesso
 */
router.post('/:asaasId/refund', authMiddleware, refundValidation, AsaasPaymentController.refundAsaasCharge);

export default router;
