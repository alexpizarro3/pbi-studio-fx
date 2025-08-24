'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { ExportModal } from '../components/ExportModal';
import { PaletteManager } from '../components/PaletteManager';
import CustomPaletteBuilder from '../components/CustomPaletteBuilder';
import ImagePaletteExtractorModal from '../components/ImagePaletteExtractorModal';
import PaletteGeneratorModal from '../components/PaletteGeneratorModal';
import PaletteDisplayItem from '../components/PaletteDisplayItem';
import ColorVariationsModal from '../components/ColorVariationsModal';
import PaletteVisualizer from '../components/PaletteVisualizer'; // New import
import { useThemeStore } from '../../store/theme-store';
import { PowerBITheme, generatePowerBITheme } from '../utils/powerbi-export';
import ColorPicker from '../components/ColorPicker';
import toast from 'react-hot-toast';

// small helper: return a readable foreground (white or near-black) for a given hex background
// helper: sRGB to linear channel
function srgbToLinearChannel(c: number) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex: string) {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  const R = srgbToLinearChannel(r);
  const G = srgbToLinearChannel(g);
  const B = srgbToLinearChannel(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hex1: string, hex2: string) {
  const L1 = luminance(hex1);
  const L2 = luminance(hex2);
  const [a, b] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (a + 0.05) / (b + 0.05);
}

// choose the foreground (white or near-black) that yields the better contrast for the given bg color
function readableOn(hex: string) {
  try {
    const white = '#ffffff';
    const dark = '#111827';
    const contrastWithWhite = contrastRatio(hex, white);
    const contrastWithDark = contrastRatio(hex, dark);
    // prefer the one with higher contrast; if one meets WCAG 4.5, choose it
    if (contrastWithWhite >= 4.5 && contrastWithWhite >= contrastWithDark) return white;
    if (contrastWithDark >= 4.5 && contrastWithDark > contrastWithWhite) return dark;
    // otherwise return whichever has higher contrast
    return contrastWithWhite >= contrastWithDark ? white : dark;
  } catch (e) {
    return '#ffffff';
  }
}

function isAccessible(hex: string) {
  try {
    const fg = readableOn(hex);
    return contrastRatio(hex, fg) >= 4.5;
  } catch (e) {
    return true;
  }
}

export default function Home() {
  const {
    mode,
    setMode,
    animationPreset,
    setAnimationPreset,
    showExportModal,
    setShowExportModal,
    showPaletteManager,
    setShowPaletteManager,
    showCustomBuilder,
    setShowCustomBuilder,
    showImageExtractor,
    setShowImageExtractor,
    showPaletteGenerator,
    setShowPaletteGenerator,
    setCurrentPaletteColors,
    getCurrentPaletteColors,
  } = useThemeStore();

  const [showRightPanel, setShowRightPanel] = useState(true);
  const [themeName, setThemeName] = useState('My Glowlytics Theme');
  const [themeDescription, setThemeDescription] = useState('A custom theme generated with Glowlytics');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [foregroundColor, setForegroundColor] = useState('#252423');
  const [tableAccentColor, setTableAccentColor] = useState('#ffd700'); // Default accent color
  const [themeForExport, setThemeForExport] = useState<PowerBITheme | null>(null);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });
  const [colorPickerColor, setColorPickerColor] = useState('#000000');
  const [colorPickerIndex, setColorPickerIndex] = useState(0);
  const [lockedColors, setLockedColors] = useState<boolean[]>([]);

  const [showColorVariationsModal, setShowColorVariationsModal] = useState(false);
  const [selectedColorForVariations, setSelectedColorForVariations] = useState('');

  const [showPaletteVisualizer, setShowPaletteVisualizer] = useState(false); // New state

  const mainRef = useRef<HTMLDivElement>(null);

  // Handler for loading a custom palette (now sets currentPaletteColors)
  const handleLoadPalette = (colors: string[]) => {
    setCurrentPaletteColors(colors);
    setLockedColors(new Array(colors.length).fill(false)); // Initialize locked state
    toast.success('Palette loaded successfully!');
  };

  // Handler for saving custom palette
  const handleSaveCustomPalette = (colors: string[], name: string) => {
    const savedPalettes = JSON.parse(localStorage.getItem('glowlytics_custom_palettes') || '[]');
    const newPalette = { name, colors, id: Date.now().toString() };
    savedPalettes.push(newPalette);
    localStorage.setItem('glowlytics_custom_palettes', JSON.stringify(savedPalettes));
    
    // Load the newly created palette
    handleLoadPalette(colors);
    toast.success('Palette saved successfully!');
  };

  const handlePrepareExport = () => {
    const theme = generatePowerBITheme(
      getCurrentPaletteColors(),
      themeName,
      {
        description: themeDescription,
        background: backgroundColor,
        foreground: foregroundColor,
        tableAccent: tableAccentColor,
      }
    );
    setThemeForExport(theme);
    setShowExportModal(true);
  };

  // Keyboard event listener for spacebar ONLY (no Escape)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault(); // Prevent scrolling
        setShowPaletteGenerator(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowPaletteGenerator]);

  const handleColorClick = (color: string, index: number, event: React.MouseEvent) => {
    setColorPickerColor(color);
    setColorPickerIndex(index);
    setShowColorPicker(true);

    // Position the color picker near the clicked element
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    if (mainRef.current) {
      const mainRect = mainRef.current.getBoundingClientRect();
      setColorPickerPosition({
        x: rect.left - mainRect.left + rect.width / 2,
        y: rect.top - mainRect.top + rect.height / 2,
      });
    }
  };

  const handleColorPickerChange = (newColor: string) => {
    const updatedColors = [...getCurrentPaletteColors()];
    updatedColors[colorPickerIndex] = newColor;
    setCurrentPaletteColors(updatedColors);
  };

  const handleToggleLock = (index: number) => {
    setLockedColors(prevLockedColors => {
      const newLockedColors = [...prevLockedColors];
      newLockedColors[index] = !newLockedColors[index];
      return newLockedColors;
    });
  };

  const handleViewVariations = (color: string) => {
    setSelectedColorForVariations(color);
    setShowColorVariationsModal(true);
  };

  return (
    <div className={`flex flex-col h-screen bg-gradient-to-br from-[#1a1a2e] via-[#23234e] to-[#0f3460] text-white ${mode === 'elegant' ? 'mode-elegant' : mode === 'vivid' ? 'mode-vivid' : 'mode-minimal'} animation-${animationPreset}`}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-[#2a2a3c] bg-[#1a1a2e]/50 backdrop-blur-sm">
        <h1 className="text-2xl font-bold tracking-wide">Glowlytics</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowRightPanel(!showRightPanel)} className="px-3 py-1.5 text-sm rounded-md bg-white/10 hover:bg-white/20 transition-colors">Toggle Advanced</button>
          <button onClick={handlePrepareExport} className="px-4 py-1.5 text-sm font-semibold rounded-md bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 transition-opacity">Export</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel (Creative Tools) */}
        <aside className={`w-72 bg-gradient-to-br from-[#23232e] via-[#23234e] to-[#0f3460]/80 backdrop-blur-lg border-r border-[#2a2a3c] flex flex-col items-center py-8 shadow-lg overflow-y-auto`}>
          <nav className="flex flex-col gap-4 w-full px-4 mt-4">
            {[
              { name: 'Manage Palettes', action: () => setShowPaletteManager(true), icon: 'store' },
              { name: 'Custom Builder', action: () => setShowCustomBuilder(true), icon: 'create' },
              { name: 'Extract from Image', action: () => setShowImageExtractor(true), icon: 'image' },
              { name: 'Palette Generator', action: () => setShowPaletteGenerator(true), icon: 'palette' },
              { name: 'Palette Visualizer', action: () => setShowPaletteVisualizer(true), icon: 'eye' } // New button
            ].map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className="font-semibold text-sm px-3 py-2 rounded-md overflow-hidden group flex items-center focus:outline-none transition-transform duration-200 active:scale-95 hover:bg-white/5 text-left"
              >
                <Icon name={item.icon as any} className="mr-3" />
                {item.name}
              </button>
            ))}
             <div className="pt-4 flex gap-2 items-center px-3">
              <label className="text-xs text-[#bfbff5]">Mode</label>
              <select aria-label="UI Mode" value={mode} onChange={(e) => setMode(e.target.value as any)} className="w-full bg-transparent border border-[#2a2a3c] rounded px-2 py-1 text-sm">
                <option value="elegant">Elegant</option>
                <option value="minimal">Minimal</option>
                <option value="vivid">Vivid</option>
              </select>
            </div>
            <div className="pt-2 flex gap-2 items-center px-3">
              <label className="text-xs text-[#bfbff5]">Animation</label>
              <select 
                aria-label="Animation Preset" 
                value={animationPreset} 
                onChange={(e) => setAnimationPreset(e.target.value as any)} 
                className="w-full bg-transparent border border-[#2a2a3c] rounded px-2 py-1 text-sm"
              >
                <option value="smooth">Smooth</option>
                <option value="bouncy">Bouncy</option>
                <option value="crisp">Crisp</option>
              </select>
            </div>
          </nav>
        </aside>

        {/* Center Panel (Live Preview) */}
        <main ref={mainRef} className="flex-1 flex items-stretch justify-center overflow-hidden relative">
          {getCurrentPaletteColors().map((color, index) => (
            <PaletteDisplayItem
              key={index}
              color={color}
              isLocked={lockedColors[index]}
              onColorClick={(e) => handleColorClick(color, index, e)}
              onToggleLock={() => handleToggleLock(index)}
              onViewVariations={() => handleViewVariations(color)}
            />
          ))}

          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute z-50"
              style={{
                top: colorPickerPosition.y,
                left: colorPickerPosition.x,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <ColorPicker
                color={colorPickerColor}
                onChange={handleColorPickerChange}
                index={colorPickerIndex}
              />
            </motion.div>
          )}
        </main>

        {/* Right Panel (Advanced Properties) */}
        {showRightPanel && (
          <aside className="w-72 bg-[#1f1f3d]/70 backdrop-blur-lg border-l border-[#2a2a3c] p-6 shadow-lg overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Advanced Properties</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="themeName" className="block text-sm font-medium text-gray-300 mb-1">Theme Name</label>
                <input
                  type="text"
                  id="themeName"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                  placeholder="My Custom Theme"
                />
              </div>
              <div>
                <label htmlFor="themeDescription" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  id="themeDescription"
                  value={themeDescription}
                  onChange={(e) => setThemeDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                  placeholder="A theme for my company's reports..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Background</label>
                <ColorPicker color={backgroundColor} onChange={setBackgroundColor} index={0} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Foreground</label>
                <ColorPicker color={foregroundColor} onChange={setForegroundColor} index={1} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Table Accent</label>
                <ColorPicker color={tableAccentColor} onChange={setTableAccentColor} index={2} />
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Modals */}
      <ExportModal 
        isOpen={showExportModal}
        onClose={() => { console.log('ExportModal close triggered'); setShowExportModal(false); }}
        theme={themeForExport}
      />
      <PaletteManager 
        isOpen={showPaletteManager}
        onClose={() => { console.log('PaletteManager close triggered'); setShowPaletteManager(false); }}
        currentPalette={getCurrentPaletteColors()}
        onLoadPalette={handleLoadPalette}
      />
      <CustomPaletteBuilder
        isOpen={showCustomBuilder}
        onClose={() => { console.log('CustomPaletteBuilder close triggered'); setShowCustomBuilder(false); }}
        onSave={handleSaveCustomPalette}
      />
      <ImagePaletteExtractorModal
        isOpen={showImageExtractor}
        onClose={() => { console.log('ImagePaletteExtractorModal close triggered'); setShowImageExtractor(false); }}
        onLoadPalette={handleLoadPalette}
      />
      <PaletteGeneratorModal
        isOpen={showPaletteGenerator}
        onClose={() => { console.log('PaletteGeneratorModal close triggered'); setShowPaletteGenerator(false); }}
        onLoadPalette={handleLoadPalette}
        currentPaletteColors={getCurrentPaletteColors()}
        lockedColors={lockedColors}
      />
      <ColorVariationsModal 
        isOpen={showColorVariationsModal}
        onClose={() => { console.log('ColorVariationsModal close triggered'); setShowColorVariationsModal(false); }}
        color={selectedColorForVariations}
      />
      <PaletteVisualizer 
        isOpen={showPaletteVisualizer}
        onClose={() => { console.log('PaletteVisualizer close triggered'); setShowPaletteVisualizer(false); }}
        palette={getCurrentPaletteColors()}
      />
    </div>
  );
}