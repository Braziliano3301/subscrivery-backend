import jwt from 'jsonwebtoken';

// Middleware para verificar token JWT
export const authMiddleware = (req, res, next) => {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adicionar dados do usuário na requisição
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar se usuário é fornecedor
export const isSupplier = (req, res, next) => {
  if (req.user.userType !== 'fornecedor') {
    return res.status(403).json({ 
      error: 'Acesso negado. Apenas fornecedores podem acessar este recurso.' 
    });
  }
  next();
};

// Middleware para verificar se usuário é cliente
export const isClient = (req, res, next) => {
  if (req.user.userType !== 'cliente') {
    return res.status(403).json({ 
      error: 'Acesso negado. Apenas clientes podem acessar este recurso.' 
    });
  }
  next();
};
