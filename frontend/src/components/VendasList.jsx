import React, { useState, useEffect } from 'react';
import { vendasAPI } from '../services/api';
import './VendasList.css';

const VendasList = () => {
  const [vendas, setVendas] = useState([]);
  const [vendaDetalhada, setVendaDetalhada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVendas();
  }, []);

  const loadVendas = async () => {
    setLoading(true);
    try {
      const response = await vendasAPI.getAll();
      setVendas(response.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verDetalhes = async (vendaId) => {
    setLoading(true);
    try {
      const response = await vendasAPI.getById(vendaId);
      setVendaDetalhada(response.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta venda?')) {
      setLoading(true);
      try {
        await vendasAPI.delete(id);
        alert('Venda deletada com sucesso!');
        await loadVendas();
        setVendaDetalhada(null);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading && vendas.length === 0) {
    return (
      <div className="vendas-container">
        <div className="loading-modern-vendas">
          <div className="loading-spinner-modern-vendas"></div>
          <p>Carregando histórico de vendas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vendas-container">
      <div className="vendas-header">
        <h2 className="vendas-title">Histórico de Vendas</h2>
      </div>
      
      {error && (
        <div className="alert-modern-vendas alert-error-modern-vendas">
          {error}
        </div>
      )}

      <div className="table-container-vendas">
        <table className="table-modern-vendas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda) => (
              <tr key={venda.id}>
                <td>
                  <span className="venda-id">#{venda.id}</span>
                </td>
                <td>
                  <span className="venda-cliente">{venda.cliente_nome}</span>
                </td>
                <td>
                  <span className="venda-total">{formatPrice(venda.total)}</span>
                </td>
                <td>
                  <span className="venda-data">{formatDate(venda.data_venda)}</span>
                </td>
                <td>
                  <div className="actions-cell-vendas">
                    <button 
                      className="btn-view-modern" 
                      onClick={() => verDetalhes(venda.id)}
                    >
                      Detalhes
                    </button>
                    <button 
                      className="btn-delete-vendas" 
                      onClick={() => handleDelete(venda.id)}
                    >
                      Deletar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vendas.length === 0 && !loading && (
        <div className="empty-state-vendas">
          <div className="empty-state-icon-vendas">📈</div>
          <div className="empty-state-text-vendas">Nenhuma venda encontrada</div>
          <div className="empty-state-subtext-vendas">
            Registre a primeira venda na aba "Nova Venda"
          </div>
        </div>
      )}
      )}

      {/* Modal de Detalhes da Venda */}
      {vendaDetalhada && (
        <div className="venda-details">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ color: '#3498db', margin: 0 }}>
              🔍 Detalhes da Venda #{vendaDetalhada.id}
            </h4>
            <button 
              className="btn-cancel-modern" 
              onClick={() => setVendaDetalhada(null)}
            >
              ✕ Fechar
            </button>
          </div>
          
          <div style={{ 
            padding: '20px',
            background: 'white',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>
              🧑‍💼 Informações do Cliente (Relacionamento 1:N)
            </h4>
            <p><strong>Nome:</strong> {vendaDetalhada.cliente_nome}</p>
            <p><strong>Email:</strong> {vendaDetalhada.cliente_email}</p>
            <p><strong>Telefone:</strong> {vendaDetalhada.cliente_telefone || 'Não informado'}</p>
            <p><strong>Data da Venda:</strong> {formatDate(vendaDetalhada.data_venda)}</p>
          </div>

          <h4 style={{ marginBottom: '15px', color: '#8e44ad' }}>
            📦 Produtos da Venda (Relacionamento N:N)
          </h4>
          <table className="produtos-venda-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Preço Unitário</th>
                <th>Quantidade</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {vendaDetalhada.produtos?.map((produto) => (
                <tr key={produto.id}>
                  <td><strong>{produto.nome}</strong></td>
                  <td>{formatPrice(produto.preco_unitario)}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {produto.quantidade}
                  </td>
                  <td style={{ fontWeight: 'bold', color: '#27ae60' }}>
                    {formatPrice(produto.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '1.5rem',
            margin: '20px 0'
          }}>
            🎯 Total da Venda: {formatPrice(vendaDetalhada.total)}
          </div>
          
          <div style={{ 
            padding: '15px',
            background: '#e8f5e8',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#2d5a2d'
          }}>
            <strong>✅ Relacionamentos demonstrados nesta venda:</strong><br/>
            • <strong>1:N:</strong> Cliente "{vendaDetalhada.cliente_nome}" possui esta venda<br/>
            • <strong>N:N:</strong> Esta venda contém {vendaDetalhada.produtos?.length || 0} produto(s) diferentes
          </div>
        </div>
      )}
    </div>
  );
};

export default VendasList;