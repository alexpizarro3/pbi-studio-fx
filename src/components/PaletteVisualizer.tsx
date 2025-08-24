'use client';

import { AnimatePresence, motion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import { Icon } from './Icon';

interface PaletteVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  palette: string[];
}

export default function PaletteVisualizer({ isOpen, onClose, palette }: PaletteVisualizerProps) {
  if (!palette || palette.length === 0) return null;

  // Assign colors from the palette to semantic roles in the mock design
  const primaryColor = palette[0] || '#000000';
  const secondaryColor = palette[1] || '#333333';
  const accentColor = palette[2] || '#FF0000';
  const textColor = palette[3] || '#FFFFFF';
  const backgroundColor = palette[4] || '#1a1a2e';

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
              className="relative w-full max-w-4xl p-6 bg-gradient-to-br from-[#23234e] to-[#0f3460] border border-[#2a2a3c] rounded-lg shadow-xl text-white overflow-y-auto max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Palette Visualizer</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
                  <Icon name="close" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Website Mockup */}
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <div style={{ backgroundColor: primaryColor, color: textColor }} className="p-4 text-center font-bold text-lg">
                    Website Header
                  </div>
                  <div style={{ backgroundColor: backgroundColor, color: textColor }} className="p-6">
                    <h3 style={{ color: accentColor }} className="text-xl font-semibold mb-2">Welcome to our site!</h3>
                    <p className="text-sm mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <button style={{ backgroundColor: accentColor, color: textColor }} className="px-4 py-2 rounded-md text-sm font-medium">
                      Learn More
                    </button>
                  </div>
                  <div style={{ backgroundColor: secondaryColor, color: textColor }} className="p-4 text-center text-xs">
                    Footer Content
                  </div>
                </div>

                {/* Dashboard Mockup */}
                <div className="border border-gray-700 rounded-lg p-4" style={{ backgroundColor: backgroundColor }}>
                  <h3 style={{ color: primaryColor }} className="text-lg font-semibold mb-4">Dashboard Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: secondaryColor, color: textColor }}>
                      <div className="text-sm" style={{ color: accentColor }}>Sales</div>
                      <div className="text-2xl font-bold">$12,345</div>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: secondaryColor, color: textColor }}>
                      <div className="text-sm" style={{ color: accentColor }}>Users</div>
                      <div className="text-2xl font-bold">1,234</div>
                    </div>
                  </div>
                  <div className="mt-4 h-32 rounded-lg" style={{ backgroundColor: primaryColor }}>
                    {/* Chart Placeholder */}
                    <div className="flex items-center justify-center h-full text-white/70 text-sm">Chart Area</div>
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
