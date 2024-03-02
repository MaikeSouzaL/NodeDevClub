import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

export default (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({
      error: 'token not provided',
    });
  }
  const token = authToken.split(' ')[1];

  try {
    jwt.verify(token, authConfig.secret, function (err, decoded) {
      if (err) {
        throw new Error();
      }
      req.userId = decoded.id;
      req.userName = decoded.name;
      // console.log(decoded);
      return next();
    });
  } catch (error) {
    res.status(401).json({ erro: 'Token is invalid' });
  }
};
