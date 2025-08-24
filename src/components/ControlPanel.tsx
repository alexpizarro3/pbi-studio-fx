'use client';

import { useThemeStore } from '../../store/theme-store';
import ColorPicker from './ColorPicker';
import { Icon } from './Icon';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

export function ControlPanel() {
  const {
    mode,
    setMode,
    animationPreset,
    setAnimationPreset,
    showRightPanel,
    setShowRightPanel,
    themeName,
    setThemeName,
    themeDescription,
    setThemeDescription,
    backgroundColor,
    setBackgroundColor,
    foregroundColor,
    setForegroundColor,
    tableAccentColor,
    setTableAccentColor,
    setShowPaletteManager,
    setShowCustomBuilder,
    setShowImageExtractor,
    setShowPaletteVisualizer,
  } = useThemeStore();

  return (
    <aside className={`w-72 bg-[#1f1f3d]/70 backdrop-blur-lg border-l border-[#2a2a3c] p-6 shadow-lg overflow-y-auto`}>
      <h2 className="text-lg font-bold mb-4">Advanced Properties</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="themeName" className="block text-sm font-medium text-gray-300 mb-1">Theme Name</label>
          <Input
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
      <nav className="flex flex-col gap-4 w-full px-4 mt-4">
        {[
          { name: 'Manage Palettes', action: () => setShowPaletteManager(true), icon: 'store' },
          { name: 'Custom Builder', action: () => setShowCustomBuilder(true), icon: 'create' },
          { name: 'Extract from Image', action: () => setShowImageExtractor(true), icon: 'image' },
          { name: 'Palette Visualizer', action: () => setShowPaletteVisualizer(true), icon: 'eye' } // New button
        ].map((item) => (
          <Button
            key={item.name}
            onClick={item.action}
            className="font-semibold text-sm px-3 py-2 rounded-md overflow-hidden group flex items-center focus:outline-none transition-transform duration-200 active:scale-95 hover:bg-white/5 text-left"
          >
            <Icon name={item.icon as any} className="mr-3" />
            {item.name}
          </Button>
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
  );
}
