import React, { useState } from 'react'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Header from './components/Header.jsx'
import ClientesList from './components/ClientesList.jsx'
import ProdutosList from './components/ProdutosList.jsx'
import NovaVenda from './components/NovaVenda.jsx'
import VendasList from './components/VendasList.jsx'
import './App.css'

function AppContent() {
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
      case 'usuarios':
        return <div>Gerenciamento de usuários em desenvolvimento...</div>
      default:
        return <NovaVenda />
    }
  }

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

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
          <strong>⚡ Tecnologias utilizadas:</strong> React + Vite, Node.js, Express, MySQL, JWT<br/>
          <strong>🔗 Relacionamentos implementados:</strong> 1:N (Cliente-Venda) e N:N (Venda-Produto)<br/>
          <strong>🔐 Autenticação:</strong> JWT com sistema de login/logout
        </p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}

export default App