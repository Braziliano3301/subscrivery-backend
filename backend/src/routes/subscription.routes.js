import express from 'express';
import { body } from 'express-validator';
import SubscriptionController from '../controllers/subscription.controller.js';
import { authMiddleware, isClient } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

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
