const db = require('../config/database');

class Produto {
  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM produtos ORDER BY nome');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM produtos WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(produtoData) {
    try {
      const { nome, preco, estoque } = produtoData;
      const [result] = await db.execute(
        'INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)',
        [nome, preco, estoque]
      );
      return { id: result.insertId, ...produtoData };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, produtoData) {
    try {
      const { nome, preco, estoque } = produtoData;
      await db.execute(
        'UPDATE produtos SET nome = ?, preco = ?, estoque = ? WHERE id = ?',
        [nome, preco, estoque, id]
      );
      return this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM produtos WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updateEstoque(id, quantidade) {
    try {
      await db.execute(
        'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
        [quantidade, id]
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Produto;