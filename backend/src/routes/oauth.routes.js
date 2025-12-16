import { Router } from 'express';
import passport from 'passport';
//import { googleCallback } from '../controllers/oauth.controller.js';

const router = Router();

// Inicia login com Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Callback do Google
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login'
  }),

  (req, res) => {
    // Aqui o user já vem autenticado
    res.json({
      message: 'Login com Google realizado com sucesso',
      user: req.user
    });
  }
);

export default router;
