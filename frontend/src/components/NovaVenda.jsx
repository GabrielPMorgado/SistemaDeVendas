import React, { useState, useEffect } from 'react';
import { clientesAPI, produtosAPI, vendasAPI } from '../services/api';

const NovaVenda = () => {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estado do formulário de venda
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [produtoAtual, setProdutoAtual] = useState('');
  const [quantidadeAtual, setQuantidadeAtual] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clientesRes, produtosRes] = await Promise.all([
        clientesAPI.getAll(),
        produtosAPI.getAll()
      ]);
      
      setClientes(clientesRes.data);
      setProdutos(produtosRes.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const adicionarProduto = () => {
    if (!produtoAtual || quantidadeAtual <= 0) {
      setError('Selecione um produto e quantidade válida');
      return;
    }

    const produto = produtos.find(p => p.id === parseInt(produtoAtual));
    
    if (!produto) {
      setError('Produto não encontrado');
      return;
    }

    if (quantidadeAtual > produto.estoque) {
      setError(`Estoque insuficiente. Disponível: ${produto.estoque}`);
      return;
    }

    // Verificar se produto já foi adicionado
    const produtoExistente = produtosSelecionados.find(p => p.produto_id === produto.id);
    
    if (produtoExistente) {
      const novaQuantidade = produtoExistente.quantidade + quantidadeAtual;
      if (novaQuantidade > produto.estoque) {
        setError(`Quantidade total excede o estoque. Máximo: ${produto.estoque}`);
        return;
      }
      
      // Atualizar quantidade
      setProdutosSelecionados(produtosSelecionados.map(p => 
        p.produto_id === produto.id 
          ? { ...p, quantidade: novaQuantidade }
          : p
      ));
    } else {
      // Adicionar novo produto
      setProdutosSelecionados([
        ...produtosSelecionados,
        {
          produto_id: produto.id,
          nome: produto.nome,
          preco_unitario: produto.preco,
          quantidade: quantidadeAtual
        }
      ]);
    }

    setProdutoAtual('');
    setQuantidadeAtual(1);
    setError('');
  };

  const removerProduto = (produtoId) => {
    setProdutosSelecionados(produtosSelecionados.filter(p => p.produto_id !== produtoId));
  };

  const atualizarQuantidade = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerProduto(produtoId);
      return;
    }

    const produto = produtos.find(p => p.id === produtoId);
    if (novaQuantidade > produto.estoque) {
      setError(`Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}`);
      return;
    }

    setProdutosSelecionados(produtosSelecionados.map(p => 
      p.produto_id === produtoId 
        ? { ...p, quantidade: novaQuantidade }
        : p
    ));
    setError('');
  };

  const calcularTotal = () => {
    return produtosSelecionados.reduce((total, produto) => {
      return total + (produto.quantidade * produto.preco_unitario);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!clienteSelecionado) {
      setError('Selecione um cliente');
      return;
    }

    if (produtosSelecionados.length === 0) {
      setError('Adicione pelo menos um produto');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const vendaData = {
        cliente_id: parseInt(clienteSelecionado),
        produtos: produtosSelecionados
      };

      await vendasAPI.create(vendaData);
      
      setSuccess('✅ Venda registrada com sucesso!');
      
      // Resetar formulário
      setClienteSelecionado('');
      setProdutosSelecionados([]);
      setProdutoAtual('');
      setQuantidadeAtual(1);
      
      // Recarregar produtos para atualizar estoque
      await loadData();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && clientes.length === 0) {
    return <div className="loading">⚡ Carregando dados com Vite...</div>;
  }

  return (
    <div className="card">
      <h2>⚡ Nova Venda - Relacionamentos em Ação</h2>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <strong>🚀 Demonstração com React + Vite:</strong><br/>
        • <strong>1:N</strong> - Um cliente pode ter várias vendas<br/>
        • <strong>N:N</strong> - Uma venda pode ter vários produtos, um produto pode estar em várias vendas
      </div>
      
      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Seleção de Cliente (Relacionamento 1:N) */}
        <div className="form-group">
          <label>
            <strong>🧑‍💼 Cliente * (Relacionamento 1:N)</strong>
            <small style={{ display: 'block', color: '#7f8c8d', fontSize: '0.85rem' }}>
              Um cliente pode estar em várias vendas
            </small>
          </label>
          <select
            value={clienteSelecionado}
            onChange={(e) => setClienteSelecionado(e.target.value)}
            required
          >
            <option value="">Selecione um cliente...</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome} - {cliente.email}
              </option>
            ))}
          </select>
        </div>

        {/* Seleção de Produtos (Relacionamento N:N) */}
        <div className="form-group">
          <label>
            <strong>📦 Adicionar Produtos (Relacionamento N:N)</strong>
            <small style={{ display: 'block', color: '#7f8c8d', fontSize: '0.85rem' }}>
              Uma venda pode ter vários produtos, um produto pode estar em várias vendas
            </small>
          </label>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <select
                value={produtoAtual}
                onChange={(e) => setProdutoAtual(e.target.value)}
              >
                <option value="">Selecione um produto...</option>
                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - {formatPrice(produto.preco)} 
                    (Estoque: {produto.estoque}{produto.estoque <= 5 ? ' ⚠️' : ''})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <input
                type="number"
                min="1"
                value={quantidadeAtual}
                onChange={(e) => setQuantidadeAtual(parseInt(e.target.value) || 1)}
                placeholder="Qtd"
                style={{ width: '80px' }}
              />
            </div>
            
            <button
              type="button"
              className="btn btn-primary"
              onClick={adicionarProduto}
            >
              + Adicionar
            </button>
          </div>
        </div>

        {/* Lista de Produtos Selecionados */}
        {produtosSelecionados.length > 0 && (
          <div className="form-group">
            <label><strong>🛒 Produtos da Venda</strong></label>
            
            {produtosSelecionados.map((produto) => (
              <div key={produto.produto_id} className="produto-item">
                <div className="produto-info">
                  <strong>{produto.nome}</strong><br/>
                  <small>
                    {formatPrice(produto.preco_unitario)} x {produto.quantidade} = {' '}
                    <strong>{formatPrice(produto.quantidade * produto.preco_unitario)}</strong>
                  </small>
                </div>
                
                <div className="produto-controls">
                  <input
                    type="number"
                    min="1"
                    value={produto.quantidade}
                    onChange={(e) => atualizarQuantidade(produto.produto_id, parseInt(e.target.value) || 0)}
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removerProduto(produto.produto_id)}
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            
            <div className="total-venda">
              💰 Total da Venda: {formatPrice(calcularTotal())}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-success" 
          disabled={loading || !clienteSelecionado || produtosSelecionados.length === 0}
          style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
        >
          {loading ? '⏳ Registrando...' : '🚀 Registrar Venda'}
        </button>
      </form>
    </div>
  );
};

export default NovaVenda;