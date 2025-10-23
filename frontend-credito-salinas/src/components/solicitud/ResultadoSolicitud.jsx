import { CheckCircle, XCircle, User, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ResultadoSolicitud = ({ resultado }) => {
  const { solicitud, evaluacion } = resultado;
  const aprobado = evaluacion.aprobado;

  return (
    <div className="space-y-6">
    
      <div
        className={`
          card text-center
          {aprobado ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}
        `}
      >
        <div className="flex flex-col items-center">
          {aprobado ? (
            <CheckCircle className="text-green-500 mb-4" size={64} />
          ) : (
            <XCircle className="text-red-500 mb-4" size={64} />
          )}
          
          <h2 className={`text-3xl font-bold mb-2 {aprobado ? 'text-green-700' : 'text-red-700'}`}>
            {aprobado ? '¡Solicitud Aprobada!' : 'Solicitud Rechazada'}
          </h2>
          
          <p className="text-gray-600 text-lg">
            Folio: #{solicitud.id}
          </p>
        </div>
      </div>

      {/* DETALLES DEL CLIENTE */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <User className="mr-2 text-primary-600" />
          Información del Cliente
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nombre Completo</p>
            <p className="font-semibold">{solicitud.nombre} {solicitud.apellidos}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold">{solicitud.email}</p>
          </div>
        </div>
      </div>

     
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <DollarSign className="mr-2 text-primary-600" />
          Detalles de la Solicitud
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Monto Solicitado</p>
            <p className="font-semibold text-lg">{formatCurrency(solicitud.monto_solicitado)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Plazo</p>
            <p className="font-semibold">{solicitud.plazo_meses} meses</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Pago Mensual Aproximado</p>
            <p className="font-semibold text-lg">
              {formatCurrency(solicitud.monto_solicitado / solicitud.plazo_meses)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Sucursal</p>
            <p className="font-semibold">{solicitud.sucursal_nombre}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Fecha de Solicitud</p>
            <p className="font-semibold">{formatDate(solicitud.fecha_solicitud)}</p>
          </div>
        </div>
      </div>

   
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-primary-600" />
          Evaluación Crediticia
        </h3>
        
        <div className="space-y-4">
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Score Crediticio</span>
              <span className="text-2xl font-bold text-primary-600">{evaluacion.score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`
                  h-4 rounded-full transition-all
                  {evaluacion.score >= 80 ? 'bg-green-500' : 
                   evaluacion.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}
                `}
                style={{ width: evaluacion.score + '%' }}
              ></div>
            </div>
          </div>

          {/* Motivo de Rechazo */}
          {!aprobado && solicitud.motivo_rechazo && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800">Motivo del Rechazo:</p>
              <p className="text-red-700 mt-1">{solicitud.motivo_rechazo}</p>
            </div>
          )}

        
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Criterios Evaluados:</p>
            <div className="space-y-2">
              {Object.entries(evaluacion.criterios).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  {value ? (
                    <CheckCircle className="text-green-500 mr-2" size={18} />
                  ) : (
                    <XCircle className="text-red-500 mr-2" size={18} />
                  )}
                  <span className="text-sm text-gray-700">
                    {getCriterioLabel(key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const getCriterioLabel = (key) => {
  const labels = {
    edadMinima: 'Edad mínima cumplida (18 años)',
    edadMaxima: 'Edad máxima permitida (65 años)',
    capacidadPago: 'Capacidad de pago suficiente',
    montoValido: 'Monto dentro del rango permitido',
    plazoValido: 'Plazo dentro del rango permitido',
  };
  return labels[key] || key;
};

export default ResultadoSolicitud;
