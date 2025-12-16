import { query, getClient } from '../config/database.js';

/**
 * Model: Customers
 * Operações CRUD para clientes
 */

export const Customer = {
  /**
   * Cria um novo cliente
   */
  async create(customerData) {
    const {
      asaas_id,
      name,
      email,
      document,
      mobile_phone,
      address_street,
      address_number,
      address_complement,
      address_neighborhood,
      address_city,
      address_state,
      address_postal_code,
      company_name,
      cpf_cnpj,
      asaas_created_at,
      asaas_updated_at
    } = customerData;

    const sql = `
      INSERT INTO customers (
        asaas_id, name, email, document, mobile_phone,
        address_street, address_number, address_complement,
        address_neighborhood, address_city, address_state,
        address_postal_code, company_name, cpf_cnpj,
        asaas_created_at, asaas_updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;

    const params = [
      asaas_id, name, email, document, mobile_phone,
      address_street, address_number, address_complement,
      address_neighborhood, address_city, address_state,
      address_postal_code, company_name, cpf_cnpj,
      asaas_created_at, asaas_updated_at
    ];

    const result = await query(sql, params);
    return result.rows[0];
  },

  /**
   * Encontra cliente por ID Asaas
   */
  async findByAsaasId(asaas_id) {
    const sql = 'SELECT * FROM customers WHERE asaas_id = $1';
    const result = await query(sql, [asaas_id]);
    return result.rows[0];
  },

  /**
   * Encontra cliente por email
   */
  async findByEmail(email) {
    const sql = 'SELECT * FROM customers WHERE email = $1';
    const result = await query(sql, [email]);
    return result.rows[0];
  },

  /**
   * Lista todos os clientes
   */
  async findAll(limit = 50, offset = 0) {
    const sql = 'SELECT * FROM customers ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await query(sql, [limit, offset]);
    return result.rows;
  },

  /**
   * Atualiza cliente
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

    params.push(id);
    const sql = `UPDATE customers SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`;
    const result = await query(sql, params);
    return result.rows[0];
  },

  /**
   * Deleta cliente
   */
  async delete(id) {
    const sql = 'DELETE FROM customers WHERE id = $1';
    await query(sql, [id]);
  },

  /**
   * Busca com resumo de pagamentos
   */
  async findWithPaymentSummary(id) {
    const sql = 'SELECT * FROM v_customers_payment_summary WHERE id = $1';
    const result = await query(sql, [id]);
    return result.rows[0];
  }
};

export default Customer;
