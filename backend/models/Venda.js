const db = require('../config/database');

class Venda {
  static async getAll() {
    try {
      const [rows] = await db.execute(`
        SELECT v.*, c.nome as cliente_nome 
        FROM vendas v 
        JOIN clientes c ON v.cliente_id = c.id 
        ORDER BY v.data_venda DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute(`
        SELECT v.*, c.nome as cliente_nome, c.email as cliente_email, c.telefone as cliente_telefone
        FROM vendas v 
        JOIN clientes c ON v.cliente_id = c.id 
        WHERE v.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getVendaComProdutos(id) {
    try {
      const venda = await this.getById(id);
      if (!venda) return null;

      const [produtos] = await db.execute(`
        SELECT p.id, p.nome, p.preco, vp.quantidade, vp.preco_unitario,
               (vp.quantidade * vp.preco_unitario) as subtotal
        FROM venda_produtos vp
        JOIN produtos p ON vp.produto_id = p.id
        WHERE vp.venda_id = ?
      `, [id]);

      return { ...venda, produtos };
    } catch (error) {
      throw error;
    }
  }

  static async create(vendaData) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const { cliente_id, produtos } = vendaData;
      
      // Calcular total da venda
      const total = produtos.reduce((sum, produto) => {
        return sum + (produto.quantidade * produto.preco_unitario);
      }, 0);

      // Inserir venda
      const [vendaResult] = await connection.execute(
        'INSERT INTO vendas (cliente_id, total, data_venda) VALUES (?, ?, NOW())',
        [cliente_id, total]
      );

      const vendaId = vendaResult.insertId;

      // Inserir produtos da venda (relacionamento N:N)
      for (const produto of produtos) {
        await connection.execute(
          'INSERT INTO venda_produtos (venda_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
          [vendaId, produto.produto_id, produto.quantidade, produto.preco_unitario]
        );

        // Atualizar estoque
        await connection.execute(
          'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
          [produto.quantidade, produto.produto_id]
        );
      }

      await connection.commit();
      return await this.getVendaComProdutos(vendaId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Primeiro, restaurar estoque dos produtos
      const [produtos] = await connection.execute(`
        SELECT produto_id, quantidade 
        FROM venda_produtos 
        WHERE venda_id = ?
      `, [id]);

      for (const produto of produtos) {
        await connection.execute(
          'UPDATE produtos SET estoque = estoque + ? WHERE id = ?',
          [produto.quantidade, produto.produto_id]
        );
      }

      // Deletar produtos da venda
      await connection.execute('DELETE FROM venda_produtos WHERE venda_id = ?', [id]);
      
      // Deletar venda
      const [result] = await connection.execute('DELETE FROM vendas WHERE id = ?', [id]);

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Venda;