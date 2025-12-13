import express from 'express';
import { body, query } from 'express-validator';
import SupplierController from '../controllers/supplier.controller.js';
import { authMiddleware, isSupplier } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Listar fornecedores
 *     description: Lista todos os fornecedores ativos com filtros opcionais
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filtrar por cidade
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 2
 *         description: Filtrar por estado (sigla - ex SP, RJ)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [supermercado, farmacia, petshop]
 *         description: Filtrar por categoria
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome da empresa
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número de resultados por página
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Pular N resultados (paginação)
 *     responses:
 *       200:
 *         description: Lista de fornecedores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suppliers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Supplier'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 */

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Obter fornecedor por ID
 *     description: Retorna os dados de um fornecedor específico
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Dados do fornecedor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Fornecedor não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/suppliers/me/profile:
 *   get:
 *     summary: Obter meu perfil de fornecedor
 *     description: Retorna o perfil do fornecedor autenticado
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do fornecedor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       401:
 *         description: Não autenticado ou não é fornecedor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Perfil de fornecedor não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Criar perfil de fornecedor
 *     description: Cria um novo perfil de fornecedor para o usuário autenticado (tipo fornecedor)
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - business_name
 *               - category
 *               - address
 *               - city
 *               - state
 *             properties:
 *               business_name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: Supermercado Bom Preço
 *               cnpj:
 *                 type: string
 *                 pattern: '^\d{14}$'
 *                 example: "12345678000195"
 *               category:
 *                 type: string
 *                 enum: [supermercado, farmacia, petshop]
 *                 example: supermercado
 *               address:
 *                 type: string
 *                 example: Rua das Flores, 123
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: São Paulo
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 example: SP
 *               zip_code:
 *                 type: string
 *                 pattern: '^\d{8}$'
 *                 example: "01310100"
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Dados inválidos ou fornecedor já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado ou não é fornecedor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Atualizar fornecedor
 *     description: Atualiza os dados do fornecedor (apenas o próprio dono pode atualizar)
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do fornecedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               business_name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               category:
 *                 type: string
 *                 enum: [supermercado, farmacia, petshop]
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *               zip_code:
 *                 type: string
 *                 pattern: '^\d{8}$'
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       401:
 *         description: Não autenticado ou não é o dono
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Fornecedor não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Deletar fornecedor
 *     description: Marca o fornecedor como inativo (soft delete - apenas o dono pode deletar)
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fornecedor deletado com sucesso
 *       401:
 *         description: Não autenticado ou não é o dono
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Fornecedor não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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
