import UserModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../config/email.js';
import { welcomeEmail } from '../templates/emailTemplates.js';

class AuthController {
  // Registrar novo usuário
  static async register(req, res) {
    try {
      const { email, password, name, phone, user_type } = req.body;

      // Verificar se usuário já existe
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Validar tipo de usuário
      if (!['cliente', 'fornecedor'].includes(user_type)) {
        return res.status(400).json({ error: 'Tipo de usuário inválido' });
      }

      // Criar usuário
      const user = await UserModel.create({ 
        email, 
        password, 
        name, 
        phone, 
        user_type 
      });

      // Gerar token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          userType: user.user_type 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Enviar email de boas-vindas (não bloquear registro se falhar)
      const emailContent = welcomeEmail(user.name);
      sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      }).catch(err => console.error('Erro ao enviar email de boas-vindas:', err));

      res.status(201).json({
        message: 'Usuário cadastrado com sucesso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type
        },
        token
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
  }

  // Login de usuário
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuário
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      // Verificar senha
      const isValidPassword = await UserModel.comparePassword(
        password, 
        user.password_hash
      );
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          userType: user.user_type 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type
        },
        token
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  // Obter perfil do usuário logado
  static async getProfile(req, res) {
    try {
      const user = await UserModel.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({ user });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
  }

  // Atualizar perfil
  static async updateProfile(req, res) {
    try {
      const { name, phone } = req.body;
      const userId = req.user.userId;

      const updatedUser = await UserModel.update(userId, { name, phone });

      res.json({
        message: 'Perfil atualizado com sucesso',
        user: updatedUser
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }
}

export default AuthController;
