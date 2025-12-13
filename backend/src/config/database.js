import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'subscrivery',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_HOST?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
  max: 20, // Máximo de conexões simultâneas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Testar conexão
pool.on('connect', () => {
  console.log('✅ Conectado ao banco de dados PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro no pool de conexões:', err.message);
});

export default pool;
