import OrderModel from '../models/order.model.js';
import SubscriptionModel from '../models/subscription.model.js';
import SupplierModel from '../models/supplier.model.js';

class OrderController {
  // Criar novo pedido (apenas clientes)
  static async createOrder(req, res) {
    try {
      const { supplier_id, delivery_date, items } = req.body;
      const userId = req.user.id;
      
      // Validar que há itens
      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Pedido deve ter pelo menos 1 item' });
      }
      
      // Verificar se fornecedor existe
      const supplier = await SupplierModel.findById(supplier_id);
      if (!supplier) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }
      
      // Buscar assinatura ativa do cliente
      const subscription = await SubscriptionModel.findActiveByUserId(userId);
      if (!subscription) {
        return res.status(400).json({ 
          error: 'Você precisa ter uma assinatura ativa para fazer pedidos' 
        });
      }
      
      // Calcular total do pedido
      const total_amount = items.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_price);
      }, 0);
      
      // Verificar crédito disponível
      const creditCheck = await OrderModel.checkSubscriptionCredit(
        subscription.id, 
        total_amount
      );
      
      if (!creditCheck.valid) {
        return res.status(400).json({ 
          error: creditCheck.message,
          available_credit: creditCheck.available,
          required_amount: total_amount
        });
      }
      
      // Criar pedido
      const orderData = {
        subscription_id: subscription.id,
        supplier_id,
        delivery_date,
        items,
        total_amount
      };
      
      const order = await OrderModel.create(orderData);
      
      // Deduzir crédito
      await OrderModel.deductSubscriptionCredit(subscription.id, total_amount);
      
      res.status(201).json({ 
        message: 'Pedido criado com sucesso',
        order,
        remaining_credit: parseFloat(creditCheck.available) - total_amount
      });
      
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({ error: 'Erro ao criar pedido', details: error.message });
    }
  }
  
  // Listar pedidos do cliente logado
  static async getMyOrders(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      
      const result = await OrderModel.findByUserId(userId, limit, offset);
      
      res.json({
        orders: result.orders,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          pages: Math.ceil(result.total / result.limit)
        }
      });
      
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
    }
  }
  
  // Obter detalhes de um pedido específico
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const order = await OrderModel.findById(id);
      
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      
      // Verificar se o usuário tem permissão (é o dono do pedido ou o fornecedor)
      const isOwner = order.user_id === userId;
      
      // Se for fornecedor, verificar se é o fornecedor do pedido
      let isSupplier = false;
      if (req.user.user_type === 'fornecedor') {
        const supplier = await SupplierModel.findByUserId(userId);
        isSupplier = supplier && supplier.id === order.supplier_id;
      }
      
      if (!isOwner && !isSupplier) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      res.json({ order });
      
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({ error: 'Erro ao buscar pedido', details: error.message });
    }
  }
  
  // Listar pedidos do fornecedor (apenas fornecedores)
  static async getSupplierOrders(req, res) {
    try {
      const userId = req.user.id;
      const status = req.query.status || null;
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      
      // Buscar fornecedor do usuário logado
      const supplier = await SupplierModel.findByUserId(userId);
      
      if (!supplier) {
        return res.status(404).json({ error: 'Perfil de fornecedor não encontrado' });
      }
      
      const result = await OrderModel.findBySupplierId(supplier.id, status, limit, offset);
      
      res.json({
        orders: result.orders,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          pages: Math.ceil(result.total / result.limit)
        }
      });
      
    } catch (error) {
      console.error('Erro ao buscar pedidos do fornecedor:', error);
      res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
    }
  }
  
  // Atualizar status do pedido (apenas fornecedor dono do pedido)
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;
      
      // Validar status
      const validStatuses = ['pendente', 'confirmado', 'entregue', 'cancelado'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Status inválido',
          valid_statuses: validStatuses
        });
      }
      
      // Buscar pedido
      const order = await OrderModel.findById(id);
      
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      
      // Verificar se é o fornecedor do pedido
      const supplier = await SupplierModel.findByUserId(userId);
      
      if (!supplier || supplier.id !== order.supplier_id) {
        return res.status(403).json({ error: 'Apenas o fornecedor do pedido pode atualizar o status' });
      }
      
      // Atualizar status
      const updatedOrder = await OrderModel.updateStatus(id, status);
      
      res.json({ 
        message: 'Status atualizado com sucesso',
        order: updatedOrder
      });
      
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({ error: 'Erro ao atualizar status', details: error.message });
    }
  }
  
  // Cancelar pedido (cliente ou fornecedor)
  static async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Buscar pedido
      const order = await OrderModel.findById(id);
      
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      
      // Verificar permissão (cliente dono ou fornecedor)
      const isOwner = order.user_id === userId;
      
      let isSupplier = false;
      if (req.user.user_type === 'fornecedor') {
        const supplier = await SupplierModel.findByUserId(userId);
        isSupplier = supplier && supplier.id === order.supplier_id;
      }
      
      if (!isOwner && !isSupplier) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      // Cancelar pedido (devolve crédito)
      const cancelledOrder = await OrderModel.cancelOrder(id);
      
      res.json({ 
        message: 'Pedido cancelado com sucesso. Crédito devolvido à assinatura.',
        order: cancelledOrder
      });
      
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      
      if (error.message.includes('já está cancelado') || error.message.includes('já entregue')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Erro ao cancelar pedido', details: error.message });
    }
  }
}

export default OrderController;
