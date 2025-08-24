import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for the theme store
export interface Palette {
  id: string;
  name: string;
  colors: string[];
  category: string;
  description?: string;
  semantic?: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    neutral: string;
  };
}

export interface CustomPalette {
  id: string;
  name: string;
  colors: string[];
  category: 'Custom';
  description: string;
  createdAt: string;
}

interface ThemeState {
  // Current theme settings
  themeName: string;
  themeDescription: string;
  backgroundColor: string;
  foregroundColor: string;
  tableAccentColor: string;
  selectedPalette: Palette | null;
  accent: string;
  gradient: string;
  mode: 'elegant' | 'minimal' | 'vivid';
  animationPreset: 'smooth' | 'bouncy' | 'crisp';
  currentPaletteColors: string[]; // New: Stores the current active palette colors
  lockedColors: boolean[];

  // Palettes
  seasonalPalettes: Palette[];
  customPalettes: CustomPalette[];

  // UI state
  showExportModal: boolean;
  showPaletteManager: boolean;
  showCustomBuilder: boolean;
  showImageExtractor: boolean;
  showRightPanel: boolean;

  // Actions
  setThemeName: (name: string) => void;
  setThemeDescription: (description: string) => void;
  setBackgroundColor: (color: string) => void;
  setForegroundColor: (color: string) => void;
  setTableAccentColor: (color: string) => void;
  setSelectedPalette: (palette: Palette) => void;
  setAccent: (accent: string) => void;
  setGradient: (gradient: string) => void;
  setMode: (mode: 'elegant' | 'minimal' | 'vivid') => void;
  setAnimationPreset: (preset: 'smooth' | 'bouncy' | 'crisp') => void;
  setCurrentPaletteColors: (colors: string[]) => void; // New action
  setLockedColors: (locked: boolean[]) => void;

  // Modal actions
  setShowExportModal: (show: boolean) => void;
  setShowPaletteManager: (show: boolean) => void;
  setShowCustomBuilder: (show: boolean) => void;
  setShowImageExtractor: (show: boolean) => void;
  setShowRightPanel: (show: boolean) => void;

  // Palette management
  loadSeasonalPalettes: () => Promise<void>;
  addCustomPalette: (palette: CustomPalette) => void;
  removeCustomPalette: (id: string) => void;

  // Utility
  getCurrentPaletteColors: () => string[];
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      themeName: 'My Glowlytics Theme',
      themeDescription: 'A custom theme generated with Glowlytics',
      backgroundColor: '#FFFFFF',
      foregroundColor: '#252423',
      tableAccentColor: '#ffd700',
      selectedPalette: null,
      accent: '#ffd700',
      gradient: 'from-[#ffd700] to-[#23234e]',
      mode: 'elegant',
      animationPreset: 'smooth',
      currentPaletteColors: ['#ffd700', '#2ecc71', '#4169e1', '#e040fb', '#ff9a8b'], // Default palette
      lockedColors: [],

      seasonalPalettes: [],
      customPalettes: [],

      showExportModal: false,
      showPaletteManager: false,
      showCustomBuilder: false,
      showImageExtractor: false,
      showRightPanel: true,

      // Actions
      setThemeName: (name) => set({ themeName: name }),
      setThemeDescription: (description) => set({ themeDescription: description }),
      setBackgroundColor: (color) => set({ backgroundColor: color }),
      setForegroundColor: (color) => set({ foregroundColor: color }),
      setTableAccentColor: (color) => set({ tableAccentColor: color }),
      setSelectedPalette: (palette) => set({ selectedPalette: palette }),
      setAccent: (accent) => set({ accent }),
      setGradient: (gradient) => set({ gradient }),
      setMode: (mode) => set({ mode }),
      setAnimationPreset: (preset) => set({ animationPreset: preset }),
      setCurrentPaletteColors: (colors) => set({ currentPaletteColors: colors }), // New action implementation
      setLockedColors: (locked) => set({ lockedColors: locked }),

      // Modal actions
      setShowExportModal: (show) => set({ showExportModal: show }),
      setShowPaletteManager: (show) => set({ showPaletteManager: show }),
      setShowCustomBuilder: (show) => set({ showCustomBuilder: show }),
      setShowImageExtractor: (show) => set({ showImageExtractor: show }),
      setShowRightPanel: (show) => set({ showRightPanel: show }),

      // Palette management
      loadSeasonalPalettes: async () => {
        try {
          const response = await fetch('/lib/seasonal-palettes.json');
          const data = await response.json();
          set({ seasonalPalettes: data.seasonal_palettes }); // Corrected key
        } catch (error) {
          console.error('Failed to load seasonal palettes:', error);
        }
      },

      addCustomPalette: (palette) => set((state) => ({
        customPalettes: [...state.customPalettes, palette]
      })),

      removeCustomPalette: (id) => set((state) => ({
        customPalettes: state.customPalettes.filter(p => p.id !== id)
      })),

      // Utility
      getCurrentPaletteColors: () => {
        const state = get();
        return state.currentPaletteColors; // Now returns the new state variable
      },
    }),
    {
      name: 'glowlytics-theme-store',
      partialize: (state) => ({
        themeName: state.themeName,
        themeDescription: state.themeDescription,
        backgroundColor: state.backgroundColor,
        foregroundColor: state.foregroundColor,
        tableAccentColor: state.tableAccentColor,
        accent: state.accent,
        gradient: state.gradient,
        mode: state.mode,
        animationPreset: state.animationPreset,
        customPalettes: state.customPalettes,
        currentPaletteColors: state.currentPaletteColors, // New: Persist current palette
        lockedColors: state.lockedColors,
        seasonalPalettes: state.seasonalPalettes,
      }),
    }
  )
);