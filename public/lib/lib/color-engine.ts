// Color utility functions using modern color science

/**
 * Convert hex color to OKLCH color space (placeholder for future implementation)
 * This is where we'll integrate culori or colorjs.io for proper color space handling
 */
export function hexToOKLCH(hex: string): { l: number; c: number; h: number } {
  // Placeholder implementation - will be replaced with proper OKLCH conversion
  // For now, return a basic approximation
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  return {
    l: hsl.l / 100, // Lightness 0-1
    c: hsl.s / 100, // Chroma 0-1  
    h: hsl.h // Hue 0-360
  };
}

/**
 * Convert OKLCH back to hex (placeholder)
 */
export function oklchToHex(l: number, c: number, h: number): string {
  // Placeholder - convert back through HSL for now
  const hsl = { h, s: c * 100, l: l * 100 };
  const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Generate color harmonies in OKLCH space for better perceptual uniformity
 */
export function generateColorHarmony(
  baseColor: string, 
  type: 'complementary' | 'triadic' | 'analogous' | 'split-complementary' | 'tetradic'
): string[] {
  const oklch = hexToOKLCH(baseColor);
  const colors = [baseColor];
  
  switch (type) {
    case 'complementary':
      colors.push(oklchToHex(oklch.l, oklch.c, (oklch.h + 180) % 360));
      break;
      
    case 'triadic':
      colors.push(
        oklchToHex(oklch.l, oklch.c, (oklch.h + 120) % 360),
        oklchToHex(oklch.l, oklch.c, (oklch.h + 240) % 360)
      );
      break;
      
    case 'analogous':
      colors.push(
        oklchToHex(oklch.l, oklch.c, (oklch.h + 30) % 360),
        oklchToHex(oklch.l, oklch.c, (oklch.h - 30 + 360) % 360)
      );
      break;
      
    case 'split-complementary':
      colors.push(
        oklchToHex(oklch.l, oklch.c, (oklch.h + 150) % 360),
        oklchToHex(oklch.l, oklch.c, (oklch.h + 210) % 360)
      );
      break;
      
    case 'tetradic':
      colors.push(
        oklchToHex(oklch.l, oklch.c, (oklch.h + 90) % 360),
        oklchToHex(oklch.l, oklch.c, (oklch.h + 180) % 360),
        oklchToHex(oklch.l, oklch.c, (oklch.h + 270) % 360)
      );
      break;
  }
  
  return colors;
}

/**
 * Generate tints and shades with perceptual uniformity
 */
export function generateTintsAndShades(baseColor: string, steps = 5): {
  tints: string[];
  shades: string[];
} {
  const oklch = hexToOKLCH(baseColor);
  const tints: string[] = [];
  const shades: string[] = [];
  
  for (let i = 1; i <= steps; i++) {
    // Tints (lighter)
    const tintL = Math.min(1, oklch.l + (i * 0.15));
    tints.push(oklchToHex(tintL, oklch.c * 0.8, oklch.h));
    
    // Shades (darker)
    const shadeL = Math.max(0, oklch.l - (i * 0.15));
    shades.push(oklchToHex(shadeL, oklch.c * 0.9, oklch.h));
  }
  
  return { tints, shades };
}

/**
 * Check if color meets WCAG contrast requirements
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Get the best readable color (black or white) for a background
 */
export function getReadableColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio(backgroundColor, '#ffffff');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}

// Helper functions (basic implementations)
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
