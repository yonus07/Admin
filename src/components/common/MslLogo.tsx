import React from 'react';

interface MslLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textColor?: 'dark' | 'light';
  className?: string;
  subtitle?: string;
}

export const MslLogo: React.FC<MslLogoProps> = ({
  size = 'md',
  showText = false,
  textColor = 'dark',
  className = '',
  subtitle = 'PLAYER REGISTRATION'
}) => {
  const shieldDimensions = {
    sm: 'w-8 h-9 text-[10px]',
    md: 'w-11 h-12 text-xs',
    lg: 'w-14 h-16 text-sm',
    xl: 'w-16 h-18 text-base',
    '2xl': 'w-20 h-24 text-xl'
  }[size];

  const titleSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-2xl'
  }[size];

  const subtitleSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[10px]',
    xl: 'text-[11px]',
    '2xl': 'text-xs'
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Yellow Shield Emblem */}
      <div className={`relative flex items-center justify-center font-black ${shieldDimensions} flex-shrink-0`}>
        <svg viewBox="0 0 100 115" className="w-full h-full drop-shadow-sm">
          {/* Outer Shield with Gold Fill */}
          <path
            d="M50 4 L92 22 C92 72, 68 98, 50 110 C32 98, 8 72, 8 22 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="3"
          />
          {/* Inner Inset Border */}
          <path
            d="M50 11 L86 27 C86 68, 64 92, 50 102 C36 92, 14 68, 14 27 Z"
            fill="none"
            stroke="#111111"
            strokeWidth="2.5"
            strokeOpacity="0.85"
          />
          {/* MSL Text inside Shield */}
          <text
            x="50"
            y="64"
            textAnchor="middle"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="900"
            fontSize="26"
            letterSpacing="-0.5"
            fill="#111111"
          >
            MSL
          </text>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <h2
            className={`font-black uppercase tracking-tight leading-none ${titleSizes} ${
              textColor === 'light' ? 'text-white' : 'text-gray-950'
            }`}
          >
            MIELLA SUPER LEAGUE
          </h2>
          <span
            className={`font-extrabold uppercase tracking-widest leading-tight mt-0.5 ${subtitleSizes} text-[#F59E0B]`}
          >
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};
