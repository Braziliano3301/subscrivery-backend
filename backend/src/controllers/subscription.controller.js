import SubscriptionModel from '../models/subscription.model.js';
import PlanModel from '../models/plan.model.js';

class SubscriptionController {
  /**
   * Criar nova assinatura
   * POST /api/subscriptions
   */
  static async createSubscription(req, res) {
    try {
      const { userId, userType } = req.user;

      // Verificar se usuário é cliente
      if (userType !== 'cliente') {
        return res.status(403).json({
          error: 'Apenas clientes podem criar assinaturas'
        });
      }

      // Verificar se já possui assinatura ativa
      const existingSubscription = await SubscriptionModel.findActiveByUserId(userId);
      if (existingSubscription) {
        return res.status(400).json({
          error: 'Você já possui uma assinatura ativa',
          subscription: existingSubscription
        });
      }

      const { plan_id } = req.body;

      // Verificar se o plano existe
      const plan = await PlanModel.findById(plan_id);
      if (!plan) {
        return res.status(404).json({
          error: 'Plano não encontrado'
        });
      }

      // Calcular datas
      const startDate = new Date().toISOString().split('T')[0];
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      const nextBillingDateStr = nextBillingDate.toISOString().split('T')[0];

      const subscriptionData = {
        user_id: userId,
        plan_id,
        start_date: startDate,
        next_billing_date: nextBillingDateStr,
        remaining_credit: plan.credit_amount
      };

      const subscription = await SubscriptionModel.create(subscriptionData);

      res.status(201).json({
        message: 'Assinatura criada com sucesso',
        subscription: {
          ...subscription,
          plan_name: plan.name,
          plan_price: plan.price,
          plan_credit: plan.credit_amount
        }
      });
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      res.status(500).json({
        error: 'Erro ao criar assinatura',
        details: error.message
      });
    }
  }

  /**
   * Buscar minha assinatura ativa
   * GET /api/subscriptions/my
   */
  static async getMySubscription(req, res) {
    try {
      const { userId, userType } = req.user;

      if (userType !== 'cliente') {
        return res.status(403).json({
          error: 'Apenas clientes podem acessar este endpoint'
        });
      }

      const subscription = await SubscriptionModel.findActiveByUserId(userId);

      if (!subscription) {
        return res.status(404).json({
          error: 'Você não possui uma assinatura ativa'
        });
      }

      res.json({ subscription });
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
      res.status(500).json({
        error: 'Erro ao buscar assinatura',
        details: error.message
      });
    }
  }

  /**
   * Buscar histórico de assinaturas
   * GET /api/subscriptions/history
   */
  static async getSubscriptionHistory(req, res) {
    try {
      const { userId, userType } = req.user;

      if (userType !== 'cliente') {
        return res.status(403).json({
          error: 'Apenas clientes podem acessar este endpoint'
        });
      }

      const subscriptions = await SubscriptionModel.findAllByUserId(userId);

      res.json({
        subscriptions,
        total: subscriptions.length
      });
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      res.status(500).json({
        error: 'Erro ao buscar histórico',
        details: error.message
      });
    }
  }

  /**
   * Pausar assinatura
   * PUT /api/subscriptions/:id/pause
   */
  static async pauseSubscription(req, res) {
    try {
      const { id } = req.params;
      const { userId, userType } = req.user;

      if (userType !== 'cliente') {
        return res.status(403).json({
          error: 'Apenas clientes podem pausar assinaturas'
        });
      }

      const subscription = await SubscriptionModel.findById(id);

      if (!subscription) {
        return res.status(404).json({
          error: 'Assinatura não encontrada'
        });
      }

      // Verificar se é o dono
      if (subscription.user_id !== userId) {
        return res.status(403).json({
          error: 'Você só pode pausar sua própria assinatura'
        });
      }

      // Verificar se está ativa
      if (subscription.status !== 'ativa') {
        return res.status(400).json({
          error: `Assinatura já está ${subscription.status}`
        });
      }

      const updated = await SubscriptionModel.updateStatus(id, 'pausada');

      res.json({
        message: 'Assinatura pausada com sucesso',
        subscription: updated
      });
    } catch (error) {
      console.error('Erro ao pausar assinatura:', error);
      res.status(500).json({
        error: 'Erro ao pausar assinatura',
        details: error.message
      });
    }
  }

  /**
   * Reativar assinatura pausada
   * PUT /api/subscriptions/:id/resume
   */
  static async resumeSubscription(req, res) {
    try {
      const { id } = req.params;
      const { userId, userType } = req.user;

      if (userType !== 'cliente') {
        return res.status(403).json({
          error: 'Apenas clientes podem reativar assinaturas'
        });
      }

      const subscription = await SubscriptionModel.findById(id);

      if (!subscription) {
        return res.status(404).json({
          error: 'Assinatura não encontrada'
        });
      }

      if (subscription.user_id !== userId) {
        return res.status(403).json({
          error: 'Você só pode reativar sua própria assinatura'
        });
      }

      if (subscription.status !== 'pausada') {
        return res.status(400).json({
          error: `Assinatura está ${subscription.status}, não pode ser reativada`
        });
      }

      const updated = await SubscriptionModel.updateStatus(id, 'ativa');

      res.json({
        message: 'Assinatura reativada com sucesso',
        subscription: updated
      });
    } catch (error) {
      console.error('Erro ao reativar assinatura:', error);
      res.status(500).json({
        error: 'Erro ao reativar assinatura',
        details: error.message
      });
    }
  }

  /**
   * Cancelar assinatura
   * PUT /api/subscriptions/:id/cancel
   */
  static async cancelSubscription(req, res) {
    try {
      const { id } = req.params;
      const { userId, userType } = req.user;

      if (userType !== 'cliente') {
        return res.status(403).json({
          error: 'Apenas clientes podem cancelar assinaturas'
        });
      }

      const subscription = await SubscriptionModel.findById(id);

      if (!subscription) {
        return res.status(404).json({
          error: 'Assinatura não encontrada'
        });
      }

      if (subscription.user_id !== userId) {
        return res.status(403).json({
          error: 'Você só pode cancelar sua própria assinatura'
        });
      }

      if (subscription.status === 'cancelada') {
        return res.status(400).json({
          error: 'Assinatura já está cancelada'
        });
      }

      const updated = await SubscriptionModel.updateStatus(id, 'cancelada');

      res.json({
        message: 'Assinatura cancelada com sucesso',
        subscription: updated
      });
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      res.status(500).json({
        error: 'Erro ao cancelar assinatura',
        details: error.message
      });
    }
  }
}

export default SubscriptionController;
