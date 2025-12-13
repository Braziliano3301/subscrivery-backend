import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Subscrivery API',
      version: '1.0.0',
      description: 'API REST para plataforma de assinaturas de produtos locais - Gerenciamento de clientes, fornecedores, planos e assinaturas',
      contact: {
        name: 'Equipe Subscrivery',
        email: 'contato@subscrivery.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://subscrivery-api.railway.app',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido no endpoint de login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            phone: { type: 'string' },
            user_type: { type: 'string', enum: ['cliente', 'fornecedor'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Supplier: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            business_name: { type: 'string' },
            cnpj: { type: 'string' },
            category: { type: 'string', enum: ['supermercado', 'farmacia', 'petshop'] },
            address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string', minLength: 2, maxLength: 2 },
            zip_code: { type: 'string' },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Plan: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', format: 'decimal' },
            credit_amount: { type: 'number', format: 'decimal' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Subscription: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            plan_id: { type: 'string', format: 'uuid' },
            status: { type: 'string', enum: ['ativa', 'pausada', 'cancelada'] },
            start_date: { type: 'string', format: 'date' },
            next_billing_date: { type: 'string', format: 'date' },
            remaining_credit: { type: 'number', format: 'decimal' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'string' }
          }
        }
      }
    },
    tags: [
      { name: 'Autenticação', description: 'Endpoints de registro, login e perfil de usuários' },
      { name: 'Fornecedores', description: 'CRUD de fornecedores (supermercados, farmácias, petshops)' },
      { name: 'Planos', description: 'Listagem de planos de assinatura disponíveis' },
      { name: 'Assinaturas', description: 'Gerenciamento de assinaturas de clientes' }
    ]
  },
  apis: ['./src/routes/*.js'] // Caminho para os arquivos de rotas
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
