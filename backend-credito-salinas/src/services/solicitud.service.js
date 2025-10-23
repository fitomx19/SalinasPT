const Cliente = require('../models/Cliente');
const Solicitud = require('../models/Solicitud');
const Sucursal = require('../models/Sucursal');
const EvaluacionService = require('./evaluacion.service');
const logger = require('../utils/logger');

class SolicitudService {

  static async procesarSolicitud(datosCliente, datosSolicitud) {
    try {
    
      const sucursal = await Sucursal.findById(datosSolicitud.sucursal_id);
      if (!sucursal) {
        throw new Error('Sucursal no encontrada');
      }

    
      const clienteId = await Cliente.createOrUpdate(datosCliente);
      logger.info('Cliente procesado:', clienteId);

     
      const evaluacion = EvaluacionService.evaluar({
        ...datosCliente,
        ...datosSolicitud
      });

      logger.info('Evaluación completada:', evaluacion);

      
      const solicitudData = {
        cliente_id: clienteId,
        sucursal_id: datosSolicitud.sucursal_id,
        monto_solicitado: datosSolicitud.monto_solicitado,
        plazo_meses: datosSolicitud.plazo_meses,
        estado: evaluacion.estado,
        motivo_rechazo: evaluacion.motivo_rechazo,
        score: evaluacion.score
      };

      const solicitudId = await Solicitud.create(solicitudData);
      logger.info('Solicitud creada:', solicitudId);
 
      const solicitudCompleta = await Solicitud.findById(solicitudId);

      return {
        solicitud: solicitudCompleta,
        evaluacion
      };
    } catch (error) {
      logger.error('Error procesando solicitud:', error);
      throw error;
    }
  }


  static async simularSolicitudes(cantidad = 10) {
    try {
      const resultados = [];
      const sucursales = await Sucursal.findAll();

      if (sucursales.length === 0) {
        throw new Error('No hay sucursales disponibles para simular');
      }

      for (let i = 0; i < cantidad; i++) {
        const datosSimulados = this.generarDatosAleatorios(sucursales);
        
        try {
          const resultado = await this.procesarSolicitud(
            datosSimulados.cliente,
            datosSimulados.solicitud
          );
          resultados.push(resultado);
        } catch (error) {
          logger.error('Error en solicitud simulada ' + (i + 1) + ':', error);
        }
      }

      return resultados;
    } catch (error) {
      logger.error('Error simulando solicitudes:', error);
      throw error;
    }
  }


  static generarDatosAleatorios(sucursales) {
    const nombres = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Laura', 'Pedro', 'Sofia'];
    const apellidos = ['García', 'Martínez', 'López', 'González', 'Rodríguez', 'Pérez', 'Sánchez', 'Ramírez'];

    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido1 = apellidos[Math.floor(Math.random() * apellidos.length)];
    const apellido2 = apellidos[Math.floor(Math.random() * apellidos.length)];

    // Fecha de nacimiento aleatoria (18-70 años)
    const edad = 18 + Math.floor(Math.random() * 52);
    const fechaNacimiento = new Date();
    fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() - edad);

    return {
      cliente: {
        nombre,
        apellidos: apellido1 + ' ' + apellido2,
        email: nombre.toLowerCase() + '.' + apellido1.toLowerCase() + Math.floor(Math.random() * 1000) + '@email.com',
        telefono: '55' + Math.floor(10000000 + Math.random() * 90000000),
        fecha_nacimiento: fechaNacimiento.toISOString().split('T')[0],
        ingreso_mensual: 5000 + Math.floor(Math.random() * 45000)
      },
      solicitud: {
        sucursal_id: sucursales[Math.floor(Math.random() * sucursales.length)].id,
        monto_solicitado: 10000 + Math.floor(Math.random() * 190000),
        plazo_meses: 12 + Math.floor(Math.random() * 37)
      }
    };
  }
}

module.exports = SolicitudService;
