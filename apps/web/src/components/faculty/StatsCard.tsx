'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean | null;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  className?: string;
}

export function StatsCard({ 
  label, 
  value, 
  subValue, 
  icon, 
  trend, 
  trendUp = null,
  color = 'blue',
  className = ''
}: StatsCardProps) {
  const colors = {
    blue: { 
      bg: 'bg-blue-50', 
      iconBg: 'bg-blue-100', 
      iconColor: 'text-blue-600',
      trendColor: 'text-green-500'
    },
    green: { 
      bg: 'bg-green-50', 
      iconBg: 'bg-green-100', 
      iconColor: 'text-green-600',
      trendColor: 'text-green-500'
    },
    amber: { 
      bg: 'bg-amber-50', 
      iconBg: 'bg-amber-100', 
      iconColor: 'text-amber-600',
      trendColor: 'text-green-500'
    },
    red: { 
      bg: 'bg-red-50', 
      iconBg: 'bg-red-100', 
      iconColor: 'text-red-600',
      trendColor: 'text-red-500'
    },
    purple: { 
      bg: 'bg-purple-50', 
      iconBg: 'bg-purple-100', 
      iconColor: 'text-purple-600',
      trendColor: 'text-green-500'
    },
  };
  
  const c = colors[color];
  
  return (
    <div className={`
      group
      bg-white 
      rounded-2xl 
      p-5 
      border border-gray-100/50
      shadow-sm
      hover:shadow-xl 
      hover:shadow-gray-900/[0.04]
      hover:-translate-y-1
      transition-all duration-300 ease-out
      cursor-pointer
      ${className}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className={`
          w-11 h-11 
          rounded-xl 
          flex items-center justify-center
          ${c.iconBg}
          ${c.iconColor}
          shadow-sm
          group-hover:scale-110 transition-transform duration-300
        `}>
          {icon}
        </div>
        
        {trend && trendUp !== null && (
          <div className={`
            flex items-center gap-0.5 
            text-xs font-semibold
            ${trendUp ? 'text-green-500' : trend === '0' ? 'text-gray-400' : 'text-red-500'}
          `}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : trend === '0' ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      
      <h4 className="text-2xl font-bold text-gray-900 mb-1">
        {value}
      </h4>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      {subValue && (
        <p className="text-xs text-gray-400 mt-1 truncate">{subValue}</p>
      )}
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: string | number;
  color?: 'blue' | 'green' | 'amber' | 'red';
}

export function MiniStat({ label, value, color = 'blue' }: MiniStatProps) {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
  };
  
  return (
    <div className="flex flex-col">
      <span className={`text-lg font-bold ${colors[color]}`}>{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
