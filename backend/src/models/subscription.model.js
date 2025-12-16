import pool from '../config/database.js';

class SubscriptionModel {
  /**
   * Criar nova assinatura
   */
  static async create(subscriptionData) {
    const {
      user_id,
      plan_id,
      start_date,
      next_billing_date,
      remaining_credit
    } = subscriptionData;

    const query = `
      INSERT INTO subscriptions (
        user_id, plan_id, status, start_date,
        next_billing_date, remaining_credit
      )
      VALUES ($1, $2, 'ativa', $3, $4, $5)
      RETURNING *
    `;

    const values = [
      user_id,
      plan_id,
      start_date,
      next_billing_date,
      remaining_credit
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Buscar assinatura ativa do usuário
   */
  static async findActiveByUserId(userId) {
    const query = `
      SELECT 
        s.*,
        sp.name as plan_name,
        sp.price as plan_price,
        sp.credit_amount as plan_credit
      FROM subscriptions s
      INNER JOIN subscription_plans sp ON s.plan_id = sp.id
      WHERE s.user_id = $1 AND s.status = 'ativa'
      ORDER BY s.created_at DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Buscar todas as assinaturas do usuário (histórico)
   */
  static async findAllByUserId(userId) {
    const query = `
      SELECT 
        s.*,
        sp.name as plan_name,
        sp.price as plan_price,
        sp.credit_amount as plan_credit
      FROM subscriptions s
      INNER JOIN subscription_plans sp ON s.plan_id = sp.id
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Buscar assinatura por ID
   */
  static async findById(id) {
    const query = `
      SELECT 
        s.*,
        sp.name as plan_name,
        sp.price as plan_price,
        sp.credit_amount as plan_credit
      FROM subscriptions s
      INNER JOIN subscription_plans sp ON s.plan_id = sp.id
      WHERE s.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Atualizar status da assinatura
   */
  static async updateStatus(id, status) {
    const query = `
      UPDATE subscriptions
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  /**
   * Atualizar crédito restante
   */
  static async updateCredit(id, newCredit) {
    const query = `
      UPDATE subscriptions
      SET remaining_credit = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [newCredit, id]);
    return result.rows[0];
  }

  /**
   * Atualizar próxima data de cobrança
   */
  static async updateNextBillingDate(id, nextDate) {
    const query = `
      UPDATE subscriptions
      SET next_billing_date = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [nextDate, id]);
    return result.rows[0];
  }

  /**
   * Renovar assinatura (resetar crédito)
   */
  static async renew(id, creditAmount) {
    const query = `
      UPDATE subscriptions
      SET 
        remaining_credit = $1,
        next_billing_date = (next_billing_date + INTERVAL '1 month')::DATE,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [creditAmount, id]);
    return result.rows[0];
  }
}

export default SubscriptionModel;
