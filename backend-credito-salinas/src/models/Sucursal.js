const { pool } = require('../config/database');

class Sucursal {
  /**
   * Obtener todas las sucursales
   */
  static async findAll() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM sucursales ORDER BY nombre'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener sucursal por ID
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM sucursales WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crear sucursal
   */
  static async create(data) {
    try {
      const [result] = await pool.query(
        'INSERT INTO sucursales (nombre, codigo, ciudad, estado) VALUES (?, ?, ?, ?)',
        [data.nombre, data.codigo, data.ciudad, data.estado]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Sucursal;
