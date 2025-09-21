import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Verificar token ao carregar a aplicação
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/verify');
          setUser(response.data.user);
        } catch (error) {
          console.error('Token inválido:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Função de login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = response.data;
      
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
      return { success: false, error: errorMessage };
    }
  };

  // Função de registro
  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { user: userData, token: userToken } = response.data;
      
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer registro';
      return { success: false, error: errorMessage };
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Verificar se usuário está autenticado
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  // Verificar se usuário é admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};