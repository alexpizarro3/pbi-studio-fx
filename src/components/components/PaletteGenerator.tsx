
import React, { useState } from 'react';
import tinycolor from 'tinycolor2';

interface PaletteGeneratorProps {
  onPaletteGenerated: (colors: string[]) => void;
}

const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({ onPaletteGenerated }) => {
  const [baseColor, setBaseColor] = useState('#ff0000');
  const [palette, setPalette] = useState<string[]>([]);

  const generatePalette = (type: string) => {
    const color = tinycolor(baseColor);
    let newPalette: tinycolor.Instance[] = [];

    switch (type) {
      case 'analogous':
        newPalette = color.analogous();
        break;
      case 'triadic':
        newPalette = color.triad();
        break;
      case 'tetradic':
        newPalette = color.tetrad();
        break;
      case 'complementary':
        newPalette = [color, color.complement()];
        break;
      default:
        newPalette = [color];
    }

    setPalette(newPalette.map(c => c.toHexString()));
  };

  const handleUsePalette = () => {
    onPaletteGenerated(palette);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Interactive Palette Generator</h2>
      <div className="mb-4">
        <label htmlFor="baseColor" className="block text-sm font-medium text-gray-300 mb-1">Base Color</label>
        <input
          type="color"
          id="baseColor"
          value={baseColor}
          onChange={(e) => setBaseColor(e.target.value)}
          className="w-full h-10 p-1 border rounded"
        />
      </div>
      <div className="mb-4 flex gap-2">
        <button onClick={() => generatePalette('analogous')} className="px-3 py-1.5 text-sm rounded-md bg-white/10 hover:bg-white/20 transition-colors">Analogous</button>
        <button onClick={() => generatePalette('triadic')} className="px-3 py-1.5 text-sm rounded-md bg-white/10 hover:bg-white/20 transition-colors">Triadic</button>
        <button onClick={() => generatePalette('tetradic')} className="px-3 py-1.5 text-sm rounded-md bg-white/10 hover:bg-white/20 transition-colors">Tetradic</button>
        <button onClick={() => generatePalette('complementary')} className="px-3 py-1.5 text-sm rounded-md bg-white/10 hover:bg-white/20 transition-colors">Complementary</button>
      </div>
      {palette.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-2">Generated Palette:</h3>
          <div className="flex">
            {palette.map((color, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={handleUsePalette}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Use this Palette
          </button>
        </div>
      )}
    </div>
  );
};

export default PaletteGenerator;
