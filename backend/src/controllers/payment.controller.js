import PaymentModel from '../models/payment.model.js';
import SubscriptionModel from '../models/subscription.model.js';

class PaymentController {
  // Criar novo pagamento
  static async createPayment(req, res) {
    try {
      const { subscription_id, amount, payment_method, transaction_id } = req.body;
      const userId = req.user.userId; // JWT usa 'userId', não 'id'
      
      // Validar que a assinatura existe e pertence ao usuário
      const subscription = await SubscriptionModel.findById(subscription_id);
      
      if (!subscription) {
        return res.status(404).json({ 
          success: false,
          message: 'Assinatura não encontrada' 
        });
      }
      
      console.log('Debug - subscription.user_id:', subscription.user_id, 'userId:', userId);
      console.log('Debug - Tipos:', typeof subscription.user_id, typeof userId);
      
      // Comparar como strings para evitar problemas de tipo
      if (subscription.user_id.toString() !== userId.toString()) {
        return res.status(403).json({ 
          success: false,
          message: 'Você não tem permissão para criar pagamentos para esta assinatura' 
        });
      }
      
      // Validar valor mínimo
      if (amount <= 0) {
        return res.status(400).json({ 
          success: false,
          message: 'O valor do pagamento deve ser maior que zero' 
        });
      }
      
      // Criar pagamento
      const payment = await PaymentModel.create({
        subscription_id,
        amount,
        payment_method,
        transaction_id
      });
      
      return res.status(201).json({
        success: true,
        message: 'Pagamento criado com sucesso',
        data: payment
      });
      
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro ao criar pagamento',
        error: error.message 
      });
    }
  }
  
  // Listar meus pagamentos
  static async getMyPayments(req, res) {
    try {
      const userId = req.user.userId;
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      
      const result = await PaymentModel.findByUserId(userId, limit, offset);
      
      return res.status(200).json({
        success: true,
        data: result.payments,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          pages: Math.ceil(result.total / result.limit)
        }
      });
      
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro ao buscar pagamentos',
        error: error.message 
      });
    }
  }
  
  // Buscar detalhes de um pagamento
  static async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      const payment = await PaymentModel.findById(id);
      
      if (!payment) {
        return res.status(404).json({ 
          success: false,
          message: 'Pagamento não encontrado' 
        });
      }
      
      // Verificar se o pagamento pertence ao usuário
      if (payment.user_id !== userId) {
        return res.status(403).json({ 
          success: false,
          message: 'Você não tem permissão para visualizar este pagamento' 
        });
      }
      
      return res.status(200).json({
        success: true,
        data: payment
      });
      
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro ao buscar pagamento',
        error: error.message 
      });
    }
  }
  
  // Atualizar status do pagamento (manual - para testes)
  static async updatePaymentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, transaction_id } = req.body;
      const userId = req.user.userId;
      
      // Validar status
      const validStatuses = ['pendente', 'aprovado', 'recusado'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          success: false,
          message: 'Status inválido. Use: pendente, aprovado ou recusado' 
        });
      }
      
      // Verificar se o pagamento existe e pertence ao usuário
      const payment = await PaymentModel.findById(id);
      
      if (!payment) {
        return res.status(404).json({ 
          success: false,
          message: 'Pagamento não encontrado' 
        });
      }
      
      if (payment.user_id !== userId) {
        return res.status(403).json({ 
          success: false,
          message: 'Você não tem permissão para atualizar este pagamento' 
        });
      }
      
      // Atualizar status
      const updatedPayment = await PaymentModel.updateStatus(id, status, transaction_id);
      
      return res.status(200).json({
        success: true,
        message: 'Status do pagamento atualizado com sucesso',
        data: updatedPayment
      });
      
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro ao atualizar status do pagamento',
        error: error.message 
      });
    }
  }
  
  // Buscar estatísticas de pagamentos
  static async getPaymentStats(req, res) {
    try {
      const userId = req.user.userId;
      
      const stats = await PaymentModel.getPaymentStats(userId);
      
      return res.status(200).json({
        success: true,
        data: {
          total_payments: parseInt(stats.total_payments) || 0,
          total_paid: parseFloat(stats.total_paid) || 0,
          total_pending: parseFloat(stats.total_pending) || 0,
          avg_payment: parseFloat(stats.avg_payment) || 0
        }
      });
      
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro ao buscar estatísticas',
        error: error.message 
      });
    }
  }
}

export default PaymentController;
