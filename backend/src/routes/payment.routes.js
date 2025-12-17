import express from 'express';
import { body, query } from 'express-validator';
import PaymentController from '../controllers/payment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

// Validações
const createPaymentValidation = [
  body('subscription_id').isUUID().withMessage('subscription_id deve ser um UUID válido'),
  body('amount').isFloat({ min: 0.01 }).withMessage('amount deve ser maior que zero'),
  body('payment_method').isIn(['pix', 'cartao_credito', 'cartao_debito', 'boleto', 'transferencia'])
    .withMessage('payment_method inválido'),
  body('transaction_id').optional().isString().withMessage('transaction_id deve ser uma string'),
  validate
];

const updateStatusValidation = [
  body('status').isIn(['pendente', 'aprovado', 'recusado'])
    .withMessage('status deve ser pendente, aprovado ou recusado'),
  body('transaction_id').optional().isString().withMessage('transaction_id deve ser uma string'),
  validate
];

const listPaymentsValidation = [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit deve ser entre 1 e 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('offset deve ser maior ou igual a 0'),
  validate
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         subscription_id:
 *           type: string
 *           format: uuid
 *         amount:
 *           type: number
 *           format: float
 *         payment_method:
 *           type: string
 *           enum: [pix, cartao_credito, cartao_debito, boleto, transferencia]
 *         payment_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [pendente, aprovado, recusado]
 *         transaction_id:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Criar novo pagamento
 *     description: Cria um pagamento para uma assinatura do usuário
 *     tags: [Pagamentos]
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
 *                 description: Valor do pagamento
 *                 example: 200.00
 *               payment_method:
 *                 type: string
 *                 enum: [pix, cartao_credito, cartao_debito, boleto, transferencia]
 *                 description: Método de pagamento
 *               transaction_id:
 *                 type: string
 *                 description: ID da transação (opcional)
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
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
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Assinatura não pertence ao usuário
 *       404:
 *         description: Assinatura não encontrada
 */
router.post('/', authMiddleware, createPaymentValidation, PaymentController.createPayment);

/**
 * @swagger
 * /api/payments/my:
 *   get:
 *     summary: Listar meus pagamentos
 *     description: Lista todos os pagamentos do usuário autenticado
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Número de registros por página
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Número de registros para pular
 *     responses:
 *       200:
 *         description: Lista de pagamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get('/my', authMiddleware, listPaymentsValidation, PaymentController.getMyPayments);

/**
 * @swagger
 * /api/payments/stats:
 *   get:
 *     summary: Estatísticas de pagamentos
 *     description: Retorna estatísticas dos pagamentos do usuário
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas de pagamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_payments:
 *                       type: integer
 *                     total_paid:
 *                       type: number
 *                     total_pending:
 *                       type: number
 *                     avg_payment:
 *                       type: number
 */
router.get('/stats', authMiddleware, PaymentController.getPaymentStats);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Buscar pagamento por ID
 *     description: Retorna os detalhes de um pagamento específico
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do pagamento
 *     responses:
 *       200:
 *         description: Detalhes do pagamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       403:
 *         description: Pagamento não pertence ao usuário
 *       404:
 *         description: Pagamento não encontrado
 */
router.get('/:id', authMiddleware, PaymentController.getPaymentById);

/**
 * @swagger
 * /api/payments/{id}/status:
 *   put:
 *     summary: Atualizar status do pagamento
 *     description: Atualiza o status de um pagamento (para testes manuais)
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do pagamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendente, aprovado, recusado]
 *                 description: Novo status do pagamento
 *               transaction_id:
 *                 type: string
 *                 description: ID da transação (opcional)
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
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
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Status inválido
 *       403:
 *         description: Pagamento não pertence ao usuário
 *       404:
 *         description: Pagamento não encontrado
 */
router.put('/:id/status', authMiddleware, updateStatusValidation, PaymentController.updatePaymentStatus);

export default router;
