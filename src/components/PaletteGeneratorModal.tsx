'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import { Icon } from './Icon';
import tinycolor from 'tinycolor2';

interface PaletteGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPalette: (colors: string[]) => void;
  currentPaletteColors: string[];
  lockedColors: boolean[];
}

const generateRandomColor = () => {
  return tinycolor.random().toHexString();
};

const generateHarmoniousColor = (baseColor: tinycolor.Instance, harmonyType: string, index: number) => {
  let generated: tinycolor.Instance[] = [];
  switch (harmonyType) {
    case 'complementary':
      generated = [baseColor, baseColor.complement()];
      break;
    case 'triadic':
      generated = baseColor.triad();
      break;
    case 'analogous':
      generated = baseColor.analogous();
      break;
    case 'monochromatic':
      generated = baseColor.monochromatic();
      break;
    case 'splitcomplementary':
      generated = baseColor.splitcomplement();
      break;
    case 'tetradic':
      generated = baseColor.tetrad();
      break;
    default:
      return generateRandomColor();
  }
  // Cycle through generated harmonious colors or fall back to random if not enough
  return generated[index % generated.length]?.toHexString() || generateRandomColor();
};

export default function PaletteGeneratorModal({ isOpen, onClose, onLoadPalette, currentPaletteColors, lockedColors }: PaletteGeneratorModalProps) {
  const [seedColor, setSeedColor] = useState('#1a1a2e');
  const [harmonyType, setHarmonyType] = useState('analogous');
  const [generatedColors, setGeneratedColors] = useState<{ color: string; isLocked: boolean }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const initialColors = currentPaletteColors.map((color, index) => ({
        color: color,
        isLocked: lockedColors[index] || false,
      }));
      while (initialColors.length < 5) {
        initialColors.push({ color: generateRandomColor(), isLocked: false });
      }
      setGeneratedColors(initialColors);
    }
  }, [isOpen, currentPaletteColors, lockedColors]);

  const generateNewPalette = () => {
    const baseColor = tinycolor(seedColor);
    const newColors = generatedColors.map((item, index) => {
      if (item.isLocked) {
        return item;
      } else {
        const newColor = (baseColor.isValid() && harmonyType) 
          ? generateHarmoniousColor(baseColor, harmonyType, index)
          : generateRandomColor();
        return { color: newColor, isLocked: false };
      }
    });
    setGeneratedColors(newColors);
  };

  const toggleLock = (index: number) => {
    setGeneratedColors(prevColors =>
      prevColors.map((item, i) =>
        i === index ? { ...item, isLocked: !item.isLocked } : item
      )
    );
  };

  const applyPalette = () => {
    onLoadPalette(generatedColors.map(item => item.color));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <FocusTrap active={isOpen}>
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg p-6 bg-gradient-to-br from-[#23234e] to-[#0f3460] border border-[#2a2a3c] rounded-lg shadow-xl text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Palette Generator</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
                  <Icon name="close" />
                </button>
              </div>
              <div className="space-y-4">
                {/* Seed Color and Harmony Type */}
                <div>
                  <label htmlFor="seedColor" className="block text-sm font-medium text-gray-300 mb-1">Seed Color</label>
                  <input
                    type="color"
                    id="seedColor"
                    value={seedColor}
                    onChange={(e) => setSeedColor(e.target.value)}
                    className="w-full h-10 rounded-md border border-white/10 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label htmlFor="harmonyType" className="block text-sm font-medium text-gray-300 mb-1">Harmony Type</label>
                  <select
                    id="harmonyType"
                    value={harmonyType}
                    onChange={(e) => setHarmonyType(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                  >
                    <option value="random">Random</option>
                    <option value="analogous">Analogous</option>
                    <option value="monochromatic">Monochromatic</option>
                    <option value="complementary">Complementary</option>
                    <option value="splitcomplementary">Split Complementary</option>
                    <option value="triadic">Triadic</option>
                    <option value="tetradic">Tetradic</option>
                  </select>
                </div>

                <div className="grid grid-cols-5 gap-2 mt-4">
                  {generatedColors.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-16 h-16 rounded-md flex items-center justify-center relative"
                        style={{ backgroundColor: item.color }}
                      >
                        <button
                          onClick={() => toggleLock(index)}
                          className="absolute bottom-1 right-1 p-1 rounded-full bg-black/30 hover:bg-black/50 text-white"
                        >
                          <Icon name={item.isLocked ? 'lock' : 'unlock'} size={16} />
                        </button>
                      </div>
                      <span className="text-xs mt-1">{item.color.toUpperCase()}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={generateNewPalette}
                  className="w-full px-4 py-2 font-semibold rounded-md bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 transition-opacity mt-4"
                >
                  Generate New Palette
                </button>

                <button
                  onClick={applyPalette}
                  className="w-full px-4 py-2 font-semibold rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors mt-2"
                >
                  Apply Palette
                </button>
              </div>
            </motion.div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
