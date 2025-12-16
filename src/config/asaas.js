import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Cliente Asaas para sandbox
 * Documentação: https://docs.asaas.com
 */
class AsaasClient {
  constructor() {
    this.apiKey = process.env.ASAAS_API_KEY;
    this.baseURL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
    
    if (!this.apiKey) {
      throw new Error('ASAAS_API_KEY não configurada nas variáveis de ambiente');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'access_token': this.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Cria um cliente (pessoa física ou jurídica)
   */
  async createCustomer({ name, email, document, mobilePhone }) {
    try {
      const response = await this.client.post('/customers', {
        name,
        email,
        document,
        mobilePhone,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lista clientes com filtros
   */
  async listCustomers(filters = {}) {
    try {
      const response = await this.client.get('/customers', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cria uma cobrança/fatura
   */
  async createPayment({
    customerId,
    billingType = 'CREDIT_CARD',
    value,
    description,
    dueDate,
  }) {
    try {
      const response = await this.client.post('/payments', {
        customer: customerId,
        billingType,
        value,
        description,
        dueDate,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Busca uma cobrança pelo ID
   */
  async getPayment(paymentId) {
    try {
      const response = await this.client.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lista cobranças com filtros
   */
  async listPayments(filters = {}) {
    try {
      const response = await this.client.get('/payments', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cria uma assinatura/plano
   */
  async createSubscription({
    customerId,
    billingType = 'CREDIT_CARD',
    value,
    nextDueDate,
    description,
    cycle = 'MONTHLY',
  }) {
    try {
      const response = await this.client.post('/subscriptions', {
        customer: customerId,
        billingType,
        value,
        nextDueDate,
        description,
        cycle,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Busca uma assinatura pelo ID
   */
  async getSubscription(subscriptionId) {
    try {
      const response = await this.client.get(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cancela uma assinatura
   */
  async cancelSubscription(subscriptionId) {
    try {
      const response = await this.client.delete(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Trata erros da API Asaas
   */
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.errors?.[0]?.description || data?.message || 'Erro desconhecido';
      
      const customError = new Error(errorMessage);
      customError.status = status;
      customError.asaasError = data;
      return customError;
    }
    return error;
  }
}

export default new AsaasClient();
