import React, { useState, useEffect } from 'react';
import { clientesAPI } from '../services/api';
import './ClientesList.css';

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
    <div className="clientes-container">
      <div className="clientes-header">
        <h2 className="clientes-title">Gerenciar Clientes</h2>
        <button 
          className="btn-add-modern" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Novo Cliente'}
        </button>
      </div>
      
      {error && (
        <div className="alert-modern-clientes alert-error-modern-clientes">
          {error}
        </div>
      )}

      {showForm && (
        <div className="form-container-modern">
          <form onSubmit={handleSubmit}>
            <div className="form-grid-modern">
              <div className="form-group-modern">
                <label className="form-label-modern">Nome *</label>
                <input
                  type="text"
                  className="form-input-modern"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group-modern">
                <label className="form-label-modern">Email *</label>
                <input
                  type="email"
                  className="form-input-modern"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group-modern">
                <label className="form-label-modern">Telefone</label>
                <input
                  type="text"
                  className="form-input-modern"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            
            <div className="form-actions-modern">
              <button type="submit" className="btn-success-modern" disabled={loading}>
                {editingId ? 'Atualizar' : 'Criar'} Cliente
              </button>
              
              <button type="button" className="btn-cancel-modern" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-modern-clientes">
          <div className="loading-spinner-modern-clientes"></div>
          <p>Carregando clientes...</p>
        </div>
      ) : (
        <div className="table-container-modern">
          <table className="table-modern-clientes">
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
                  <td>
                    <span className="cliente-id">#{cliente.id}</span>
                  </td>
                  <td>
                    <span className="cliente-nome">{cliente.nome}</span>
                  </td>
                  <td>
                    <span className="cliente-email">{cliente.email}</span>
                  </td>
                  <td>
                    <span className="cliente-telefone">
                      {cliente.telefone || 'Não informado'}
                    </span>
                  </td>
                  <td>
                    <span className="cliente-data">{formatDate(cliente.data_cadastro)}</span>
                  </td>
                  <td>
                    <div className="actions-cell-modern">
                      <button 
                        className="btn-edit-modern" 
                        onClick={() => handleEdit(cliente)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-delete-modern" 
                        onClick={() => handleDelete(cliente.id)}
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
      )}
      
      {clientes.length === 0 && !loading && (
        <div className="empty-state-modern">
          <div className="empty-state-icon-modern">👥</div>
          <div className="empty-state-text-modern">Nenhum cliente encontrado</div>
          <div className="empty-state-subtext-modern">
            Clique no botão "Novo Cliente" para adicionar o primeiro cliente
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientesList;