const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.admin = admin;  // Attach admin info to the request
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = adminMiddleware;
