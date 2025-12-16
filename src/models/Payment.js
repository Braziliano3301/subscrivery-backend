import { query, getClient } from '../config/database.js';

/**
 * Model: Payments
 * Operações CRUD para pagamentos
 */

export const Payment = {
  /**
   * Cria um novo pagamento
   */
  async create(paymentData) {
    const {
      asaas_id,
      customer_id,
      asaas_customer_id,
      value,
      net_value,
      gross_value,
      due_date,
      original_due_date,
      payment_date,
      description,
      billing_type,
      status = 'PENDING',
      subscription_id,
      subscription_asaas_id,
      installment_number,
      invoice_number,
      invoice_series,
      external_reference_id,
      discount_value,
      interest_value,
      fine_value,
      credit_date,
      estimated_credit_date,
      pix_qrcode,
      pix_url_image,
      pix_expiration_date,
      boleto_barcode,
      boleto_url_image,
      asaas_created_at,
      asaas_updated_at
    } = paymentData;

    const sql = `
      INSERT INTO payments (
        asaas_id, customer_id, asaas_customer_id, value, net_value, gross_value,
        due_date, original_due_date, payment_date, description, billing_type, status,
        subscription_id, subscription_asaas_id, installment_number, invoice_number,
        invoice_series, external_reference_id, discount_value, interest_value,
        fine_value, credit_date, estimated_credit_date, pix_qrcode,
        pix_url_image, pix_expiration_date, boleto_barcode, boleto_url_image,
        asaas_created_at, asaas_updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
      )
      RETURNING *;
    `;

    const params = [
      asaas_id, customer_id, asaas_customer_id, value, net_value, gross_value,
      due_date, original_due_date, payment_date, description, billing_type, status,
      subscription_id, subscription_asaas_id, installment_number, invoice_number,
      invoice_series, external_reference_id, discount_value, interest_value,
      fine_value, credit_date, estimated_credit_date, pix_qrcode,
      pix_url_image, pix_expiration_date, boleto_barcode, boleto_url_image,
      asaas_created_at, asaas_updated_at
    ];

    const result = await query(sql, params);
    return result.rows[0];
  },

  /**
   * Encontra pagamento por ID Asaas
   */
  async findByAsaasId(asaas_id) {
    const sql = 'SELECT * FROM payments WHERE asaas_id = $1';
    const result = await query(sql, [asaas_id]);
    return result.rows[0];
  },

  /**
   * Lista pagamentos por cliente
   */
  async findByCustomerId(customer_id, limit = 50, offset = 0) {
    const sql = `
      SELECT * FROM payments 
      WHERE customer_id = $1 
      ORDER BY due_date DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await query(sql, [customer_id, limit, offset]);
    return result.rows;
  },

  /**
   * Lista pagamentos por status
   */
  async findByStatus(status, limit = 50, offset = 0) {
    const sql = `
      SELECT * FROM payments 
      WHERE status = $1 
      ORDER BY due_date DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await query(sql, [status, limit, offset]);
    return result.rows;
  },

  /**
   * Lista todos os pagamentos
   */
  async findAll(limit = 50, offset = 0) {
    const sql = `
      SELECT * FROM payments 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await query(sql, [limit, offset]);
    return result.rows;
  },

  /**
   * Atualiza pagamento
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
    const sql = `UPDATE payments SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await query(sql, params);
    return result.rows[0];
  },

  /**
   * Pagamentos pendentes
   */
  async findPending() {
    const sql = `SELECT * FROM v_pending_payments`;
    const result = await query(sql);
    return result.rows;
  },

  /**
   * Resumo de pagamentos por status
   */
  async getSummaryByStatus() {
    const sql = `
      SELECT 
        status,
        COUNT(*) as count,
        SUM(value) as total_value
      FROM payments
      GROUP BY status
      ORDER BY total_value DESC
    `;
    const result = await query(sql);
    return result.rows;
  }
};

export default Payment;
