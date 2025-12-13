import express from 'express';
import PlanController from '../controllers/plan.controller.js';

const router = express.Router();

// Rotas públicas
router.get('/', PlanController.getPlans);
router.get('/:id', PlanController.getPlanById);

export default router;
