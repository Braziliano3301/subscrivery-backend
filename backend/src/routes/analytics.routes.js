import express from 'express';
import {
  getOrdersByPeriod,
  getTopProducts,
  getCustomersByRegion,
  getSuppliersPricing,
  getProductMargins,
  getDashboardSummary
} from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas as rotas de analytics requerem autenticação
router.use(authMiddleware);

// Resumo geral do dashboard
router.get('/summary', getDashboardSummary);

// Pedidos por período
router.get('/orders-by-period', getOrdersByPeriod);

// Produtos mais pedidos
router.get('/top-products', getTopProducts);

// Clientes por região
router.get('/customers-by-region', getCustomersByRegion);

// Fornecedores com melhores preços
router.get('/suppliers-pricing', getSuppliersPricing);

// Margens de lucro por produto
router.get('/product-margins', getProductMargins);

export default router;
