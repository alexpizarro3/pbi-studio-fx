
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PaletteGenerator from './PaletteGenerator';

interface PaletteGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPalette: (colors: string[]) => void;
}

const PaletteGeneratorModal: React.FC<PaletteGeneratorModalProps> = ({ isOpen, onClose, onLoadPalette }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-gradient-to-br from-[#23234e] to-[#0f3460] rounded-lg shadow-xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <PaletteGenerator onPaletteGenerated={(colors) => { onLoadPalette(colors); onClose(); }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaletteGeneratorModal;
