'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExportModal } from '../../modules/export/ExportModal';
import { PaletteManager } from './components/PaletteManager';
import CustomPaletteBuilder from './components/CustomPaletteBuilder';
import ImagePaletteExtractorModal from '../../modules/preview/ImagePaletteExtractorModal';
import ColorVariationsModal from '../../modules/preview/ColorVariationsModal';
import { useThemeStore } from '../../store/theme-store';
import { PowerBITheme, generatePowerBITheme } from '../../src/utils/powerbi-export';
import toast from 'react-hot-toast';
import { MainPanel } from '../components/MainPanel';
import { ControlPanel } from '../components/ControlPanel';
import { Button } from '~/components/ui/button';
import ColorTemperatureAnalysis from './components/ColorTemperatureAnalysis';

export default function Home() {
  const {
    showExportModal,
    setShowExportModal,
    showPaletteManager,
    setShowPaletteManager,
    showCustomBuilder,
    setShowCustomBuilder,
    showImageExtractor,
    setShowImageExtractor,
    setCurrentPaletteColors,
    currentPaletteColors,
    setLockedColors,
    showRightPanel,
    themeName,
    themeDescription,
    backgroundColor,
    foregroundColor,
    tableAccentColor,
    loadSeasonalPalettes,
  } = useThemeStore();

  useEffect(() => {
    loadSeasonalPalettes();
  }, [loadSeasonalPalettes]);

  const [themeForExport, setThemeForExport] = useState<PowerBITheme | null>(null);
  const [showColorVariationsModal, setShowColorVariationsModal] = useState(false);
  const [selectedColorForVariations, setSelectedColorForVariations] = useState('');

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
      currentPaletteColors,
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

  const handleViewVariations = (color: string) => {
    setSelectedColorForVariations(color);
    setShowColorVariationsModal(true);
  };

  return (
    <div className={`flex flex-col h-screen bg-gradient-to-br from-[#1a1a2e] via-[#23234e] to-[#0f3460] text-white`}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-[#2a2a3c] bg-[#1a1a2e]/50 backdrop-blur-sm">
        <h1 className="text-2xl font-bold tracking-wide">Glowlytics</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handlePrepareExport} className="px-4 py-1.5 text-sm font-semibold rounded-md bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 transition-opacity">Export</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <MainPanel />
        {showRightPanel && <ControlPanel />}
      </div>

      {/* Color Temperature Analysis */}
      <div className="p-4">
        <ColorTemperatureAnalysis palette={currentPaletteColors} />
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
        currentPalette={currentPaletteColors}
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
      <ColorVariationsModal
        isOpen={showColorVariationsModal}
        onClose={() => { console.log('ColorVariationsModal close triggered'); setShowColorVariationsModal(false); }}
        color={selectedColorForVariations}
      />
    </div>
  );
}
