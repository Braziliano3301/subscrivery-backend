import pool from '../config/database.js';
import { sendEmail } from '../config/email.js';
import { forgotPasswordEmail, passwordResetConfirmationEmail } from '../templates/emailTemplates.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Solicitar recuperação de senha
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar se usuário existe
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      // Por segurança, não revelar se o email existe ou não
      return res.json({ 
        message: 'Se o email existir, você receberá instruções de recuperação.' 
      });
    }

    const user = userResult.rows[0];

    // Gerar token único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco
    const updateQuery = `
      UPDATE users 
      SET reset_password_token = $1, 
          reset_password_expires = $2,
          updated_at = NOW()
      WHERE id = $3
    `;
    await pool.query(updateQuery, [resetTokenHash, resetTokenExpires, user.id]);

    // Enviar email
    const emailContent = forgotPasswordEmail(user.name, resetToken);
    const emailSent = await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    if (!emailSent.success) {
      return res.status(500).json({ error: 'Erro ao enviar email de recuperação' });
    }

    res.json({ 
      message: 'Se o email existir, você receberá instruções de recuperação.' 
    });

  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
};

// Redefinir senha com token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validar senha
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Hash do token recebido
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar usuário com token válido e não expirado
    const userQuery = `
      SELECT * FROM users 
      WHERE reset_password_token = $1 
      AND reset_password_expires > NOW()
    `;
    const userResult = await pool.query(userQuery, [resetTokenHash]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    const user = userResult.rows[0];

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atualizar senha e limpar token
    const updateQuery = `
      UPDATE users 
      SET password = $1,
          reset_password_token = NULL,
          reset_password_expires = NULL,
          updated_at = NOW()
      WHERE id = $2
    `;
    await pool.query(updateQuery, [hashedPassword, user.id]);

    // Enviar email de confirmação
    const emailContent = passwordResetConfirmationEmail(user.name);
    await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    res.json({ message: 'Senha redefinida com sucesso' });

  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
};
