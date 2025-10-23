const app = require('./src/app');
const { testConnection } = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

// Iniciar servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      logger.error('No se pudo conectar a la base de datos. Verifica la configuración.');
      process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info('🚀 Servidor corriendo en http://localhost:' + PORT);
      logger.info('📊 Ambiente: ' + process.env.NODE_ENV);
      logger.info('🗄️  Base de datos: ' + process.env.DB_NAME);
    });
  } catch (error) {
    logger.error('Error iniciando el servidor:', error);
    process.exit(1);
  }
};

startServer();
