import pool from '../config/database.js';

class OrderModel {
  // Criar novo pedido com itens
  static async create(orderData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { subscription_id, supplier_id, delivery_date, items, total_amount } = orderData;
      
      // Inserir pedido
      const orderQuery = `
        INSERT INTO orders (subscription_id, supplier_id, delivery_date, status, total_amount)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const orderResult = await client.query(orderQuery, [
        subscription_id,
        supplier_id,
        delivery_date,
        'pendente',
        total_amount
      ]);
      
      const order = orderResult.rows[0];
      
      // Inserir itens do pedido
      const itemsPromises = items.map(item => {
        const itemQuery = `
          INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        
        const total_price = item.quantity * item.unit_price;
        
        return client.query(itemQuery, [
          order.id,
          item.product_name,
          item.quantity,
          item.unit_price,
          total_price
        ]);
      });
      
      const itemsResults = await Promise.all(itemsPromises);
      order.items = itemsResults.map(result => result.rows[0]);
      
      await client.query('COMMIT');
      return order;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Buscar pedido por ID com itens
  static async findById(orderId) {
    const query = `
      SELECT 
        o.*,
        s.business_name as supplier_name,
        sub.user_id,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price
          )
        ) as items
      FROM orders o
      LEFT JOIN suppliers s ON o.supplier_id = s.id
      LEFT JOIN subscriptions sub ON o.subscription_id = sub.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
      GROUP BY o.id, s.business_name, sub.user_id
    `;
    
    const result = await pool.query(query, [orderId]);
    return result.rows[0];
  }
  
  // Buscar pedidos do cliente (user_id)
  static async findByUserId(userId, limit = 20, offset = 0) {
    const query = `
      SELECT 
        o.*,
        s.business_name as supplier_name,
        s.category as supplier_category,
        COUNT(*) OVER() as total_count
      FROM orders o
      LEFT JOIN suppliers s ON o.supplier_id = s.id
      INNER JOIN subscriptions sub ON o.subscription_id = sub.id
      WHERE sub.user_id = $1
      ORDER BY o.order_date DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [userId, limit, offset]);
    
    return {
      orders: result.rows,
      total: result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0,
      limit,
      offset
    };
  }
  
  // Buscar pedidos do fornecedor
  static async findBySupplierId(supplierId, status = null, limit = 20, offset = 0) {
    let query = `
      SELECT 
        o.*,
        u.name as customer_name,
        u.phone as customer_phone,
        COUNT(*) OVER() as total_count
      FROM orders o
      INNER JOIN subscriptions sub ON o.subscription_id = sub.id
      INNER JOIN users u ON sub.user_id = u.id
      WHERE o.supplier_id = $1
    `;
    
    const params = [supplierId];
    
    if (status) {
      query += ` AND o.status = $${params.length + 1}`;
      params.push(status);
    }
    
    query += ` ORDER BY o.order_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    return {
      orders: result.rows,
      total: result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0,
      limit,
      offset
    };
  }
  
  // Atualizar status do pedido
  static async updateStatus(orderId, status) {
    const query = `
      UPDATE orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, orderId]);
    return result.rows[0];
  }
  
  // Verificar se assinatura tem crédito suficiente
  static async checkSubscriptionCredit(subscriptionId, amount) {
    const query = `
      SELECT remaining_credit, status
      FROM subscriptions
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [subscriptionId]);
    const subscription = result.rows[0];
    
    if (!subscription) {
      return { valid: false, message: 'Assinatura não encontrada' };
    }
    
    if (subscription.status !== 'ativa') {
      return { valid: false, message: 'Assinatura não está ativa' };
    }
    
    if (parseFloat(subscription.remaining_credit) < amount) {
      return { 
        valid: false, 
        message: 'Crédito insuficiente',
        available: subscription.remaining_credit,
        required: amount
      };
    }
    
    return { valid: true, available: subscription.remaining_credit };
  }
  
  // Deduzir crédito da assinatura
  static async deductSubscriptionCredit(subscriptionId, amount) {
    const query = `
      UPDATE subscriptions
      SET remaining_credit = remaining_credit - $1
      WHERE id = $2
      RETURNING remaining_credit
    `;
    
    const result = await pool.query(query, [amount, subscriptionId]);
    return result.rows[0];
  }
  
  // Cancelar pedido (devolve crédito)
  static async cancelOrder(orderId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Buscar pedido
      const orderQuery = 'SELECT * FROM orders WHERE id = $1';
      const orderResult = await client.query(orderQuery, [orderId]);
      const order = orderResult.rows[0];
      
      if (!order) {
        throw new Error('Pedido não encontrado');
      }
      
      if (order.status === 'entregue') {
        throw new Error('Não é possível cancelar pedido já entregue');
      }
      
      if (order.status === 'cancelado') {
        throw new Error('Pedido já está cancelado');
      }
      
      // Atualizar status
      await client.query(
        'UPDATE orders SET status = $1 WHERE id = $2',
        ['cancelado', orderId]
      );
      
      // Devolver crédito
      await client.query(
        'UPDATE subscriptions SET remaining_credit = remaining_credit + $1 WHERE id = $2',
        [order.total_amount, order.subscription_id]
      );
      
      await client.query('COMMIT');
      return { ...order, status: 'cancelado' };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default OrderModel;
