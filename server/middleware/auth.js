import jwt from 'jsonwebtoken';

export default function(req, res, next) {
  // Get token from header or cookie
  const token = req.header('x-auth-token') || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
