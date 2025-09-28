const jwt = require('jsonwebtoken');

// Function to generate a token
const generateToken = (user) => {
    return jwt.sign({ userId: user.id, role: user.role }, 'bookStore123', { expiresIn: '1h' });
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }
  
    jwt.verify(token, "bookStore123", (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token expired or invalid. Please sign in again' });
      }
  
      console.log("Decoded JWT:", user);  // Check that user.id is accessible here
      req.user = user;  // Attach the decoded user (with id, username, role) to req.user
      next();
    });
  };

module.exports = { authenticateToken, generateToken };