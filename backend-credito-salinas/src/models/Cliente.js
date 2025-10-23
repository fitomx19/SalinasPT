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

  /**
   * Buscar clientes por email, nombre o teléfono
   */
  static async buscar(query) {
    try {
      const searchTerm = `%${query}%`;
      const [rows] = await pool.query(
        `SELECT 
          c.id,
          c.nombre,
          c.apellidos,
          c.email,
          c.telefono,
          c.fecha_nacimiento,
          c.ingreso_mensual,
          c.fecha_registro,
          COUNT(s.id) as total_solicitudes,
          SUM(CASE WHEN s.estado = 'aprobado' THEN 1 ELSE 0 END) as solicitudes_aprobadas
        FROM clientes c
        LEFT JOIN solicitudes s ON c.id = s.cliente_id
        WHERE c.email LIKE ? 
          OR c.telefono LIKE ? 
          OR CONCAT(c.nombre, ' ', c.apellidos) LIKE ?
        GROUP BY c.id
        ORDER BY c.fecha_registro DESC
        LIMIT 20`,
        [searchTerm, searchTerm, searchTerm]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Cliente;
