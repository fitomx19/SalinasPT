const express = require('express');
const router = express.Router();
const SucursalController = require('../controllers/sucursal.controller');


router.get('/', SucursalController.getAll);


router.get('/:id', SucursalController.getById);

module.exports = router;
