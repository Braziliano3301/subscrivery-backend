import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

/**
 * Pool de conexão com PostgreSQL
 * Para usar:
 * 
 * import { db } from './config/database.js';
 * 
 * // Query simples
 * const result = await db.query('SELECT * FROM customers WHERE id = $1', [1]);
 * 
 * // Com transação
 * const client = await db.connect();
 * try {
 *   await client.query('BEGIN');
 *   // suas queries aqui
 *   await client.query('COMMIT');
 * } catch (e) {
 *   await client.query('ROLLBACK');
 *   throw e;
 * } finally {
 *   client.release();
 * }
 */

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'subscrivery',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Erro não esperado no cliente idle', err);
  process.exit(-1);
});

/**
 * Executa uma query no banco de dados
 * @param {string} text - Comando SQL
 * @param {array} params - Parâmetros da query
 * @returns {Promise} Resultado da query
 */
export const query = (text, params) => {
  return pool.query(text, params);
};

/**
 * Obtém um cliente específico para transações
 * @returns {Promise} Cliente da pool
 */
export const getClient = () => {
  return pool.connect();
};

/**
 * Encerra a pool de conexões
 */
export const close = () => {
  return pool.end();
};

/**
 * Verifica conexão com o banco
 */
export const healthCheck = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    return {
      status: 'connected',
      timestamp: result.rows[0].now,
      message: 'PostgreSQL conectado com sucesso'
    };
  } catch (error) {
    return {
      status: 'disconnected',
      error: error.message,
      message: 'Erro ao conectar ao PostgreSQL'
    };
  }
};

export default pool;
