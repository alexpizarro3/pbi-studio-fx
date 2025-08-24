import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import tinycolor from 'tinycolor2';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  index: number;
}

export default function ColorPicker({ color, onChange, index }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(color);
  const [hsv, setHsv] = useState(tinycolor(color).toHsv());

  useEffect(() => {
    setCustomColor(color);
    setHsv(tinycolor(color).toHsv());
  }, [color]);

  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8E8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85929E', '#D5A6BD'
  ];

  const handleColorChange = (newColor: string) => {
    setCustomColor(newColor);
    onChange(newColor);
    setHsv(tinycolor(newColor).toHsv());
  };

  const handleHsvChange = (newHsv: tinycolor.ColorFormats.HSVA) => {
    const newColor = tinycolor(newHsv).toHexString();
    setHsv(newHsv);
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="relative">
      <motion.button
        className="w-8 h-8 rounded-md border-2 border-white/30 relative overflow-hidden shadow-lg"
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute top-10 left-0 z-50 bg-black/90 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-xl"
            style={{ minWidth: '200px' }}
          >
            {/* Custom Color Input */}
            <div className="mb-3">
              <label className="text-white text-xs mb-1 block">Custom Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-8 h-8 rounded border border-white/30 bg-transparent"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/30 rounded px-2 py-1 text-white text-xs"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* HSB Sliders */}
            <div className="mb-3">
              <label className="text-white text-xs mb-1 block">HSB Sliders</label>
              <div className="space-y-2">
                <input type="range" min="0" max="360" value={hsv.h} onChange={(e) => handleHsvChange({ ...hsv, h: parseInt(e.target.value) })} className="w-full" />
                <input type="range" min="0" max="1" step="0.01" value={hsv.s} onChange={(e) => handleHsvChange({ ...hsv, s: parseFloat(e.target.value) })} className="w-full" />
                <input type="range" min="0" max="1" step="0.01" value={hsv.v} onChange={(e) => handleHsvChange({ ...hsv, v: parseFloat(e.target.value) })} className="w-full" />
              </div>
            </div>

            {/* Predefined Colors */}
            <div className="mb-3">
              <label className="text-white text-xs mb-2 block">Quick Colors</label>
              <div className="grid grid-cols-5 gap-1">
                {predefinedColors.map((presetColor) => (
                  <motion.button
                    key={presetColor}
                    className="w-6 h-6 rounded border border-white/30"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handleColorChange(presetColor)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/30 rounded py-1 text-white text-xs transition-colors"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
