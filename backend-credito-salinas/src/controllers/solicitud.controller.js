const SolicitudService = require('../services/solicitud.service');
const Solicitud = require('../models/Solicitud');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

class SolicitudController {
  /**
   * Crear nueva solicitud
   */
  static async create(req, res) {
    try {
      const { cliente, solicitud } = req.body;

      const resultado = await SolicitudService.procesarSolicitud(cliente, solicitud);

      const statusCode = resultado.evaluacion.aprobado ? 201 : 200;
      const message = resultado.evaluacion.aprobado 
        ? 'Solicitud aprobada exitosamente' 
        : 'Solicitud rechazada';

      return success(res, resultado, message, statusCode);
    } catch (err) {
      logger.error('Error creando solicitud:', err);
      return error(res, err.message || 'Error procesando solicitud');
    }
  }

  /**
   * Simular múltiples solicitudes
   */
  static async simular(req, res) {
    try {
      const { cantidad = 10 } = req.body;

      if (cantidad < 1 || cantidad > 100) {
        return error(res, 'La cantidad debe estar entre 1 y 100', 400);
      }

      const resultados = await SolicitudService.simularSolicitudes(cantidad);

      return success(
        res,
        {
          cantidad: resultados.length,
          solicitudes: resultados
        },
        resultados.length + ' solicitudes simuladas exitosamente',
        201
      );
    } catch (err) {
      logger.error('Error simulando solicitudes:', err);
      return error(res, err.message || 'Error simulando solicitudes');
    }
  }

  /**
   * Obtener solicitud por ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const solicitud = await Solicitud.findById(id);

      if (!solicitud) {
        return error(res, 'Solicitud no encontrada', 404);
      }

      return success(res, solicitud, 'Solicitud obtenida exitosamente');
    } catch (err) {
      logger.error('Error obteniendo solicitud:', err);
      return error(res, 'Error obteniendo solicitud');
    }
  }

  /**
   * Obtener todas las solicitudes
   */
  static async getAll(req, res) {
    try {
      const { limit = 100 } = req.query;
      const solicitudes = await Solicitud.findAll(parseInt(limit));

      return success(res, solicitudes, 'Solicitudes obtenidas exitosamente');
    } catch (err) {
      logger.error('Error obteniendo solicitudes:', err);
      return error(res, 'Error obteniendo solicitudes');
    }
  }
}

module.exports = SolicitudController;
