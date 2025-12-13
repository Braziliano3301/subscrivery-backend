import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

// Validações para registro
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('name')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .trim(),
  body('phone')
    .optional()
    .isMobilePhone('pt-BR')
    .withMessage('Telefone inválido'),
  body('user_type')
    .isIn(['cliente', 'fornecedor'])
    .withMessage('Tipo de usuário deve ser "cliente" ou "fornecedor"')
];

// Validações para login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

// Validações para atualização de perfil
const updateProfileValidation = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Nome não pode ser vazio')
    .trim(),
  body('phone')
    .optional()
    .isMobilePhone('pt-BR')
    .withMessage('Telefone inválido')
];

// Rotas públicas
router.post('/register', registerValidation, validate, AuthController.register);
router.post('/login', loginValidation, validate, AuthController.login);

// Rotas protegidas (requerem autenticação)
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/profile', authMiddleware, updateProfileValidation, validate, AuthController.updateProfile);

export default router;
