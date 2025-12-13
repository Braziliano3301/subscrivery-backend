import pool from '../config/database.js';

class SupplierModel {
  /**
   * Criar novo fornecedor
   */
  static async create(supplierData) {
    const {
      user_id,
      business_name,
      cnpj,
      category,
      address,
      city,
      state,
      zip_code
    } = supplierData;

    const query = `
      INSERT INTO suppliers (
        user_id, business_name, cnpj, category,
        address, city, state, zip_code
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      user_id,
      business_name,
      cnpj || null,
      category,
      address,
      city,
      state,
      zip_code || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Buscar todos os fornecedores com filtros opcionais
   */
  static async findAll(filters = {}) {
    const { city, state, category, search, limit = 50, offset = 0 } = filters;

    let query = `
      SELECT 
        s.*,
        u.name as contact_name,
        u.email,
        u.phone
      FROM suppliers s
      INNER JOIN users u ON s.user_id = u.id
      WHERE s.is_active = true
    `;

    const values = [];
    let paramCounter = 1;

    if (city) {
      query += ` AND LOWER(s.city) = LOWER($${paramCounter})`;
      values.push(city);
      paramCounter++;
    }

    if (state) {
      query += ` AND LOWER(s.state) = LOWER($${paramCounter})`;
      values.push(state);
      paramCounter++;
    }

    if (category) {
      query += ` AND s.category = $${paramCounter}`;
      values.push(category);
      paramCounter++;
    }

    if (search) {
      query += ` AND (
        LOWER(s.business_name) LIKE LOWER($${paramCounter})
      )`;
      values.push(`%${search}%`);
      paramCounter++;
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Buscar fornecedor por ID
   */
  static async findById(id) {
    const query = `
      SELECT 
        s.*,
        u.name as contact_name,
        u.email,
        u.phone
      FROM suppliers s
      INNER JOIN users u ON s.user_id = u.id
      WHERE s.id = $1 AND s.is_active = true
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Buscar fornecedor por user_id
   */
  static async findByUserId(userId) {
    const query = `
      SELECT * FROM suppliers
      WHERE user_id = $1 AND is_active = true
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Verificar se CNPJ já existe
   */
  static async findByCnpj(cnpj) {
    const query = `
      SELECT * FROM suppliers
      WHERE cnpj = $1 AND is_active = true
    `;

    const result = await pool.query(query, [cnpj]);
    return result.rows[0];
  }

  /**
   * Atualizar fornecedor
   */
  static async update(id, updateData) {
    const {
      business_name,
      category,
      address,
      city,
      state,
      zip_code
    } = updateData;

    const query = `
      UPDATE suppliers
      SET 
        business_name = COALESCE($1, business_name),
        category = COALESCE($2, category),
        address = COALESCE($3, address),
        city = COALESCE($4, city),
        state = COALESCE($5, state),
        zip_code = COALESCE($6, zip_code),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND is_active = true
      RETURNING *
    `;

    const values = [
      business_name,
      category,
      address,
      city,
      state,
      zip_code,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Soft delete - marcar como inativo
   */
  static async delete(id) {
    const query = `
      UPDATE suppliers
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Contar total de fornecedores (para paginação)
   */
  static async count(filters = {}) {
    const { city, state, category, search } = filters;

    let query = `
      SELECT COUNT(*) as total
      FROM suppliers s
      WHERE s.is_active = true
    `;

    const values = [];
    let paramCounter = 1;

    if (city) {
      query += ` AND LOWER(s.city) = LOWER($${paramCounter})`;
      values.push(city);
      paramCounter++;
    }

    if (state) {
      query += ` AND LOWER(s.state) = LOWER($${paramCounter})`;
      values.push(state);
      paramCounter++;
    }

    if (category) {
      query += ` AND s.category = $${paramCounter}`;
      values.push(category);
      paramCounter++;
    }

    if (search) {
      query += ` AND (
        LOWER(s.business_name) LIKE LOWER($${paramCounter})
      )`;
      values.push(`%${search}%`);
      paramCounter++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].total);
  }
}

export default SupplierModel;
