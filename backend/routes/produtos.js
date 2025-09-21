const express = require('express');
const Produto = require('../models/Produto');
const router = express.Router();

// GET /api/produtos - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.getAll();
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/produtos/:id - Buscar produto por ID
router.get('/:id', async (req, res) => {
  try {
    const produto = await Produto.getById(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/produtos - Criar novo produto
router.post('/', async (req, res) => {
  try {
    const { nome, preco, estoque } = req.body;
    
    if (!nome || !preco || estoque === undefined) {
      return res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios' });
    }

    const produto = await Produto.create({ nome, preco, estoque });
    res.status(201).json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/produtos/:id - Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const { nome, preco, estoque } = req.body;
    
    if (!nome || !preco || estoque === undefined) {
      return res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios' });
    }

    const produto = await Produto.update(req.params.id, { nome, preco, estoque });
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/produtos/:id - Deletar produto
router.delete('/:id', async (req, res) => {
  try {
    const sucesso = await Produto.delete(req.params.id);
    if (!sucesso) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;