const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(username, email, password, role = 'user') {
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  // Criar novo usuário
  static async create(userData) {
    try {
      const { username, email, password, role = 'user' } = userData;
      
      // Hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const query = `
        INSERT INTO users (username, email, password, role)
        VALUES (?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [username, email, hashedPassword, role]);
      
      return {
        id: result.insertId,
        username,
        email,
        role
      };
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await db.execute(query, [email]);
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID
  static async findById(id) {
    try {
      const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Verificar senha
  static async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  // Listar todos os usuários (admin)
  static async findAll() {
    try {
      const query = 'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC';
      const [rows] = await db.execute(query);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar usuário
  static async update(id, userData) {
    try {
      const { username, email, role } = userData;
      
      const query = `
        UPDATE users 
        SET username = ?, email = ?, role = ?
        WHERE id = ?
      `;
      
      await db.execute(query, [username, email, role, id]);
      
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Deletar usuário
  static async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;