import SupplierModel from '../models/supplier.model.js';

class SupplierController {
  /**
   * Criar novo fornecedor
   * POST /api/suppliers
   */
  static async createSupplier(req, res) {
    try {
      const { userId, userType } = req.user;

      // Verificar se usuário é fornecedor
      if (userType !== 'fornecedor') {
        return res.status(403).json({
          error: 'Apenas usuários do tipo "fornecedor" podem criar perfil de fornecedor'
        });
      }

      // Verificar se já existe fornecedor para este usuário
      const existingSupplier = await SupplierModel.findByUserId(userId);
      if (existingSupplier) {
        return res.status(400).json({
          error: 'Você já possui um perfil de fornecedor cadastrado'
        });
      }

      const {
        business_name,
        cnpj,
        category,
        address,
        city,
        state,
        zip_code
      } = req.body;

      // Verificar se CNPJ já existe
      if (cnpj) {
        const existingCnpj = await SupplierModel.findByCnpj(cnpj);
        if (existingCnpj) {
          return res.status(400).json({
            error: 'CNPJ já cadastrado'
          });
        }
      }

      const supplierData = {
        user_id: userId,
        business_name,
        cnpj,
        category,
        address,
        city,
        state,
        zip_code
      };

      const supplier = await SupplierModel.create(supplierData);

      res.status(201).json({
        message: 'Fornecedor criado com sucesso',
        supplier
      });
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      res.status(500).json({
        error: 'Erro ao criar fornecedor',
        details: error.message
      });
    }
  }

  /**
   * Listar fornecedores com filtros
   * GET /api/suppliers?city=São Paulo&category=Alimentos&search=padaria&limit=10&offset=0
   */
  static async getSuppliers(req, res) {
    try {
      const { city, state, category, search, limit, offset } = req.query;

      const filters = {
        city,
        state,
        category,
        search,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0
      };

      const suppliers = await SupplierModel.findAll(filters);
      const total = await SupplierModel.count(filters);

      res.json({
        suppliers,
        pagination: {
          total,
          limit: filters.limit,
          offset: filters.offset,
          pages: Math.ceil(total / filters.limit)
        }
      });
    } catch (error) {
      console.error('Erro ao listar fornecedores:', error);
      res.status(500).json({
        error: 'Erro ao listar fornecedores',
        details: error.message
      });
    }
  }

  /**
   * Buscar fornecedor por ID
   * GET /api/suppliers/:id
   */
  static async getSupplierById(req, res) {
    try {
      const { id } = req.params;

      const supplier = await SupplierModel.findById(id);

      if (!supplier) {
        return res.status(404).json({
          error: 'Fornecedor não encontrado'
        });
      }

      res.json({ supplier });
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error);
      res.status(500).json({
        error: 'Erro ao buscar fornecedor',
        details: error.message
      });
    }
  }

  /**
   * Atualizar fornecedor (apenas o próprio)
   * PUT /api/suppliers/:id
   */
  static async updateSupplier(req, res) {
    try {
      const { id } = req.params;
      const { userId, userType } = req.user;

      // Verificar se é fornecedor
      if (userType !== 'fornecedor') {
        return res.status(403).json({
          error: 'Apenas fornecedores podem atualizar perfis'
        });
      }

      // Buscar fornecedor
      const supplier = await SupplierModel.findById(id);

      if (!supplier) {
        return res.status(404).json({
          error: 'Fornecedor não encontrado'
        });
      }

      // Verificar se é o dono do perfil
      if (supplier.user_id !== userId) {
        return res.status(403).json({
          error: 'Você só pode atualizar seu próprio perfil'
        });
      }

      const {
        business_name,
        category,
        address,
        city,
        state,
        zip_code
      } = req.body;

      const updateData = {
        business_name,
        category,
        address,
        city,
        state,
        zip_code
      };

      const updatedSupplier = await SupplierModel.update(id, updateData);

      res.json({
        message: 'Fornecedor atualizado com sucesso',
        supplier: updatedSupplier
      });
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      res.status(500).json({
        error: 'Erro ao atualizar fornecedor',
        details: error.message
      });
    }
  }

  /**
   * Deletar fornecedor (soft delete - apenas o próprio)
   * DELETE /api/suppliers/:id
   */
  static async deleteSupplier(req, res) {
    try {
      const { id } = req.params;
      const { userId, userType } = req.user;

      // Verificar se é fornecedor
      if (userType !== 'fornecedor') {
        return res.status(403).json({
          error: 'Apenas fornecedores podem deletar perfis'
        });
      }

      // Buscar fornecedor
      const supplier = await SupplierModel.findById(id);

      if (!supplier) {
        return res.status(404).json({
          error: 'Fornecedor não encontrado'
        });
      }

      // Verificar se é o dono do perfil
      if (supplier.user_id !== userId) {
        return res.status(403).json({
          error: 'Você só pode deletar seu próprio perfil'
        });
      }

      await SupplierModel.delete(id);

      res.json({
        message: 'Fornecedor removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar fornecedor:', error);
      res.status(500).json({
        error: 'Erro ao deletar fornecedor',
        details: error.message
      });
    }
  }

  /**
   * Buscar meu perfil de fornecedor
   * GET /api/suppliers/me
   */
  static async getMySupplierProfile(req, res) {
    try {
      const { userId, userType } = req.user;

      if (userType !== 'fornecedor') {
        return res.status(403).json({
          error: 'Apenas fornecedores podem acessar este endpoint'
        });
      }

      const supplier = await SupplierModel.findByUserId(userId);

      if (!supplier) {
        return res.status(404).json({
          error: 'Você ainda não criou um perfil de fornecedor'
        });
      }

      res.json({ supplier });
    } catch (error) {
      console.error('Erro ao buscar perfil de fornecedor:', error);
      res.status(500).json({
        error: 'Erro ao buscar perfil',
        details: error.message
      });
    }
  }
}

export default SupplierController;
