const express = require('express');
const router = express.Router();
const EstadisticaController = require('../controllers/estadistica.controller');

/**
 * GET /api/estadisticas
 * Obtener estadísticas generales
 */
router.get('/', EstadisticaController.getGenerales);

/**
 * GET /api/estadisticas/sucursales
 * Obtener estadísticas por sucursal
 */
router.get('/sucursales', EstadisticaController.getPorSucursal);

module.exports = router;
