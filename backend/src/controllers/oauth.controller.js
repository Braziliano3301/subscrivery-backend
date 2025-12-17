import jwt from 'jsonwebtoken';

export const googleCallback = async (req, res) => {
  try {
    // O passport já colocou isso em req.user
    const { user, token } = req.user;
 // PROD: redireciona para o frontend
    return res.redirect(
      `${process.env.FRONTEND_URL}/oauth?token=${token}`
    );

  } catch (error) {
    console.error('Erro no callback do Google:', error);
    return res.status(500).json({ error: 'Erro ao autenticar com Google' });
  }
  
    /* // DEV: retorna JSON (útil para testes)
    if (process.env.NODE_ENV === 'development') {
      return res.json({
        message: 'Login com Google realizado com sucesso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type
        },
        token
      });
    }
 */
    
};
