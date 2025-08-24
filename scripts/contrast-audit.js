const fs = require('fs');
const path = 'c:\\Users\\Alexis Pizarro\\Documents\\Personal\\pbi-studio-fx\\app\\page.tsx';
const content = fs.readFileSync(path, 'utf8');
const regex = /accent:\s*"(#[0-9a-fA-F]{6})"/g;
const accents = new Set();
let m;
while ((m = regex.exec(content)) !== null) accents.add(m[1].toLowerCase());

function srgbToLinearChannel(c){
  c = c/255;
  return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
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
  try{
    const white = '#ffffff';
    const dark = '#111827';
    const contrastWithWhite = contrastRatio(hex, white);
    const contrastWithDark = contrastRatio(hex, dark);
    if (contrastWithWhite >= 4.5 && contrastWithWhite >= contrastWithDark) return white;
    if (contrastWithDark >= 4.5 && contrastWithDark > contrastWithWhite) return dark;
    return contrastWithWhite >= contrastWithDark ? white : dark;
  }catch(e){
    return '#ffffff';
  }
}

console.log('Found accents:', [...accents].join(', '));
console.log('\nAudit results (contrast ratio vs chosen foreground) — pass if >= 4.5 for normal text:\n');
for (const a of accents){
  const fg = readableOn(a);
  const ratio = contrastRatio(a, fg);
  const ratioStr = ratio.toFixed(2);
  const pass = ratio >= 4.5 ? 'PASS' : 'FAIL';
  console.log(`${a} -> fg ${fg} -> ${ratioStr} : ${pass}`);
}
