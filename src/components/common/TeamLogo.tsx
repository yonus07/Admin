import React from 'react';
import { Team } from '../../types';

interface TeamLogoProps {
  team?: Team | null;
  name?: string;
  shortName?: string;
  logo?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const TeamLogo: React.FC<TeamLogoProps> = ({
  team,
  name,
  shortName,
  logo,
  size = 'md',
  className = ''
}) => {
  const tName = team?.name || name || 'Team';
  const tShort = team?.shortName || shortName || tName.substring(0, 2).toUpperCase();
  const tLogo = team?.logo || logo;
  const primaryColor = team?.primaryColor || '#111111';

  const sizeMap = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-3xl'
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl font-bold shadow-xs select-none transition-transform duration-200 border border-black/10 ${sizeMap[size]} ${className}`}
      style={{
        backgroundColor: primaryColor,
        color: '#FFFFFF'
      }}
      title={tName}
    >
      {tLogo ? (
        <span>{tLogo}</span>
      ) : (
        <span className="font-extrabold tracking-tight">{tShort}</span>
      )}
    </div>
  );
};
