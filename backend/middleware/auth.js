const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso não fornecido' 
      });
    }

    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    // Buscar o usuário no banco de dados
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado' 
      });
    }

    // Adicionar informações do usuário ao request
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        error: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        error: 'Token expirado' 
      });
    }
    
    return res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

// Middleware para verificar se o usuário é admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      error: 'Acesso negado. Privilégios de administrador necessários.' 
    });
  }
};

// Middleware opcional - não retorna erro se não houver token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Em caso de erro, apenas continua sem autenticação
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};