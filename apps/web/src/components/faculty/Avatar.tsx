'use client';

import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showStatus?: boolean;
  isOnline?: boolean;
}

export function Avatar({ name, size = 'md', className = '', showStatus, isOnline }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  const sizes = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
  };
  
  return (
    <div className={`relative inline-flex ${className}`}>
      <div className={`
        ${sizes[size]}
        rounded-full 
        bg-gradient-to-br from-blue-500 to-blue-600 
        flex items-center justify-center 
        text-white font-semibold 
        shadow-md shadow-blue-500/20
        ring-2 ring-white
      `}>
        {initials}
      </div>
      {showStatus && (
        <span className={`
          absolute bottom-0 right-0 
          w-3 h-3 
          rounded-full 
          border-2 border-white
          ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
        `} />
      )}
    </div>
  );
}

interface AvatarStackProps {
  users: { name: string; avatar?: string }[];
  max?: number;
  size?: 'sm' | 'md';
}

export function AvatarStack({ users, max = 3, size = 'sm' }: AvatarStackProps) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;
  
  const sizes = {
    sm: 'w-6 h-6 text-[8px]',
    md: 'w-8 h-8 text-[10px]',
  };
  
  return (
    <div className="flex -space-x-2">
      {visible.map((user, idx) => (
        <div 
          key={idx} 
          className="relative z-10 ring-2 ring-white rounded-full"
          style={{ zIndex: visible.length - idx }}
        >
          <Avatar name={user.name} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div className={`
          ${sizes[size]}
          rounded-full 
          bg-gray-100 
          flex items-center justify-center 
          text-gray-500 font-semibold 
          ring-2 ring-white
        `}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
