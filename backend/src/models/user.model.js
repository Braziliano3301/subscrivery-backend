import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class UserModel {
  // Criar novo usuário
  static async create({ email, password, name, phone, user_type }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (email, password_hash, name, phone, user_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, name, phone, user_type, created_at
    `;
    
    const values = [email, hashedPassword, name, phone, user_type];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Buscar usuário por ID
  static async findById(id) {
    const query = 'SELECT id, email, name, phone, user_type, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Comparar senha
  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Atualizar perfil
  static async update(id, { name, phone }) {
    const query = `
      UPDATE users 
      SET name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, email, name, phone, user_type
    `;
    const result = await pool.query(query, [name, phone, id]);
    return result.rows[0];
  }
}

export default UserModel;
