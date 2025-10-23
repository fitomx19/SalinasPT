import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, BarChart3, Sparkles, History } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/solicitud', icon: FileText, label: 'Nueva Solicitud' },
    { path: '/simular', icon: Sparkles, label: 'Simular' },
    { path: '/historial', icon: History, label: 'Historial' },
    { path: '/estadisticas', icon: BarChart3, label: 'Estadísticas' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                Grupo Salinas
              </h1>
            </div>
          </div>

          <div className="flex space-x-4 items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200
                    ${isActive(item.path)
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
