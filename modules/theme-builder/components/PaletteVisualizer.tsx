'use client';

import React, { useState } from 'react';
import { simulateColorBlindness } from '~/public/lib/lib/color-engine';

interface PaletteVisualizerProps {
  palette: string[];
}

export default function PaletteVisualizer({ palette }: PaletteVisualizerProps) {
  const [layout, setLayout] = useState('default');
  const [colorBlindnessType, setColorBlindnessType] = useState('none');

  if (!palette || palette.length === 0) return null;

  const simulatedPalette = palette.map(color => 
    colorBlindnessType === 'none' ? color : simulateColorBlindness(color, colorBlindnessType)
  );

  const primaryColor = simulatedPalette[0] || '#176087';
  const secondaryColor = simulatedPalette[1] || '#FFC300';
  const accentColor = simulatedPalette[2] || '#FF5733';
  const cardColor = simulatedPalette[3] || '#FFFBEA';
  const tableColor = simulatedPalette[4] || '#A3D8F4';

  const kpiData = [
    { label: 'Revenue', value: '$24,500', color: accentColor },
    { label: 'Users', value: '1,234', color: accentColor },
    { label: 'Conversion', value: '7.2%', color: accentColor },
    { label: 'Retention', value: '89%', color: accentColor },
  ];
  const salesData = [60, 80, 40, 100, 70, 90];
  const userData = [80, 60, 90, 40, 70, 30, 60];
  const tableRows = [
    { product: 'Glowlytics Pro', sales: '$8,900', growth: '+12%' },
    { product: 'Glowlytics Lite', sales: '$5,400', growth: '+8%' },
    { product: 'Glowlytics Enterprise', sales: '$10,200', growth: '+15%' },
  ];

  const renderDefaultLayout = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, idx) => (
          <div key={kpi.label} className="kpi-card" style={{ background: cardColor, color: primaryColor, border: idx === 0 ? `2px solid ${accentColor}` : 'none' }}>
            <span className="text-xs font-bold uppercase mb-2" style={{ color: kpi.color }}>{kpi.label}</span>
            <span className="text-2xl font-extrabold">{kpi.value}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="chart-container" style={{ background: tableColor }}>
          <h3 className="chart-title" style={{ color: primaryColor }}>Monthly Sales</h3>
          <div className="flex items-end gap-2 h-32 w-full">
            {salesData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end">
                <div style={{ height: `${val}%`, background: accentColor, borderRadius: '0.5rem', width: '80%' }}></div>
                <span className="text-xs mt-2" style={{ color: primaryColor }}>{`Month ${i + 1}`}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-container" style={{ background: tableColor }}>
          <h3 className="chart-title" style={{ color: primaryColor }}>Active Users</h3>
          <svg width="100%" height="120" viewBox="0 0 300 120">
            <polyline
              fill="none"
              stroke={accentColor}
              strokeWidth="4"
              points="0,80 50,60 100,90 150,40 200,70 250,30 300,60"
            />
            <circle cx="0" cy="80" r="5" fill={primaryColor} />
            <circle cx="50" cy="60" r="5" fill={primaryColor} />
            <circle cx="100" cy="90" r="5" fill={primaryColor} />
            <circle cx="150" cy="40" r="5" fill={primaryColor} />
            <circle cx="200" cy="70" r="5" fill={primaryColor} />
            <circle cx="250" cy="30" r="5" fill={primaryColor} />
            <circle cx="300" cy="60" r="5" fill={primaryColor} />
          </svg>
        </div>
      </div>
      <div className="table-container" style={{ background: cardColor }}>
        <h3 className="chart-title" style={{ color: primaryColor }}>Top Products</h3>
        <table className="w-full text-sm rounded-lg overflow-hidden">
          <thead>
            <tr style={{ background: secondaryColor, color: primaryColor }}>
              <th className="table-header">Product</th>
              <th className="table-header">Sales</th>
              <th className="table-header">Growth</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map(row => (
              <tr key={row.product}>
                <td className="table-cell">{row.product}</td>
                <td className="table-cell">{row.sales}</td>
                <td className="table-cell" style={{ color: accentColor }}>{row.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderCompactLayout = () => (
    <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
    <div className="chart-container" style={{ background: tableColor }}>
          <h3 className="chart-title" style={{ color: primaryColor }}>Sales Distribution</h3>
          <div className="donut-chart-container">
            <div className="donut-chart-hole"></div>
            <div className="donut-chart-segment" style={{ background: `conic-gradient(${simulatedPalette[0]} 0% 40%, ${simulatedPalette[1]} 40% 70%, ${simulatedPalette[2]} 70% 100%)` }}></div>
          </div>
        </div>
        <div className="chart-container" style={{ background: tableColor }}>
          <h3 className="chart-title" style={{ color: primaryColor }}>User Growth</h3>
          <svg width="100%" height="120" viewBox="0 0 300 120">
            <polyline
              fill="none"
              stroke={accentColor}
              strokeWidth="4"
              points="0,80 50,60 100,90 150,40 200,70 250,30 300,60"
            />
          </svg>
        </div>
        <div className="chart-container" style={{ background: tableColor }}>
          <h3 className="chart-title" style={{ color: primaryColor }}>Success Rate</h3>
          <div className="gauge-chart-container">
            <div className="gauge-chart-background"></div>
            <div className="gauge-chart-fill" style={{ transform: 'rotate(135deg)' }}></div>
            <div className="gauge-chart-needle" style={{ transform: 'rotate(135deg)' }}></div>
          </div>
        </div>
    </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, idx) => (
          <div key={kpi.label} className="kpi-card" style={{ background: cardColor, color: primaryColor, border: idx === 0 ? `2px solid ${accentColor}` : 'none' }}>
            <span className="text-xs font-bold uppercase mb-2" style={{ color: kpi.color }}>{kpi.label}</span>
            <span className="text-2xl font-extrabold">{kpi.value}</span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="palette-visualizer-container">
      <div className="visualizer-header">
        <h2 className="visualizer-title" style={{ color: primaryColor }}>Power BI Dashboard Preview</h2>
        <div className="flex gap-4">
          <select 
            value={colorBlindnessType} 
            onChange={(e) => setColorBlindnessType(e.target.value)} 
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white"
          >
            <option value="none">Normal Vision</option>
            <option value="protanomaly">Protanomaly</option>
            <option value="deuteranomaly">Deuteranomaly</option>
            <option value="tritanomaly">Tritanomaly</option>
            <option value="achromatopsia">Achromatopsia</option>
          </select>
          <button onClick={() => setLayout('default')} className={`layout-button ${layout === 'default' ? 'active' : ''}`}>Default</button>
          <button onClick={() => setLayout('compact')} className={`layout-button ${layout === 'compact' ? 'active' : ''}`}>Compact</button>
        </div>
      </div>
      {layout === 'default' ? renderDefaultLayout() : renderCompactLayout()}
    </div>
  );
}