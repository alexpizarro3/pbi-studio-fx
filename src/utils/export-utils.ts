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
