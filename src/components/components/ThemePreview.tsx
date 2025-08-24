'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ThemePreviewProps {
  palette: string[];
  name: string;
}

export default function ThemePreview({ palette, name }: ThemePreviewProps) {
  const previewItems = [
    { type: 'chart', label: 'Bar Chart' },
    { type: 'kpi', label: 'KPI Card' },
    { type: 'table', label: 'Data Table' },
    { type: 'visual', label: 'Visual Header' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
      <h3 className="text-white font-semibold mb-3">{name} Preview</h3>
      
      {/* Color Palette Bar */}
      <div className="flex gap-1 mb-4 rounded-lg overflow-hidden">
        {palette.map((color, index) => (
          <motion.div
            key={index}
            className="h-8 flex-1"
            style={{ backgroundColor: color }}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            title={color}
          />
        ))}
      </div>

      {/* Mock Dashboard Elements */}
      <div className="grid grid-cols-2 gap-3">
        {previewItems.map((item, index) => (
          <motion.div
            key={item.type}
            className="bg-white/5 rounded-md p-3 border border-white/10"
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <div className="text-xs text-white/70 mb-2">{item.label}</div>
            
            {item.type === 'chart' && (
              <div className="flex items-end gap-1 h-12">
                {palette.slice(0, 4).map((color, i) => (
                  <div
                    key={i}
                    className="rounded-sm flex-1"
                    style={{ 
                      backgroundColor: color,
                      height: `${30 + (i * 10)}%`
                    }}
                  />
                ))}
              </div>
            )}

            {item.type === 'kpi' && (
              <div className="text-center">
                <div 
                  className="text-lg font-bold"
                  style={{ color: palette[0] }}
                >
                  $2.4M
                </div>
                <div className="text-xs text-white/50">Revenue</div>
              </div>
            )}

            {item.type === 'table' && (
              <div className="space-y-1">
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: palette[row % palette.length] }}
                    />
                    <div className="text-xs text-white/60 flex-1">Data {row + 1}</div>
                  </div>
                ))}
              </div>
            )}

            {item.type === 'visual' && (
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: palette[0] }}
                />
                <div className="text-xs text-white/60">Visual Title</div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
