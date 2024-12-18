import authController from '../../controller/authController/index.js';
import passport from 'passport';

const authRoute = (app) => {
  app.post('/signUp', authController.signUp);
  app.post('/login', authController.login);

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
    (req, res) => {
      const message = req.authInfo?.message || 'Authentication successful';
      res.status(200).json({ message, user: req.user });
    }
  );
  

  app.post('/verify-token', authController.verifyToken);
};

export default authRoute;
