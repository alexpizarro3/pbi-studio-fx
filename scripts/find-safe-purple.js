const candidates = ['#8f5cff','#7a3eff','#7430ff','#6f3bff','#6b00ff','#6622cc','#5e2bd6','#6d28d9','#5c20ad','#4f1a9b'];

function srgbToLinearChannel(c){
  const v = c/255;
  return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4);
}
function luminance(hex){
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  const R = srgbToLinearChannel(r);
  const G = srgbToLinearChannel(g);
  const B = srgbToLinearChannel(b);
  return 0.2126*R + 0.7152*G + 0.0722*B;
}
function contrastRatio(hex1, hex2){
  const L1 = luminance(hex1);
  const L2 = luminance(hex2);
  const [a,b] = L1>=L2 ? [L1,L2] : [L2,L1];
  return (a+0.05)/(b+0.05);
}
function readableOn(hex){
  const white = '#ffffff';
  const dark = '#111827';
  const contrastWithWhite = contrastRatio(hex, white);
  const contrastWithDark = contrastRatio(hex, dark);
  if (contrastWithWhite >= 4.5 && contrastWithWhite >= contrastWithDark) return white;
  if (contrastWithDark >= 4.5 && contrastWithDark > contrastWithWhite) return dark;
  return contrastWithWhite >= contrastWithDark ? white : dark;
}

console.log('Testing candidates for WCAG 4.5...');
for(const c of candidates){
  const fg = readableOn(c);
  const ratio = contrastRatio(c, fg);
  console.log(`${c} -> fg ${fg} -> ${ratio.toFixed(2)} ${ratio>=4.5? 'PASS':'FAIL'}`);
}

const passing = candidates.filter(c => {
  const fg = readableOn(c);
  return contrastRatio(c, fg) >= 4.5;
});

if(passing.length) console.log('\nRecommended replacement (first passing):', passing[0]);
else console.log('\nNo candidate met WCAG 4.5');
