/**
 * Servicio para evaluar solicitudes de crédito
 */
class EvaluacionService {

  static evaluar(datos) {
    const {
      fecha_nacimiento,
      ingreso_mensual,
      monto_solicitado,
      plazo_meses
    } = datos;

  
    const edad = this.calcularEdad(fecha_nacimiento);

   
    const criterios = {
      edadMinima: edad >= 18,
      edadMaxima: edad <= 65,
      capacidadPago: ingreso_mensual >= (monto_solicitado / plazo_meses),
      montoValido: monto_solicitado >= 5000 && monto_solicitado <= 500000,
      plazoValido: plazo_meses >= 6 && plazo_meses <= 60
    };

  
    const score = this.calcularScore(datos, edad);

    const aprobado = Object.values(criterios).every(c => c === true) && score >= 60;

    let motivoRechazo = null;
    if (!aprobado) {
      if (!criterios.edadMinima) motivoRechazo = 'Edad mínima no cumplida (18 años)';
      else if (!criterios.edadMaxima) motivoRechazo = 'Edad máxima excedida (65 años)';
      else if (!criterios.capacidadPago) motivoRechazo = 'Ingreso insuficiente para el monto solicitado';
      else if (!criterios.montoValido) motivoRechazo = 'Monto fuera del rango permitido (\,000 - \,000)';
      else if (!criterios.plazoValido) motivoRechazo = 'Plazo fuera del rango permitido (6-60 meses)';
      else if (score < 60) motivoRechazo = 'Score crediticio insuficiente';
    }

    return {
      aprobado,
      score: Math.round(score),
      estado: aprobado ? 'aprobado' : 'rechazado',
      motivo_rechazo: motivoRechazo,
      criterios
    };
  }


  static calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

 
  static calcularScore(datos, edad) {
    let score = 50; // Base

    // Factor de ingreso vs monto
    const relacionIngresoMonto = datos.ingreso_mensual / datos.monto_solicitado;
    if (relacionIngresoMonto >= 1) score += 20;
    else if (relacionIngresoMonto >= 0.5) score += 10;
    else if (relacionIngresoMonto >= 0.3) score += 5;

    // Factor de edad (mejor entre 25-50 años)
    if (edad >= 25 && edad <= 50) score += 15;
    else if (edad >= 18 && edad < 25) score += 10;
    else if (edad > 50 && edad <= 65) score += 10;

    // Factor de plazo
    if (datos.plazo_meses <= 24) score += 10;
    else if (datos.plazo_meses <= 48) score += 5;

    // Factor aleatorio (simula historial crediticio)
    const factorAleatorio = Math.random() * 10;
    score += factorAleatorio;

    return Math.min(100, Math.max(0, score));
  }
}

module.exports = EvaluacionService;
