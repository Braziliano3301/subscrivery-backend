import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import pool from './database.js'; // ajuste se o caminho for outro

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // Verifica se usuário já existe
        const { rows } = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [email]
        );

        let user;

        if (rows.length === 0) {
          const result = await pool.query(
            `INSERT INTO users (email, name, user_type, password_hash)
             VALUES ($1, $2, 'cliente', 'google_oauth')
             RETURNING *`,
            [email, name]
          );
          user = result.rows[0];
        } else {
          user = rows[0];
        }

        const token = jwt.sign(
          { 
            id: user.id, 
            email: user.email,},
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return done(null, { user, token });
      } catch (error) {
        console.error('Erro no Google OAuth:', error);
        return done(error, null);
      }
    }
  )
);

export default passport;
