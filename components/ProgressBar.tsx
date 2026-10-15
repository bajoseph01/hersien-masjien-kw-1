
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.min(100, (current / total) * 100);

  return (
    <div className="w-full h-8 bg-zinc-800 neo-border rounded-full overflow-hidden relative">
      <motion.div
        className="h-full bg-[#BEF264]"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-white/20"
        />
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center mix-blend-difference font-bold text-xs uppercase tracking-tighter">
        {current} / {total} VRAE VOLTOOI
      </div>
    </div>
  );
};

export default ProgressBar;
