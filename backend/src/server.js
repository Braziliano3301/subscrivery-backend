import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import planRoutes from './routes/plan.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import orderRoutes from './routes/order.routes.js';

import passport from './config/passport.js';
import oauthRoutes from './routes/oauth.routes.js';


// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Configuração de CORS dinâmica (desenvolvimento vs produção)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL  // Em produção: apenas frontend autorizado
    : '*',                       // Em desenvolvimento: qualquer origem
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (test-api.html)
app.use(express.static('.'));

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Subscrivery API está rodando',
    timestamp: new Date().toISOString()
  });
});

// Rota de status detalhado (para monitoramento)
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Subscrivery Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      suppliers: '/api/suppliers',
      plans: '/api/plans',
      subscriptions: '/api/subscriptions',
      orders: '/api/orders',
      payments: '/api/payments',
      docs: '/api-docs'
    }
  });
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Subscrivery API Docs'
}));

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de OAuth
app.use(passport.initialize());
app.use('/api/oauth', oauthRoutes);

// Rotas de fornecedores
app.use('/api/suppliers', supplierRoutes);

// Rotas de planos
app.use('/api/plans', planRoutes);

// Rotas de assinaturas
app.use('/api/subscriptions', subscriptionRoutes);

// Rotas de pedidos
app.use('/api/orders', orderRoutes);

// Rotas de pagamentos
app.use('/api/payments', paymentRoutes);


// Rotas de analytics
app.use('/api/analytics', analyticsRoutes);


// Tratamento de erro 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Servidor acessível externamente em 0.0.0.0:${PORT}`);
});

// Tratamento de erros do servidor
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso!`);
    process.exit(1);
  } else {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});


