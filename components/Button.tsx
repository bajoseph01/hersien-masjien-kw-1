
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary': return 'bg-[#BEF264] text-black'; // Cyber Lime
      case 'secondary': return 'bg-[#A855F7] text-white'; // Electric Purple
      case 'danger': return 'bg-red-500 text-white';
      case 'ghost': return 'bg-zinc-800 text-white border-zinc-700';
      default: return 'bg-white text-black';
    }
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02, x: -2, y: -2 }}
      whileTap={{ scale: 0.95, x: 2, y: 2 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantStyles()}
        neo-border
        neo-shadow-sm
        px-6 py-3
        rounded-xl
        font-black
        text-lg
        uppercase
        tracking-wider
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

export default Button;
