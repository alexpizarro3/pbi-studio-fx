'use client';

import { useEffect, useRef, useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { PowerBITheme, downloadTheme, previewThemeJson, validatePowerBITheme } from '../src/utils/powerbi-export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: PowerBITheme | null;
}

export function ExportModal({ isOpen, onClose, theme }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const firstFocusRef = useRef<HTMLButtonElement | null>(null);

  const focusTrapOptions = {
    escapeDeactivates: true,
    onDeactivate: onClose,
    initialFocus: () => firstFocusRef.current || undefined,
  };

  const handleExport = async () => {
    if (!theme) return;
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing
      downloadTheme(theme);
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen || !theme) {
    return null;
  }

  const previewJson = previewThemeJson(theme);
  const validation = validatePowerBITheme(theme);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <FocusTrap active={isOpen} focusTrapOptions={focusTrapOptions}>
                <div role="dialog" aria-modal="true" aria-labelledby="export-modal-title" className="flex flex-col h-full">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 id="export-modal-title" className="text-2xl font-bold text-gray-900">{theme.name}</h2>
                        <p className="text-gray-600 mt-1">{theme.description || 'Download your custom theme for Power BI Desktop'}</p>
                      </div>
                      <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Icon name="grid" className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6 overflow-y-auto">
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

                    <div className="bg-white/5 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">JSON Preview</h4>
                        <div className="text-sm">
                          {validation.valid ? <span className="text-green-600 font-medium">Valid</span> : <span className="text-red-600 font-medium">Invalid</span>}
                        </div>
                      </div>
                      <pre className="text-xs p-2 rounded bg-black/80 text-white overflow-x-auto max-h-48">{previewJson}</pre>
                      {!validation.valid && <div className="mt-2 text-sm text-red-600">{validation.errors.slice(0, 3).map((err, i) => <div key={i}>• {err}</div>)}</div>}
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 mt-auto">
                    <button ref={firstFocusRef} onClick={onClose} className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                    <div className="flex items-center gap-2">
                      <button onClick={async () => { try { await navigator.clipboard.writeText(previewJson); setCopySuccess('Copied'); setTimeout(() => setCopySuccess(null), 1800); } catch (e) { setCopySuccess('Failed'); setTimeout(() => setCopySuccess(null), 1800); } }} aria-label="Copy theme JSON to clipboard" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        <span className="mr-2">📋</span><span>{copySuccess || 'Copy JSON'}</span>
                      </button>
                      <motion.button onClick={handleExport} disabled={isExporting || !validation.valid} aria-disabled={isExporting || !validation.valid} title={!validation.valid ? 'Theme JSON is invalid — fix errors before exporting' : undefined} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        {isExporting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Exporting...</span></>) : (<><Icon name="download" className="w-4 h-4" /><span>Download Theme</span></>)}
                      </motion.button>
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
