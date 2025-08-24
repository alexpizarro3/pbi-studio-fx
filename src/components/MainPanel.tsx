'use client';

import { useRef } from 'react';
import { CoolorsPaletteGenerator } from './CoolorsPaletteGenerator';
import PaletteVisualizer from './PaletteVisualizer';
import { useThemeStore } from '../../store/theme-store';

export function MainPanel() {
  const {
    currentPaletteColors,
    showPaletteVisualizer,
  } = useThemeStore();

  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <main ref={mainRef} className="flex-1 flex flex-col items-center justify-center overflow-hidden relative bg-gray-800">
      <CoolorsPaletteGenerator />
      {showPaletteVisualizer && (
        <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-5xl h-full p-8 overflow-y-auto">
            <PaletteVisualizer palette={currentPaletteColors} />
          </div>
        </div>
      )}
    </main>
  );
}
