import express from 'express';
import PlanController from '../controllers/plan.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Listar todos os planos
 *     description: Retorna a lista de todos os planos de assinatura disponíveis (Básico, Intermediário, Premium)
 *     tags: [Planos]
 *     responses:
 *       200:
 *         description: Lista de planos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 *             example:
 *               - id: "550e8400-e29b-41d4-a716-446655440000"
 *                 name: "Básico"
 *                 description: "Plano básico com R$200 em créditos"
 *                 price: 49.90
 *                 credit_amount: 200.00
 *                 created_at: "2024-12-15T10:00:00.000Z"
 *               - id: "550e8400-e29b-41d4-a716-446655440001"
 *                 name: "Intermediário"
 *                 description: "Plano intermediário com R$500 em créditos"
 *                 price: 89.90
 *                 credit_amount: 500.00
 *                 created_at: "2024-12-15T10:00:00.000Z"
 *               - id: "550e8400-e29b-41d4-a716-446655440002"
 *                 name: "Premium"
 *                 description: "Plano premium com R$1000 em créditos"
 *                 price: 149.90
 *                 credit_amount: 1000.00
 *                 created_at: "2024-12-15T10:00:00.000Z"
 */

/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Obter plano por ID
 *     description: Retorna os detalhes de um plano específico
 *     tags: [Planos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do plano
 *     responses:
 *       200:
 *         description: Detalhes do plano
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plano não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Rotas públicas
router.get('/', PlanController.getPlans);
router.get('/:id', PlanController.getPlanById);

export default router;
