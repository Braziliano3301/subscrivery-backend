import PlanModel from '../models/plan.model.js';

class PlanController {
  /**
   * Listar todos os planos de assinatura
   * GET /api/plans
   */
  static async getPlans(req, res) {
    try {
      const plans = await PlanModel.findAll();

      res.json({
        plans
      });
    } catch (error) {
      console.error('Erro ao listar planos:', error);
      res.status(500).json({
        error: 'Erro ao listar planos',
        details: error.message
      });
    }
  }

  /**
   * Buscar plano por ID
   * GET /api/plans/:id
   */
  static async getPlanById(req, res) {
    try {
      const { id } = req.params;

      const plan = await PlanModel.findById(id);

      if (!plan) {
        return res.status(404).json({
          error: 'Plano não encontrado'
        });
      }

      res.json({ plan });
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      res.status(500).json({
        error: 'Erro ao buscar plano',
        details: error.message
      });
    }
  }
}

export default PlanController;
