import express from 'express';
import { body, query } from 'express-validator';
import OrderController from '../controllers/order.controller.js';
import { authMiddleware, isClient, isSupplier } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Criar novo pedido
 *     description: Cria um pedido para o cliente autenticado (requer assinatura ativa e crédito suficiente)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplier_id
 *               - delivery_date
 *               - items
 *             properties:
 *               supplier_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID do fornecedor
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               delivery_date:
 *                 type: string
 *                 format: date
 *                 description: Data de entrega desejada
 *                 example: "2025-12-20"
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_name
 *                     - quantity
 *                     - unit_price
 *                   properties:
 *                     product_name:
 *                       type: string
 *                       example: Arroz 5kg
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *                     unit_price:
 *                       type: number
 *                       format: decimal
 *                       example: 25.50
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     subscription_id:
 *                       type: string
 *                       format: uuid
 *                     supplier_id:
 *                       type: string
 *                       format: uuid
 *                     delivery_date:
 *                       type: string
 *                       format: date
 *                     status:
 *                       type: string
 *                       enum: [pendente, confirmado, entregue, cancelado]
 *                     total_amount:
 *                       type: number
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                 remaining_credit:
 *                   type: number
 *       400:
 *         description: Crédito insuficiente ou assinatura inativa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado ou não é cliente
 *       404:
 *         description: Fornecedor não encontrado
 */

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Listar meus pedidos
 *     description: Retorna todos os pedidos do cliente autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Número de resultados por página
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pular N resultados
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       supplier_name:
 *                         type: string
 *                       order_date:
 *                         type: string
 *                       delivery_date:
 *                         type: string
 *                       status:
 *                         type: string
 *                       total_amount:
 *                         type: number
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Não autenticado ou não é cliente
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obter detalhes do pedido
 *     description: Retorna informações completas de um pedido incluindo itens (cliente dono ou fornecedor)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Detalhes do pedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     supplier_name:
 *                       type: string
 *                     order_date:
 *                       type: string
 *                     delivery_date:
 *                       type: string
 *                     status:
 *                       type: string
 *                     total_amount:
 *                       type: number
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_name:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           unit_price:
 *                             type: number
 *                           total_price:
 *                             type: number
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /api/orders/supplier/orders:
 *   get:
 *     summary: Listar pedidos do fornecedor
 *     description: Retorna todos os pedidos recebidos pelo fornecedor autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendente, confirmado, entregue, cancelado]
 *         description: Filtrar por status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Lista de pedidos do fornecedor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Não autenticado ou não é fornecedor
 *       404:
 *         description: Perfil de fornecedor não encontrado
 */

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Atualizar status do pedido
 *     description: Atualiza o status de um pedido (apenas fornecedor dono do pedido)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *                 enum: [pendente, confirmado, entregue, cancelado]
 *                 example: confirmado
 *     responses:
 *       200:
 *         description: Status atualizado
 *       400:
 *         description: Status inválido
 *       403:
 *         description: Apenas o fornecedor do pedido pode atualizar
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancelar pedido
 *     description: Cancela um pedido e devolve o crédito à assinatura (cliente ou fornecedor)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Pedido cancelado e crédito devolvido
 *       400:
 *         description: Pedido já cancelado ou já entregue
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 */

// Validações
const createOrderValidation = [
  body('supplier_id')
    .notEmpty()
    .withMessage('ID do fornecedor é obrigatório')
    .isUUID()
    .withMessage('ID do fornecedor inválido'),
  
  body('delivery_date')
    .notEmpty()
    .withMessage('Data de entrega é obrigatória')
    .isDate()
    .withMessage('Data de entrega inválida'),
  
  body('items')
    .isArray({ min: 1 })
    .withMessage('Pedido deve ter pelo menos 1 item'),
  
  body('items.*.product_name')
    .notEmpty()
    .withMessage('Nome do produto é obrigatório'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser maior que 0'),
  
  body('items.*.unit_price')
    .isFloat({ min: 0.01 })
    .withMessage('Preço unitário deve ser maior que 0')
];

const updateStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status é obrigatório')
    .isIn(['pendente', 'confirmado', 'entregue', 'cancelado'])
    .withMessage('Status inválido')
];

const listOrdersValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser entre 1 e 100'),
  
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset deve ser maior ou igual a 0'),
  
  query('status')
    .optional()
    .isIn(['pendente', 'confirmado', 'entregue', 'cancelado'])
    .withMessage('Status inválido')
];

// Rotas de clientes
router.post(
  '/',
  authMiddleware,
  isClient,
  createOrderValidation,
  validate,
  OrderController.createOrder
);

router.get(
  '/my',
  authMiddleware,
  isClient,
  listOrdersValidation,
  validate,
  OrderController.getMyOrders
);

router.get(
  '/:id',
  authMiddleware,
  OrderController.getOrderById
);

router.put(
  '/:id/cancel',
  authMiddleware,
  OrderController.cancelOrder
);

// Rotas de fornecedores
router.get(
  '/supplier/orders',
  authMiddleware,
  isSupplier,
  listOrdersValidation,
  validate,
  OrderController.getSupplierOrders
);

router.put(
  '/:id/status',
  authMiddleware,
  isSupplier,
  updateStatusValidation,
  validate,
  OrderController.updateOrderStatus
);

export default router;
