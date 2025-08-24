'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { 
  saveCustomPalette, 
  getCustomPalettes, 
  deleteCustomPalette, 
  generatePaletteId,
  PaletteData 
} from '../utils/powerbi-export';
import { useThemeStore } from '../../store/theme-store';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '~/components/ui/dialog';

interface PaletteManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPalette: string[];
  onLoadPalette: (palette: string[]) => void;
}

export function PaletteManager({ isOpen, onClose, currentPalette, onLoadPalette }: PaletteManagerProps) {
  const {
    seasonalPalettes,
    customPalettes,
    addCustomPalette,
    removeCustomPalette,
    loadSeasonalPalettes,
  } = useThemeStore();

  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (isOpen) {
      loadSeasonalPalettes();
    }
  }, [isOpen, loadSeasonalPalettes]);

  const filteredPalettes = () => {
    switch (activeCategory) {
      case 'Seasonal':
        return seasonalPalettes;
      case 'Custom':
        return customPalettes;
      default:
        return [...seasonalPalettes, ...customPalettes];
    }
  };

  const handleSaveCurrentPalette = (name: string) => {
    const newPalette = {
      id: generatePaletteId(),
      name: name.trim(),
      colors: currentPalette,
      category: 'Custom' as const,
      description: `Custom palette with ${currentPalette.length} colors`,
      createdAt: new Date().toISOString(),
    };
    addCustomPalette(newPalette);
  };

  const handleDeletePalette = (id: string) => {
    removeCustomPalette(id);
  };

  const handleLoadPalette = (palette: PaletteData) => {
    onLoadPalette(palette.colors);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Palette Manager</DialogTitle>
          <DialogDescription>Save, load, and manage your color palettes</DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button onClick={() => setActiveCategory('All')} className={`px-4 py-2 rounded-lg ${activeCategory === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>All</Button>
              <Button onClick={() => setActiveCategory('Seasonal')} className={`px-4 py-2 rounded-lg ${activeCategory === 'Seasonal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Seasonal</Button>
              <Button onClick={() => setActiveCategory('Custom')} className={`px-4 py-2 rounded-lg ${activeCategory === 'Custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Custom</Button>
            </div>
          </div>

          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {filteredPalettes().map((palette) => (
              <motion.div
                key={palette.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{palette.name}</h4>
                    <p className="text-sm text-gray-500">{palette.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleLoadPalette(palette)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Load
                    </Button>
                    {palette.category === 'Custom' && (
                      <Button
                        onClick={() => handleDeletePalette(palette.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-8 gap-1">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded border border-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
