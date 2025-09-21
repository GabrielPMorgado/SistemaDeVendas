import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Header.css';

const Header = ({ activeTab, setActiveTab }) => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-left">
          <h1>Sistema de Vendas</h1>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">
              Olá, {user?.username}
              {isAdmin() && <span className="admin-badge">Admin</span>}
            </span>
            <span className="user-email">{user?.email}</span>
          </div>
          
          <button 
            className="logout-button" 
            onClick={handleLogout}
            title="Sair do sistema"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sair
          </button>
        </div>
      </div>
      
      <nav className="nav-tabs">
        <div className="container">
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
            Vendas
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
          {isAdmin() && (
            <button 
              className={activeTab === 'usuarios' ? 'active' : ''}
              onClick={() => setActiveTab('usuarios')}
            >
              Usuários
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;