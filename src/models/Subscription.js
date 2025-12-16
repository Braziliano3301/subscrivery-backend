import { query, getClient } from '../config/database.js';

/**
 * Model: Subscriptions
 * Operações CRUD para assinaturas recorrentes
 */

export const Subscription = {
  /**
   * Cria uma nova assinatura
   */
  async create(subscriptionData) {
    const {
      asaas_id,
      customer_id,
      asaas_customer_id,
      value,
      next_due_date,
      description,
      billing_type,
      cycle,
      status = 'ACTIVE',
      end_date,
      max_payments,
      invoice_by_email = false,
      auto_payment_failure_notifications = true,
      cycle_custom_day,
      discount_value,
      interest_value,
      fine_value,
      external_reference_id,
      next_payment_id,
      previous_payment_id,
      asaas_created_at,
      asaas_updated_at
    } = subscriptionData;

    const sql = `
      INSERT INTO subscriptions (
        asaas_id, customer_id, asaas_customer_id, value, next_due_date, description,
        billing_type, cycle, status, end_date, max_payments, invoice_by_email,
        auto_payment_failure_notifications, cycle_custom_day, discount_value,
        interest_value, fine_value, external_reference_id, next_payment_id,
        previous_payment_id, asaas_created_at, asaas_updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      )
      RETURNING *;
    `;

    const params = [
      asaas_id, customer_id, asaas_customer_id, value, next_due_date, description,
      billing_type, cycle, status, end_date, max_payments, invoice_by_email,
      auto_payment_failure_notifications, cycle_custom_day, discount_value,
      interest_value, fine_value, external_reference_id, next_payment_id,
      previous_payment_id, asaas_created_at, asaas_updated_at
    ];

    const result = await query(sql, params);
    return result.rows[0];
  },

  /**
   * Encontra assinatura por ID Asaas
   */
  async findByAsaasId(asaas_id) {
    const sql = 'SELECT * FROM subscriptions WHERE asaas_id = $1';
    const result = await query(sql, [asaas_id]);
    return result.rows[0];
  },

  /**
   * Lista assinaturas por cliente
   */
  async findByCustomerId(customer_id, limit = 50, offset = 0) {
    const sql = `
      SELECT * FROM subscriptions 
      WHERE customer_id = $1 
      ORDER BY next_due_date ASC 
      LIMIT $2 OFFSET $3
    `;
    const result = await query(sql, [customer_id, limit, offset]);
    return result.rows;
  },

  /**
   * Lista assinaturas ativas
   */
  async findActive() {
    const sql = 'SELECT * FROM v_active_subscriptions ORDER BY next_due_date ASC';
    const result = await query(sql);
    return result.rows;
  },

  /**
   * Lista todas as assinaturas
   */
  async findAll(limit = 50, offset = 0) {
    const sql = `
      SELECT * FROM subscriptions 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await query(sql, [limit, offset]);
    return result.rows;
  },

  /**
   * Atualiza assinatura
   */
  async update(id, updateData) {
    const updates = [];
    const params = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        params.push(value);
        paramCount++;
      }
    }

    if (updates.length === 0) return null;

    updates.push(`updated_at = NOW()`);
    params.push(id);
    const sql = `UPDATE subscriptions SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await query(sql, params);
    return result.rows[0];
  },

  /**
   * Pausa assinatura
   */
  async pause(id) {
    return this.update(id, { status: 'PAUSED' });
  },

  /**
   * Reativa assinatura
   */
  async resume(id) {
    return this.update(id, { status: 'ACTIVE' });
  },

  /**
   * Encerra assinatura
   */
  async end(id) {
    return this.update(id, { status: 'ENDED', end_date: new Date() });
  },

  /**
   * Incrementa contador de pagamentos
   */
  async incrementPaymentCount(id) {
    const sql = `
      UPDATE subscriptions 
      SET payments_count = payments_count + 1, updated_at = NOW()
      WHERE id = $1 
      RETURNING *
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  },

  /**
   * Assinaturas com próximo vencimento hoje
   */
  async findDuToday() {
    const sql = `
      SELECT * FROM subscriptions 
      WHERE status = 'ACTIVE' AND DATE(next_due_date) = CURRENT_DATE
      ORDER BY next_due_date ASC
    `;
    const result = await query(sql);
    return result.rows;
  },

  /**
   * Resumo de assinaturas por ciclo
   */
  async getSummaryByCycle() {
    const sql = `
      SELECT 
        cycle,
        COUNT(*) as count,
        SUM(value) as total_value,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_count
      FROM subscriptions
      GROUP BY cycle
      ORDER BY count DESC
    `;
    const result = await query(sql);
    return result.rows;
  }
};

export default Subscription;
