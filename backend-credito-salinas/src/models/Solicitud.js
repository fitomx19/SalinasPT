const { pool } = require('../config/database');

class Solicitud {
  /**
   * Crear solicitud
   */
  static async create(data) {
    try {
      const [result] = await pool.query(
        `INSERT INTO solicitudes 
         (cliente_id, sucursal_id, monto_solicitado, plazo_meses, estado, motivo_rechazo, score)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.cliente_id,
          data.sucursal_id,
          data.monto_solicitado,
          data.plazo_meses,
          data.estado,
          data.motivo_rechazo,
          data.score
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener solicitud por ID
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT s.*, c.nombre, c.apellidos, c.email, su.nombre as sucursal_nombre
         FROM solicitudes s
         INNER JOIN clientes c ON s.cliente_id = c.id
         INNER JOIN sucursales su ON s.sucursal_id = su.id
         WHERE s.id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todas las solicitudes
   */
  static async findAll(limit = 100) {
    try {
      const [rows] = await pool.query(
        `SELECT s.*, c.nombre, c.apellidos, c.email, su.nombre as sucursal_nombre
         FROM solicitudes s
         INNER JOIN clientes c ON s.cliente_id = c.id
         INNER JOIN sucursales su ON s.sucursal_id = su.id
         ORDER BY s.fecha_solicitud DESC
         LIMIT ?`,
        [limit]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener estadísticas
   */
  static async getEstadisticas() {
    try {
      const [stats] = await pool.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN estado = 'aprobado' THEN 1 ELSE 0 END) as aprobados,
          SUM(CASE WHEN estado = 'rechazado' THEN 1 ELSE 0 END) as rechazados,
          AVG(monto_solicitado) as monto_promedio,
          SUM(CASE WHEN estado = 'aprobado' THEN monto_solicitado ELSE 0 END) as monto_aprobado_total
        FROM solicitudes
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener estadísticas por sucursal
   */
  static async getEstadisticasPorSucursal() {
    try {
      const [stats] = await pool.query(`
        SELECT 
          su.nombre as sucursal,
          COUNT(*) as total,
          SUM(CASE WHEN s.estado = 'aprobado' THEN 1 ELSE 0 END) as aprobados,
          SUM(CASE WHEN s.estado = 'rechazado' THEN 1 ELSE 0 END) as rechazados
        FROM solicitudes s
        INNER JOIN sucursales su ON s.sucursal_id = su.id
        GROUP BY su.id, su.nombre
      `);
      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Solicitud;
