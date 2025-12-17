import axios from 'axios';
import ASAAS_CONFIG from '../config/asaas.js';

class AsaasService {
  constructor() {
    this.client = axios.create({
      baseURL: ASAAS_CONFIG.API_URL,
      headers: {
        'access_token': ASAAS_CONFIG.API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    // Interceptor para tratamento de erros
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('Erro Asaas:', error.response?.data || error.message);
        throw new Error(error.response?.data?.errors?.[0]?.detail || error.message);
      }
    );
  }

  // ===================== CLIENTES =====================
  
  /**
   * Criar cliente no Asaas
   * @param {Object} customerData - Dados do cliente
   * @returns {Promise<Object>} Cliente criado
   */
  async createCustomer(customerData) {
    try {
      const response = await this.client.post('/customers', {
        name: customerData.name,
        email: customerData.email,
        cpfCnpj: customerData.cpfCnpj, // Remover caracteres especiais
        phone: customerData.phone,
        mobilePhone: customerData.mobilePhone,
        addressStreet: customerData.addressStreet,
        addressNumber: customerData.addressNumber,
        addressComplement: customerData.addressComplement,
        addressCity: customerData.addressCity,
        addressState: customerData.addressState,
        addressPostalCode: customerData.addressPostalCode,
        groupName: 'Subscrivery', // Agrupar clientes
        externalReference: customerData.externalReference || null // ID do cliente no seu sistema
      });
      
      console.log(`✅ Cliente criado no Asaas: ${response.data.id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error.message);
      throw error;
    }
  }

  /**
   * Obter cliente pelo ID
   * @param {String} customerId - ID do cliente no Asaas
   * @returns {Promise<Object>} Dados do cliente
   */
  async getCustomer(customerId) {
    try {
      const response = await this.client.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter cliente:', error.message);
      throw error;
    }
  }

  /**
   * Listar clientes
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Object>} Lista de clientes
   */
  async listCustomers(filters = {}) {
    try {
      const response = await this.client.get('/customers', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar clientes:', error.message);
      throw error;
    }
  }

  /**
   * Atualizar cliente
   * @param {String} customerId - ID do cliente
   * @param {Object} updateData - Dados a atualizar
   * @returns {Promise<Object>} Cliente atualizado
   */
  async updateCustomer(customerId, updateData) {
    try {
      const response = await this.client.post(`/customers/${customerId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error.message);
      throw error;
    }
  }

  // ===================== COBRANÇAS (INVOICES) =====================
  
  /**
   * Criar cobrança única
   * @param {Object} chargeData - Dados da cobrança
   * @returns {Promise<Object>} Cobrança criada
   */
  async createCharge(chargeData) {
    try {
      const payload = {
        customer: chargeData.customerId,
        billingType: chargeData.billingType || 'PIX', // PIX, BOLETO, CREDIT_CARD, DEBIT_CARD
        value: chargeData.value,
        dueDate: chargeData.dueDate,
        description: chargeData.description || 'Assinatura Subscrivery',
        externalReference: chargeData.externalReference || null,
        installmentCount: chargeData.installmentCount || 1,
        installmentValue: chargeData.installmentValue || null,
        discount: chargeData.discount || null,
        interest: chargeData.interest || null,
        fine: chargeData.fine || null,
        url: chargeData.url || null,
        remoteIp: chargeData.remoteIp || null
      };
      
      const response = await this.client.post('/payments', payload);
      console.log(`✅ Cobrança criada: ${response.data.id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cobrança:', error.message);
      throw error;
    }
  }

  /**
   * Obter detalhes de uma cobrança
   * @param {String} chargeId - ID da cobrança
   * @returns {Promise<Object>} Dados da cobrança
   */
  async getCharge(chargeId) {
    try {
      const response = await this.client.get(`/payments/${chargeId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter cobrança:', error.message);
      throw error;
    }
  }

  /**
   * Listar cobranças
   * @param {Object} filters - Filtros
   * @returns {Promise<Object>} Lista de cobranças
   */
  async listCharges(filters = {}) {
    try {
      const response = await this.client.get('/payments', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar cobranças:', error.message);
      throw error;
    }
  }

  /**
   * Atualizar cobrança
   * @param {String} chargeId - ID da cobrança
   * @param {Object} updateData - Dados a atualizar
   * @returns {Promise<Object>} Cobrança atualizada
   */
  async updateCharge(chargeId, updateData) {
    try {
      const response = await this.client.post(`/payments/${chargeId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar cobrança:', error.message);
      throw error;
    }
  }

  /**
   * Confirmar recebimento de cobrança (após receber notificação)
   * @param {String} chargeId - ID da cobrança
   * @returns {Promise<Object>} Cobrança confirmada
   */
  async confirmCharge(chargeId) {
    try {
      const response = await this.client.post(`/payments/${chargeId}/confirm`);
      return response.data;
    } catch (error) {
      console.error('Erro ao confirmar cobrança:', error.message);
      throw error;
    }
  }

  /**
   * Refundar cobrança
   * @param {String} chargeId - ID da cobrança
   * @param {Object} refundData - Dados do reembolso
   * @returns {Promise<Object>} Reembolso processado
   */
  async refundCharge(chargeId, refundData = {}) {
    try {
      const payload = {
        refundAmount: refundData.amount || null // Se null, reembolsa o valor total
      };
      
      const response = await this.client.post(`/payments/${chargeId}/refund`, payload);
      console.log(`✅ Reembolso processado: ${response.data.id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao reembolsar cobrança:', error.message);
      throw error;
    }
  }

  // ===================== ASSINATURAS (SUBSCRIPTIONS) =====================
  
  /**
   * Criar assinatura recorrente
   * @param {Object} subscriptionData - Dados da assinatura
   * @returns {Promise<Object>} Assinatura criada
   */
  async createSubscription(subscriptionData) {
    try {
      const payload = {
        customer: subscriptionData.customerId,
        billingType: subscriptionData.billingType || 'PIX',
        value: subscriptionData.value,
        cycle: subscriptionData.cycle || 'MONTHLY', // WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL
        description: subscriptionData.description || 'Assinatura Subscrivery',
        nextDueDate: subscriptionData.nextDueDate,
        externalReference: subscriptionData.externalReference || null,
        discount: subscriptionData.discount || null,
        interest: subscriptionData.interest || null,
        fine: subscriptionData.fine || null,
        maxPayments: subscriptionData.maxPayments || null, // null = infinita
        notificationUrl: subscriptionData.notificationUrl || null,
        remoteIp: subscriptionData.remoteIp || null
      };
      
      const response = await this.client.post('/subscriptions', payload);
      console.log(`✅ Assinatura criada: ${response.data.id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar assinatura:', error.message);
      throw error;
    }
  }

  /**
   * Obter assinatura
   * @param {String} subscriptionId - ID da assinatura
   * @returns {Promise<Object>} Dados da assinatura
   */
  async getSubscription(subscriptionId) {
    try {
      const response = await this.client.get(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter assinatura:', error.message);
      throw error;
    }
  }

  /**
   * Atualizar assinatura
   * @param {String} subscriptionId - ID da assinatura
   * @param {Object} updateData - Dados a atualizar
   * @returns {Promise<Object>} Assinatura atualizada
   */
  async updateSubscription(subscriptionId, updateData) {
    try {
      const response = await this.client.post(`/subscriptions/${subscriptionId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error.message);
      throw error;
    }
  }

  /**
   * Cancelar assinatura
   * @param {String} subscriptionId - ID da assinatura
   * @returns {Promise<Object>} Assinatura cancelada
   */
  async cancelSubscription(subscriptionId) {
    try {
      const response = await this.client.delete(`/subscriptions/${subscriptionId}`);
      console.log(`✅ Assinatura cancelada: ${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error.message);
      throw error;
    }
  }

  /**
   * Listar assinaturas
   * @param {Object} filters - Filtros
   * @returns {Promise<Object>} Lista de assinaturas
   */
  async listSubscriptions(filters = {}) {
    try {
      const response = await this.client.get('/subscriptions', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar assinaturas:', error.message);
      throw error;
    }
  }

  // ===================== UTILIDADES =====================
  
  /**
   * Formatar CPF/CNPJ removendo caracteres especiais
   * @param {String} document - CPF ou CNPJ
   * @returns {String} Documento formatado
   */
  static formatDocument(document) {
    return document.replace(/\D/g, '');
  }

  /**
   * Gerar data de vencimento
   * @param {Number} daysFromNow - Dias a partir de hoje
   * @returns {String} Data em formato YYYY-MM-DD
   */
  static generateDueDate(daysFromNow = 3) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  }

  /**
   * Verificar se ambiente é sandbox
   * @returns {Boolean}
   */
  static isSandbox() {
    return ASAAS_CONFIG.ENVIRONMENT === 'sandbox';
  }
}

export default new AsaasService();
