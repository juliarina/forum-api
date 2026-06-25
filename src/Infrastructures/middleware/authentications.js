import AuthenticationTokenManager from '../../Applications/security/AuthenticationTokenManager.js';

const authenticateToken = (container) => async (req, res, next) => {
  const token = req.headers.authorization;

  if (token && token.indexOf('Bearer ') !== -1) {
    try {
      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      const user = await tokenManager.verifyAccessToken(token.split('Bearer ')[1]);
      req.user = user;
      return next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        status: 'fail',
        message: 'token tidak valid',
      });
    }
  }

  return res.status(401).json({
    status: 'fail',
    message: 'Missing authentication',
  });
};

export default authenticateToken;