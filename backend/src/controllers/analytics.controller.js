import pool from '../config/database.js';

/**
 * Obter quantidade de pedidos no período especificado
 * Query params: startDate, endDate (formato YYYY-MM-DD)
 */
export const getOrdersByPeriod = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    let dateFormat;
    switch (groupBy) {
      case 'day':
        dateFormat = "TO_CHAR(o.created_at, 'YYYY-MM-DD')";
        break;
      case 'week':
        dateFormat = "TO_CHAR(DATE_TRUNC('week', o.created_at), 'YYYY-MM-DD')";
        break;
      case 'month':
        dateFormat = "TO_CHAR(DATE_TRUNC('month', o.created_at), 'YYYY-MM')";
        break;
      default:
        dateFormat = "TO_CHAR(o.created_at, 'YYYY-MM-DD')";
    }

    let query = `
      SELECT 
        ${dateFormat} as period,
        COUNT(*) as total_orders,
        SUM(o.total_price) as total_revenue,
        AVG(o.total_price) as avg_order_value
      FROM orders o
    `;

    const params = [];

    if (startDate && endDate) {
      query += ` WHERE o.created_at >= $${params.length + 1} AND o.created_at <= $${params.length + 2}`;
      params.push(startDate, endDate);
    }

    query += ` GROUP BY ${dateFormat} ORDER BY period DESC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao obter pedidos por período:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar dados de pedidos'
    });
  }
};

/**
 * Obter produtos mais pedidos
 * Query params: limit (padrão 10), startDate, endDate
 */
export const getTopProducts = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;

    let query = `
      SELECT 
        p.id,
        p.name as product_name,
        p.description,
        COUNT(o.id) as total_orders,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.subtotal) as total_revenue,
        AVG(oi.price) as avg_price
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id
    `;

    const params = [];

    if (startDate && endDate) {
      query += ` WHERE o.created_at >= $${params.length + 1} AND o.created_at <= $${params.length + 2}`;
      params.push(startDate, endDate);
    }

    query += `
      GROUP BY p.id, p.name, p.description
      ORDER BY total_orders DESC
      LIMIT $${params.length + 1}
    `;
    params.push(limit);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao obter produtos principais:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar dados de produtos'
    });
  }
};

/**
 * Obter clientes por região/estado
 * Retorna quantidade de clientes e localização para mapa
 */
export const getCustomersByRegion = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.state as region,
        u.city,
        COUNT(*) as total_customers,
        COUNT(DISTINCT s.id) as active_subscriptions,
        ST_AsGeoJSON(ST_Point(
          COALESCE(u.longitude, -51.9253),
          COALESCE(u.latitude, -14.2350)
        )) as location
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
      GROUP BY u.state, u.city
      ORDER BY total_customers DESC
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao obter clientes por região:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar dados de regiões'
    });
  }
};

/**
 * Obter fornecedores com melhores preços
 * Retorna fornecedor com menor preço por produto
 */
export const getSuppliersPricing = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.name as product_name,
        s.id as supplier_id,
        s.name as supplier_name,
        sp.price as unit_price,
        ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY sp.price ASC) as price_rank
      FROM products p
      INNER JOIN supplier_products sp ON p.id = sp.product_id
      INNER JOIN suppliers s ON sp.supplier_id = s.id
      ORDER BY p.id, sp.price ASC
    `;

    const result = await pool.query(query);

    // Filtrar apenas o fornecedor com melhor preço por produto
    const bestPricedSuppliers = result.rows.filter(row => row.price_rank === 1);

    res.json({
      success: true,
      data: bestPricedSuppliers,
      count: bestPricedSuppliers.length
    });
  } catch (error) {
    console.error('Erro ao obter preços de fornecedores:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar dados de fornecedores'
    });
  }
};

/**
 * Obter margem de lucro por produto
 * Calcula a diferença entre preço de venda e custo
 */
export const getProductMargins = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.name as product_name,
        p.price as selling_price,
        COALESCE(MIN(sp.price), 0) as supplier_cost,
        (p.price - COALESCE(MIN(sp.price), 0)) as margin_value,
        CASE 
          WHEN COALESCE(MIN(sp.price), 0) = 0 THEN 0
          ELSE ROUND(((p.price - COALESCE(MIN(sp.price), 0)) / p.price * 100)::numeric, 2)
        END as margin_percentage,
        COUNT(oi.id) as total_sold
      FROM products p
      LEFT JOIN supplier_products sp ON p.id = sp.product_id
      LEFT JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id, p.name, p.price
      ORDER BY margin_percentage DESC
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao obter margens de produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar dados de margens'
    });
  }
};

/**
 * Obter dashboard geral com principais métricas
 */
export const getDashboardSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Total de pedidos
    let ordersQuery = 'SELECT COUNT(*) as total FROM orders';
    const ordersParams = [];
    if (startDate && endDate) {
      ordersQuery += ` WHERE created_at >= $1 AND created_at <= $2`;
      ordersParams.push(startDate, endDate);
    }

    // Total de receita
    let revenueQuery = 'SELECT SUM(total_price) as total FROM orders';
    const revenueParams = [];
    if (startDate && endDate) {
      revenueQuery += ` WHERE created_at >= $1 AND created_at <= $2`;
      revenueParams.push(startDate, endDate);
    }

    // Total de clientes
    const customersQuery = 'SELECT COUNT(*) as total FROM users WHERE role = $1';

    // Total de assinaturas ativas
    const subscriptionsQuery = 'SELECT COUNT(*) as total FROM subscriptions WHERE status = $1';

    const [ordersResult, revenueResult, customersResult, subscriptionsResult] = await Promise.all([
      pool.query(ordersQuery, ordersParams),
      pool.query(revenueQuery, revenueParams),
      pool.query(customersQuery, ['customer']),
      pool.query(subscriptionsQuery, ['active'])
    ]);

    res.json({
      success: true,
      data: {
        total_orders: parseInt(ordersResult.rows[0].total) || 0,
        total_revenue: parseFloat(revenueResult.rows[0].total) || 0,
        total_customers: parseInt(customersResult.rows[0].total) || 0,
        active_subscriptions: parseInt(subscriptionsResult.rows[0].total) || 0
      }
    });
  } catch (error) {
    console.error('Erro ao obter resumo do dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar dados do dashboard'
    });
  }
};
