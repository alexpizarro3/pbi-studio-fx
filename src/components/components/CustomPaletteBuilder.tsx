'use client';

import React, { useEffect, useRef, useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/theme-store';

interface CustomPaletteBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (palette: string[], name: string) => void;
}

export default function CustomPaletteBuilder({ isOpen, onClose, onSave }: CustomPaletteBuilderProps) {
  const store = useThemeStore();
  const isOpenLocal = typeof isOpen === 'boolean' ? isOpen : store.showCustomBuilder;
  const onCloseLocal = onClose ?? (() => store.setShowCustomBuilder(false));

  const modalRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!isOpenLocal) return;
    // initial focus handled by focusTrap initialFocus option
    setTimeout(() => firstRef.current?.focus(), 0);
  }, [isOpenLocal]);

  const focusTrapOptions = {
    escapeDeactivates: true,
    onDeactivate: onCloseLocal,
    initialFocus: () => firstRef.current || undefined,
  };

  const [palette, setPalette] = useState([
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'
  ]);
  const [paletteName, setPaletteName] = useState('');

  const updateColor = (index: number, color: string) => {
    const newPalette = [...palette];
    newPalette[index] = color;
    setPalette(newPalette);
  };

  const addColor = () => {
    if (palette.length < 12) {
      setPalette([...palette, '#000000']);
    }
  };

  const removeColor = (index: number) => {
    if (palette.length > 3) {
      setPalette(palette.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (paletteName.trim()) {
      onSave(palette, paletteName.trim());
      setPaletteName('');
      onClose();
    }
  };

  const generateHarmony = (baseColor: string, type: 'complementary' | 'triadic' | 'analogous') => {
    // Simple color harmony generation
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    let colors = [baseColor];

    switch (type) {
      case 'complementary':
        colors.push(`#${(255 - r).toString(16).padStart(2, '0')}${(255 - g).toString(16).padStart(2, '0')}${(255 - b).toString(16).padStart(2, '0')}`);
        break;
      case 'triadic':
        colors.push(
          `#${((r + 85) % 255).toString(16).padStart(2, '0')}${((g + 85) % 255).toString(16).padStart(2, '0')}${((b + 85) % 255).toString(16).padStart(2, '0')}`,
          `#${((r + 170) % 255).toString(16).padStart(2, '0')}${((g + 170) % 255).toString(16).padStart(2, '0')}${((b + 170) % 255).toString(16).padStart(2, '0')}`
        );
        break;
      case 'analogous':
        colors.push(
          `#${Math.max(0, r - 30).toString(16).padStart(2, '0')}${Math.max(0, g - 30).toString(16).padStart(2, '0')}${Math.min(255, b + 30).toString(16).padStart(2, '0')}`,
          `#${Math.min(255, r + 30).toString(16).padStart(2, '0')}${Math.min(255, g + 30).toString(16).padStart(2, '0')}${Math.max(0, b - 30).toString(16).padStart(2, '0')}`
        );
        break;
    }

    // Fill remaining slots with variations
    while (colors.length < 8) {
      const variation = colors[colors.length % 3];
      const vHex = variation.replace('#', '');
      const vR = parseInt(vHex.substr(0, 2), 16);
      const vG = parseInt(vHex.substr(2, 2), 16);
      const vB = parseInt(vHex.substr(4, 2), 16);
      
      const lighter = `#${Math.min(255, vR + 40).toString(16).padStart(2, '0')}${Math.min(255, vG + 40).toString(16).padStart(2, '0')}${Math.min(255, vB + 40).toString(16).padStart(2, '0')}`;
      colors.push(lighter);
    }

    setPalette(colors.slice(0, 8));
  };

  return (
    <AnimatePresence>
      {isOpenLocal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            ref={modalRef}
            className="bg-black/90 backdrop-blur-md rounded-xl p-6 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <FocusTrap active={isOpenLocal} focusTrapOptions={focusTrapOptions}>
              <div role="dialog" aria-modal="true" aria-labelledby="custom-palette-title">
                <h2 id="custom-palette-title" className="text-2xl font-bold text-white mb-6">Custom Palette Builder</h2>

            {/* Palette Name Input */}
            <div className="mb-6">
              <label className="text-white text-sm mb-2 block">Palette Name</label>
              <input
                ref={firstRef}
                type="text"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50"
                placeholder="Enter palette name..."
              />
            </div>

            {/* Color Harmony Generators */}
            <div className="mb-6">
              <label className="text-white text-sm mb-2 block">Quick Harmony</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="color"
                  className="w-12 h-8 rounded border border-white/30"
                  onChange={(e) => generateHarmony(e.target.value, 'complementary')}
                />
                <button
                  onClick={() => generateHarmony(palette[0], 'complementary')}
                  className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded text-white text-xs transition-colors"
                >
                  Complementary
                </button>
                <button
                  onClick={() => generateHarmony(palette[0], 'triadic')}
                  className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded text-white text-xs transition-colors"
                >
                  Triadic
                </button>
                <button
                  onClick={() => generateHarmony(palette[0], 'analogous')}
                  className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded text-white text-xs transition-colors"
                >
                  Analogous
                </button>
              </div>
            </div>

            {/* Color Grid */}
            <div className="mb-6">
              <label className="text-white text-sm mb-2 block">Colors ({palette.length}/12)</label>
              <div className="grid grid-cols-4 gap-3">
                {palette.map((color, index) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div
                      className="w-full h-16 rounded-lg border-2 border-white/30 relative overflow-hidden cursor-pointer"
                      style={{ backgroundColor: color }}
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    </div>
                    
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                      className="w-full mt-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-xs text-center"
                    />
                    
                    {palette.length > 3 && (
                      <button
                        onClick={() => removeColor(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    )}
                  </motion.div>
                ))}
                
                {palette.length < 12 && (
                  <motion.button
                    onClick={addColor}
                    className="w-full h-16 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl">+</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="mb-6">
              <label className="text-white text-sm mb-2 block">Preview</label>
              <div className="flex gap-1 rounded-lg overflow-hidden h-8">
                {palette.map((color, index) => (
                  <div
                    key={index}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg py-2 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!paletteName.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:opacity-50 rounded-lg py-2 text-white transition-colors"
              >
                Save Palette
              </button>
            </div>
                </div>
              </FocusTrap>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
