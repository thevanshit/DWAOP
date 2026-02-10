import { useState } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  status?: 'success' | 'warning' | 'danger' | 'info';
  icon?: string;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  status = 'info', 
  icon, 
  className = ''
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'danger': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (value: number, target?: number) => {
    if (!target) return null;
    const diff = target - value;
    if (diff > 0) {
      return (
        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21l10-10L7 1" />
        </svg>
      );
    } else if (diff < 0) {
      return (
        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 3L7 13l10 10" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl border border-gray-200 transition-all duration-200 hover:shadow-xl
        ${isHovered ? 'scale-105 shadow-2xl' : 'hover:shadow-xl'}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {status && (
              <div className={`w-2 h-2 rounded-full flex items-center justify-center ${getStatusColor()}`}>
                <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="text-center mb-4">
        <div className={`text-5xl font-bold ${getStatusColor()} mb-2 transition-all duration-500`}>
          {value}
        </div>

      </div>

      {/* Animated Border */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor()} opacity-20 animate-pulse`}></div>
    </div>
  );
}

export default MetricCard;