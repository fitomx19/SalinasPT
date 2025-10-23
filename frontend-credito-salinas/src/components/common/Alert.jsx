import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Alert = ({ type = 'info', title, message, onClose }) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-400',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-400',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-400',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-400',
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`{config.bg} {config.border} border rounded-lg p-4`}>
      <div className="flex items-start">
        <Icon className={`{config.iconColor} mt-0.5`} size={20} />
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`{config.text} font-semibold text-sm`}>
              {title}
            </h3>
          )}
          {message && (
            <p className={`{config.text} text-sm mt-1`}>
              {message}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`{config.text} hover:opacity-75`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
