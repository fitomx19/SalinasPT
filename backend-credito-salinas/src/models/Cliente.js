const { pool } = require('../config/database');

class Cliente {
  /**
   * Crear o actualizar cliente
   */
  static async createOrUpdate(data) {
    try {
      // Buscar si existe por email
      const [existing] = await pool.query(
        'SELECT id FROM clientes WHERE email = ?',
        [data.email]
      );

      if (existing.length > 0) {
        // Actualizar
        await pool.query(
          `UPDATE clientes SET 
           nombre = ?, apellidos = ?, telefono = ?, 
           fecha_nacimiento = ?, ingreso_mensual = ?
           WHERE id = ?`,
          [
            data.nombre,
            data.apellidos,
            data.telefono,
            data.fecha_nacimiento,
            data.ingreso_mensual,
            existing[0].id
          ]
        );
        return existing[0].id;
      } else {
        // Crear
        const [result] = await pool.query(
          `INSERT INTO clientes 
           (nombre, apellidos, email, telefono, fecha_nacimiento, ingreso_mensual)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            data.nombre,
            data.apellidos,
            data.email,
            data.telefono,
            data.fecha_nacimiento,
            data.ingreso_mensual
          ]
        );
        return result.insertId;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener cliente por ID
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM clientes WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener cliente por email
   */
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM clientes WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Cliente;
