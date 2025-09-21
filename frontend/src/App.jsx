import React, { useState } from 'react'
import ClientesList from './components/ClientesList.jsx'
import ProdutosList from './components/ProdutosList.jsx'
import NovaVenda from './components/NovaVenda.jsx'
import VendasList from './components/VendasList.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('nova-venda')

  const renderContent = () => {
    switch (activeTab) {
      case 'clientes':
        return <ClientesList />
      case 'produtos':
        return <ProdutosList />
      case 'nova-venda':
        return <NovaVenda />
      case 'vendas':
        return <VendasList />
      default:
        return <NovaVenda />
    }
  }

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>Sistema de Vendas</h1>
          <p>Demonstração de Relacionamentos 1:N e N:N com React + Vite</p>
          
          <nav className="nav">
            <button
              className={activeTab === 'nova-venda' ? 'active' : ''}
              onClick={() => setActiveTab('nova-venda')}
            >
              Nova Venda
            </button>
            <button
              className={activeTab === 'vendas' ? 'active' : ''}
              onClick={() => setActiveTab('vendas')}
            >
              Histórico
            </button>
            <button
              className={activeTab === 'clientes' ? 'active' : ''}
              onClick={() => setActiveTab('clientes')}
            >
              Clientes
            </button>
            <button
              className={activeTab === 'produtos' ? 'active' : ''}
              onClick={() => setActiveTab('produtos')}
            >
              Produtos
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        {renderContent()}
      </main>
      
      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: '#7f8c8d',
        borderTop: '1px solid #ecf0f1',
        marginTop: '2rem'
      }}>
        <p>
          <strong>⚡ Tecnologias utilizadas:</strong> React + Vite, Node.js, Express, MySQL<br/>
          <strong>🔗 Relacionamentos implementados:</strong> 1:N (Cliente-Venda) e N:N (Venda-Produto)
        </p>
      </footer>
    </div>
  )
}

export default App