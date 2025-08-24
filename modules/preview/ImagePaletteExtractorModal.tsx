'use client';

import React, { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './Icon';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '~/components/ui/dialog';

const LazyImagePaletteExtractor = lazy(() => import('./ImagePaletteExtractor'));

interface ImagePaletteExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPalette: (colors: string[]) => void;
}

export default function ImagePaletteExtractorModal({ isOpen, onClose, onLoadPalette }: ImagePaletteExtractorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="relative w-full max-w-lg p-6 bg-gradient-to-br from-[#23234e] to-[#0f3460] border border-[#2a2a3c] rounded-lg shadow-xl text-white">
        <DialogHeader>
          <DialogTitle>Extract Palette from Image</DialogTitle>
        </DialogHeader>
        <Suspense fallback={<div>Loading extractor...</div>}>
          <LazyImagePaletteExtractor onPaletteExtracted={onLoadPalette} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}