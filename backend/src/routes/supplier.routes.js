import express from 'express';
import { body, query } from 'express-validator';
import SupplierController from '../controllers/supplier.controller.js';
import { authMiddleware, isSupplier } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

// Validações
const createSupplierValidation = [
  body('business_name')
    .notEmpty()
    .withMessage('Nome da empresa é obrigatório')
    .isLength({ min: 3, max: 255 })
    .withMessage('Nome deve ter entre 3 e 255 caracteres'),
  
  body('cnpj')
    .optional()
    .matches(/^\d{14}$/)
    .withMessage('CNPJ deve conter 14 dígitos'),
  
  body('category')
    .notEmpty()
    .withMessage('Categoria é obrigatória')
    .isIn(['supermercado', 'farmacia', 'petshop'])
    .withMessage('Categoria inválida (supermercado, farmacia ou petshop)'),
  
  body('address')
    .notEmpty()
    .withMessage('Endereço é obrigatório'),
  
  body('city')
    .notEmpty()
    .withMessage('Cidade é obrigatória')
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres'),
  
  body('state')
    .notEmpty()
    .withMessage('Estado é obrigatório')
    .isLength({ min: 2, max: 2 })
    .withMessage('Use a sigla do estado (ex: SP, RJ, MG)')
    .isUppercase()
    .withMessage('Estado deve estar em maiúsculas'),
  
  body('zip_code')
    .optional()
    .matches(/^\d{8}$/)
    .withMessage('CEP deve conter 8 dígitos')
];

const updateSupplierValidation = [
  body('business_name')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Nome deve ter entre 3 e 255 caracteres'),
  
  body('category')
    .optional()
    .isIn(['supermercado', 'farmacia', 'petshop'])
    .withMessage('Categoria inválida (supermercado, farmacia ou petshop)'),
  
  body('address')
    .optional()
    .notEmpty()
    .withMessage('Endereço não pode ser vazio'),
  
  body('city')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres'),
  
  body('state')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('Use a sigla do estado (ex: SP, RJ, MG)')
    .isUppercase()
    .withMessage('Estado deve estar em maiúsculas'),
  
  body('zip_code')
    .optional()
    .matches(/^\d{8}$/)
    .withMessage('CEP deve conter 8 dígitos')
];

const listSuppliersValidation = [
  query('city')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade inválida'),
  
  query('state')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado inválido'),
  
  query('category')
    .optional()
    .isIn(['supermercado', 'farmacia', 'petshop'])
    .withMessage('Categoria inválida (supermercado, farmacia ou petshop)'),
  
  query('search')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Busca deve ter entre 2 e 100 caracteres'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser entre 1 e 100'),
  
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset deve ser maior ou igual a 0')
];

// Rotas públicas
router.get(
  '/',
  listSuppliersValidation,
  validate,
  SupplierController.getSuppliers
);

// Rotas protegidas (requer autenticação) - DEVEM VIR ANTES DE /:id
router.get(
  '/me/profile',
  authMiddleware,
  isSupplier,
  SupplierController.getMySupplierProfile
);

router.post(
  '/',
  authMiddleware,
  isSupplier,
  createSupplierValidation,
  validate,
  SupplierController.createSupplier
);

router.put(
  '/:id',
  authMiddleware,
  isSupplier,
  updateSupplierValidation,
  validate,
  SupplierController.updateSupplier
);

router.delete(
  '/:id',
  authMiddleware,
  isSupplier,
  SupplierController.deleteSupplier
);

// Rota pública com parâmetro (deve vir por último)
router.get(
  '/:id',
  SupplierController.getSupplierById
);

export default router;
