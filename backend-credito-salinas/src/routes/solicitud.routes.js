const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator.middleware');
const SolicitudController = require('../controllers/solicitud.controller');

/**
 * POST /api/solicitudes
 * Crear nueva solicitud
 */
router.post(
  '/',
  [
    
    body('cliente.nombre')
      .trim()
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    
    body('cliente.apellidos')
      .trim()
      .notEmpty().withMessage('Los apellidos son requeridos')
      .isLength({ min: 2, max: 100 }).withMessage('Los apellidos deben tener entre 2 y 100 caracteres'),
    
    body('cliente.email')
      .trim()
      .notEmpty().withMessage('El email es requerido')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    
    body('cliente.telefono')
      .trim()
      .notEmpty().withMessage('El teléfono es requerido')
      .matches(/^[0-9]{10}$/).withMessage('El teléfono debe tener 10 dígitos'),
    
    body('cliente.fecha_nacimiento')
      .notEmpty().withMessage('La fecha de nacimiento es requerida')
      .isDate().withMessage('Fecha de nacimiento inválida'),
    
    body('cliente.ingreso_mensual')
      .notEmpty().withMessage('El ingreso mensual es requerido')
      .isFloat({ min: 0 }).withMessage('El ingreso mensual debe ser un número positivo'),
    
    // Validaciones de la solicitud
    body('solicitud.sucursal_id')
      .notEmpty().withMessage('La sucursal es requerida')
      .isInt({ min: 1 }).withMessage('ID de sucursal inválido'),
    
    body('solicitud.monto_solicitado')
      .notEmpty().withMessage('El monto solicitado es requerido')
      .isFloat({ min: 5000, max: 500000 }).withMessage('El monto debe estar entre \,000 y \,000'),
    
    body('solicitud.plazo_meses')
      .notEmpty().withMessage('El plazo es requerido')
      .isInt({ min: 6, max: 60 }).withMessage('El plazo debe estar entre 6 y 60 meses'),
    
    validate
  ],
  SolicitudController.create
);

/**
 * POST /api/solicitudes/simular
 * Simular múltiples solicitudes
 */
router.post(
  '/simular',
  [
    body('cantidad')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('La cantidad debe estar entre 1 y 100'),
    validate
  ],
  SolicitudController.simular
);


router.get('/:id', SolicitudController.getById);


router.get('/', SolicitudController.getAll);

module.exports = router;
