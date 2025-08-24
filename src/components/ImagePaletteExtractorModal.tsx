'use client';

import React, { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import { Icon } from './Icon';

const LazyImagePaletteExtractor = lazy(() => import('./ImagePaletteExtractor'));

interface ImagePaletteExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPalette: (colors: string[]) => void;
}

export default function ImagePaletteExtractorModal({ isOpen, onClose, onLoadPalette }: ImagePaletteExtractorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={e => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <FocusTrap active={isOpen} focusTrapOptions={{ escapeDeactivates: false, allowOutsideClick: true, onDeactivate: () => {} }}>
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg p-6 bg-gradient-to-br from-[#23234e] to-[#0f3460] border border-[#2a2a3c] rounded-lg shadow-xl text-white"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Extract Palette from Image</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
                  <Icon name="close" />
                </button>
              </div>
              <Suspense fallback={<div>Loading extractor...</div>}>
                <LazyImagePaletteExtractor onPaletteExtracted={onLoadPalette} />
              </Suspense>
            </motion.div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  );
}