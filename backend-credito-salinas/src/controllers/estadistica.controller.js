const Solicitud = require('../models/Solicitud');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

class EstadisticaController {
  /**
   * Obtener estadísticas generales
   */
  static async getGenerales(req, res) {
    try {
      const stats = await Solicitud.getEstadisticas();

      // Calcular porcentajes
      const porcentajeAprobacion = stats.total > 0 
        ? ((stats.aprobados / stats.total) * 100).toFixed(2)
        : 0;

      const porcentajeRechazo = stats.total > 0 
        ? ((stats.rechazados / stats.total) * 100).toFixed(2)
        : 0;

      const resultado = {
        ...stats,
        porcentaje_aprobacion: parseFloat(porcentajeAprobacion),
        porcentaje_rechazo: parseFloat(porcentajeRechazo),
        monto_promedio: parseFloat(stats.monto_promedio || 0).toFixed(2)
      };

      return success(res, resultado, 'Estadísticas obtenidas exitosamente');
    } catch (err) {
      logger.error('Error obteniendo estadísticas:', err);
      return error(res, 'Error obteniendo estadísticas');
    }
  }

  /**
   * Obtener estadísticas por sucursal
   */
  static async getPorSucursal(req, res) {
    try {
      const stats = await Solicitud.getEstadisticasPorSucursal();

      // Calcular porcentajes para cada sucursal
      const resultado = stats.map(stat => ({
        ...stat,
        porcentaje_aprobacion: stat.total > 0 
          ? parseFloat(((stat.aprobados / stat.total) * 100).toFixed(2))
          : 0,
        porcentaje_rechazo: stat.total > 0 
          ? parseFloat(((stat.rechazados / stat.total) * 100).toFixed(2))
          : 0
      }));

      return success(res, resultado, 'Estadísticas por sucursal obtenidas exitosamente');
    } catch (err) {
      logger.error('Error obteniendo estadísticas por sucursal:', err);
      return error(res, 'Error obteniendo estadísticas por sucursal');
    }
  }
}

module.exports = EstadisticaController;
