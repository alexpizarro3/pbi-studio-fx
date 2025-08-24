'use client';

import { AnimatePresence, motion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import { Icon } from './Icon';
import tinycolor from 'tinycolor2';

interface ColorVariationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export default function ColorVariationsModal({ isOpen, onClose, color }: ColorVariationsModalProps) {
  if (!color) return null;

  const baseColor = tinycolor(color);

  const generateVariations = (method: string) => {
    const variations: string[] = [];
    for (let i = 0; i <= 10; i++) {
      const percentage = i * 10;
      if (method === 'tint') {
        variations.push(baseColor.tint(percentage).toHexString());
      } else if (method === 'shade') {
        variations.push(baseColor.shade(percentage).toHexString());
      } else if (method === 'tone') {
        // Tones are typically created by adding grey. tinycolor2 doesn't have a direct tone method.
        // A common way to approximate tones is to desaturate and lighten/darken.
        // For simplicity, we'll use a combination of desaturation and slight shade/tint.
        // This is a simplified approximation.
        const tonedColor = baseColor.desaturate(percentage / 2).darken(percentage / 4);
        variations.push(tonedColor.toHexString());
      }
    }
    return variations;
  };

  const tints = generateVariations('tint');
  const shades = generateVariations('shade');
  const tones = generateVariations('tone');

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
              className="relative w-full max-w-2xl p-6 bg-gradient-to-br from-[#23234e] to-[#0f3460] border border-[#2a2a3c] rounded-lg shadow-xl text-white overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Color Variations: {color.toUpperCase()}</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
                  <Icon name="close" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Base Color */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-2 border-white/50" style={{ backgroundColor: color }}></div>
                  <span className="mt-2 text-lg font-semibold">Base Color</span>
                </div>

                {/* Tints */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tints (add white)</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tints.map((tintColor, index) => (
                      <div key={index} className="w-12 h-12 rounded-md" style={{ backgroundColor: tintColor }}>
                        <span className="text-xs text-white opacity-0 hover:opacity-100 transition-opacity p-1 block text-center" style={{ color: tinycolor(tintColor).isLight() ? '#333' : '#fff' }}>{tintColor.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shades */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Shades (add black)</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {shades.map((shadeColor, index) => (
                      <div key={index} className="w-12 h-12 rounded-md" style={{ backgroundColor: shadeColor }}>
                        <span className="text-xs text-white opacity-0 hover:opacity-100 transition-opacity p-1 block text-center" style={{ color: tinycolor(shadeColor).isLight() ? '#333' : '#fff' }}>{shadeColor.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tones (simplified) */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tones (add grey - simplified)</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tones.map((toneColor, index) => (
                      <div key={index} className="w-12 h-12 rounded-md" style={{ backgroundColor: toneColor }}>
                        <span className="text-xs text-white opacity-0 hover:opacity-100 transition-opacity p-1 block text-center" style={{ color: tinycolor(toneColor).isLight() ? '#333' : '#fff' }}>{toneColor.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
