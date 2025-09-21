import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro específico quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.username) {
        newErrors.username = 'Nome de usuário é obrigatório';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let result;
      
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.username, formData.email, formData.password);
      }

      if (!result.success) {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Erro inesperado. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sistema de Vendas</h1>
          <h2>{isLogin ? 'Entrar' : 'Criar Conta'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Nome de Usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error' : ''}
                placeholder="Digite seu nome de usuário"
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Digite seu email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Digite sua senha"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirme sua senha"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}

          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button 
              type="button" 
              className="toggle-button"
              onClick={toggleMode}
            >
              {isLogin ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
          
          {isLogin && (
            <div className="demo-credentials">
              <p><strong>Credenciais de teste:</strong></p>
              <p>Admin: admin@sistema.com / admin123</p>
              <p>Usuário: usuario@sistema.com / user123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;