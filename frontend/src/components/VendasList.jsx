import React, { useState, useEffect } from 'react';
import { vendasAPI } from '../services/api';

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
    return <div className="loading">⚡ Carregando histórico...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>⚡ Histórico de Vendas</h2>
        
        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>🧑‍💼 Cliente</th>
              <th>💰 Total</th>
              <th>📅 Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda) => (
              <tr key={venda.id}>
                <td>#{venda.id}</td>
                <td>{venda.cliente_nome}</td>
                <td style={{ fontWeight: 'bold', color: '#27ae60' }}>
                  {formatPrice(venda.total)}
                </td>
                <td>{formatDate(venda.data_venda)}</td>
                <td>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => verDetalhes(venda.id)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    🔍 Detalhes
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(venda.id)}
                  >
                    🗑️ Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {vendas.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            color: '#7f8c8d', 
            marginTop: '2rem',
            padding: '2rem',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>
              📈 Nenhuma venda encontrada
            </p>
            <p style={{ margin: '0.5rem 0 0 0' }}>
              Registre a primeira venda na aba "Nova Venda"
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes da Venda */}
      {vendaDetalhada && (
        <div className="card" style={{ marginTop: '1rem', border: '2px solid #3498db' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#3498db', margin: 0 }}>
              🔍 Detalhes da Venda #{vendaDetalhada.id}
            </h2>
            <button 
              className="btn btn-secondary" 
              onClick={() => setVendaDetalhada(null)}
            >
              ✕ Fechar
            </button>
          </div>
          
          <div style={{ 
            marginTop: '1rem',
            padding: '1rem',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
              🧑‍💼 Informações do Cliente (Relacionamento 1:N)
            </h3>
            <p><strong>Nome:</strong> {vendaDetalhada.cliente_nome}</p>
            <p><strong>Email:</strong> {vendaDetalhada.cliente_email}</p>
            <p><strong>Telefone:</strong> {vendaDetalhada.cliente_telefone || 'Não informado'}</p>
            <p><strong>Data da Venda:</strong> {formatDate(vendaDetalhada.data_venda)}</p>
          </div>

          <h3 style={{ marginTop: '1.5rem', color: '#8e44ad' }}>
            📦 Produtos da Venda (Relacionamento N:N)
          </h3>
          <table className="table">
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
          
          <div className="total-venda" style={{ 
            background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
            color: 'white',
            fontSize: '1.5rem'
          }}>
            🎯 Total da Venda: {formatPrice(vendaDetalhada.total)}
          </div>
          
          <div style={{ 
            marginTop: '1rem',
            padding: '1rem',
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