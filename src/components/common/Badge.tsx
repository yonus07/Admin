import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'green' | 'red' | 'blue' | 'gray' | 'purple' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider font-semibold',
    md: 'text-xs px-2.5 py-1 tracking-wide font-medium',
    lg: 'text-sm px-3 py-1.5 font-medium'
  }[size];

  const variantClasses = {
    gold: 'bg-[#FBF5D8] text-[#8E6B15] border border-[#F5E7A6]',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    red: 'bg-rose-50 text-rose-700 border border-rose-200',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200'
  }[variant];

  const dotColors = {
    gold: 'bg-[#D8AD28]',
    green: 'bg-emerald-500',
    red: 'bg-rose-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    gray: 'bg-gray-400'
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase ${sizeClasses} ${variantClasses} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors} ${variant === 'green' ? 'animate-pulse' : ''}`} />
      )}
      {children}
    </span>
  );
};
