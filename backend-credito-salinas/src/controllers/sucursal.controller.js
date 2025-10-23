const Sucursal = require('../models/Sucursal');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

class SucursalController {
  /**
   * Obtener todas las sucursales
   */
  static async getAll(req, res) {
    try {
      const sucursales = await Sucursal.findAll();
      return success(res, sucursales, 'Sucursales obtenidas exitosamente');
    } catch (err) {
      logger.error('Error obteniendo sucursales:', err);
      return error(res, 'Error obteniendo sucursales');
    }
  }

  /**
   * Obtener sucursal por ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const sucursal = await Sucursal.findById(id);

      if (!sucursal) {
        return error(res, 'Sucursal no encontrada', 404);
      }

      return success(res, sucursal, 'Sucursal obtenida exitosamente');
    } catch (err) {
      logger.error('Error obteniendo sucursal:', err);
      return error(res, 'Error obteniendo sucursal');
    }
  }
}

module.exports = SucursalController;
