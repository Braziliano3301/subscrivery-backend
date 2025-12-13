import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import planRoutes from './routes/plan.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: '*', // Permitir todas as origens em desenvolvimento
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Subscrivery API está rodando',
    timestamp: new Date().toISOString()
  });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de fornecedores
app.use('/api/suppliers', supplierRoutes);

// Rotas de planos
app.use('/api/plans', planRoutes);

// Rotas de assinaturas
app.use('/api/subscriptions', subscriptionRoutes);

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
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
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
