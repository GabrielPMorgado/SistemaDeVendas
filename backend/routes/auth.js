const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validações básicas
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Username, email e password são obrigatórios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    // Verificar se o email já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'Email já está em uso'
      });
    }

    // Criar o usuário
    const newUser = await User.create({
      username,
      email,
      password,
      role: role || 'user'
    });

    // Gerar token JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      token
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Login do usuário
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e password são obrigatórios'
      });
    }

    // Buscar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar token atual
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    res.json({
      message: 'Token válido',
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Erro na verificação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Listar usuários (apenas admin)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      users
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Perfil do usuário atual
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        created_at: req.user.created_at
      }
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Logout (no backend, apenas uma rota informativa)
router.post('/logout', (req, res) => {
  res.json({
    message: 'Logout realizado com sucesso. Remova o token do cliente.'
  });
});

module.exports = router;