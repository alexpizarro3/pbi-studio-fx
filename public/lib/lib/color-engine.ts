import { oklch, parse, formatHex, converter, getLuminance as culoriGetLuminance, filter as culoriFilter } from 'culori';

// Initialize culori converter for OKLCH
const toOklch = converter('oklch');
const fromOklch = converter('hex');

/**
 * Convert hex color to OKLCH color space
 */
export function hexToOKLCH(hex: string): { l: number; c: number; h: number } {
  const color = toOklch(parse(hex));
  return {
    l: color.l || 0, // Lightness (0-1)
    c: color.c || 0, // Chroma (0-0.4 for sRGB gamut)
    h: color.h || 0  // Hue (0-360)
  };
}

/**
 * Convert OKLCH back to hex
 */
export function oklchToHex(l: number, c: number, h: number): string {
  // Ensure values are within valid ranges for culori
  const oklchColor = oklch(l, c, h);
  return formatHex(fromOklch(oklchColor));
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
    // Tints (lighter) - increase lightness, slightly decrease chroma to avoid desaturation at high lightness
    const tintL = Math.min(1, oklch.l + (i * 0.15));
    const tintC = Math.max(0, oklch.c * (1 - i * 0.05)); // Reduce chroma slightly for lighter colors
    tints.push(oklchToHex(tintL, tintC, oklch.h));
    
    // Shades (darker) - decrease lightness, slightly increase chroma for richer darks
    const shadeL = Math.max(0, oklch.l - (i * 0.15));
    const shadeC = oklch.c * (1 + i * 0.05); // Increase chroma slightly for darker colors
    shades.push(oklchToHex(shadeL, shadeC, oklch.h));
  }
  
  return { tints, shades };
}

/**
 * Check if color meets WCAG contrast requirements
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = culoriGetLuminance(parse(color1));
  const lum2 = culoriGetLuminance(parse(color2));
  
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

/**
 * Get the best readable color (black or white) for a background
 */
export function getReadableColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio(backgroundColor, '#ffffff');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}

/**
 * Simulate color blindness for a given color
 * @param color The hex color to simulate
 * @param type The type of color blindness to simulate ('protanomaly', 'deuteranomaly', 'tritanomaly', etc.)
 * @returns The hex color after simulation
 */
export function simulateColorBlindness(color: string, type: string): string {
  const parsedColor = parse(color);
  if (!parsedColor) return color; // Return original if parsing fails

  const simulatedColor = culoriFilter(type)(parsedColor);
  return formatHex(simulatedColor);
}

/**
 * Analyze the color temperature of a palette
 * @param palette The array of hex colors in the palette
 * @returns 'warm', 'cool', or 'neutral'
 */
export function analyzeColorTemperature(palette: string[]): 'warm' | 'cool' | 'neutral' {
  let warmCount = 0;
  let coolCount = 0;

  palette.forEach(hex => {
    const oklchColor = hexToOKLCH(hex);
    // Simple heuristic: hues around 0-60 (red-yellow) are warm, 180-240 (cyan-blue) are cool
    if (oklchColor.h >= 0 && oklchColor.h < 90) {
      warmCount++;
    } else if (oklchColor.h >= 210 && oklchColor.h < 330) {
      coolCount++;
    }
  });

  if (warmCount > coolCount * 1.5) {
    return 'warm';
  } else if (coolCount > warmCount * 1.5) {
    return 'cool';
  } else {
    return 'neutral';
  }
}
