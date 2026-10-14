import { t } from '../i18n/index.js';

/* ---------- Praise words ----------
   What pops up when lines clear. Picked by how many lines went at once and by the running combo; each pool avoids repeating its last word. */
const POOLS = {
  l2: ['Güzel!', 'Hoş!', 'Şahane!', 'Temiz!', 'Aferin!', 'Tatlı hamle!', 'Pırıl pırıl!', 'İyi gidiyor!'],
  l3: ['Harika!', 'Süper!', 'Çok iyi!', 'Kusursuz!', 'Parlak!', 'Bayıldım!', 'Bu iş tamam!', 'Bravo!'],
  l4: ['Muhteşem!', 'Efsane!', 'İnanılmaz!', 'Olağanüstü!', 'Dehşet!', 'Bomba gibi!', 'Destansı!', 'Akıl almaz!'],
  c2: ['Akışa girdin!', 'Devam!', 'Ritim tuttu!', 'Tam gaz!', 'Isınıyoruz!', 'Zincir başladı!'],
  c4: ['Yanıyorsun!', 'Durdurulamaz!', 'Seri başladı!', 'Ateş aldın!', 'Zinciri bozma!', 'Hız kesmiyor!'],
  c6: ['Alev alev!', 'Çılgın seri!', 'Rüzgâr gibi!', 'Sınır tanımıyor!', 'Büyücü gibi!', 'Hesap tutmuyor!'],
  c9: ['Tanrısal!', 'Efsanevi!', 'Zirvedesin!', 'Usta işi!', 'Kimse tutamaz!', 'Rekor kokusu!', 'Evren titriyor!'],
  clean: ['Tahta tertemiz!', 'Sıfırladın!', 'Tertemiz!', 'Cilalandı!'],
  bow: ['Fiyonk!', 'Çifte darbe!', 'Artı işareti!', 'Çapraz ateş!'],
  gem: ['Bir taş gitti!', 'Bir tane eksildi!', 'Çatırdadı!'],
};
const last = {};

function pick(key) {
  const a = POOLS[key];
  let w;
  do w = a[(Math.random() * a.length) | 0]; while (a.length > 1 && w === last[key]);
  last[key] = w;
  return t(w);
}

// The word for a move that cleared `lines` lines at combo `combo`; null when there is nothing to say
export function praiseFor(lines, combo) {
  const byLines = lines >= 4 ? 'l4' : lines === 3 ? 'l3' : lines === 2 ? 'l2' : null;
  if (combo < 2) return byLines && pick(byLines);
  const byCombo = combo >= 9 ? 'c9' : combo >= 6 ? 'c6' : combo >= 4 ? 'c4' : 'c2';
  return byLines && Math.random() < 0.5 ? pick(byLines) : pick(byCombo); // a big clear still sometimes gets its own word
}
export const cleanPraise = () => pick('clean');
export const bowPraise = () => pick('bow');
export const gemPraise = () => pick('gem');
