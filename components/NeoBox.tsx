
import React from 'react';

interface NeoBoxProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  noShadow?: boolean;
}

const NeoBox: React.FC<NeoBoxProps> = ({ 
  children, 
  color = 'bg-white', 
  className = '',
  noShadow = false
}) => {
  return (
    <div className={`
      ${color} 
      neo-border 
      ${noShadow ? '' : 'neo-shadow'} 
      rounded-2xl 
      p-6 
      ${className}
    `}>
      {children}
    </div>
  );
};

export default NeoBox;
