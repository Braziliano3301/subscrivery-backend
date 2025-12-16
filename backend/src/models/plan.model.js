import pool from '../config/database.js';

class PlanModel {
  /**
   * Buscar todos os planos de assinatura
   */
  static async findAll() {
    const query = `
      SELECT * FROM subscription_plans
      ORDER BY price ASC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Buscar plano por ID
   */
  static async findById(id) {
    const query = `
      SELECT * FROM subscription_plans
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default PlanModel;
