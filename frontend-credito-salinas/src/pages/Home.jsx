import { Link } from 'react-router-dom';
import { FileText, BarChart3, TrendingUp, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* HERO SECTION */}
      <div className="card text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Sistema de Solicitud de Crédito
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Grupo Salinas - Evaluación Técnica
        </p>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto">
          Bienvenido al sistema de solicitud de crédito. Aquí puedes realizar una nueva 
          solicitud de crédito y visualizar las estadísticas de todas las solicitudes procesadas.
        </p>
      </div>

      {/* CARACTERÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FeatureCard
          icon={FileText}
          title="Nueva Solicitud"
          description="Realiza una solicitud de crédito y obtén una respuesta inmediata sobre su aprobación."
          link="/solicitud"
          linkText="Solicitar Crédito"
          color="primary"
        />

        <FeatureCard
          icon={Sparkles}
          title="Simular Solicitudes"
          description="Genera solicitudes aleatorias automáticamente para probar el sistema y ver su funcionamiento."
          link="/simular"
          linkText="Simular Ahora"
          color="purple"
        />

        <FeatureCard
          icon={BarChart3}
          title="Estadísticas"
          description="Visualiza las estadísticas generales y por sucursal de todas las solicitudes procesadas."
          link="/estadisticas"
          linkText="Ver Estadísticas"
          color="blue"
        />
      </div>

      {/* INFORMACIÓN ADICIONAL */}
      <div className="card bg-gradient-to-r from-primary-50 to-orange-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-primary-600" />
          Características del Sistema
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">✓</span>
            <span><strong>Evaluación Automática:</strong> El sistema evalúa automáticamente 
            la capacidad de pago del solicitante.</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">✓</span>
            <span><strong>Score Crediticio:</strong> Se calcula un score de 0 a 100 basado 
            en múltiples factores.</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">✓</span>
            <span><strong>Respuesta Inmediata:</strong> Obtén una respuesta al instante sobre 
            la aprobación o rechazo.</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">✓</span>
            <span><strong>Dashboard Completo:</strong> Visualiza estadísticas en tiempo real 
            con gráficas interactivas.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Componente de Tarjeta de Característica
const FeatureCard = ({ icon: Icon, title, description, link, linkText, color }) => {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className={`p-3 rounded-full ${colors[color]} w-fit mb-4`}>
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Link
        to={link}
        className="inline-block btn-primary"
      >
        {linkText}
      </Link>
    </div>
  );
};

export default Home;
