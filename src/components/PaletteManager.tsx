'use client';

import { useEffect, useRef, useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { 
  saveCustomPalette, 
  getCustomPalettes, 
  deleteCustomPalette, 
  generatePaletteId,
  PaletteData 
} from '../utils/powerbi-export';
import { useThemeStore } from '../../store/theme-store';

interface PaletteManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPalette: string[];
  onLoadPalette: (palette: string[]) => void;
}

export function PaletteManager({ isOpen, onClose, currentPalette, onLoadPalette }: PaletteManagerProps) {
  const store = useThemeStore();
  const isOpenLocal = typeof isOpen === 'boolean' ? isOpen : store.showPaletteManager;
  const onCloseLocal = onClose ?? (() => store.setShowPaletteManager(false));
  const currentPaletteLocal = currentPalette ?? store.getCurrentPaletteColors();

  const [customPalettes, setCustomPalettes] = useState<PaletteData[]>([]);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [editingPalette, setEditingPalette] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (isOpenLocal) loadCustomPalettes();
  }, [isOpenLocal]);

  const focusTrapOptions = {
    escapeDeactivates: true,
    onDeactivate: onCloseLocal,
    initialFocus: () => firstRef.current || undefined,
  };

  const loadCustomPalettes = () => {
    const palettes = getCustomPalettes();
    setCustomPalettes(palettes);
  };

  const handleSaveCurrentPalette = () => {
    if (!newPaletteName.trim()) return;

  const newPalette: PaletteData = {
      id: generatePaletteId(),
      name: newPaletteName.trim(),
      colors: currentPalette,
      category: 'Custom',
      description: `Custom palette with ${currentPalette.length} colors`,
      createdAt: new Date().toISOString()
    };

    saveCustomPalette(newPalette);
    loadCustomPalettes();
    setIsCreateMode(false);
    setNewPaletteName('');
  };

  const handleDeletePalette = (id: string) => {
    deleteCustomPalette(id);
    loadCustomPalettes();
  };

  const handleLoadPalette = (palette: PaletteData) => {
    if (onLoadPalette) {
      onLoadPalette(palette.colors);
    } else {
      // default behavior: set as selected in store
      const p = { id: palette.id, name: palette.name, colors: palette.colors, category: palette.category, description: palette.description } as any;
      store.setSelectedPalette(p);
    }
    onCloseLocal();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {isOpenLocal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <FocusTrap active={isOpenLocal} focusTrapOptions={focusTrapOptions}>
              <div role="dialog" aria-modal="true" aria-labelledby="palette-manager-title">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Palette Manager</h2>
                    <p className="text-gray-600 mt-1">Save, load, and manage your custom color palettes</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Icon name="grid" className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Save Current Palette Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 id="palette-manager-title" className="text-lg font-semibold text-gray-900">Current Palette</h3>
                    <button
                      onClick={() => setIsCreateMode(!isCreateMode)}
                      ref={firstRef}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Icon name="preview" className="w-4 h-4" />
                      <span>Save Current</span>
                    </button>
                  </div>

                  {/* Current Palette Preview */}
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    {currentPalette.map((color, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Save Form */}
                  <AnimatePresence>
                    {isCreateMode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 rounded-lg p-4 space-y-3"
                      >
                        <input
                          type="text"
                          value={newPaletteName}
                          onChange={(e) => setNewPaletteName(e.target.value)}
                          placeholder="Enter palette name..."
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSaveCurrentPalette}
                            disabled={!newPaletteName.trim()}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Save Palette
                          </button>
                          <button
                            onClick={() => {
                              setIsCreateMode(false);
                              setNewPaletteName('');
                            }}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Saved Palettes Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Saved Palettes ({customPalettes.length})
                  </h3>

                  {customPalettes.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Icon name="preview" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No saved palettes yet</p>
                      <p className="text-sm">Save your current palette to get started</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 max-h-96 overflow-y-auto">
                      {customPalettes.map((palette) => (
                        <motion.div
                          key={palette.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{palette.name}</h4>
                              <p className="text-sm text-gray-500">
                                Created {formatDate(palette.createdAt)} • {palette.colors.length} colors
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleLoadPalette(palette)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                              >
                                Load
                              </button>
                              <button
                                onClick={() => handleDeletePalette(palette.id)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Palette Colors */}
                          <div className="grid grid-cols-8 gap-1">
                            {palette.colors.map((color, index) => (
                              <div
                                key={index}
                                className="aspect-square rounded border border-gray-200"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              </div>
              </FocusTrap>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
