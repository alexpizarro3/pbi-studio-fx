'use client';



interface PaletteVisualizerProps {
  palette: string[];
}

import React from 'react';

export default function PaletteVisualizer({ palette }: PaletteVisualizerProps) {
  if (!palette || palette.length === 0) return null;

  // Assign colors from the palette to semantic roles in the dashboard
  const primaryColor = palette[0] || '#176087';
  const secondaryColor = palette[1] || '#FFC300';
  const accentColor = palette[2] || '#FF5733';
  const cardColor = palette[3] || '#FFFBEA';
  const tableColor = palette[4] || '#A3D8F4';

  // Simulated dashboard state
  const [selectedMonth, setSelectedMonth] = React.useState('All');
  const [selectedProduct, setSelectedProduct] = React.useState('All');
  const months = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const products = ['All', 'Glowlytics Pro', 'Glowlytics Lite', 'Glowlytics Enterprise'];

  // Simulated data
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

  // Filter logic (simulate)
  const filteredTable = selectedProduct === 'All' ? tableRows : tableRows.filter(row => row.product === selectedProduct);

  return (
    <div className="relative w-full max-w-5xl mx-auto p-8 rounded-3xl shadow-2xl bg-white/30 backdrop-blur-lg border border-white/20" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: primaryColor }}>Power BI Dashboard Preview</h2>
        <div className="flex gap-4">
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white">
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white">
            {products.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, idx) => (
          <div key={kpi.label} className="rounded-xl p-6 shadow-lg flex flex-col items-center cursor-pointer transition hover:scale-105" style={{ background: cardColor, color: primaryColor, border: idx === 0 ? `2px solid ${accentColor}` : 'none' }}>
            <span className="text-xs font-bold uppercase mb-2" style={{ color: kpi.color }}>{kpi.label}</span>
            <span className="text-2xl font-extrabold">{kpi.value}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="rounded-2xl p-6 shadow-lg" style={{ background: tableColor }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>Monthly Sales</h3>
          <div className="flex items-end gap-2 h-32 w-full">
            {salesData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end">
                <div style={{ height: `${val}%`, background: accentColor, borderRadius: '0.5rem', width: '80%' }}></div>
                <span className="text-xs mt-2" style={{ color: primaryColor }}>{months[i+1] || ''}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Line Chart */}
        <div className="rounded-2xl p-6 shadow-lg" style={{ background: tableColor }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>Active Users</h3>
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
      {/* Table Section */}
      <div className="rounded-2xl p-6 shadow-lg" style={{ background: cardColor }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>Top Products</h3>
        <table className="w-full text-sm rounded-lg overflow-hidden">
          <thead>
            <tr style={{ background: secondaryColor, color: primaryColor }}>
              <th className="py-2 px-4 text-left">Product</th>
              <th className="py-2 px-4 text-left">Sales</th>
              <th className="py-2 px-4 text-left">Growth</th>
            </tr>
          </thead>
          <tbody>
            {filteredTable.map(row => (
              <tr key={row.product}>
                <td className="py-2 px-4">{row.product}</td>
                <td className="py-2 px-4">{row.sales}</td>
                <td className="py-2 px-4" style={{ color: accentColor }}>{row.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
