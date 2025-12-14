import pool from '../config/database.js';

class PaymentModel {
  // Criar novo pagamento
  static async create(paymentData) {
    const { subscription_id, amount, payment_method, transaction_id } = paymentData;
    
    const query = `
      INSERT INTO payments (subscription_id, amount, payment_method, status, transaction_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      subscription_id,
      amount,
      payment_method,
      'pendente', // Status inicial
      transaction_id || null
    ]);
    
    return result.rows[0];
  }
  
  // Buscar pagamento por ID
  static async findById(paymentId) {
    const query = `
      SELECT 
        p.*,
        s.user_id,
        sp.name as plan_name,
        sp.price as plan_price
      FROM payments p
      INNER JOIN subscriptions s ON p.subscription_id = s.id
      INNER JOIN subscription_plans sp ON s.plan_id = sp.id
      WHERE p.id = $1
    `;
    
    const result = await pool.query(query, [paymentId]);
    return result.rows[0];
  }
  
  // Buscar pagamentos por usuário
  static async findByUserId(userId, limit = 20, offset = 0) {
    const query = `
      SELECT 
        p.*,
        sp.name as plan_name,
        sp.price as plan_price,
        COUNT(*) OVER() as total_count
      FROM payments p
      INNER JOIN subscriptions s ON p.subscription_id = s.id
      INNER JOIN subscription_plans sp ON s.plan_id = sp.id
      WHERE s.user_id = $1
      ORDER BY p.payment_date DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [userId, limit, offset]);
    
    return {
      payments: result.rows,
      total: result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0,
      limit,
      offset
    };
  }
  
  // Buscar pagamentos por assinatura
  static async findBySubscriptionId(subscriptionId) {
    const query = `
      SELECT *
      FROM payments
      WHERE subscription_id = $1
      ORDER BY payment_date DESC
    `;
    
    const result = await pool.query(query, [subscriptionId]);
    return result.rows;
  }
  
  // Atualizar status do pagamento
  static async updateStatus(paymentId, status, transaction_id = null) {
    const query = `
      UPDATE payments
      SET status = $1, transaction_id = $2
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, transaction_id, paymentId]);
    return result.rows[0];
  }
  
  // Buscar último pagamento aprovado da assinatura
  static async findLastApprovedBySubscription(subscriptionId) {
    const query = `
      SELECT *
      FROM payments
      WHERE subscription_id = $1 AND status = 'aprovado'
      ORDER BY payment_date DESC
      LIMIT 1
    `;
    
    const result = await pool.query(query, [subscriptionId]);
    return result.rows[0];
  }
  
  // Estatísticas de pagamentos do usuário
  static async getPaymentStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_payments,
        SUM(CASE WHEN p.status = 'aprovado' THEN p.amount ELSE 0 END) as total_paid,
        SUM(CASE WHEN p.status = 'pendente' THEN p.amount ELSE 0 END) as total_pending,
        AVG(CASE WHEN p.status = 'aprovado' THEN p.amount ELSE NULL END) as avg_payment
      FROM payments p
      INNER JOIN subscriptions s ON p.subscription_id = s.id
      WHERE s.user_id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

export default PaymentModel;
