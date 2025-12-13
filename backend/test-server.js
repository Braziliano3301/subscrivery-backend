import express from 'express';

const app = express();
const PORT = 3000;

app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor de teste funcionando!' });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Servidor de teste rodando na porta ${PORT}`);
  console.log(`🔗 Teste: http://localhost:${PORT}/test`);
});
