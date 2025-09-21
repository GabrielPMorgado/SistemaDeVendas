const express = require('express');
const Venda = require('../models/Venda');
const router = express.Router();

// GET /api/vendas - Listar todas as vendas
router.get('/', async (req, res) => {
  try {
    const vendas = await Venda.getAll();
    res.json(vendas);
  } catch (error) {
    console.error('Erro ao listar vendas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/vendas/:id - Buscar venda por ID com produtos
router.get('/:id', async (req, res) => {
  try {
    const venda = await Venda.getVendaComProdutos(req.params.id);
    if (!venda) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }
    res.json(venda);
  } catch (error) {
    console.error('Erro ao buscar venda:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/vendas - Criar nova venda
router.post('/', async (req, res) => {
  try {
    const { cliente_id, produtos } = req.body;
    
    if (!cliente_id || !produtos || !Array.isArray(produtos) || produtos.length === 0) {
      return res.status(400).json({ 
        error: 'Cliente e pelo menos um produto são obrigatórios' 
      });
    }

    // Validar estrutura dos produtos
    for (const produto of produtos) {
      if (!produto.produto_id || !produto.quantidade || !produto.preco_unitario) {
        return res.status(400).json({ 
          error: 'Cada produto deve ter produto_id, quantidade e preco_unitario' 
        });
      }
    }

    const venda = await Venda.create({ cliente_id, produtos });
    res.status(201).json(venda);
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(400).json({ error: 'Cliente ou produto não encontrado' });
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

// DELETE /api/vendas/:id - Deletar venda
router.delete('/:id', async (req, res) => {
  try {
    const sucesso = await Venda.delete(req.params.id);
    if (!sucesso) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }
    res.json({ message: 'Venda deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar venda:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;