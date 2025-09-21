import React, { useState, useEffect } from 'react';
import { produtosAPI } from '../services/api';

const ProdutosList = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ nome: '', preco: '', estoque: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    setLoading(true);
    try {
      const response = await produtosAPI.getAll();
      setProdutos(response.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        nome: formData.nome,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque)
      };

      if (editingId) {
        await produtosAPI.update(editingId, data);
        alert('Produto atualizado com sucesso!');
      } else {
        await produtosAPI.create(data);
        alert('Produto criado com sucesso!');
      }
      
      setFormData({ nome: '', preco: '', estoque: '' });
      setEditingId(null);
      setShowForm(false);
      await loadProdutos();
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (produto) => {
    setFormData({
      nome: produto.nome,
      preco: produto.preco.toString(),
      estoque: produto.estoque.toString()
    });
    setEditingId(produto.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      setLoading(true);
      try {
        await produtosAPI.delete(id);
        alert('Produto deletado com sucesso!');
        await loadProdutos();
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', preco: '', estoque: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading && produtos.length === 0) {
    return <div className="loading">Carregando produtos...</div>;
  }

  return (
    <div className="card">
      <h2>⚡ Gerenciar Produtos</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Novo Produto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label>Nome *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Preço *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Estoque *</label>
            <input
              type="number"
              min="0"
              value={formData.estoque}
              onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-success" disabled={loading}>
            {editingId ? 'Atualizar' : 'Criar'} Produto
          </button>
          
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancelar
          </button>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.id}</td>
              <td>{produto.nome}</td>
              <td>{formatPrice(produto.preco)}</td>
              <td>
                <span style={{ 
                  color: produto.estoque <= 5 ? '#e74c3c' : '#27ae60',
                  fontWeight: produto.estoque <= 5 ? 'bold' : 'normal'
                }}>
                  {produto.estoque}
                  {produto.estoque <= 5 && ' ⚠️'}
                </span>
              </td>
              <td>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleEdit(produto)}
                  style={{ marginRight: '0.5rem' }}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(produto.id)}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {produtos.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#7f8c8d', marginTop: '1rem' }}>
          Nenhum produto encontrado
        </p>
      )}
    </div>
  );
};

export default ProdutosList;