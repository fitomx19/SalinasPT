const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const sucursalRoutes = require('./routes/sucursal.routes');
const solicitudRoutes = require('./routes/solicitud.routes');
const estadisticaRoutes = require('./routes/estadistica.routes');
const clienteRoutes = require('./routes/cliente.routes');

const app = express();

// Middlewares globales
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger de requests
app.use((req, res, next) => {
  console.log(new Date().toISOString() + ' - ' + req.method + ' ' + req.path);
  next();
});

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API de Solicitud de Crédito - Grupo Salinas',
    version: '1.0.0',
    endpoints: {
      sucursales: '/api/sucursales',
      solicitudes: '/api/solicitudes',
      estadisticas: '/api/estadisticas',
      clientes: '/api/clientes'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/sucursales', sucursalRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/estadisticas', estadisticaRoutes);
app.use('/api/clientes', clienteRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
