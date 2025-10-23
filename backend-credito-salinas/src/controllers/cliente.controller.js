const Cliente = require('../models/Cliente');
const { pool } = require('../config/database');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

class ClienteController {
  /**
   * Buscar cliente por email o teléfono
   */
  static async buscar(req, res) {
    try {
      const { query } = req.query;

      if (!query || query.trim().length < 3) {
        return error(res, 'Debes proporcionar al menos 3 caracteres para buscar', 400);
      }

      const clientes = await Cliente.buscar(query);

      return success(res, clientes, `${clientes.length} cliente(s) encontrado(s)`);
    } catch (err) {
      logger.error('Error buscando cliente:', err);
      return error(res, 'Error buscando cliente');
    }
  }

  /**
   * Obtener historial completo de un cliente
   */
  static async obtenerHistorial(req, res) {
    try {
      const { id } = req.params;

      // Obtener datos del cliente
      const cliente = await Cliente.findById(id);
      
      if (!cliente) {
        return error(res, 'Cliente no encontrado', 404);
      }

      // Obtener historial usando stored procedure
      const [solicitudes] = await pool.query('CALL sp_historial_cliente(?)', [id]);

      // Calcular estadísticas del cliente
      const totalSolicitudes = solicitudes[0].length;
      const aprobadas = solicitudes[0].filter(s => s.estado === 'aprobado').length;
      const rechazadas = solicitudes[0].filter(s => s.estado === 'rechazado').length;
      const montoTotalAprobado = solicitudes[0]
        .filter(s => s.estado === 'aprobado')
        .reduce((sum, s) => sum + parseFloat(s.monto_solicitado), 0);
      const scorePromedio = totalSolicitudes > 0
        ? solicitudes[0].reduce((sum, s) => sum + s.score, 0) / totalSolicitudes
        : 0;

      const resultado = {
        cliente: {
          id: cliente.id,
          nombre: cliente.nombre,
          apellidos: cliente.apellidos,
          email: cliente.email,
          telefono: cliente.telefono,
          fecha_nacimiento: cliente.fecha_nacimiento,
          ingreso_mensual: cliente.ingreso_mensual,
          fecha_registro: cliente.fecha_registro
        },
        estadisticas: {
          total_solicitudes: totalSolicitudes,
          aprobadas,
          rechazadas,
          tasa_aprobacion: totalSolicitudes > 0 ? ((aprobadas / totalSolicitudes) * 100).toFixed(2) : 0,
          monto_total_aprobado: montoTotalAprobado,
          score_promedio: scorePromedio.toFixed(2)
        },
        solicitudes: solicitudes[0]
      };

      return success(res, resultado, 'Historial obtenido exitosamente');
    } catch (err) {
      logger.error('Error obteniendo historial:', err);
      return error(res, 'Error obteniendo historial del cliente');
    }
  }

  /**
   * Obtener cliente por ID
   */
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findById(id);

      if (!cliente) {
        return error(res, 'Cliente no encontrado', 404);
      }

      return success(res, cliente, 'Cliente obtenido exitosamente');
    } catch (err) {
      logger.error('Error obteniendo cliente:', err);
      return error(res, 'Error obteniendo cliente');
    }
  }
}

module.exports = ClienteController;

