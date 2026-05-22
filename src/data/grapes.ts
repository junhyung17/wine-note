export interface GrapeVariety {
  name: string;
  color: 'red' | 'white' | 'sparkling';
  countries: string[];
}

export const GRAPE_VARIETIES: GrapeVariety[] = [
  // ── 레드 ───────────────────────────────────────────────
  { name: 'Cabernet Sauvignon', color: 'red', countries: ['프랑스', '미국', '칠레', '호주', '이탈리아'] },
  { name: 'Merlot',             color: 'red', countries: ['프랑스', '미국', '이탈리아', '칠레'] },
  { name: 'Pinot Noir',         color: 'red', countries: ['프랑스', '미국', '뉴질랜드', '독일'] },
  { name: 'Syrah',              color: 'red', countries: ['프랑스', '미국'] },
  { name: 'Shiraz',             color: 'red', countries: ['호주'] },
  { name: 'Grenache',           color: 'red', countries: ['프랑스', '스페인'] },
  { name: 'Garnacha',           color: 'red', countries: ['스페인'] },
  { name: 'Tempranillo',        color: 'red', countries: ['스페인'] },
  { name: 'Sangiovese',         color: 'red', countries: ['이탈리아'] },
  { name: 'Nebbiolo',           color: 'red', countries: ['이탈리아'] },
  { name: 'Barbera',            color: 'red', countries: ['이탈리아'] },
  { name: 'Montepulciano',      color: 'red', countries: ['이탈리아'] },
  { name: 'Primitivo',          color: 'red', countries: ['이탈리아'] },
  { name: 'Zinfandel',          color: 'red', countries: ['미국'] },
  { name: 'Malbec',             color: 'red', countries: ['아르헨티나', '프랑스'] },
  { name: 'Cabernet Franc',     color: 'red', countries: ['프랑스', '미국', '이탈리아'] },
  { name: 'Petit Verdot',       color: 'red', countries: ['프랑스', '미국'] },
  { name: 'Mourvèdre',          color: 'red', countries: ['프랑스', '스페인'] },
  { name: 'Monastrell',         color: 'red', countries: ['스페인'] },
  { name: 'Carménère',          color: 'red', countries: ['칠레'] },
  { name: 'Touriga Nacional',   color: 'red', countries: ['포르투갈'] },
  { name: 'Pinotage',           color: 'red', countries: ['남아프리카'] },
  { name: 'Agiorgitiko',        color: 'red', countries: ['그리스'] },
  { name: 'Xinomavro',          color: 'red', countries: ['그리스'] },
  { name: 'Zweigelt',           color: 'red', countries: ['오스트리아'] },
  { name: "Nero d'Avola",       color: 'red', countries: ['이탈리아'] },

  // ── 화이트 ──────────────────────────────────────────────
  { name: 'Chardonnay',         color: 'white', countries: ['프랑스', '미국', '호주', '이탈리아'] },
  { name: 'Sauvignon Blanc',    color: 'white', countries: ['프랑스', '뉴질랜드', '미국'] },
  { name: 'Riesling',           color: 'white', countries: ['독일', '프랑스', '오스트리아'] },
  { name: 'Pinot Grigio',       color: 'white', countries: ['이탈리아'] },
  { name: 'Pinot Gris',         color: 'white', countries: ['프랑스', '미국'] },
  { name: 'Gewurztraminer',     color: 'white', countries: ['프랑스', '독일', '오스트리아'] },
  { name: 'Viognier',           color: 'white', countries: ['프랑스', '미국'] },
  { name: 'Chenin Blanc',       color: 'white', countries: ['프랑스', '남아프리카'] },
  { name: 'Grüner Veltliner',   color: 'white', countries: ['오스트리아'] },
  { name: 'Albariño',           color: 'white', countries: ['스페인'] },
  { name: 'Verdejo',            color: 'white', countries: ['스페인'] },
  { name: 'Vermentino',         color: 'white', countries: ['이탈리아', '프랑스'] },
  { name: 'Fiano',              color: 'white', countries: ['이탈리아'] },
  { name: 'Greco',              color: 'white', countries: ['이탈리아'] },
  { name: 'Garganega',          color: 'white', countries: ['이탈리아'] },
  { name: 'Trebbiano',          color: 'white', countries: ['이탈리아'] },
  { name: 'Muscat',             color: 'white', countries: ['프랑스', '이탈리아', '스페인', '그리스'] },
  { name: 'Torrontés',          color: 'white', countries: ['아르헨티나'] },
  { name: 'Roussanne',          color: 'white', countries: ['프랑스'] },
  { name: 'Marsanne',           color: 'white', countries: ['프랑스'] },
  { name: 'Sémillon',           color: 'white', countries: ['프랑스', '호주'] },
  { name: 'Melon de Bourgogne', color: 'white', countries: ['프랑스'] },
  { name: 'Assyrtiko',          color: 'white', countries: ['그리스'] },
  { name: 'Furmint',            color: 'white', countries: ['헝가리'] },
  { name: 'Welschriesling',     color: 'white', countries: ['오스트리아'] },

  // ── 스파클링 전용 ─────────────────────────────────────────
  { name: 'Pinot Meunier',  color: 'sparkling', countries: ['프랑스'] },
  { name: 'Glera',          color: 'sparkling', countries: ['이탈리아'] },
  { name: 'Macabeo',        color: 'sparkling', countries: ['스페인'] },
  { name: 'Xarel·lo',       color: 'sparkling', countries: ['스페인'] },
  { name: 'Parellada',      color: 'sparkling', countries: ['스페인'] },
];

// 와인 색상 → 우선 표시할 품종 색상
export const COLOR_TO_GRAPE_COLOR: Record<string, ('red' | 'white' | 'sparkling')[]> = {
  red:       ['red', 'white', 'sparkling'],
  rosé:      ['red', 'white', 'sparkling'],
  orange:    ['white', 'red', 'sparkling'],
  white:     ['white', 'red', 'sparkling'],
  sparkling: ['sparkling', 'white', 'red'],
  dessert:   ['white', 'red', 'sparkling'],
  fortified: ['red', 'white', 'sparkling'],
};
