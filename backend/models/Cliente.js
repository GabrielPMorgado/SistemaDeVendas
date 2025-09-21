const db = require('../config/database');

class Cliente {
  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM clientes ORDER BY nome');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM clientes WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(clienteData) {
    try {
      const { nome, email, telefone } = clienteData;
      const [result] = await db.execute(
        'INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)',
        [nome, email, telefone]
      );
      return { id: result.insertId, ...clienteData };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, clienteData) {
    try {
      const { nome, email, telefone } = clienteData;
      await db.execute(
        'UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?',
        [nome, email, telefone, id]
      );
      return this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM clientes WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Cliente;