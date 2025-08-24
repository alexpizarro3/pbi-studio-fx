import { PowerBITheme } from './powerbi-export';

export const generateCssVariables = (colors: string[]): string => {
  let css = ':root {\n';
  colors.forEach((color, index) => {
    css += `  --color-palette-${index + 1}: ${color};\n`;
  });
  css += '}\n';
  return css;
};

export const generateTailwindConfig = (colors: string[]): string => {
  const colorMap = colors.reduce((acc, color, index) => {
    acc[`palette-${index + 1}`] = color;
    return acc;
  }, {} as Record<string, string>);

  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colorMap, null, 2)}
    }
  }
};
`;
};

export const generateStyleDictionaryTokens = (colors: string[]): string => {
  const tokens: { [key: string]: { value: string } } = {};
  colors.forEach((color, index) => {
    tokens[`color-palette-${index + 1}`] = { value: color };
  });

  return JSON.stringify({
    "color": tokens
  }, null, 2);
};

export const generateAse = (colors: string[]): string => {
  // This is a simplified placeholder for .ase generation.
  // Real .ase generation is complex and typically requires a dedicated library or binary.
  // This example will generate a very basic, non-standard ASE-like string.
  let aseContent = "";
  aseContent += "ASEF"; // Adobe Swatch Exchange File header
  aseContent += "\x00\x01\x00\x00"; // Version 1.0
  aseContent += "\x00\x00\x00\x01"; // Number of blocks (1 for color list)

  // Color list block
  aseContent += "\x00\x00\x00\x01"; // Block type: Color list
  aseContent += "\x00\x00\x00\x00"; // Block length (placeholder, will be updated)

  aseContent += String.fromCharCode(colors.length >> 8) + String.fromCharCode(colors.length & 0xFF); // Number of colors

  colors.forEach(color => {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    aseContent += "\x00\x06"; // Name length (6 for "ColorX")
    aseContent += "C\x00o\x00l\x00o\x00r\x00" + String.fromCharCode(colors.indexOf(color) + 49); // Name (e.g., Color1)
    aseContent += "\x00\x00"; // Model: RGB
    aseContent += String.fromCharCode(r) + String.fromCharCode(g) + String.fromCharCode(b);
    aseContent += "\x00\x00\x00\x00"; // Type: Global
  });

  // Update block length (very rough estimate, not accurate for real ASE)
  const blockLength = aseContent.length - 12; // Subtract header and block type/length placeholders
  // This part is tricky without proper binary manipulation. This is illustrative.
  // For a real ASE, you'd need to calculate byte lengths precisely.

  return aseContent;
};

export const generateSvg = (colors: string[]): string => {
  const width = 200;
  const height = 50;
  const rectWidth = width / colors.length;

  const svgRects = colors.map((color, index) => {
    const x = index * rectWidth;
    return `<rect x="${x}" y="0" width="${rectWidth}" height="${height}" fill="${color}" />`;
  }).join('\n');

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n${svgRects}\n</svg>`;
};

export const generatePng = async (colors: string[]): Promise<string> => {
  // This is a placeholder. Actual PNG generation requires a canvas and a library like html2canvas or similar.
  // For now, we'll return a base64 encoded transparent pixel.
  // In a real scenario, you would render the palette to a canvas and then convert it to PNG.
  console.warn("PNG generation is a placeholder and requires client-side canvas rendering.");
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
};

export const parseCoolorsUrl = (url: string): string[] | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'coolors.co') {
      const pathParts = urlObj.pathname.split('/');
      const colorsString = pathParts[pathParts.length - 1];
      if (colorsString) {
        const colors = colorsString.split('-').map(color => `#${color}`);
        return colors;
      }
    }
    return null;
  } catch (error) {
    console.error("Error parsing Coolors URL:", error);
    return null;
  }
};

export const generateCoolorsUrl = (colors: string[]): string => {
  const colorsString = colors.map(color => color.replace('#', '')).join('-');
  return `https://coolors.co/${colorsString}`;
};