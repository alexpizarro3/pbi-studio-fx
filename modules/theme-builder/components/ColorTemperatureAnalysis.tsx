'use client';

import React from 'react';
import { analyzeColorTemperature } from '~/public/lib/lib/color-engine';

interface ColorTemperatureAnalysisProps {
  palette: string[];
}

export default function ColorTemperatureAnalysis({ palette }: ColorTemperatureAnalysisProps) {
  if (!palette || palette.length === 0) return null;

  const temperature = analyzeColorTemperature(palette);

  const getExplanation = () => {
    switch (temperature) {
      case 'warm':
        return "This palette leans towards warm tones (reds, oranges, yellows), often evoking feelings of energy, passion, or comfort.";
      case 'cool':
        return "This palette leans towards cool tones (blues, greens, purples), often evoking feelings of calm, serenity, or professionalism.";
      case 'neutral':
        return "This palette has a balanced mix of warm and cool tones, or consists primarily of neutral colors, making it versatile and adaptable.";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white/10 p-4 rounded-lg shadow-inner text-white">
      <h3 className="text-lg font-semibold mb-2">Color Temperature Analysis</h3>
      <p className="text-xl font-bold capitalize mb-2">{temperature}</p>
      <p className="text-sm text-white/80">{getExplanation()}</p>
    </div>
  );
}
