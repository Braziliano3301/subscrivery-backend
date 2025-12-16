// Template base
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌿 Subscrivery</h1>
  </div>
  <div class="content">
    ${content}
  </div>
  <div class="footer">
    <p>© 2025 Subscrivery - Conectando você aos melhores fornecedores locais</p>
    <p>Este é um email automático, por favor não responda.</p>
  </div>
</body>
</html>
`;

// 1. Email de Boas-vindas
export const welcomeEmail = (userName) => {
  const content = `
    <h2>Bem-vindo(a), ${userName}! 🎉</h2>
    <p>Estamos muito felizes em ter você conosco!</p>
    <p>Sua conta foi criada com sucesso. Agora você pode:</p>
    <ul>
      <li>✨ Explorar nossos fornecedores parceiros</li>
      <li>📦 Fazer pedidos com créditos da assinatura</li>
      <li>💳 Gerenciar seus pagamentos</li>
      <li>📊 Acompanhar seu histórico</li>
    </ul>
    <p>Estamos aqui para tornar suas compras mais fáceis e sustentáveis!</p>
    <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Acessar Dashboard</a>
  `;
  
  return {
    subject: '🎉 Bem-vindo ao Subscrivery!',
    html: baseTemplate(content),
    text: `Bem-vindo, ${userName}! Sua conta foi criada com sucesso.`
  };
};

// 2. Email de Recuperação de Senha
export const forgotPasswordEmail = (userName, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const content = `
    <h2>Recuperação de Senha</h2>
    <p>Olá, ${userName}!</p>
    <p>Recebemos uma solicitação para redefinir sua senha.</p>
    <p>Clique no botão abaixo para criar uma nova senha:</p>
    <a href="${resetLink}" class="button">Redefinir Senha</a>
    <p><small>Este link expira em 1 hora.</small></p>
    <p>Se você não solicitou esta alteração, ignore este email.</p>
    <hr>
    <p><small>Ou copie e cole este link no navegador:</small></p>
    <p style="font-size: 12px; word-break: break-all;">${resetLink}</p>
  `;
  
  return {
    subject: '🔐 Recuperação de Senha - Subscrivery',
    html: baseTemplate(content),
    text: `Olá ${userName}, use este link para redefinir sua senha: ${resetLink}`
  };
};

// 3. Email de Pedido Criado (Cliente)
export const orderCreatedClientEmail = (userName, order, supplierName) => {
  const content = `
    <h2>Pedido Confirmado! 🎉</h2>
    <p>Olá, ${userName}!</p>
    <p>Seu pedido foi criado com sucesso.</p>
    
    <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>Detalhes do Pedido</h3>
      <p><strong>Pedido:</strong> #${order.id.substring(0, 8)}</p>
      <p><strong>Fornecedor:</strong> ${supplierName}</p>
      <p><strong>Total:</strong> R$ ${parseFloat(order.total_amount).toFixed(2)}</p>
      <p><strong>Data de Entrega:</strong> ${new Date(order.delivery_date).toLocaleDateString('pt-BR')}</p>
      <p><strong>Status:</strong> ${order.status === 'pendente' ? 'Aguardando Confirmação' : order.status}</p>
    </div>
    
    <p>Você será notificado quando o fornecedor confirmar o pedido.</p>
    <a href="${process.env.FRONTEND_URL}/orders/${order.id}" class="button">Ver Pedido</a>
  `;
  
  return {
    subject: `✅ Pedido Confirmado - Subscrivery`,
    html: baseTemplate(content),
    text: `Pedido #${order.id} criado com sucesso. Total: R$ ${order.total_amount}`
  };
};

// 4. Email de Pedido Recebido (Fornecedor)
export const orderReceivedSupplierEmail = (supplierName, order, clientName) => {
  const content = `
    <h2>Novo Pedido Recebido! 📦</h2>
    <p>Olá, ${supplierName}!</p>
    <p>Você recebeu um novo pedido.</p>
    
    <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>Detalhes do Pedido</h3>
      <p><strong>Pedido:</strong> #${order.id.substring(0, 8)}</p>
      <p><strong>Cliente:</strong> ${clientName}</p>
      <p><strong>Total:</strong> R$ ${parseFloat(order.total_amount).toFixed(2)}</p>
      <p><strong>Data de Entrega:</strong> ${new Date(order.delivery_date).toLocaleDateString('pt-BR')}</p>
      <p><strong>Items:</strong> ${order.items ? order.items.length : 0} produto(s)</p>
    </div>
    
    <p>Por favor, confirme o pedido o quanto antes.</p>
    <a href="${process.env.FRONTEND_URL}/supplier/orders/${order.id}" class="button">Ver Pedido</a>
  `;
  
  return {
    subject: `📦 Novo Pedido Recebido - Subscrivery`,
    html: baseTemplate(content),
    text: `Novo pedido #${order.id} de ${clientName}. Total: R$ ${order.total_amount}`
  };
};

// 5. Email de Pagamento Aprovado
export const paymentApprovedEmail = (userName, payment, subscription) => {
  const content = `
    <h2>Pagamento Aprovado! 💚</h2>
    <p>Olá, ${userName}!</p>
    <p>Seu pagamento foi aprovado com sucesso.</p>
    
    <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>Detalhes do Pagamento</h3>
      <p><strong>Valor:</strong> R$ ${parseFloat(payment.amount).toFixed(2)}</p>
      <p><strong>Método:</strong> ${payment.payment_method === 'pix' ? 'PIX' : payment.payment_method}</p>
      <p><strong>Data:</strong> ${new Date(payment.created_at).toLocaleDateString('pt-BR')}</p>
      ${subscription ? `<p><strong>Plano:</strong> ${subscription.plan_name}</p>` : ''}
    </div>
    
    <p>Seus créditos já estão disponíveis para uso!</p>
    <a href="${process.env.FRONTEND_URL}/payments" class="button">Ver Histórico</a>
  `;
  
  return {
    subject: `✅ Pagamento Aprovado - Subscrivery`,
    html: baseTemplate(content),
    text: `Pagamento de R$ ${payment.amount} aprovado com sucesso!`
  };
};

// 6. Email de Senha Redefinida (Confirmação)
export const passwordResetConfirmationEmail = (userName) => {
  const content = `
    <h2>Senha Alterada com Sucesso ✅</h2>
    <p>Olá, ${userName}!</p>
    <p>Sua senha foi alterada com sucesso.</p>
    <p>Se você não realizou esta alteração, entre em contato conosco imediatamente.</p>
    <a href="${process.env.FRONTEND_URL}/login" class="button">Fazer Login</a>
  `;
  
  return {
    subject: '✅ Senha Alterada - Subscrivery',
    html: baseTemplate(content),
    text: `Sua senha foi alterada com sucesso.`
  };
};
