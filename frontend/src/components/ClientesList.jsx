import React, { useState, useEffect } from 'react';
import { clientesAPI } from '../services/api';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const response = await clientesAPI.getAll();
      setClientes(response.data);
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
        email: formData.email,
        telefone: formData.telefone
      };

      if (editingId) {
        await clientesAPI.update(editingId, data);
        alert('Cliente atualizado com sucesso!');
      } else {
        await clientesAPI.create(data);
        alert('Cliente criado com sucesso!');
      }
      
      setFormData({ nome: '', email: '', telefone: '' });
      setEditingId(null);
      setShowForm(false);
      await loadClientes();
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente) => {
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone || ''
    });
    setEditingId(cliente.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      setLoading(true);
      try {
        await clientesAPI.delete(id);
        alert('Cliente deletado com sucesso!');
        await loadClientes();
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', email: '', telefone: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading && clientes.length === 0) {
    return <div className="loading">Carregando clientes...</div>;
  }

  return (
    <div className="card">
      <h2>⚡ Gerenciar Clientes</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Novo Cliente'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label>Nome *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Telefone</label>
            <input
              type="text"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <button type="submit" className="btn btn-success" disabled={loading}>
            {editingId ? 'Atualizar' : 'Criar'} Cliente
          </button>
          
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancelar
          </button>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Data Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone || 'Não informado'}</td>
              <td>{formatDate(cliente.data_cadastro)}</td>
              <td>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleEdit(cliente)}
                  style={{ marginRight: '0.5rem' }}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(cliente.id)}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {clientes.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#7f8c8d', marginTop: '1rem' }}>
          Nenhum cliente encontrado
        </p>
      )}
    </div>
  );
};

export default ClientesList;