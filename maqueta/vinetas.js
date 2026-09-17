// Viñetas ilustradas del entorno de cada localidad candidata (320 × 180).
window.VINETAS = {
  agricola: `
<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="320" height="180" fill="#f2dfae"/>
  <circle cx="252" cy="44" r="20" fill="#f6c768" opacity=".85"/>
  <path d="M0 96 Q80 84 160 92 T320 88 V180 H0z" fill="#e3c26d"/>
  <g stroke="#33241a" stroke-width="1.6" stroke-linejoin="round">
    <path d="M86 92V62h14v-8h8v8h26v-8h8v8h14v30z" fill="#d8a46a"/>
    <path d="M116 62V36h18v26" fill="#c98f55"/>
    <path d="M116 36v-6h4v6h5v-6h4v6h5v-6" fill="none"/>
    <path d="M86 62v-6h4v6M152 62v-6h4v6" fill="none"/>
    <path d="M122 92v-12a3 3 0 0 1 6 0v12z" fill="#5c4331"/>
  </g>
  <path d="M0 112 Q90 100 170 110 T320 104 V180 H0z" fill="#d9ad4c"/>
  <g stroke="#a47f26" stroke-width="1.4" fill="none" opacity=".75">
    <path d="M-10 132 Q80 118 170 128 T330 120"/><path d="M-10 146 Q80 132 170 142 T330 134"/>
    <path d="M-10 160 Q80 146 170 156 T330 148"/><path d="M-10 174 Q80 160 170 170 T330 162"/>
  </g>
  <g stroke="#33241a" stroke-width="1.3" fill="#e9c46a">
    <path d="M30 150v-22M30 132c-4-1-6-4-6-8 4 1 6 4 6 8zM30 132c4-1 6-4 6-8-4 1-6 4-6 8zM30 124c-3-1-5-3-5-7 3 1 5 3 5 7zM30 124c3-1 5-3 5-7-3 1-5 3-5 7z"/>
    <path d="M290 146v-22M290 128c-4-1-6-4-6-8 4 1 6 4 6 8zM290 128c4-1 6-4 6-8-4 1-6 4-6 8zM290 120c-3-1-5-3-5-7 3 1 5 3 5 7zM290 120c3-1 5-3 5-7-3 1-5 3-5 7z"/>
  </g>
  <g fill="none" stroke="#33241a" stroke-width="1.3" opacity=".5"><path d="M200 50q5-5 10 0q5-5 10 0M222 62q4-4 8 0q4-4 8 0"/></g>
</svg>`,
  forestal: `
<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="320" height="180" fill="#dfe0c2"/>
  <path d="M0 92 L70 36 L112 70 L168 20 L236 78 L270 52 L320 88 V180 H0z" fill="#a7a893"/>
  <path d="M152 34 L168 20 L184 34 L176 32 L168 38 L160 31z" fill="#f6f1e2"/>
  <path d="M0 118 Q100 92 200 108 T320 100 V180 H0z" fill="#8c9f63"/>
  <g stroke="#33241a" stroke-width="1.3" stroke-linejoin="round">
    ${[18, 44, 70, 96, 206, 232, 258, 284, 310].map((x, i) => {
      const y = 112 - (i % 3) * 5, h = 30 + (i % 2) * 8;
      return `<path d="M${x} ${y}V${y + 12}" fill="none"/><path d="M${x - 11} ${y + 2}L${x} ${y - h}L${x + 11} ${y + 2}z" fill="${i % 2 ? '#4f6b3a' : '#5d7a44'}"/>`;
    }).join('')}
  </g>
  <path d="M120 180 Q150 150 138 132 Q128 118 160 104" fill="none" stroke="#6f9c98" stroke-width="9" stroke-linecap="round"/>
  <path d="M120 180 Q150 150 138 132 Q128 118 160 104" fill="none" stroke="#b8d3cf" stroke-width="3" stroke-linecap="round"/>
  <path d="M0 150 Q80 138 110 146 L112 180 H0z M200 150 Q260 140 320 146 V180 H190z" fill="#6f8a4b"/>
  <g stroke="#33241a" stroke-width="1.3" stroke-linejoin="round">
    ${[10, 34, 60, 88, 214, 240, 266, 294].map((x, i) => {
      const y = 158 + (i % 2) * 4;
      return `<path d="M${x - 13} ${y}L${x} ${y - 42}L${x + 13} ${y}z" fill="${i % 2 ? '#3f5a30' : '#4a6636'}"/>`;
    }).join('')}
    <path d="M178 170h34v7h-34z" fill="#b98552"/><ellipse cx="212" cy="173.5" rx="3" ry="3.5" fill="#e6c48f"/>
  </g>
</svg>`,
  serrano: `
<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="320" height="180" fill="#f1d9b4"/>
  <circle cx="60" cy="40" r="16" fill="#f3b560" opacity=".8"/>
  <path d="M0 100 L60 60 L110 82 L180 30 L250 76 L320 50 V180 H0z" fill="#c9a77c"/>
  <g stroke="#33241a" stroke-width="1.5" stroke-linejoin="round">
    <path d="M140 64 L180 30 L222 58 V74 H206 V90 H188 V106 H150 V90 H140z" fill="#f4f0e6"/>
    <path d="M150 74 H206 M140 90 H188" fill="none" opacity=".55"/>
    <path d="M160 64v10M178 64v10M196 64v10M156 90v16M172 90v16" fill="none" opacity=".4"/>
  </g>
  <path d="M0 124 Q110 104 200 118 T320 110 V180 H0z" fill="#b98f5f"/>
  <g stroke="#33241a" stroke-width="1.4" stroke-linejoin="round">
    <path d="M40 150h26v-14H40zM70 150h26v-14H70zM55 136h26v-14H55z" fill="#f4f0e6"/>
    <path d="M232 156l6-22h8l6 22z" fill="#6b7a4a"/>
    <path d="M258 156l5-16h6l5 16z" fill="#7d8b56"/>
    <path d="M118 166h48l-6-12h-36z" fill="#a77444"/>
    <circle cx="126" cy="168" r="6" fill="#8a6848"/><circle cx="158" cy="168" r="6" fill="#8a6848"/>
    <path d="M128 154h8v-8h10v8" fill="#f4f0e6"/>
  </g>
  <g fill="none" stroke="#8a6a44" stroke-width="1.2" opacity=".6"><path d="M10 170q20-6 40 0M200 176q30-6 60 0M270 168q20-5 40 0"/></g>
</svg>`
};
