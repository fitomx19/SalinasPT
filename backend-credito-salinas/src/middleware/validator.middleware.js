const { validationResult } = require('express-validator');
const { error } = require('../utils/response');

/**
 * Validar resultados de express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return error(res, 'Error de validación', 400, errors.array());
  }
  
  next();
};

module.exports = { validate };
