import express from 'express';
import { body } from 'express-validator';
import SubscriptionController from '../controllers/subscription.controller.js';
import { authMiddleware, isClient } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Criar nova assinatura
 *     description: Cria uma assinatura para o cliente autenticado (não permite assinatura ativa duplicada)
 *     tags: [Assinaturas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan_id
 *             properties:
 *               plan_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID do plano escolhido (Básico, Intermediário ou Premium)
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       201:
 *         description: Assinatura criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscription:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Subscription'
 *                     - type: object
 *                       properties:
 *                         plan:
 *                           $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Cliente já possui assinatura ativa ou plano inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado ou não é cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/subscriptions/my:
 *   get:
 *     summary: Obter minha assinatura ativa
 *     description: Retorna a assinatura ativa do cliente autenticado com detalhes do plano
 *     tags: [Assinaturas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assinatura ativa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscription:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Subscription'
 *                     - type: object
 *                       properties:
 *                         plan_name:
 *                           type: string
 *                         plan_price:
 *                           type: number
 *                         plan_credit:
 *                           type: number
 *       404:
 *         description: Cliente não possui assinatura ativa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado ou não é cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/subscriptions/history:
 *   get:
 *     summary: Obter histórico de assinaturas
 *     description: Retorna todas as assinaturas do cliente (ativas, pausadas e canceladas)
 *     tags: [Assinaturas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Histórico de assinaturas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscriptions:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Subscription'
 *                       - type: object
 *                         properties:
 *                           plan_name:
 *                             type: string
 *                           plan_price:
 *                             type: number
 *       401:
 *         description: Não autenticado ou não é cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/subscriptions/{id}/pause:
 *   put:
 *     summary: Pausar assinatura
 *     description: Pausa uma assinatura ativa (status muda de "ativa" para "pausada")
 *     tags: [Assinaturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da assinatura
 *     responses:
 *       200:
 *         description: Assinatura pausada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Assinatura pausada com sucesso
 *                 subscription:
 *                   $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Assinatura não está ativa ou não pode ser pausada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado ou não é o dono da assinatura
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Assinatura não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/subscriptions/{id}/resume:
 *   put:
 *     summary: Reativar assinatura
 *     description: Reativa uma assinatura pausada (status muda de "pausada" para "ativa")
 *     tags: [Assinaturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da assinatura
 *     responses:
 *       200:
 *         description: Assinatura reativada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Assinatura reativada com sucesso
 *                 subscription:
 *                   $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Assinatura não está pausada ou não pode ser reativada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado ou não é o dono da assinatura
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Assinatura não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/subscriptions/{id}/cancel:
 *   put:
 *     summary: Cancelar assinatura
 *     description: Cancela uma assinatura permanentemente (status muda para "cancelada" - não pode ser revertido)
 *     tags: [Assinaturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da assinatura
 *     responses:
 *       200:
 *         description: Assinatura cancelada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Assinatura cancelada com sucesso
 *                 subscription:
 *                   $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Assinatura já está cancelada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado ou não é o dono da assinatura
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Assinatura não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Validações
const createSubscriptionValidation = [
  body('plan_id')
    .notEmpty()
    .withMessage('ID do plano é obrigatório')
    .isUUID()
    .withMessage('ID do plano inválido')
];

// Todas as rotas requerem autenticação de cliente
router.post(
  '/',
  authMiddleware,
  isClient,
  createSubscriptionValidation,
  validate,
  SubscriptionController.createSubscription
);

router.get(
  '/my',
  authMiddleware,
  isClient,
  SubscriptionController.getMySubscription
);

router.get(
  '/history',
  authMiddleware,
  isClient,
  SubscriptionController.getSubscriptionHistory
);

router.put(
  '/:id/pause',
  authMiddleware,
  isClient,
  SubscriptionController.pauseSubscription
);

router.put(
  '/:id/resume',
  authMiddleware,
  isClient,
  SubscriptionController.resumeSubscription
);

router.put(
  '/:id/cancel',
  authMiddleware,
  isClient,
  SubscriptionController.cancelSubscription
);

export default router;
