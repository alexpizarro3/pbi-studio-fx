'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import toast from 'react-hot-toast';

interface PaletteDisplayItemProps {
  color: string;
  isLocked: boolean;
  onColorClick: (color: string, event: React.MouseEvent) => void;
  onToggleLock: () => void;
  onViewVariations: () => void; // New prop
}

export default function PaletteDisplayItem({ color, isLocked, onColorClick, onToggleLock, onViewVariations }: PaletteDisplayItemProps) {
  const [showControls, setShowControls] = useState(false);

  const handleCopyHex = () => {
    navigator.clipboard.writeText(color.toUpperCase());
    toast.success(`Copied ${color.toUpperCase()}`);
  };

  return (
    <motion.div
      className="relative flex-1 flex items-center justify-center cursor-pointer group"
      style={{ backgroundColor: color }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={(e) => onColorClick(color, e)}
      layout
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-2 flex gap-2"
        >
          <button
            onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
            className="p-1 rounded-full bg-black/50 hover:bg-black/70 text-white"
          >
            <Icon name={isLocked ? 'lock' : 'unlock'} size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleCopyHex(); }}
            className="p-1 rounded-full bg-black/50 hover:bg-black/70 text-white"
          >
            <Icon name="copy" size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onViewVariations(); }}
            className="p-1 rounded-full bg-black/50 hover:bg-black/70 text-white"
          >
            <Icon name="eye" size={16} />
          </button>
        </motion.div>
      )}
      <span className="absolute top-2 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        {color.toUpperCase()}
      </span>
    </motion.div>
  );
}
