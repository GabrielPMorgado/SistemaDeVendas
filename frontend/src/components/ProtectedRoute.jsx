import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import Login from './Login.jsx';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Login />;
  }

  if (adminOnly && !isAdmin()) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h2>Acesso Negado</h2>
          <p>Você não tem permissões para acessar esta página.</p>
          <p>Entre em contato com o administrador se precisar de acesso.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;