const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/cliente.controller');

/**
 * @route   GET /api/clientes/buscar
 * @desc    Buscar clientes por email, nombre o teléfono
 * @access  Public
 * @query   query - Término de búsqueda (mínimo 3 caracteres)
 */
router.get('/buscar', ClienteController.buscar);

/**
 * @route   GET /api/clientes/:id
 * @desc    Obtener cliente por ID
 * @access  Public
 */
router.get('/:id', ClienteController.obtenerPorId);

/**
 * @route   GET /api/clientes/:id/historial
 * @desc    Obtener historial completo de solicitudes de un cliente
 * @access  Public
 */
router.get('/:id/historial', ClienteController.obtenerHistorial);

module.exports = router;

