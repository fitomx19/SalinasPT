import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioSolicitud from '../components/solicitud/FormularioSolicitud';
import ResultadoSolicitud from '../components/solicitud/ResultadoSolicitud';
import Alert from '../components/common/Alert';
import { solicitudService } from '../services/solicitudService';
import { Sparkles } from 'lucide-react';

const SolicitudPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setResultado(null);

      const response = await solicitudService.crear(formData);
      setResultado(response.data);
    } catch (err) {
      console.error('Error al crear solicitud:', err);
      setError(err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaSolicitud = () => {
    setResultado(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Nueva Solicitud de Crédito
          </h1>
          <p className="text-gray-600">
            Completa el formulario para solicitar tu crédito
          </p>
        </div>
        <button
          onClick={() => navigate('/simular')}
          className="btn-secondary flex items-center gap-2"
        >
          <Sparkles size={18} />
          Simular Solicitudes
        </button>
      </div>

      {error && (
        <div className="mb-6">
          <Alert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}

      {!resultado ? (
        <FormularioSolicitud onSubmit={handleSubmit} loading={loading} />
      ) : (
        <div>
          <ResultadoSolicitud resultado={resultado} />
          <div className="flex justify-center mt-8">
            <button
              onClick={handleNuevaSolicitud}
              className="btn-secondary px-8 py-3 text-lg"
            >
              Nueva Solicitud
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudPage;
