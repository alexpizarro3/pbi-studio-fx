// Power BI Theme Export Utilities
export interface PowerBITheme {
  name: string;
  description?: string;
  dataColors: string[];
  background: string;
  foreground: string;
  tableAccent: string;
  good: string;
  neutral: string;
  bad: string;
  maximum: string;
  center: string;
  minimum: string;
  null: string;
}

export interface PaletteData {
  id: string;
  name: string;
  colors: string[];
  category: string;
  description?: string;
  createdAt: string;
}

export interface ThemeGenerationOptions {
  description?: string;
  background?: string;
  foreground?: string;
  tableAccent?: string;
}

export function generatePowerBITheme(
  palette: string[],
  themeName: string = 'Glowlytics Theme',
  options: ThemeGenerationOptions = {}
): PowerBITheme {
  // Ensure we have at least 8 colors for a complete theme
  const extendedPalette = [...palette];
  while (extendedPalette.length < 8) {
    extendedPalette.push(...palette);
  }
  
  const theme: PowerBITheme = {
    name: themeName,
    dataColors: extendedPalette.slice(0, 12),
    background: options.background || '#ffffff',
    foreground: options.foreground || '#252423',
    tableAccent: options.tableAccent || extendedPalette[0],
    good: '#118DFF',
    neutral: '#E6E6E6',
    bad: '#FF312F',
    maximum: extendedPalette[1] || extendedPalette[0],
    center: extendedPalette[2] || extendedPalette[0],
    minimum: extendedPalette[3] || extendedPalette[0],
    null: '#FF7F00'
  };

  if (options.description) {
    theme.description = options.description;
  }
  
  return theme;
}

export function downloadTheme(theme: PowerBITheme) {
  const themeJson = JSON.stringify(theme, null, 2);
  const blob = new Blob([themeJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${theme.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Basic validation helpers for the generated Power BI theme
export function validatePowerBITheme(theme: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!theme || typeof theme !== 'object') {
    errors.push('Theme must be an object');
    return { valid: false, errors };
  }
  if (!theme.name || typeof theme.name !== 'string') errors.push('Missing or invalid "name"');
  if (!Array.isArray(theme.dataColors) || theme.dataColors.length === 0) errors.push('"dataColors" must be a non-empty array');
  if (!theme.tableAccent || typeof theme.tableAccent !== 'string') errors.push('Missing or invalid "tableAccent"');
  // basic hex format check for dataColors and tableAccent
  const hexRE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  (theme.dataColors || []).forEach((c: any, i: number) => {
    if (typeof c !== 'string' || !hexRE.test(c)) errors.push(`dataColors[${i}] is not a valid hex color`);
  });
  if (theme.tableAccent && typeof theme.tableAccent === 'string' && !hexRE.test(theme.tableAccent)) errors.push('tableAccent is not a valid hex color');

  return { valid: errors.length === 0, errors };
}

// Return pretty-printed JSON string for preview
export function previewThemeJson(theme: PowerBITheme): string {
  try {
    return JSON.stringify(theme, null, 2);
  } catch (e) {
    return '{ "error": "unable to preview theme" }';
  }
}

export function exportCurrentTheme(
  selectedPalette: string[],
  customName?: string,
  options?: ThemeGenerationOptions
) {
  const themeName = customName || `Glowlytics Theme ${new Date().toLocaleDateString()}`;
  const theme = generatePowerBITheme(selectedPalette, themeName, options);
  downloadTheme(theme);
}

export function generatePaletteId(): string {
  return `plt_${Math.random().toString(36).substr(2, 9)}`;
}

// Local storage utilities for custom palettes
export function saveCustomPalette(palette: PaletteData): void {
  const saved = getCustomPalettes();
  const updated = saved.filter(p => p.id !== palette.id);
  updated.push(palette);
  localStorage.setItem('glowlytics_custom_palettes', JSON.stringify(updated));
}

export function getCustomPalettes(): PaletteData[] {
  try {
    const saved = localStorage.getItem('glowlytics_custom_palettes');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading custom palettes:', error);
    return [];
  }
}

export function deleteCustomPalette(id: string): void {
  const saved = getCustomPalettes();
  const updated = saved.filter(p => p.id !== id);
  localStorage.setItem('glowlytics_custom_palettes', JSON.stringify(updated));
}


''
