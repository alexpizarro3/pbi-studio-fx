'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { PowerBITheme, downloadTheme, previewThemeJson, validatePowerBITheme } from '../utils/powerbi-export';
import { generateCssVariables, generateTailwindConfig, generateSvg, generatePng } from '../utils/export-utils';
import { useThemeStore } from '../../store/theme-store';
import toast from 'react-hot-toast';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '~/components/ui/dialog';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: PowerBITheme | null;
}

type ExportFormat = 'powerbi' | 'css' | 'tailwind' | 'svg' | 'png';

export function ExportModal({ isOpen, onClose, theme }: ExportModalProps) {
  const { getCurrentPaletteColors } = useThemeStore();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('powerbi');
  const [previewContent, setPreviewContent] = useState<string>('');
  const modalRef = useRef<HTMLDivElement | null>(null);
  const firstFocusRef = useRef<HTMLButtonElement | null>(null);

  const currentPalette = getCurrentPaletteColors();

  useEffect(() => {
    if (isOpen) {
      updatePreviewContent(selectedFormat);
    }
  }, [isOpen, selectedFormat, currentPalette, theme]);

  const updatePreviewContent = async (format: ExportFormat) => {
    if (!theme) return;

    let content = '';
    switch (format) {
      case 'powerbi':
        content = previewThemeJson(theme);
        break;
      case 'css':
        content = generateCssVariables(currentPalette);
        break;
      case 'tailwind':
        content = generateTailwindConfig(currentPalette);
        break;
      case 'svg':
        content = generateSvg(currentPalette);
        break;
      case 'png':
        // PNG generation is async and requires client-side rendering
        content = await generatePng(currentPalette);
        break;
      default:
        content = '';
    }
    setPreviewContent(content);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewContent);
      toast.success('Copied to clipboard!');
    } catch (e) {
      toast.error('Failed to copy.');
    }
  };

  const handleDownload = async () => {
    if (!theme) return;
    setIsExporting(true);
    try {
      if (selectedFormat === 'powerbi') {
        downloadTheme(theme);
      } else {
        const filename = `glowlytics-palette.${selectedFormat}`;
        const blob = new Blob([previewContent], { type: `text/${selectedFormat === 'svg' ? 'xml' : 'plain'}` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      toast.success('Download initiated!');
    } catch (e) {
      toast.error('Failed to download.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen || !theme) {
    return null;
  }

  const validation = validatePowerBITheme(theme);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{theme.name}</DialogTitle>
          <DialogDescription>Export your custom theme</DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Format Selection Tabs */}
          <div className="flex space-x-2 mb-4">
            <Button
              className={`px-4 py-2 rounded-md text-sm font-medium ${selectedFormat === 'powerbi' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setSelectedFormat('powerbi')}
            >
              Power BI JSON
            </Button>
            <Button
              className={`px-4 py-2 rounded-md text-sm font-medium ${selectedFormat === 'css' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setSelectedFormat('css')}
            >
              CSS Variables
            </Button>
            <Button
              className={`px-4 py-2 rounded-md text-sm font-medium ${selectedFormat === 'tailwind' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setSelectedFormat('tailwind')}
            >
              Tailwind Config
            </Button>
            <Button
              className={`px-4 py-2 rounded-md text-sm font-medium ${selectedFormat === 'svg' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setSelectedFormat('svg')}
            >
              SVG
            </Button>
            <Button
              className={`px-4 py-2 rounded-md text-sm font-medium ${selectedFormat === 'png' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setSelectedFormat('png')}
            >
              PNG
            </Button>
          </div>

          {selectedFormat === 'powerbi' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Data Colors Preview</label>
                <div className="grid grid-cols-6 gap-2">
                  {theme.dataColors.slice(0, 12).map((color, index) => (
                    <div key={index} className="aspect-square rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color }} title={color} />
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Theme Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Data Colors:</span><span className="ml-2 font-medium">{theme.dataColors.length}</span></div>
                  <div><span className="text-gray-600">Format:</span><span className="ml-2 font-medium">JSON</span></div>
                  <div><span className="text-gray-600">Table Accent:</span><div className="ml-2 inline-block w-4 h-4 rounded border" style={{ backgroundColor: theme.tableAccent }} /></div>
                  <div><span className="text-gray-600">Compatible:</span><span className="ml-2 font-medium">Power BI Desktop</span></div>
                </div>
              </div>
            </>
          )}

          {/* Code Preview for Text-based formats */}
          {(selectedFormat === 'powerbi' || selectedFormat === 'css' || selectedFormat === 'tailwind') && (
            <div className="bg-white/5 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{selectedFormat.toUpperCase()} Preview</h4>
                {selectedFormat === 'powerbi' && (
                  <div className="text-sm">
                    {validation.valid ? <span className="text-green-600 font-medium">Valid</span> : <span className="text-red-600 font-medium">Invalid</span>}
                  </div>
                )}
              </div>
              <pre className="text-xs p-2 rounded bg-black/80 text-white overflow-x-auto max-h-48">{previewContent}</pre>
              {selectedFormat === 'powerbi' && !validation.valid && <div className="mt-2 text-sm text-red-600">{validation.errors.slice(0, 3).map((err, i) => <div key={i}>• {err}</div>)}</div>}
            </div>
          )}

          {/* Image Preview for SVG/PNG */}
          {(selectedFormat === 'svg' || selectedFormat === 'png') && previewContent && (
            <div className="bg-white/5 rounded-lg p-4 border border-gray-100 flex justify-center items-center">
              {selectedFormat === 'svg' ? (
                <div dangerouslySetInnerHTML={{ __html: previewContent }} />
              ) : (
                <img src={previewContent} alt="Palette Preview" className="max-w-full h-auto" />
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 mt-auto">
          <Button onClick={onClose} className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Cancel</Button>
          <div className="flex items-center gap-2">
            {(selectedFormat === 'powerbi' || selectedFormat === 'css' || selectedFormat === 'tailwind') && (
              <Button onClick={handleCopy} aria-label="Copy to clipboard" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <span className="mr-2">📋</span><span>Copy {selectedFormat.toUpperCase()}</span>
              </Button>
            )}
            <Button onClick={handleDownload} disabled={isExporting || (selectedFormat === 'powerbi' && !validation.valid)} aria-disabled={isExporting || (selectedFormat === 'powerbi' && !validation.valid)} title={(selectedFormat === 'powerbi' && !validation.valid) ? 'Theme JSON is invalid — fix errors before exporting' : undefined} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {isExporting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Exporting...</span></>) : (<><Icon name="download" className="w-4 h-4" /><span>Download {selectedFormat.toUpperCase()}</span></>)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}