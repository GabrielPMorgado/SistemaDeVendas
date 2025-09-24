import React, { useState, useEffect } from 'react';
import { produtosAPI } from '../services/api';
import './ProdutosList.css';

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

  const getStockStatus = (estoque) => {
    if (estoque <= 5) return { class: 'stock-low', icon: '⚠️', text: 'Baixo' };
    if (estoque <= 20) return { class: 'stock-medium', icon: '📦', text: 'Médio' };
    return { class: 'stock-normal', icon: '✅', text: 'Bom' };
  };

  const getStatistics = () => {
    const total = produtos.length;
    const lowStock = produtos.filter(p => p.estoque <= 5).length;
    const totalValue = produtos.reduce((sum, p) => sum + (p.preco * p.estoque), 0);
    const totalItems = produtos.reduce((sum, p) => sum + p.estoque, 0);
    
    return { total, lowStock, totalValue, totalItems };
  };

  const stats = getStatistics();

  if (loading && produtos.length === 0) {
    return (
      <div className="produtos-container">
        <div className="loading-modern">
          <div className="loading-spinner-modern"></div>
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="produtos-container fade-in">
      <div className="produtos-header">
        <h1 className="produtos-title">Gerenciar Produtos</h1>
        <button 
          className="add-product-btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✖ Cancelar' : '➕ Novo Produto'}
        </button>
      </div>
      
      {error && (
        <div className="alert-modern alert-error-modern">
          {error}
        </div>
      )}

      {produtos.length > 0 && (
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Produtos</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <div className="stat-number">{stats.lowStock}</div>
              <div className="stat-label">Estoque Baixo</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">{formatPrice(stats.totalValue)}</div>
              <div className="stat-label">Valor Total</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalItems}</div>
              <div className="stat-label">Itens Total</div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="form-container fade-in">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group-modern">
                <label>📦 Nome do Produto *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Digite o nome do produto"
                  required
                />
              </div>
              
              <div className="form-group-modern">
                <label>💰 Preço (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="form-group-modern">
                <label>📊 Quantidade em Estoque *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.estoque}
                  onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn-modern btn-cancel-modern" onClick={resetForm}>
                Cancelar
              </button>
              <button type="submit" className="btn-modern btn-success-modern" disabled={loading}>
                {loading ? '⏳ Processando...' : (editingId ? '✏️ Atualizar' : '➕ Criar')} Produto
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="table-modern">
          <thead>
            <tr>
              <th>🆔 ID</th>
              <th>📦 Produto</th>
              <th>💰 Preço</th>
              <th>📊 Estoque</th>
              <th>⚙️ Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => {
              const stockStatus = getStockStatus(produto.estoque);
              return (
                <tr key={produto.id}>
                  <td>
                    <span className="product-id">#{produto.id}</span>
                  </td>
                  <td>
                    <span className="product-name">{produto.nome}</span>
                  </td>
                  <td>
                    <span className="product-price">{formatPrice(produto.preco)}</span>
                  </td>
                  <td>
                    <span className={`stock-badge ${stockStatus.class}`}>
                      {stockStatus.icon} {produto.estoque} unidades
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="btn-action btn-edit" 
                        onClick={() => handleEdit(produto)}
                        title="Editar produto"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn-action btn-delete" 
                        onClick={() => handleDelete(produto.id)}
                        title="Deletar produto"
                      >
                        🗑️ Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {produtos.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3 className="empty-state-text">Nenhum produto cadastrado</h3>
          <p className="empty-state-subtext">
            Clique em "Novo Produto" para começar a gerenciar seu estoque
          </p>
        </div>
      )}
    </div>
  );
};

export default ProdutosList;