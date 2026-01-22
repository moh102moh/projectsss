import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']; 
    if (!authHeader) 
      return res.status(401).json({ message: 'Authorization header missing' });

    const token = authHeader.split(' ')[1]; 
    if (!token) 
      return res.status(401).json({ message: 'Token missing' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(payload.id);
    if (!user)
      return res.status(401).json({ message: 'User not found' });

    req.user = user; 
    next();  
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'invalid token' });
  }
};


export const preimt = (...roles) => (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ message: 'Unauthorized' });

  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Forbidden' });

  next();
};


