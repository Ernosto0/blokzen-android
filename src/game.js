(() => {
'use strict';

/* ---------- Themes ---------- */
// blocks: 7 block colors; style: block look; amb: living background; snd: sound timbre
const THEMES = [
  { id: 'dusk', name: 'Alacakaranlık', bg: '#1a1330', glow: '#3a2766', board: '#0f0b1d', cell: '#241b3e', fg: '#f4eeff', muted: '#a597c7', accent: '#ffcb57', ink: '#0f0b1d', btn: '#2a2046', grey: '#5d5576',
    blocks: ['#ff6b5b', '#ffb23f', '#9ad94f', '#2ec4b6', '#4aa8ff', '#a77bff', '#ff6fb5'], style: 'gloss', amb: 'orbs', snd: { wave: 'triangle', root: 523.25 } },
  { id: 'ocean', name: 'Okyanus', bg: '#062236', glow: '#0d5876', board: '#03141f', cell: '#0b2f47', fg: '#e6fbff', muted: '#7fb5c9', accent: '#5ef2d6', ink: '#03141f', btn: '#0d3a55', grey: '#4b6878',
    blocks: ['#ff7a6b', '#ffd166', '#7ae582', '#2ee6d6', '#36a9ff', '#7d8cff', '#f78fd8'], style: 'jelly', amb: 'bubbles', snd: { wave: 'sine', root: 587.33, echo: true } },
  { id: 'forest', name: 'Ateşböceği Ormanı', bg: '#0c1c14', glow: '#21452f', board: '#07120c', cell: '#15301f', fg: '#eef7e4', muted: '#93b49a', accent: '#d8f36a', ink: '#07120c', btn: '#1a3826', grey: '#4f6455',
    blocks: ['#d9573b', '#eaa53a', '#a8d24a', '#43b97a', '#3aa7b8', '#9a86e0', '#d85f8f'], style: 'leaf', amb: 'fireflies', snd: { wave: 'sine', root: 440, marimba: true } },
  { id: 'sunset', name: 'Gün Batımı', bg: '#4a1d3c', glow: '#c4566a', board: '#24091d', cell: '#441a36', fg: '#fff3e8', muted: '#f0b9a8', accent: '#ffe08a', ink: '#24091d', btn: '#5e2549', grey: '#7a5560',
    blocks: ['#ff5e57', '#ff9f43', '#ffd23f', '#3ddc97', '#38b6ff', '#8c7bff', '#ff6fb7'], style: 'gem', amb: 'dust', snd: { wave: 'triangle', root: 493.88 } },
  { id: 'snow', name: 'Kar Vadisi', light: true, bg: '#8db6db', glow: '#f0f8ff', board: '#5f8fbd', cell: '#79a4cc', fg: '#132c48', muted: '#3d5f82', accent: '#1d6ad0', ink: '#ffffff', btn: '#cfe2f3', grey: '#8a9db0', stroke: '#f2f8ff',
    blocks: ['#ee6f80', '#f4ad5f', '#86cf78', '#38c3c3', '#4f97ee', '#9a82f0', '#e07fc4'], style: 'frost', amb: 'snow', snd: { wave: 'sine', root: 659.25, bell: true, echo: true } },
  { id: 'neon', name: 'Neon Şehir', bg: '#07060f', glow: '#2c0c40', board: '#050409', cell: '#120f22', fg: '#f2f0ff', muted: '#8f86b8', accent: '#ff3dc8', ink: '#07060f', btn: '#1a1430', grey: '#3e3a55',
    blocks: ['#ff3b6b', '#ff9e2c', '#e8ff3a', '#2bffb8', '#2ad4ff', '#8a5cff', '#ff4fd8'], style: 'neon', amb: 'grid', snd: { wave: 'square', root: 523.25, gain: 0.45 } },
  { id: 'sakura', name: 'Sakura', light: true, bg: '#efbccc', glow: '#fff4f7', board: '#cf8ca3', cell: '#e2a9bb', fg: '#4a1f30', muted: '#8a5065', accent: '#c93a68', ink: '#ffffff', btn: '#f8dbe4', grey: '#b89aa4', stroke: '#fff5f8',
    blocks: ['#e8506a', '#f39c5a', '#a3c955', '#43b89c', '#5a9be0', '#9a7ad8', '#e070ae'], style: 'candy', amb: 'petals', snd: { wave: 'triangle', root: 698.46, pluck: true } },
  { id: 'volcano', name: 'Volkan', bg: '#1a0806', glow: '#5a160a', board: '#0e0403', cell: '#2a0e09', fg: '#fff0e6', muted: '#c08a76', accent: '#ff8a2a', ink: '#1a0806', btn: '#3a140c', grey: '#5a403a',
    blocks: ['#ff3d2e', '#ff7f1f', '#ffcc33', '#8fe05a', '#36c2d6', '#a66bff', '#ff4f9a'], style: 'lava', amb: 'embers', snd: { wave: 'triangle', root: 392 } },
  { id: 'space', name: 'Derin Uzay', bg: '#050a1f', glow: '#1b2c6e', board: '#030616', cell: '#0f1a3a', fg: '#eef2ff', muted: '#8e9bd0', accent: '#8fd3ff', ink: '#030616', btn: '#121f48', grey: '#3f4a6e',
    blocks: ['#ff6b9d', '#ffb86b', '#d6f56b', '#5cf0d0', '#5aa2ff', '#9d7dff', '#e47dff'], style: 'cosmic', amb: 'stars', snd: { wave: 'sine', root: 523.25, echo: true, bell: true } },
  // one-colour theme: every block is the same honey, only the light inside it shifts a touch
  { id: 'honey', name: 'Bal Kovanı', bg: '#2a1703', glow: '#7a4a0a', board: '#170c01', cell: '#3a2307', fg: '#fff4dc', muted: '#d8b277', accent: '#ffc23a', ink: '#1d0f02', btn: '#43280a', grey: '#6b5a44',
    blocks: ['#f2a516', '#f5ab1c', '#efa013', '#f6b022', '#eea415', '#f4a81a', '#f0a518'], style: 'honey', amb: 'hive', snd: { wave: 'sine', root: 440, kit: 'honey' } },
  { id: 'gold', name: 'Altın Hazine', bg: '#1d1405', glow: '#6b4a0c', board: '#120c03', cell: '#2b1f0a', fg: '#fff6dc', muted: '#cdb27a', accent: '#ffd54a', ink: '#1d1405', btn: '#3a2a0c', grey: '#6a6050',
    blocks: ['#f5c542', '#f2bd37', '#f7cb4d', '#efb52e', '#f4c03f', '#f9d157', '#f0ba33'], style: 'gold', amb: 'coins', snd: { wave: 'triangle', root: 659.25, bell: true, kit: 'gold' } },
  { id: 'glass', name: 'Cam Kristal', bg: '#0b1a24', glow: '#2a5a72', board: '#07121a', cell: '#122a38', fg: '#eefaff', muted: '#8fb8cc', accent: '#9ff0ff', ink: '#07121a', btn: '#163444', grey: '#4a5c66',
    blocks: ['#ff8fa3', '#ffc48a', '#fff08a', '#9df5b5', '#8ae8ff', '#a3b5ff', '#e3a3ff'], style: 'glass', amb: 'prism', snd: { wave: 'sine', root: 783.99, bell: true, echo: true, kit: 'glass' } },
  { id: 'choco', name: 'Çikolata Dükkânı', bg: '#1e0f08', glow: '#5a2e18', board: '#0d0603', cell: '#22120a', fg: '#fff0e2', muted: '#c49a80', accent: '#ffb070', ink: '#1e0f08', btn: '#3a1f10', grey: '#5c4a40',
    blocks: ['#8b4a24', '#94532a', '#874622', '#9a5a2e', '#82431f', '#915028', '#8e4c25'], style: 'choco', amb: 'cocoa', snd: { wave: 'triangle', root: 440, kit: 'choco' } },
  { id: 'slime', name: 'Slime', bg: '#0b1a0c', glow: '#2c5e1c', board: '#061006', cell: '#132a12', fg: '#efffe6', muted: '#9cc48c', accent: '#9dff4a', ink: '#061006', btn: '#18361a', grey: '#4c5c48',
    blocks: ['#7ee03a', '#86e842', '#74d632', '#8cee4c', '#78dc36', '#82e43e', '#7ad838'], style: 'slime', amb: 'ooze', snd: { wave: 'sine', root: 392, kit: 'slime' } },
  { id: 'wood', name: 'Ahşap Oyuncak', bg: '#2a1a10', glow: '#6e4422', board: '#1a0f08', cell: '#2e1d12', fg: '#fff3e2', muted: '#c8a484', accent: '#ffc46a', ink: '#1a0f08', btn: '#3e2816', grey: '#5e5248',
    blocks: ['#d9a066', '#c98f55', '#e0aa70', '#cf9660', '#d39a5e', '#dca468', '#c88c52'], style: 'wood', amb: 'workshop', snd: { wave: 'sine', root: 523.25, marimba: true, kit: 'wood' } },
  { id: 'gum', name: 'Sakız Balonu', light: true, bg: '#ffc2dc', glow: '#fff0f6', board: '#e88ab4', cell: '#f3a8c8', fg: '#5a1035', muted: '#a04870', accent: '#e0287a', ink: '#ffffff', btn: '#ffe0ee', grey: '#c0a0b0', stroke: '#fff3f8',
    blocks: ['#ff5fa2', '#ff6fae', '#ff539a', '#ff7bb6', '#ff66a8', '#ff5a9e', '#ff74b2'], style: 'gum', amb: 'gumballs', snd: { wave: 'triangle', root: 622.25, pluck: true, kit: 'gum' } },
  { id: 'retro', name: 'Retro Arcade', bg: '#0a0820', glow: '#241a5e', board: '#05040f', cell: '#151236', fg: '#ffffff', muted: '#9a94d0', accent: '#3dff7a', ink: '#05040f', btn: '#1c1846', grey: '#4a4866',
    blocks: ['#ff3355', '#ff9922', '#ffee33', '#33ee55', '#33ccff', '#5566ff', '#cc44ff'], style: 'pixel', amb: 'arcade', snd: { wave: 'square', root: 523.25, gain: 0.4, kit: 'chip' } },
  { id: 'amethyst', name: 'Ametist Mağarası', bg: '#140a24', glow: '#4a2276', board: '#0b0516', cell: '#1f1236', fg: '#f6eeff', muted: '#ad94d6', accent: '#d59bff', ink: '#0b0516', btn: '#2a1846', grey: '#4f4462',
    blocks: ['#a35cff', '#b06bff', '#9550f0', '#bb7aff', '#9c58f8', '#a965ff', '#8f4ae8'], style: 'crystal', amb: 'cave', snd: { wave: 'sine', root: 587.33, bell: true, echo: true, kit: 'crystal' } },
  { id: 'coffee', name: 'Kahve Dükkânı', bg: '#1c120c', glow: '#5c3a22', board: '#110a06', cell: '#2a1c13', fg: '#fff3e6', muted: '#c8a888', accent: '#f2c48d', ink: '#1c120c', btn: '#382518', grey: '#5c5048',
    blocks: ['#c48a5a', '#b97d4e', '#d29a68', '#a86f43', '#c99060', '#bd8452', '#d6a272'], style: 'bean', amb: 'steam', snd: { wave: 'sine', root: 493.88, kit: 'cup' } },
  { id: 'halloween', name: 'Cadılar Bayramı', bg: '#120a1c', glow: '#3a1a4a', board: '#0a0610', cell: '#1e1328', fg: '#fff0e0', muted: '#b49ab8', accent: '#ff8a1e', ink: '#0a0610', btn: '#2a1a36', grey: '#4a4250',
    blocks: ['#ff7a12', '#ff8420', '#f8700c', '#ff8e2a', '#fa7616', '#ff801c', '#f46e10'], style: 'pumpkin', amb: 'night', snd: { wave: 'triangle', root: 349.23, echo: true, kit: 'spooky' } },
  { id: 'xmas', name: 'Yılbaşı Şekeri', bg: '#0d2418', glow: '#2a5a3a', board: '#07160e', cell: '#143222', fg: '#fff8f0', muted: '#a8c8b0', accent: '#ffd25a', ink: '#07160e', btn: '#18402a', grey: '#4c5a50',
    blocks: ['#e8283c', '#ee3446', '#e02034', '#f0404e', '#e42a3e', '#ea3242', '#de2232'], style: 'cane', amb: 'lights', snd: { wave: 'sine', root: 659.25, bell: true, kit: 'jingle' } },
  { id: 'marble', name: 'Mermer & Altın', bg: '#0c1612', glow: '#244236', board: '#060c0a', cell: '#152620', fg: '#fbf7ee', muted: '#a8b8ae', accent: '#e2c56b', ink: '#060c0a', btn: '#1a3028', grey: '#5a6460',
    blocks: ['#f2efe8', '#ece8df', '#f5f2ec', '#e8e4da', '#f0ece4', '#eeeae2', '#e6e2d8'], style: 'marble', amb: 'luxe', snd: { wave: 'triangle', root: 523.25, kit: 'stone' } },
  { id: 'origami', name: 'Kâğıt Origami', light: true, bg: '#f3ead8', glow: '#fffaf0', board: '#d8c8a8', cell: '#e6d8bc', fg: '#3a2e20', muted: '#7a6a52', accent: '#e2553a', ink: '#ffffff', btn: '#fbf4e6', grey: '#b0a898', stroke: '#fffaf0',
    blocks: ['#f26b5b', '#f5a04a', '#f2d25a', '#7cc77a', '#55aee0', '#8c7ee0', '#e47ab4'], style: 'paper', amb: 'cranes', snd: { wave: 'triangle', root: 587.33, pluck: true, kit: 'paper' } },
  { id: 'fruit', name: 'Meyve Bahçesi', light: true, bg: '#bfe9d4', glow: '#f6fff6', board: '#7cc8a4', cell: '#9ad8b8', fg: '#123a28', muted: '#3a6a52', accent: '#ff4a5a', ink: '#ffffff', btn: '#e2f7ec', grey: '#9ab0a4', stroke: '#f2fff8',
    blocks: ['#ff4d5e', '#ff9a2a', '#ffe14a', '#8ccf3a', '#ff5ab4', '#8a4ad8', '#3fbf6a'], style: 'fruit', amb: 'summer', snd: { wave: 'triangle', root: 554.37, pluck: true, kit: 'juicy' } },
  // ---- third set: each one locked behind its own task ----
  { id: 'aurora', name: 'Kuzey Işıkları', bg: '#071526', glow: '#1d4a5a', board: '#040d18', cell: '#0e2236', fg: '#eafcff', muted: '#8fb4c4', accent: '#7dffc4', ink: '#04121c', btn: '#123048', grey: '#3e5260',
    blocks: ['#3dffa8', '#2ee0d0', '#4ab0ff', '#7a84ff', '#b47aff', '#ff7ad8', '#a8ff6a'], style: 'aurora', amb: 'aurora', snd: { wave: 'sine', root: 587.33, bell: true, echo: true, kit: 'aurora' } },
  { id: 'coral', name: 'Mercan Resifi', bg: '#083444', glow: '#16707e', board: '#041e28', cell: '#0c3e4c', fg: '#eafffb', muted: '#86c2c6', accent: '#ff8a6a', ink: '#041e28', btn: '#0e4a58', grey: '#4a666c',
    blocks: ['#ff6a5a', '#ff9f4a', '#ffd25a', '#ff6f9e', '#c47aff', '#4ad8c8', '#7ae07a'], style: 'coral', amb: 'reef', snd: { wave: 'sine', root: 493.88, echo: true, kit: 'reef' } },
  { id: 'tomb', name: 'Firavun Mezarı', bg: '#26170a', glow: '#74451a', board: '#150d05', cell: '#30200e', fg: '#fff1d6', muted: '#cdab78', accent: '#ffc24a', ink: '#1a0f05', btn: '#3c2811', grey: '#6a5a48',
    blocks: ['#d9a65a', '#2f7fc0', '#2fb0a2', '#c8583a', '#e8c470', '#8a5ac0', '#7aa04a'], style: 'tomb', amb: 'tomb', snd: { wave: 'triangle', root: 392, kit: 'tomb' } },
  { id: 'iznik', name: 'İznik Çinisi', bg: '#0e2a50', glow: '#2a5a98', board: '#081c38', cell: '#13335e', fg: '#f4f8ff', muted: '#9fb6d8', accent: '#ff6a52', ink: '#081c38', btn: '#183a68', grey: '#5a6a80',
    blocks: ['#1f5fc8', '#1aa0b8', '#d8402e', '#2a9a5a', '#4a3ab0', '#d89a2a', '#b0306a'], style: 'iznik', amb: 'iznik', snd: { wave: 'triangle', root: 523.25, pluck: true, kit: 'iznik' } },
  { id: 'balloon', name: 'Kapadokya Balonları', light: true, bg: '#f2c4a2', glow: '#fff2dc', board: '#c48466', cell: '#d89c7e', fg: '#4a2418', muted: '#8a5440', accent: '#d8442a', ink: '#ffffff', btn: '#fbe2cf', grey: '#b8a090', stroke: '#fff4ea',
    blocks: ['#e8443a', '#f5962a', '#f2c83a', '#3aa86a', '#3a86d8', '#8a56d0', '#e8569a'], style: 'balloon', amb: 'cappadocia', snd: { wave: 'triangle', root: 587.33, kit: 'balloon' } },
  { id: 'ebru', name: 'Ebru', bg: '#122030', glow: '#2e4a6a', board: '#0a131d', cell: '#18283a', fg: '#f6f2ea', muted: '#a8b4c4', accent: '#ffb84a', ink: '#0a131d', btn: '#1e3246', grey: '#4c5866',
    blocks: ['#e8485a', '#f5a03a', '#f0d84a', '#3ab87a', '#3a96d8', '#7a58d0', '#e868b8'], style: 'ebru', amb: 'ebru', snd: { wave: 'sine', root: 440, echo: true, kit: 'ebru' } },
  { id: 'clock', name: 'Saat Kulesi', bg: '#1a140e', glow: '#5a4020', board: '#0e0a06', cell: '#2a2016', fg: '#fff2dc', muted: '#c8aa84', accent: '#e8b84a', ink: '#1a140e', btn: '#3a2a18', grey: '#5a5044',
    blocks: ['#d4a040', '#b86e34', '#e8c868', '#8c9caa', '#5a9a8a', '#a85a3a', '#c8b088'], style: 'gear', amb: 'clockwork', snd: { wave: 'triangle', root: 440, bell: true, kit: 'clock' } },
  { id: 'storm', name: 'Fırtına', bg: '#121822', glow: '#323e56', board: '#090d13', cell: '#18202c', fg: '#eef2fa', muted: '#97a4ba', accent: '#9fd8ff', ink: '#090d13', btn: '#202a3a', grey: '#3e4552',
    blocks: ['#8090c0', '#4f9ad8', '#9a7ad8', '#4fb0b0', '#c08ad0', '#5f78d8', '#8ac4e8'], style: 'storm', amb: 'storm', snd: { wave: 'sine', root: 392, echo: true, kit: 'storm' } },
  { id: 'zen', name: 'Zen Bahçesi', light: true, bg: '#dbe3d6', glow: '#f8fbf4', board: '#a2ac96', cell: '#b8c2ac', fg: '#24302a', muted: '#5a6a5e', accent: '#c8442e', ink: '#ffffff', btn: '#eef2ea', grey: '#a0a69a', stroke: '#f8fbf4',
    blocks: ['#6f8fa8', '#a8846a', '#6a9a7a', '#b8a07a', '#5a6f9a', '#9a7aa0', '#c08a7a'], style: 'stone', amb: 'zen', snd: { wave: 'sine', root: 440, kit: 'zen' } },
  { id: 'lavalamp', name: 'Lav Lambası', bg: '#28120a', glow: '#86381a', board: '#160904', cell: '#2e160a', fg: '#fff0e0', muted: '#d8a880', accent: '#ff8a2a', ink: '#160904', btn: '#3e1e0e', grey: '#5a4a40',
    blocks: ['#ff6a3a', '#ffb03a', '#e8d84a', '#d04a8a', '#8a4ac8', '#3aa8a8', '#ff4a6a'], style: 'lamp', amb: 'lavalamp', snd: { wave: 'triangle', root: 392, kit: 'funk' } },
  { id: 'cloud', name: 'Pamuk Bulutlar', light: true, bg: '#bcdcf6', glow: '#ffffff', board: '#88b4dc', cell: '#a2c8e8', fg: '#1a3450', muted: '#4a6a8a', accent: '#f0558e', ink: '#ffffff', btn: '#e6f3fd', grey: '#a8b8c8', stroke: '#f4faff',
    blocks: ['#ff8fb0', '#ffb07a', '#ffd86a', '#7ad8a0', '#6ab8ff', '#a890ff', '#f08ad8'], style: 'cloud', amb: 'sky', snd: { wave: 'sine', root: 659.25, bell: true, kit: 'cloud' } },
  { id: 'factory', name: 'Robot Fabrikası', bg: '#14171b', glow: '#383e46', board: '#0a0c0f', cell: '#1b1f25', fg: '#eef2f6', muted: '#9aa4b0', accent: '#ffc21a', ink: '#0a0c0f', btn: '#252b33', grey: '#4a5058',
    blocks: ['#e04a3a', '#f5a01a', '#f2d21a', '#4ab85a', '#3a8ae0', '#8a6ad8', '#a8b4c0'], style: 'metal', amb: 'factory', snd: { wave: 'square', root: 392, gain: 0.35, kit: 'factory' } },
  { id: 'tropic', name: 'Tropik Ada', light: true, bg: '#98dcd4', glow: '#fff8e0', board: '#d8b47c', cell: '#e6c896', fg: '#143a36', muted: '#3a6a64', accent: '#f0602e', ink: '#ffffff', btn: '#e6f8f4', grey: '#b8b0a0', stroke: '#fffaf0',
    blocks: ['#e8503a', '#f59a2a', '#f0c83a', '#4aa84a', '#22a8b8', '#3a72d0', '#e0569a'], style: 'tiki', amb: 'island', snd: { wave: 'triangle', root: 523.25, pluck: true, kit: 'ukulele' } },
  { id: 'fossil', name: 'Fosil Kazısı', bg: '#221912', glow: '#583824', board: '#130d09', cell: '#291f17', fg: '#f6ece0', muted: '#bca890', accent: '#ff9a3a', ink: '#130d09', btn: '#32251b', grey: '#5a5048',
    blocks: ['#c08a5a', '#a86e4a', '#d4ae74', '#8c8474', '#b4785a', '#9a8a68', '#cc9c7c'], style: 'fossil', amb: 'prehistoric', snd: { wave: 'triangle', root: 349.23, kit: 'fossil' } },
  { id: 'musicbox', name: 'Müzik Kutusu', bg: '#280d19', glow: '#682943', board: '#17070f', cell: '#2d1120', fg: '#fff0f4', muted: '#d0a0b4', accent: '#ffd27a', ink: '#17070f', btn: '#3d1929', grey: '#5a4650',
    blocks: ['#d8304a', '#e8902a', '#e8c840', '#2a9a6a', '#2a6ac8', '#7a3ab0', '#c83a8a'], style: 'lacquer', amb: 'musicbox', snd: { wave: 'sine', root: 783.99, bell: true, kit: 'musicbox' } },
  { id: 'autumn', name: 'Sonbahar', bg: '#281508', glow: '#763810', board: '#160b04', cell: '#2d190b', fg: '#fff2e2', muted: '#d4a882', accent: '#ffa53a', ink: '#160b04', btn: '#3d210e', grey: '#5a4c40',
    blocks: ['#d8402a', '#e8782a', '#f0b030', '#b8a02a', '#7a9a3a', '#a03a2a', '#d86a4a'], style: 'maple', amb: 'autumn', snd: { wave: 'triangle', root: 440, marimba: true, kit: 'autumn' } },
  { id: 'sushi', name: 'Sushi Bar', bg: '#1a1414', glow: '#4a2a24', board: '#0e0a0a', cell: '#221a18', fg: '#fff6ee', muted: '#c4aa9a', accent: '#ff5a3a', ink: '#0e0a0a', btn: '#2e2220', grey: '#504644',
    blocks: ['#ff8a5a', '#d8344a', '#f2c84a', '#6ab84a', '#f2e8da', '#c8607a', '#3a6a4a'], style: 'sushi', amb: 'sushibar', snd: { wave: 'triangle', root: 523.25, pluck: true, kit: 'sushi' } },
  { id: 'graffiti', name: 'Graffiti Duvarı', bg: '#1e1a1c', glow: '#4a3a40', board: '#121012', cell: '#242024', fg: '#ffffff', muted: '#b0a8ac', accent: '#c8ff3a', ink: '#121012', btn: '#2e282c', grey: '#555055',
    blocks: ['#ff3d5a', '#ff9a1a', '#ffe81a', '#3dff7a', '#1ad8ff', '#8a5aff', '#ff4ad8'], style: 'spray', amb: 'graffiti', snd: { wave: 'square', root: 392, gain: 0.3, kit: 'spray' } },
  { id: 'carnival', name: 'Lunapark', bg: '#1a0a2a', glow: '#4a1a6a', board: '#0e0618', cell: '#22103a', fg: '#fff6e0', muted: '#c0a0d8', accent: '#ffd23a', ink: '#0e0618', btn: '#2e1846', grey: '#4e4460',
    blocks: ['#ff3a4a', '#ff9a2a', '#ffd83a', '#3ad86a', '#3aa8ff', '#a85aff', '#ff5ac8'], style: 'marquee', amb: 'carnival', snd: { wave: 'square', root: 523.25, gain: 0.35, kit: 'carnival' } },
  { id: 'gelato', name: 'Gelato', light: true, bg: '#fbe4d6', glow: '#fffaf4', board: '#dcae84', cell: '#e8c4a0', fg: '#4a2a1a', muted: '#8a5a44', accent: '#e2447a', ink: '#ffffff', btn: '#fff2ea', grey: '#c0b0a4', stroke: '#fffaf4',
    blocks: ['#ff8fa0', '#ffb47a', '#ffe48a', '#9ad890', '#8acaf0', '#bea0ea', '#8a5a3a'], style: 'gelato', amb: 'gelateria', snd: { wave: 'triangle', root: 659.25, pluck: true, kit: 'gelato' } },
  // ---- daily collection: each one opens by playing the daily challenge ----
  { id: 'news', name: 'Sabah Gazetesi', light: true, bg: '#e6e0d2', glow: '#fbf8f0', board: '#b9b19f', cell: '#d0c8b6', fg: '#1e1c18', muted: '#5e594e', accent: '#c8321e', ink: '#ffffff', btn: '#f6f2e8', grey: '#a8a294', stroke: '#fbf8f0',
    blocks: ['#d0473a', '#e09a38', '#e2c640', '#5a9a5a', '#3a86c0', '#7a62b0', '#c4508a'], style: 'news', amb: 'newsroom', snd: { wave: 'triangle', root: 523.25, kit: 'news' } },
  { id: 'calendar', name: 'Takvim Yaprağı', bg: '#1f3a3c', glow: '#3e6a68', board: '#13282a', cell: '#24403f', fg: '#fdf8ee', muted: '#a9c2bc', accent: '#ff5a4a', ink: '#13282a', btn: '#2a4a4a', grey: '#4f6462',
    blocks: ['#f26b5b', '#f5a24a', '#f2d25a', '#8cc87a', '#5aaee0', '#9a86e0', '#f08ab4'], style: 'leaflet', amb: 'tearoff', snd: { wave: 'triangle', root: 587.33, pluck: true, kit: 'calendar' } },
  { id: 'tea', name: 'Çay Bahçesi', bg: '#2c4a5e', glow: '#e8a878', board: '#1a2e3c', cell: '#2a4456', fg: '#fff6ea', muted: '#b8c6cc', accent: '#f0a03a', ink: '#1a2e3c', btn: '#33536a', grey: '#556a74',
    blocks: ['#c84a24', '#e08a2a', '#e8bc4a', '#8cb040', '#d4405a', '#9a5a9a', '#3a9a8a'], style: 'teaglass', amb: 'bosphorus', snd: { wave: 'sine', root: 493.88, echo: true, kit: 'tea' } },
  { id: 'spice', name: 'Baharat Çarşısı', bg: '#2a160c', glow: '#7a3a14', board: '#170b05', cell: '#33190c', fg: '#fff0dc', muted: '#d4a47c', accent: '#ffb43a', ink: '#170b05', btn: '#40220f', grey: '#5e4a3c',
    blocks: ['#b02a36', '#e8a81c', '#d84a22', '#b07a34', '#6e9a40', '#ee7a2a', '#8a6aa8'], style: 'spice', amb: 'bazaar', snd: { wave: 'triangle', root: 440, kit: 'spice' } },
  { id: 'desert', name: 'Kum Saati Çölü', bg: '#3a2414', glow: '#c47a3a', board: '#22140a', cell: '#3e2614', fg: '#fff3e0', muted: '#dcb48a', accent: '#ffc65a', ink: '#22140a', btn: '#4a2e18', grey: '#6a5440',
    blocks: ['#e8b450', '#e07a38', '#c4503a', '#f0d890', '#a8743e', '#9aa85a', '#6a8ac0'], style: 'dune', amb: 'hourglass', snd: { wave: 'sine', root: 392, echo: true, kit: 'sand' } },
  { id: 'letter', name: 'Mektup ve Mühür', bg: '#1e2433', glow: '#4a5470', board: '#121722', cell: '#232b3c', fg: '#f6f0e6', muted: '#a8b0c4', accent: '#e85a4a', ink: '#121722', btn: '#2a3346', grey: '#4a5266',
    blocks: ['#c83a3a', '#e08a2a', '#e8c24a', '#4a9a6a', '#3a7ac8', '#7a5ab8', '#c85a9a'], style: 'envelope', amb: 'post', snd: { wave: 'triangle', root: 523.25, kit: 'letter' } },
  { id: 'picnic', name: 'Hafta Sonu Pikniği', light: true, bg: '#bfe0a8', glow: '#f4fbe8', board: '#8ab070', cell: '#a4c88a', fg: '#1e3a1a', muted: '#4a6a3e', accent: '#d8402e', ink: '#ffffff', btn: '#eaf6e0', grey: '#a8b49a', stroke: '#f4fbe8',
    blocks: ['#e0453a', '#f0943a', '#f0c83a', '#4aa84a', '#3a8ad0', '#9a6ac8', '#e86aa0'], style: 'gingham', amb: 'park', snd: { wave: 'triangle', root: 587.33, pluck: true, kit: 'picnic' } },
  { id: 'library', name: 'Gece Yarısı Kütüphanesi', bg: '#1e140e', glow: '#5a3418', board: '#120b07', cell: '#24170f', fg: '#f8ecd8', muted: '#c8a880', accent: '#f0b860', ink: '#120b07', btn: '#33221a', grey: '#54463a',
    blocks: ['#b03a3a', '#3a8a4a', '#3a62a8', '#b8802e', '#8a447a', '#c8a050', '#3a8a8a'], style: 'book', amb: 'library', snd: { wave: 'sine', root: 440, echo: true, kit: 'library' } },
  { id: 'stained', name: 'Vitray', bg: '#16121c', glow: '#3a2a4a', board: '#0c0910', cell: '#1e1826', fg: '#f4eefc', muted: '#a89cbc', accent: '#ffd25a', ink: '#0c0910', btn: '#261e30', grey: '#4a4256',
    blocks: ['#e0283c', '#f08a1e', '#f2cc2a', '#28a858', '#2a72d8', '#7a3ac8', '#d83a9a'], style: 'vitray', amb: 'cathedral', snd: { wave: 'sine', root: 392, echo: true, kit: 'organ' } },
  { id: 'observatory', name: 'Rasathane', bg: '#0a1020', glow: '#1e2a50', board: '#060a14', cell: '#121c32', fg: '#eef2ff', muted: '#94a2c8', accent: '#e8c06a', ink: '#060a14', btn: '#16223e', grey: '#3e4866',
    blocks: ['#d85a4a', '#e8a040', '#e8d070', '#5ab88a', '#4a90e0', '#8a70d8', '#d070b0'], style: 'astrolabe', amb: 'starchart', snd: { wave: 'sine', root: 523.25, bell: true, echo: true, kit: 'brass' } },
  { id: 'train', name: 'Gece Treni', bg: '#141628', glow: '#2e2e58', board: '#0b0c18', cell: '#1c1e34', fg: '#f2f0ff', muted: '#a0a0c8', accent: '#ffb84a', ink: '#0b0c18', btn: '#22243e', grey: '#46485e',
    blocks: ['#c83a3a', '#e08a2a', '#e8c84a', '#3a9a5a', '#3a6ac0', '#7a4aa8', '#3a9aa8'], style: 'carriage', amb: 'nighttrain', snd: { wave: 'triangle', root: 440, kit: 'train' } },
  { id: 'moon', name: 'Ay Evreleri', bg: '#0a1426', glow: '#2a4466', board: '#060c18', cell: '#122036', fg: '#eef4ff', muted: '#9ab0cc', accent: '#dfe8f6', ink: '#060c18', btn: '#16263e', grey: '#3e4a60',
    blocks: ['#e8a0a0', '#e8c08a', '#ecdc9a', '#a8d8b0', '#9ac0ec', '#b8a8ec', '#e8b0d8'], style: 'lunar', amb: 'tides', snd: { wave: 'sine', root: 587.33, bell: true, echo: true, kit: 'moon' } },
  { id: 'zeugma', name: 'Zeugma Mozaiği', bg: '#2e1a12', glow: '#7a4428', board: '#1a0e09', cell: '#352016', fg: '#fbefe2', muted: '#d4b098', accent: '#e8b46a', ink: '#1a0e09', btn: '#3e2619', grey: '#5e4c40',
    blocks: ['#b84a32', '#d8963e', '#e8cc8a', '#6a8a4a', '#4a7a9a', '#7a5a7a', '#e6dccb'], style: 'tesserae', amb: 'mosaicfloor', snd: { wave: 'triangle', root: 440, kit: 'mosaic' } },
  { id: 'comet', name: 'Kuyruklu Yıldız', bg: '#070a1e', glow: '#22285a', board: '#04061a', cell: '#10143a', fg: '#f2f4ff', muted: '#98a0d8', accent: '#7ef0ff', ink: '#04061a', btn: '#141a46', grey: '#3a3e66',
    blocks: ['#ff7a9a', '#ffb06a', '#ffe07a', '#7af0b0', '#6ad0ff', '#9a8aff', '#e88aff'], style: 'cometcore', amb: 'comet', snd: { wave: 'sine', root: 659.25, bell: true, echo: true, kit: 'comet' } },
  // ---- zen collection: ten cultures of the world, each one opened by playing Zen ----
  { id: 'zellige', name: 'Fas Zellige', bg: '#0f2a2a', glow: '#2a5a52', board: '#081a1a', cell: '#123432', fg: '#f4f0e4', muted: '#9cc0b4', accent: '#e8b84a', ink: '#081a1a', btn: '#16403c', grey: '#4a5c58',
    blocks: ['#1e8a5a', '#2a5ab8', '#c8502e', '#d8a63a', '#e8e2d0', '#2aa8a0', '#8a4a8a'], style: 'zellige', amb: 'riad', snd: { wave: 'triangle', root: 440, echo: true, kit: 'oud' } },
  { id: 'bojagi', name: 'Bojagi', light: true, bg: '#efe4e8', glow: '#fffaf8', board: '#c4aab4', cell: '#d8c4cc', fg: '#3a2430', muted: '#7a5a68', accent: '#c83a5a', ink: '#ffffff', btn: '#fbf2f5', grey: '#b8a8ae', stroke: '#fffaf8',
    blocks: ['#e8506a', '#f0b040', '#3a9a7a', '#4a78c8', '#a85ac0', '#ec8a5a', '#4ab8c0'], style: 'bojagi', amb: 'hanok', snd: { wave: 'sine', root: 587.33, pluck: true, kit: 'gayageum' } },
  { id: 'rangoli', name: 'Rangoli', bg: '#2a0e1e', glow: '#7a1e48', board: '#1a0812', cell: '#3a1428', fg: '#fff2e8', muted: '#d8a0b8', accent: '#ffb030', ink: '#1a0812', btn: '#46182e', grey: '#5a4450',
    blocks: ['#ff3a6a', '#ff9a1a', '#ffd83a', '#2ac0a0', '#3a7aff', '#a050e0', '#ff5a2a'], style: 'rangoli', amb: 'diya', snd: { wave: 'triangle', root: 493.88, kit: 'sitar' } },
  { id: 'kente', name: 'Kente', bg: '#1a1408', glow: '#5a4210', board: '#0e0b04', cell: '#2a2010', fg: '#fff6dc', muted: '#d4b878', accent: '#ffc21a', ink: '#0e0b04', btn: '#3a2c10', grey: '#5a5040',
    blocks: ['#e8b818', '#2a9a3a', '#d8302a', '#3a5ad0', '#e8781a', '#b8d03a', '#a03a9a'], style: 'kente', amb: 'loom', snd: { wave: 'triangle', root: 440, marimba: true, kit: 'djembe' } },
  { id: 'talavera', name: 'Talavera', bg: '#1e3a78', glow: '#4a7ad0', board: '#122650', cell: '#1e3666', fg: '#fff8ec', muted: '#a8c0e8', accent: '#ffc83a', ink: '#122650', btn: '#264684', grey: '#5a6a8a',
    blocks: ['#1e4fb8', '#e8a81a', '#e86a1a', '#2a9a5a', '#c83a3a', '#6a4ab0', '#1aa0b0'], style: 'talavera', amb: 'plaza', snd: { wave: 'triangle', root: 523.25, pluck: true, kit: 'mariachi' } },
  { id: 'andes', name: 'And Teraslar', bg: '#2a1a12', glow: '#7a4a2a', board: '#160d08', cell: '#30201a', fg: '#fff2e4', muted: '#d0aa8a', accent: '#e8503a', ink: '#160d08', btn: '#3e2a1e', grey: '#5e4e44',
    blocks: ['#e8303a', '#f0a020', '#e8d040', '#2a9a6a', '#2a6ac8', '#d04a9a', '#8a4ac0'], style: 'andean', amb: 'terraces', snd: { wave: 'sine', root: 440, echo: true, kit: 'panflute' } },
  { id: 'batik', name: 'Batik', bg: '#1a140e', glow: '#4a3420', board: '#0e0a06', cell: '#261c12', fg: '#fff2dc', muted: '#c8a880', accent: '#e8a040', ink: '#0e0a06', btn: '#33261a', grey: '#54483c',
    blocks: ['#3a5aa8', '#a8642a', '#d8a03a', '#b03a2a', '#3a8a6a', '#8a4a7a', '#d8c8a0'], style: 'batik', amb: 'paddy', snd: { wave: 'sine', root: 392, echo: true, bell: true, kit: 'gamelan' } },
  { id: 'santorini', name: 'Santorini', light: true, bg: '#d6eaf6', glow: '#ffffff', board: '#5a8ec4', cell: '#78a6d4', fg: '#14304e', muted: '#40648a', accent: '#1e5ec8', ink: '#ffffff', btn: '#eef6fc', grey: '#9ab0c4', stroke: '#f6fbff',
    blocks: ['#1e5ec8', '#f4f2ec', '#e8a83a', '#d84a6a', '#2aa8a0', '#8a6ad0', '#f07a3a'], style: 'cycladic', amb: 'caldera', snd: { wave: 'triangle', root: 587.33, pluck: true, kit: 'bouzouki' } },
  { id: 'persian', name: 'Pers Bahçesi', bg: '#14182e', glow: '#3a3060', board: '#0a0d1c', cell: '#1a1e36', fg: '#fbf2e2', muted: '#b8aec8', accent: '#e8c06a', ink: '#0a0d1c', btn: '#222844', grey: '#4a4c60',
    blocks: ['#b8283e', '#2a5ab0', '#e8c06a', '#2a8a7a', '#ece4d0', '#d0702a', '#7a4a9a'], style: 'carpet', amb: 'charbagh', snd: { wave: 'sine', root: 523.25, echo: true, kit: 'santur' } },
  { id: 'inkmount', name: 'Mürekkep Dağları', light: true, bg: '#ece6d6', glow: '#faf7ef', board: '#bfb6a2', cell: '#d4ccb8', fg: '#1e1c18', muted: '#5e5a50', accent: '#c42a22', ink: '#ffffff', btn: '#f6f2e8', grey: '#a8a294', stroke: '#faf7ef',
    blocks: ['#3a3a40', '#c42a22', '#3a7a62', '#4a5a9a', '#9a7034', '#7a4a7a', '#4a8aa0'], style: 'inkwash', amb: 'shanshui', snd: { wave: 'sine', root: 392, echo: true, kit: 'guqin' } },
  // ---- puzzle collection: thinking games and the tools of a solver, each one opened by solving levels ----
  { id: 'jigsaw', name: 'Yapboz', light: true, bg: '#e9dcc4', glow: '#fbf3e3', board: '#c4ad86', cell: '#d8c6a2', fg: '#3a2c1c', muted: '#76603f', accent: '#d2502a', ink: '#ffffff', btn: '#f6eddc', grey: '#b3a58c', stroke: '#fbf3e3',
    blocks: ['#e4604f', '#ee9f3e', '#e6c548', '#6fb25e', '#4f9fd4', '#8a72cc', '#de6fa2'], style: 'jigsaw', amb: 'jigsawtable', snd: { wave: 'triangle', root: 523.25, pluck: true, kit: 'jigsaw' } },
  { id: 'chalk', name: 'Kara Tahta', bg: '#1c3a2d', glow: '#2e5845', board: '#12261c', cell: '#1f3d2e', fg: '#f3f1e6', muted: '#a6bfae', accent: '#ffe27a', ink: '#12261c', btn: '#284e3b', grey: '#4d6356',
    blocks: ['#f28b82', '#f7b267', '#f3df78', '#9be08f', '#8ecdf0', '#c3a6f0', '#f5a3cf'], style: 'chalk', amb: 'blackboard', snd: { wave: 'triangle', root: 440, kit: 'chalk' } },
  { id: 'domino', name: 'Domino', bg: '#3a1420', glow: '#6a2434', board: '#22080e', cell: '#481a25', fg: '#fff3ea', muted: '#d4a3ad', accent: '#f2c14e', ink: '#22080e', btn: '#4f1f2c', grey: '#6a4f55',
    blocks: ['#d23440', '#e5852a', '#d9a826', '#2f9a5a', '#2f6fc8', '#7a46b8', '#26232a'], style: 'domino', amb: 'dominorun', snd: { wave: 'triangle', root: 493.88, kit: 'domino' } },
  { id: 'tangram', name: 'Tangram', light: true, bg: '#efe7d6', glow: '#fbf6ec', board: '#c6b99d', cell: '#dbcfb6', fg: '#2b2620', muted: '#6c6250', accent: '#c8402d', ink: '#ffffff', btn: '#f8f2e6', grey: '#b3aa98', stroke: '#fbf6ec',
    blocks: ['#e04b3a', '#f29b2e', '#efc23a', '#3aa86a', '#2f86c8', '#6a52b8', '#e0609a'], style: 'tangram', amb: 'tans', snd: { wave: 'triangle', root: 587.33, pluck: true, kit: 'tangram' } },
  { id: 'detective', name: 'Dedektif Panosu', bg: '#3a2a1c', glow: '#6b4a2c', board: '#22170e', cell: '#45311f', fg: '#fbf1e2', muted: '#cdb08c', accent: '#e0393a', ink: '#ffffff', btn: '#4c3624', grey: '#6e6052',
    blocks: ['#f2cf45', '#efe9dc', '#ef98ae', '#8cc2e6', '#9cd187', '#f2a058', '#c8a274'], style: 'memo', amb: 'corkboard', snd: { wave: 'sine', root: 392, kit: 'detective' } },
  { id: 'cipher', name: 'Şifre Makinesi', bg: '#171b1d', glow: '#2e3739', board: '#0c0f10', cell: '#1d2427', fg: '#f0ece0', muted: '#a2a9a3', accent: '#ffb43a', ink: '#0c0f10', btn: '#262e31', grey: '#4c5452',
    blocks: ['#d8483a', '#e89a3a', '#d8c25a', '#4aa078', '#3a86c8', '#8a64c0', '#e8e2d0'], style: 'cipherkey', amb: 'enigma', snd: { wave: 'triangle', root: 440, kit: 'cipher' } },
  { id: 'cube', name: 'Sihirli Küp', bg: '#1a1d2e', glow: '#353b5e', board: '#0e1020', cell: '#232741', fg: '#f2f4ff', muted: '#a3a9c8', accent: '#ffd23a', ink: '#0e1020', btn: '#2a2f4c', grey: '#4f5470',
    blocks: ['#f4f4f0', '#ffd23a', '#e8333a', '#ff8a1e', '#2a6ce8', '#22b04a', '#9a5ae0'], style: 'cubeface', amb: 'cubes', snd: { wave: 'triangle', root: 523.25, kit: 'cube' } },
  { id: 'blueprint', name: 'Mavi Kopya', bg: '#1b4f8c', glow: '#2f6db0', board: '#123b6c', cell: '#1c4b82', fg: '#f2f8ff', muted: '#acc8ea', accent: '#ffd75e', ink: '#123b6c', btn: '#245a98', grey: '#5a7598',
    blocks: ['#ff8a7a', '#ffb760', '#ffe27a', '#7ee0a0', '#7fd4ff', '#c3a6ff', '#f2f6ff'], style: 'draft', amb: 'drafting', snd: { wave: 'sine', root: 587.33, kit: 'blueprint' } },
  { id: 'alchemy', name: 'Simya Atölyesi', bg: '#1e1428', glow: '#42295c', board: '#120b1a', cell: '#271a35', fg: '#f6eedc', muted: '#bba8cc', accent: '#86f0a8', ink: '#120b1a', btn: '#2f2140', grey: '#584a66',
    blocks: ['#e8434a', '#f2913a', '#f2d24a', '#52d07a', '#3ab0e0', '#9a62e8', '#e85ab0'], style: 'flask', amb: 'alchemylab', snd: { wave: 'sine', root: 466.16, echo: true, kit: 'alchemy' } },
  { id: 'chess', name: 'Satranç', bg: '#2a2420', glow: '#5a4430', board: '#16110d', cell: '#3a2e24', fg: '#fbf3e4', muted: '#cbb497', accent: '#e8c35a', ink: '#16110d', btn: '#3c3027', grey: '#6a5c50',
    blocks: ['#e8e0cc', '#c8503a', '#e0a040', '#4a9a6a', '#3a78b8', '#8a5ab0', '#b88a5a'], style: 'chesstile', amb: 'chessboard', snd: { wave: 'triangle', root: 392, echo: true, kit: 'chess' } },
];
const T = THEMES.length;
// Score needed to reach level/theme stage k within one game: 800, 2000, 3600, 5600, 8000, ...
const milestone = k => 200 * k * (k + 3);
const stageAt = s => { let k = 0; while (s >= milestone(k + 1)) k++; return k; };

/* ---------- Color helpers ---------- */
const hexRgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const hexOf = rgb => '#' + rgb.match(/\d+/g).map(n => (+n).toString(16).padStart(2, '0')).join('');
const rgba = (h, a) => { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${a})`; };
const mixHex = (a, b, t) => { const A = hexRgb(a), B = hexRgb(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };
function shade(hex, amt) {
  let [r, g, b] = hexRgb(hex);
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return `rgb(${r},${g},${b})`;
}
// clear / theme-change effects per theme: particle kind, gravity factor (negative floats up), air drag, sideways wobble, additive glow, flash tint (null = block color)
const FX = {
  dusk:    { p: 'square', g: 1, flash: '#ffffff' },
  ocean:   { p: 'bubble', g: -0.35, drag: 2.2, wobble: 0.5, flash: '#c8fbff' },
  forest:  { p: 'firefly', g: -0.08, drag: 2.6, wobble: 1, glow: true, flash: '#eaff9a' },
  sunset:  { p: 'diamond', g: 0.9, flash: '#ffe2b0' },
  snow:    { p: 'flake', g: 0.18, drag: 2.4, wobble: 1, flash: '#ffffff' },
  neon:    { p: 'streak', g: 0.45, drag: 0.8, glow: true, flash: null },
  sakura:  { p: 'petal', g: 0.2, drag: 2.2, wobble: 1.2, flash: '#fff3f7' },
  volcano: { p: 'ember', g: -0.45, drag: 1.4, wobble: 0.4, glow: true, flash: '#ffd27a' },
  space:   { p: 'star', g: 0.12, drag: 1.6, glow: true, flash: '#dfe9ff' },
  honey:   { p: 'drop', g: 1.15, drag: 0.6, flash: '#ffe39a' },
  gold:      { p: 'coin', g: 1, flash: '#fff2b0' },
  glass:     { p: 'shard', g: 1.1, flash: '#ffffff' },
  choco:     { p: 'crumb', g: 1.2, flash: '#ffd6a8' },
  slime:     { p: 'drop', g: 1, drag: 0.8, flash: '#d6ff9a' },
  wood:      { p: 'chip', g: 0.9, drag: 0.6, flash: '#ffe6c0' },
  gum:       { p: 'ring', g: -0.1, drag: 3, flash: '#ffffff' },
  retro:     { p: 'pixel', g: 1, flash: null },
  amethyst:  { p: 'diamond', g: 0.6, glow: true, flash: '#f0d8ff' },
  coffee:    { p: 'bubble', g: -0.3, drag: 2.2, wobble: 0.5, flash: '#ffe8c8' },
  halloween: { p: 'bat', g: -0.25, drag: 1.4, wobble: 1, flash: '#ffb050' },
  xmas:      { p: 'star', g: 0.25, drag: 1.6, glow: true, flash: '#fff6d0' },
  marble:    { p: 'fleck', g: 0.35, drag: 1.8, wobble: 0.6, flash: '#fff3c4' },
  origami:   { p: 'paper', g: 0.4, drag: 2, wobble: 1, flash: '#ffffff' },
  fruit:     { p: 'drop', g: 1.1, drag: 0.5, flash: '#ffffff' },
  aurora:    { p: 'star', g: -0.1, drag: 2, glow: true, flash: '#d8fff0' },
  coral:     { p: 'fish', g: -0.05, drag: 2, wobble: 0.6, flash: '#ffe6dc' },
  tomb:      { p: 'crumb', g: 1.1, flash: '#ffe8b8' },
  iznik:     { p: 'tile', g: 0.9, flash: '#ffffff' },
  balloon:   { p: 'balloon', g: -0.3, drag: 1.6, wobble: 0.5, flash: '#fff4e4' },
  ebru:      { p: 'ring', g: -0.05, drag: 3, flash: '#fff6e8' },
  clock:     { p: 'cog', g: 1, flash: '#ffe6a8' },
  storm:     { p: 'streak', g: 0.6, drag: 0.6, glow: true, flash: '#e0f2ff' },
  zen:       { p: 'leaf', g: 0.2, drag: 2.2, wobble: 1.2, flash: '#ffffff' },
  lavalamp:  { p: 'blob', g: -0.3, drag: 2, wobble: 0.4, flash: '#ffe2b8' },
  cloud:     { p: 'puff', g: -0.1, drag: 3, flash: '#ffffff' },
  factory:   { p: 'nut', g: 1.1, flash: '#fff4cc' },
  tropic:    { p: 'drop', g: 1.1, drag: 0.5, flash: '#ffffff' },
  fossil:    { p: 'crumb', g: 1.2, flash: '#ffe2c0' },
  musicbox:  { p: 'note', g: -0.2, drag: 2, wobble: 0.6, flash: '#fff2c8' },
  autumn:    { p: 'leaf', g: 0.25, drag: 2.2, wobble: 1.2, flash: '#ffe2b0' },
  sushi:     { p: 'rice', g: 1, flash: '#fff4e8' },
  graffiti:  { p: 'drop', g: 1.1, drag: 0.4, flash: null },
  carnival:  { p: 'confetti', g: 0.5, drag: 1.8, wobble: 0.8, flash: '#fff6d0' },
  gelato:    { p: 'sprinkle', g: 0.9, flash: '#ffffff' },
  news:      { p: 'newsclip', g: 0.35, drag: 2, wobble: 1, flash: '#ffffff' },
  calendar:  { p: 'leaflet', g: 0.4, drag: 2, wobble: 1.1, flash: '#fff8ee' },
  tea:       { p: 'sugar', g: 1, flash: '#ffe8c0' },
  spice:     { p: 'grain', g: 1.2, drag: 0.4, flash: '#ffd890' },
  desert:    { p: 'grain', g: 0.8, drag: 0.8, wobble: 0.6, flash: '#fff0c8' },
  letter:    { p: 'envelope', g: 0.3, drag: 2, wobble: 0.8, flash: '#fff6e8' },
  picnic:    { p: 'petal', g: 0.2, drag: 2.2, wobble: 1.2, flash: '#ffffff' },
  library:   { p: 'page', g: 0.3, drag: 2, wobble: 1, flash: '#ffe8b8' },
  stained:   { p: 'shard', g: 1, flash: '#fff4d0' },
  observatory:{ p: 'star', g: 0.1, drag: 1.8, glow: true, flash: '#fff0c8' },
  train:     { p: 'puff', g: -0.15, drag: 3, flash: '#ffe8c0' },
  moon:      { p: 'crescent', g: -0.05, drag: 2.2, wobble: 0.5, glow: true, flash: '#ffffff' },
  zeugma:    { p: 'tile', g: 1, flash: '#fff2dc' },
  comet:     { p: 'star', g: -0.05, drag: 1.6, glow: true, flash: '#e8fbff' },
  zellige:   { p: 'zillij', g: 0.9, flash: '#fff6e0' },
  bojagi:    { p: 'silk', g: 0.2, drag: 2.2, wobble: 1.1, flash: '#ffffff' },
  rangoli:   { p: 'powder', g: -0.05, drag: 2.6, flash: '#ffe8b0' },
  kente:     { p: 'thread', g: 0.5, drag: 1.6, wobble: 0.8, flash: '#fff2c0' },
  talavera:  { p: 'flag', g: 0.3, drag: 2, wobble: 1, flash: '#ffffff' },
  andes:     { p: 'wool', g: 0.35, drag: 2, wobble: 0.6, flash: '#fff0e0' },
  batik:     { p: 'drop', g: 1, drag: 0.6, flash: '#ffe8c0' },
  santorini: { p: 'bubble', g: -0.3, drag: 2.2, wobble: 0.5, flash: '#ffffff' },
  persian:   { p: 'petal', g: 0.2, drag: 2.2, wobble: 1.2, flash: '#fff2d0' },
  inkmount:  { p: 'inkdrop', g: 0.8, drag: 1, flash: '#ffffff' },
  jigsaw:    { p: 'piece', g: 0.9, drag: 0.6, flash: '#fff8ec' },
  chalk:     { p: 'chalkdust', g: 0.3, drag: 2.6, wobble: 0.4, flash: '#f6f4ea' },
  domino:    { p: 'bone', g: 1, drag: 0.4, flash: '#fff4dc' },
  tangram:   { p: 'tan', g: 0.8, drag: 0.6, flash: '#ffffff' },
  detective: { p: 'memo', g: 0.3, drag: 2, wobble: 1, flash: '#fff6e4' },
  cipher:    { p: 'cipherchar', g: 0.6, drag: 1.2, wobble: 0.4, flash: '#ffe2a8' },
  cube:      { p: 'sticker', g: 1, drag: 0.4, flash: '#ffffff' },
  blueprint: { p: 'dimension', g: 0.2, drag: 2, wobble: 0.6, flash: '#e8f4ff' },
  alchemy:   { p: 'rune', g: -0.3, drag: 1.8, wobble: 0.5, glow: true, flash: '#d8ffe4' },
  chess:     { p: 'chessman', g: 1, drag: 0.4, flash: '#fff2d0' },
};
THEMES.forEach(th => {
  th.fx = FX[th.id];
  th.stroke = th.stroke || th.board;
  th.surface = th.light ? mixHex(th.glow, th.bg, 0.25) : mixHex(th.bg, th.fg, 0.07);
});

/* ---------- Constants ---------- */
const N = 8;
const OS_REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
let REDUCED = OS_REDUCED; // also on when the player picks low-effects mode
const SAVE_KEY = 'blokzen.game.v2', OLD_SAVE_KEY = 'blokzen.game.v1', BEST_KEY = 'blokzen.best', MUTE_KEY = 'blokzen.mute', PREFS_KEY = 'blokzen.prefs', TUT_KEY = 'blokzen.tutorial', THEME_KEY = 'blokzen.themes';
const OLD_COLORS = ['#ff6b5b', '#ffb23f', '#9ad94f', '#2ec4b6', '#4aa8ff', '#a77bff', '#ff6fb5'];
const GREY = 8; // cell value for the game-over grey

// [rows, weight]; order is fixed (saved games refer to shapes by index)
const RAW = [
  [['#'], 0.5],
  [['##'], 0.9], [['#', '#'], 0.9],
  [['###'], 1.6], [['#', '#', '#'], 1.6],
  [['####'], 1.6], [['#', '#', '#', '#'], 1.6],
  [['#####'], 1.2], [['#', '#', '#', '#', '#'], 1.2],
  [['##', '##'], 3.6],
  [['###', '###', '###'], 2.6],
  [['###', '###'], 2.4], [['##', '##', '##'], 2.4],
  [['#.', '##'], 0.45], [['.#', '##'], 0.45], [['##', '#.'], 0.45], [['##', '.#'], 0.45],
  [['#.', '#.', '##'], 0.55], [['.#', '.#', '##'], 0.55], [['##', '#.', '#.'], 0.55], [['##', '.#', '.#'], 0.55],
  [['###', '#..'], 0.55], [['###', '..#'], 0.55], [['#..', '###'], 0.55], [['..#', '###'], 0.55],
  [['###', '.#.'], 0.55], [['.#.', '###'], 0.55], [['#.', '##', '#.'], 0.55], [['.#', '##', '.#'], 0.55],
  [['##.', '.##'], 0.4], [['.##', '##.'], 0.4], [['#.', '##', '.#'], 0.4], [['.#', '##', '#.'], 0.4],
  [['###', '#..', '#..'], 0.5], [['###', '..#', '..#'], 0.5], [['#..', '#..', '###'], 0.5], [['..#', '..#', '###'], 0.5],
];

const SHAPES = RAW.map(([m, weight], id) => {
  const cells = [];
  m.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '#') cells.push([r, c]); }));
  const h = m.length, w = Math.max(...m.map(s => s.length));
  const pos = [];
  for (let r = 0; r + h <= N; r++) for (let c = 0; c + w <= N; c++) {
    let lo = 0, hi = 0;
    for (const [dr, dc] of cells) {
      const i = (r + dr) * N + (c + dc);
      if (i < 32) lo |= 1 << i; else hi |= 1 << (i - 32);
    }
    pos.push({ r, c, lo: lo >>> 0, hi: hi >>> 0 });
  }
  return { id, cells, w, h, weight, size: cells.length, pos };
});

/* ---------- Bitboard helpers (fast placement search) ---------- */
const LINES = [];
for (let r = 0; r < N; r++) {
  const m = (0xFF << ((r % 4) * 8)) >>> 0;
  LINES.push(r < 4 ? { lo: m, hi: 0 } : { lo: 0, hi: m });
}
for (let c = 0; c < N; c++) {
  const m = (0x01010101 << c) >>> 0;
  LINES.push({ lo: m, hi: m });
}
const fits = (lo, hi, p) => (lo & p.lo) === 0 && (hi & p.hi) === 0;
function applyBits(lo, hi, p) {
  lo = (lo | p.lo) >>> 0; hi = (hi | p.hi) >>> 0;
  let clo = 0, chi = 0, n = 0;
  for (const L of LINES) {
    if (((lo & L.lo) >>> 0) === L.lo && ((hi & L.hi) >>> 0) === L.hi) { clo |= L.lo; chi |= L.hi; n++; }
  }
  return [(lo & ~clo) >>> 0, (hi & ~chi) >>> 0, n];
}
function bitsOf(grid) {
  let lo = 0, hi = 0;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (grid[r][c]) {
    const i = r * N + c;
    if (i < 32) lo |= 1 << i; else hi |= 1 << (i - 32);
  }
  return [lo >>> 0, hi >>> 0];
}
const popcount = x => { x >>>= 0; let n = 0; while (x) { x &= x - 1; n++; } return n; };
const fitsAnywhere = (lo, hi, s) => s.pos.some(p => fits(lo, hi, p));

function solvable(lo, hi, shapes) {
  let budget = 120000;
  const used = [false, false, false];
  function dfs(lo, hi, depth) {
    if (depth === shapes.length) return true;
    for (let i = 0; i < shapes.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      for (const p of shapes[i].pos) {
        if (--budget < 0) { used[i] = false; return false; }
        if (!fits(lo, hi, p)) continue;
        const [nlo, nhi] = applyBits(lo, hi, p);
        if (dfs(nlo, nhi, depth + 1)) { used[i] = false; return true; }
      }
      used[i] = false;
    }
    return false;
  }
  return dfs(lo, hi, 0);
}

/* ---------- Random source for dealing ----------
   Classic games use Math.random. The daily challenge swaps in a seeded stream (state saved with the game), so the same
   day, board and moves always produce the same pieces on every device. */
function dealStream(seed) {
  const g = { s: seed >>> 0, next() {
    let t = g.s = (g.s + 0x6D2B79F5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  } };
  return g;
}
let dealRng = null; // null: Math.random
const drand = () => dealRng ? dealRng.next() : Math.random();

/* ---------- Piece generation ----------
   1. Chunky pieces (2x2, 3x3, 3x2, long bars) are common; singles, dominoes and the small 3-cell L are rare.
   2. When the board can be wiped clean with up to three pieces, the dealer looks for such a set and usually deals it.
   3. Otherwise it deals sets that fit, lean toward completing lines, and keep the board open.
   Sets are judged by lines and cleared cells, never by how few cells they add, so small pieces are not favoured. */
const PROBES = [
  [SHAPES[10], 9], // 3x3
  [SHAPES[7], 5], [SHAPES[8], 5], // 1x5, 5x1
  [SHAPES[11], 4], [SHAPES[12], 4], // 3x2, 2x3
  [SHAPES[9], 3], // 2x2
];
const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
const bitAt = (lo, hi, i) => i < 32 ? (lo >>> i) & 1 : (hi >>> (i - 32)) & 1;
const cellsOf = (lo, hi) => popcount(lo) + popcount(hi);
const ROWM = LINES.slice(0, N), COLM = LINES.slice(N);

// How usable the board's shape is, regardless of how full it is: no room for a big piece, or sealed holes, cost points.
// Holes are counted with bit masks (rows 0-3 live in lo, rows 4-7 in hi) so this stays fast enough to call thousands of times.
const NOT_C0 = 0xFEFEFEFE | 0, NOT_C7 = 0x7F7F7F7F | 0;
function boardShape(lo, hi) {
  let v = 0;
  for (const [s, w] of PROBES) if (!s.pos.some(p => fits(lo, hi, p))) v -= w;
  const el = ~lo, eh = ~hi;                                   // empty cells
  const ul = el << 8, uh = (eh << 8) | (el >>> 24);           // the cell above is empty
  const dl = (el >>> 8) | (eh << 24), dh = eh >>> 8;          // the cell below is empty
  const ll = (el << 1) & NOT_C0, lh = (eh << 1) & NOT_C0;     // the cell to the left is empty
  const rl = (el >>> 1) & NOT_C7, rh = (eh >>> 1) & NOT_C7;   // the cell to the right is empty
  const anyL = ul | dl | ll | rl, anyH = uh | dh | lh | rh;
  const twoL = (ul & dl) | (ul & ll) | (ul & rl) | (dl & ll) | (dl & rl) | (ll & rl);
  const twoH = (uh & dh) | (uh & lh) | (uh & rh) | (dh & lh) | (dh & rh) | (lh & rh);
  v -= 4 * (popcount(el & ~anyL) + popcount(eh & ~anyH));                 // sealed: no empty neighbour
  v -= 0.8 * (popcount(el & anyL & ~twoL) + popcount(eh & anyH & ~twoH)); // dead end: one empty neighbour
  return v;
}

// Best outcome of a set for a sensible player (greedy placement, every order). null if it cannot all be placed.
function playSet(lo0, hi0, set) {
  let best = null;
  const seen = new Set();
  for (const ord of PERMS) {
    const key = ord.map(k => set[k].id).join(',');
    if (seen.has(key)) continue;
    seen.add(key);
    let l = lo0, h = hi0, lines = 0, cleared = 0, wipes = 0, ok = true;
    for (const k of ord) {
      let bv = -Infinity, bl = 0, bh = 0, bn = 0;
      const before = cellsOf(l, h) + set[k].size;
      for (const p of set[k].pos) {
        if (!fits(l, h, p)) continue;
        const [nl, nh, n] = applyBits(l, h, p);
        const v = boardShape(nl, nh) + n * 14 + (before - cellsOf(nl, nh)) * 0.5 + (n && !nl && !nh ? 400 : 0);
        if (v > bv) { bv = v; bl = nl; bh = nh; bn = n; }
      }
      if (bv === -Infinity) { ok = false; break; }
      cleared += before - cellsOf(bl, bh);
      if (bn && !bl && !bh) wipes++;
      l = bl; h = bh; lines += bn;
    }
    if (!ok) continue;
    const v = lines * 10 + cleared * 0.5 + wipes * 300 + boardShape(l, h);
    if (!best || v > best.v) best = { v, lines, wipes };
  }
  return best;
}

function pickShape(fill, moves) {
  let total = 0;
  const ws = SHAPES.map(s => {
    let w = s.weight;
    if (fill > 0.62) { if (s.size <= 3) w *= 1 + (fill - 0.62) * 5; else if (s.size >= 6) w *= 0.6; } // only a really crowded board gets smaller pieces
    total += w; return w;
  });
  let x = drand() * total;
  for (let i = 0; i < SHAPES.length; i++) { x -= ws[i]; if (x <= 0) return SHAPES[i]; }
  return SHAPES[0];
}
const pickFrom = list => { // weighted by the base weights
  let t = 0; for (const s of list) t += s.weight;
  let x = drand() * t;
  for (const s of list) { x -= s.weight; if (x <= 0) return s; }
  return list[list.length - 1];
};

// How kind the dealer is (0..1). Kind at the start, firmer as the game goes on, rescues a crowded board.
function kindness(moves, fill) {
  if (mode === 'zen') return 0.95; // zen never gets firmer, however long the session runs
  let k = moves < 150 ? 0.92 : moves < 350 ? 0.8 : moves < 700 ? 0.66 : moves < 1200 ? 0.52 : 0.42;
  if (fill > 0.5) k = Math.max(k, 0.55 + (fill - 0.5) * 1.5);
  return Math.min(k, 0.95);
}

// Cost of clearing what is left: each filled cell needs its row or its column finished, whichever is closer
function clearCost(lo, hi) {
  const cm = COLM.map(L => N - popcount(lo & L.lo) - popcount(hi & L.hi));
  let cost = 0;
  for (let r = 0; r < N; r++) {
    const row = ((r < 4 ? lo >>> (r * 8) : hi >>> ((r - 4) * 8)) & 255);
    if (!row) continue;
    const rm = N - popcount(row);
    for (let c = 0; c < N; c++) if (row & (1 << c)) cost += rm < cm[c] ? rm : cm[c];
  }
  return cost;
}

// Search for up to three pieces that leave the board completely empty. Beam search keeps it fast.
function findWipe(lo, hi, pool) {
  let beam = [{ lo, hi, s: null, up: null }];
  const path = st => { const a = []; for (; st && st.s; st = st.up) a.unshift(st.s); return a; };
  for (let d = 0; d < 3; d++) {
    const next = new Map(), last = d === 2;
    for (const st of beam) for (const s of pool) for (const p of s.pos) {
      if ((st.lo & p.lo) || (st.hi & p.hi)) continue;
      const [nl, nh] = applyBits(st.lo, st.hi, p);
      if (!nl && !nh) return [...path(st), s];
      if (last) continue;
      const key = nl * 4294967296 + nh;
      if (next.has(key)) continue;
      next.set(key, { lo: nl, hi: nh, s, up: st, h: -clearCost(nl, nh) + s.size * 0.15 + drand() * 0.5 });
    }
    if (last) break;
    beam = [...next.values()].sort((a, b) => b.h - a.h).slice(0, 50);
  }
  return null;
}
// A varied, weight-biased pool of shapes to search with, so wipe sets do not always use the same pieces
function wipePool() {
  const pool = new Set([SHAPES[9], SHAPES[10], SHAPES[11], SHAPES[12]]);
  while (pool.size < 18) pool.add(pickFrom(SHAPES));
  return [...pool];
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = (drand() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

function generateSet(grid, moves) {
  const [lo, hi] = bitsOf(grid);
  const cells = cellsOf(lo, hi), fill = cells / 64;
  const kind = kindness(moves, fill);

  // Full-board clear: how often a found wipe is dealt depends on how much there is to wipe
  const zen = mode === 'zen';
  const pWipe = (cells >= 12 ? 0.75 : cells > 0 ? 0.5 : 0.2) * (moves > 900 && !zen ? 0.75 : 1);
  if (cells <= 36 && drand() < pWipe) { // more than 36 filled cells cannot be wiped by three pieces in practice
    const seq = findWipe(lo, hi, wipePool());
    if (seq) {
      while (seq.length < 3) seq.push(pickShape(0, moves)); // the board is empty after the wipe, so any piece fits
      return shuffle(seq);
    }
  }

  // Late game: now and then a raw set that only has to fit somewhere
  if (!zen && moves > 700 && fill < 0.4 && drand() < 0.08) {
    for (let a = 0; a < 20; a++) {
      const set = [pickShape(fill, moves), pickShape(fill, moves), pickShape(fill, moves)];
      if (set.some(s => fitsAnywhere(lo, hi, s))) return set;
    }
  }

  const clearers = SHAPES.filter(s => s.pos.some(p => fits(lo, hi, p) && applyBits(lo, hi, p)[2] > 0));
  const cands = [];
  for (let a = 0; a < 60 && cands.length < 18; a++) {
    const set = [pickShape(fill, moves), pickShape(fill, moves), pickShape(fill, moves)];
    if (clearers.length && drand() < 0.35 + 0.4 * kind) set[(drand() * 3) | 0] = pickFrom(clearers);
    const r = playSet(lo, hi, set);
    if (r) cands.push({ set, v: r.v });
  }
  if (cands.length) {
    cands.sort((a, b) => b.v - a.v);
    const idx = Math.floor(Math.pow(drand(), 1 + kind * 4) * cands.length);
    return cands[idx].set;
  }
  // Nothing passed: try the exhaustive search, then fall back to tiny pieces
  for (let a = 0; a < 30; a++) {
    const set = [pickShape(1, moves), pickShape(1, moves), pickShape(1, moves)];
    if (solvable(lo, hi, set)) return set;
  }
  const small = SHAPES.filter(s => s.size <= 2);
  return [0, 1, 2].map(() => small[(drand() * small.length) | 0]);
}

/* ---------- Scoring: level, combo and full-clear multipliers ---------- */
const LINE_BASE = [0, 10, 30, 60, 100, 150, 210, 280, 360, 450, 550, 660, 780, 910, 1050, 1200, 1360];
const levelOf = sc => stageAt(sc) + 1;                         // level rises with the same milestones as themes
const levelMult = lvl => Math.min(4, 1 + 0.25 * (lvl - 1));    // ×1, ×1.25, ×1.5 ... up to ×4
const comboMult = c => c <= 1 ? 1 : c + 0.1 * c * (c - 1);     // ×2.2, ×3.6, ×5.2, ×7 ... grows faster than the streak
function scoreMove(size, lines, combo, fullClear, fullsBefore, sc) {
  const zen = mode === 'zen'; // zen: no levels, and the full-clear bonus stops growing at the fifth
  const lm = zen || mode === 'puzzle' ? 1 : levelMult(levelOf(sc)); // puzzle: always ×1 so score targets stay predictable
  return {
    lm,
    place: Math.round(size * lm),
    clear: lines ? Math.round(LINE_BASE[lines] * comboMult(combo) * lm) : 0,
    full: fullClear ? Math.round(500 * (zen ? Math.min(fullsBefore + 1, 5) : fullsBefore + 1) * lm) : 0, // 500, 1000, 1500 ... per full clear in the game
  };
}
const fmtMult = m => '×' + m.toLocaleString('tr-TR', { maximumFractionDigits: 2 });

function colorize(shapes) {
  const pool = shuffle([1, 2, 3, 4, 5, 6, 7]); // a real shuffle: a random sort comparator gives different results in different browsers
  return shapes.map((s, i) => ({ shape: s, color: pool[i] }));
}

/* ---------- Sound (synthesized, timbre follows the theme) ---------- */
const Sfx = {
  ctx: null, out: null, send: null, noise: null, muted: false, vol: 1, snd: THEMES[0].snd,
  setVol(v) { this.vol = v; if (this.out) this.out.gain.setTargetAtTime(0.7 * v, this.ctx.currentTime, 0.02); },
  unlock() {
    if (this.ctx) { if (this.ctx.state !== 'running' && this.ctx.state !== 'closed') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      try { if (navigator.audioSession) navigator.audioSession.type = 'ambient'; } catch (e) {} // iOS 17+: let the player's music keep playing
      const ctx = new AC();
      try { const b = ctx.createBuffer(1, 1, 22050), s0 = ctx.createBufferSource(); s0.buffer = b; s0.connect(ctx.destination); s0.start(0); } catch (e) {} // iOS: prime the output inside the gesture
      if (ctx.state !== 'running') { try { ctx.resume(); } catch (e) {} }
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4;
      const g = ctx.createGain(); g.gain.value = 0.7 * this.vol;
      g.connect(comp); comp.connect(ctx.destination);
      // echo bus for "wet" themes
      const send = ctx.createGain(), d = ctx.createDelay(1), fb = ctx.createGain(), wet = ctx.createGain(), lp = ctx.createBiquadFilter();
      d.delayTime.value = 0.19; fb.gain.value = 0.33; wet.gain.value = 0.4; lp.type = 'lowpass'; lp.frequency.value = 3200;
      send.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(wet); wet.connect(g);
      const len = ctx.sampleRate * 0.5;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const dd = buf.getChannelData(0);
      for (let i = 0; i < len; i++) dd[i] = Math.random() * 2 - 1;
      this.ctx = ctx; this.out = g; this.send = send; this.noise = buf;
    } catch (e) { this.ctx = null; }
  },
  ok() { return this.ctx && !this.muted; },
  tone(freq, { type = 'sine', dur = 0.15, vol = 0.2, attack = 0.004, to = null, when = 0, detune = 0, wet = false } = {}) {
    const c = this.ctx, t = c.currentTime + when;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    o.detune.value = detune;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.out);
    if (wet && this.snd.echo) g.connect(this.send);
    o.start(t); o.stop(t + dur + 0.05);
  },
  hiss({ dur = 0.1, vol = 0.1, type = 'lowpass', freq = 1200, to = null, when = 0, q = 0.7 } = {}) {
    const c = this.ctx, t = c.currentTime + when;
    const s = c.createBufferSource(); s.buffer = this.noise;
    const f = c.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.out);
    s.start(t); s.stop(t + dur + 0.02);
  },
  note(f, { vol = 0.15, dur = 0.34, when = 0 } = {}) {
    const s = this.snd, v = vol * (s.gain || 1), d = s.pluck ? dur * 0.55 : dur;
    this.tone(f, { type: s.wave, dur: d, vol: v, when, wet: true, attack: s.pluck ? 0.002 : 0.004 });
    if (s.bell) this.tone(f * 2.76, { type: 'sine', dur: d * 0.6, vol: v * 0.32, when, wet: true });
    else if (s.marimba) this.tone(f * 4, { type: 'sine', dur: 0.07, vol: v * 0.35, when });
    else this.tone(f * 2, { type: 'sine', dur: d * 0.65, vol: v * 0.3, when, detune: 7 });
  },
  // honey: a thick drop landing (rising "blop"), and a low sticky squelch under it
  plop(f, { when = 0, vol = 0.14, dur = 0.08 } = {}) { this.tone(f, { type: 'sine', dur, vol, to: f * 2.3, when, attack: 0.006 }); },
  goo({ when = 0, vol = 0.1, dur = 0.12 } = {}) { this.hiss({ dur, vol, type: 'lowpass', freq: 900, to: 220, when, q: 4 }); },
  pick() {
    if (!this.ok()) return;
    const kit = KITS[this.snd.kit]; if (kit) { kit.pick(); return; }
    this.tone(this.snd.root, { type: 'triangle', dur: 0.07, vol: 0.1, to: this.snd.root * 1.45 });
  },
  place() {
    if (!this.ok()) return;
    const kit = KITS[this.snd.kit]; if (kit) { kit.place(); return; }
    const k = this.snd.root / 523.25;
    this.tone(220 * k, { dur: 0.14, vol: 0.4, to: 90 * k });
    this.hiss({ dur: 0.05, vol: 0.12, type: 'bandpass', freq: 2200, q: 1.2 });
    this.tone(1500, { type: 'triangle', dur: 0.03, vol: 0.04 });
  },
  clear(lines, combo) {
    if (!this.ok()) return;
    const scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31];
    const start = Math.min(Math.max(combo, 1) - 1, 7);
    const n = Math.min(lines + 2, 6);
    for (let i = 0; i < n; i++) this.note(this.snd.root * Math.pow(2, scale[start + i] / 12), { when: i * 0.055 });
    const kit = KITS[this.snd.kit]; if (kit) { kit.clear(n, combo); return; }
    this.hiss({ dur: 0.38, vol: 0.06, type: 'highpass', freq: 3000, to: 9000, when: 0.02 });
    this.tone(140, { dur: 0.22, vol: 0.3, to: 60 });
  },
  themeChange() {
    if (!this.ok()) return;
    this.hiss({ dur: 0.9, vol: 0.07, type: 'bandpass', freq: 300, to: 7000, q: 0.8 });
    const r = this.snd.root / 2;
    [0, 4, 7, 12, 16, 19].forEach((st, i) => this.note(r * Math.pow(2, st / 12), { when: 0.12 + i * 0.075, vol: 0.12, dur: 0.5 }));
    this.tone(r * 4, { type: 'sine', dur: 0.9, vol: 0.05, when: 0.6, wet: true });
  },
  fullClear() {
    if (!this.ok()) return;
    const r = this.snd.root;
    [0, 4, 7, 12, 16, 19, 24].forEach((st, i) => this.note(r * Math.pow(2, st / 12), { when: 0.25 + i * 0.06, vol: 0.13, dur: 0.45 }));
    [12, 16, 19].forEach(st => this.note(r * Math.pow(2, st / 12), { when: 0.75, vol: 0.09, dur: 0.9 }));
    this.hiss({ dur: 1.1, vol: 0.06, type: 'highpass', freq: 2500, to: 10000, when: 0.25 });
    this.tone(90, { dur: 0.5, vol: 0.35, to: 40, when: 0.2 });
  },
  bad() { if (!this.ok()) return; this.tone(160, { type: 'square', dur: 0.09, vol: 0.04, to: 110 }); },
  deal() { if (!this.ok()) return; const kit = KITS[this.snd.kit]; if (kit) { kit.deal(); return; } this.hiss({ dur: 0.2, vol: 0.05, type: 'bandpass', freq: 500, to: 2600, q: 0.9 }); },
  over() { if (!this.ok()) return; [0.75, 0.63, 0.5, 0.375].forEach((k, i) => this.note(this.snd.root * k, { when: i * 0.15, vol: 0.13, dur: 0.4 })); },
  record() { if (!this.ok()) return; [1, 1.26, 1.5, 2].forEach((k, i) => this.note(this.snd.root * k, { when: 0.7 + i * 0.09, vol: 0.12, dur: 0.3 })); },
  // zen: the board breathes out; an airy sweep down, then three soft rising notes
  breath() {
    if (!this.ok()) return;
    this.hiss({ dur: 1.3, vol: 0.05, type: 'bandpass', freq: 2600, to: 380, q: 0.7 });
    const r = this.snd.root / 2;
    [0, 7, 12].forEach((st, i) => this.note(r * Math.pow(2, st / 12), { when: 0.4 + i * 0.18, vol: 0.08, dur: 0.7 }));
  },
  star(n) { if (!this.ok()) return; const up = [1, 1.26, 1.5, 2, 2.52].slice(0, 2 + n); up.forEach((k, i) => this.note(this.snd.root * k, { when: i * 0.07, vol: 0.11, dur: 0.32 })); },
};
// small instruments the theme kits are built from
Object.assign(Sfx, {
  tink(f, { when = 0, vol = 0.1, dur = 0.25 } = {}) { // metal / glass ping with inharmonic partials
    this.tone(f, { type: 'sine', dur, vol, when, attack: 0.002, wet: true });
    this.tone(f * 2.76, { type: 'sine', dur: dur * 0.5, vol: vol * 0.5, when, attack: 0.002 });
    this.tone(f * 5.4, { type: 'sine', dur: dur * 0.3, vol: vol * 0.25, when, attack: 0.002 });
  },
  knock(f, { when = 0, vol = 0.25 } = {}) { // hollow wooden knock
    this.tone(f, { type: 'sine', dur: 0.08, vol, when, to: f * 0.85, attack: 0.002 });
    this.tone(f * 2.3, { type: 'triangle', dur: 0.03, vol: vol * 0.3, when, attack: 0.001 });
    this.hiss({ dur: 0.02, vol: vol * 0.4, type: 'bandpass', freq: f * 3, q: 2, when });
  },
  crunch({ when = 0, vol = 0.12, n = 4 } = {}) { // crisp bite: a few short noise grains
    let t = when;
    for (let i = 0; i < n; i++) { this.hiss({ dur: rand(0.015, 0.045), vol: vol * rand(0.5, 1), type: 'bandpass', freq: rand(1500, 4500), q: 1.5, when: t }); t += rand(0.012, 0.03); }
  },
  pop({ when = 0, vol = 0.2, f = 700 } = {}) {
    this.hiss({ dur: 0.025, vol: vol * 0.8, type: 'highpass', freq: 1500, when });
    this.tone(f, { type: 'sine', dur: 0.06, vol, to: f * 0.3, when, attack: 0.001 });
  },
  squelch({ when = 0, vol = 0.14, dur = 0.18 } = {}) {
    this.hiss({ dur, vol, type: 'bandpass', freq: 250, to: 1400, q: 6, when });
    this.tone(140, { type: 'sine', dur, vol: vol * 1.6, to: 320, when, attack: 0.01 });
  },
  rustle({ when = 0, vol = 0.08, dur = 0.12 } = {}) {
    for (let i = 0; i < 3; i++) this.hiss({ dur: dur * rand(0.4, 0.8), vol: vol * rand(0.6, 1), type: 'bandpass', freq: rand(2500, 5000), q: 0.8, when: when + i * dur * 0.3 });
  },
  blip(f, { to = null, when = 0, vol = 0.08, dur = 0.08 } = {}) { this.tone(f, { type: 'square', dur, vol, to, when, attack: 0.001 }); },
  thud({ when = 0, vol = 0.3, f = 120 } = {}) { this.tone(f, { dur: 0.16, vol, to: f * 0.45, when }); },
});
// per-theme sound kits; each one replaces pick / place / deal and the noise layer of a clear (the melody always plays)
const KITS = (S => ({
  honey: {
    pick() { S.plop(330, { vol: 0.09, dur: 0.06 }); },
    place() { S.plop(170, { vol: 0.34, dur: 0.12 }); S.tone(120, { dur: 0.18, vol: 0.28, to: 55 }); S.goo({ vol: 0.12, dur: 0.14, when: 0.01 }); },
    clear(n) {
      S.hiss({ dur: 0.6, vol: 0.09, type: 'lowpass', freq: 1100, to: 260, when: 0.02, q: 3 });
      for (let i = 0; i < n + 1; i++) S.plop(rand(420, 760), { when: 0.08 + i * 0.075 + Math.random() * 0.03, vol: 0.11 });
      S.tone(120, { dur: 0.26, vol: 0.28, to: 50 });
    },
    deal() { S.goo({ vol: 0.07, dur: 0.22 }); },
  },
  gold: {
    pick() { S.tink(2400, { vol: 0.05, dur: 0.12 }); },
    place() { S.thud({ vol: 0.25, f: 150 }); S.tink(rand(1900, 2300), { vol: 0.12 }); S.tink(rand(2600, 3000), { vol: 0.07, when: 0.04 }); },
    clear(n) { for (let i = 0; i < n * 3 + 2; i++) S.tink(rand(1800, 3400), { when: 0.04 + i * 0.045 + Math.random() * 0.02, vol: 0.07, dur: 0.18 }); S.thud({ vol: 0.25, f: 110 }); },
    deal() { S.tink(2600, { vol: 0.04, dur: 0.1 }); S.tink(3100, { vol: 0.03, dur: 0.1, when: 0.05 }); },
  },
  glass: {
    pick() { S.tink(3200, { vol: 0.05, dur: 0.1 }); },
    place() { S.thud({ vol: 0.2, f: 180 }); S.tink(rand(2600, 3200), { vol: 0.1, dur: 0.3 }); },
    clear(n) {
      S.hiss({ dur: 0.35, vol: 0.12, type: 'highpass', freq: 4000, to: 9000 });
      for (let i = 0; i < n * 3 + 3; i++) S.tink(rand(2500, 5200), { when: 0.02 + Math.random() * 0.35, vol: 0.06, dur: 0.15 });
      S.thud({ vol: 0.2, f: 140 });
    },
    deal() { S.tink(4200, { vol: 0.03, dur: 0.2 }); },
  },
  choco: {
    pick() { S.crunch({ vol: 0.05, n: 2 }); },
    place() { S.thud({ vol: 0.3, f: 110 }); S.crunch({ vol: 0.1, n: 3 }); },
    clear(n) {
      for (let i = 0; i < Math.min(n + 1, 4); i++) S.crunch({ when: i * 0.11, vol: 0.13, n: 6 });
      S.hiss({ dur: 0.5, vol: 0.06, type: 'lowpass', freq: 800, to: 300, when: 0.1, q: 2 });
    },
    deal() { S.rustle({ vol: 0.05 }); },
  },
  slime: {
    pick() { S.squelch({ vol: 0.06, dur: 0.1 }); },
    place() { S.squelch({ vol: 0.14, dur: 0.2 }); S.thud({ vol: 0.2, f: 90 }); },
    clear(n) { for (let i = 0; i < n + 1; i++) S.squelch({ when: i * 0.08, vol: 0.12, dur: 0.16 }); S.plop(300, { when: 0.1, vol: 0.1 }); },
    deal() { S.squelch({ vol: 0.05, dur: 0.14 }); },
  },
  wood: {
    pick() { S.knock(900, { vol: 0.08 }); },
    place() { S.knock(rand(520, 620), { vol: 0.3 }); S.thud({ vol: 0.2, f: 130 }); },
    clear(n) { for (let i = 0; i < n + 2; i++) S.knock(500 + i * 90, { when: i * 0.06, vol: 0.18 }); },
    deal() { S.knock(1100, { vol: 0.06 }); S.knock(1300, { vol: 0.05, when: 0.06 }); },
  },
  gum: {
    pick() { S.pop({ vol: 0.06, f: 900 }); },
    place() { S.thud({ vol: 0.22, f: 160 }); S.hiss({ dur: 0.08, vol: 0.08, type: 'lowpass', freq: 900 }); },
    clear(n) { for (let i = 0; i < n + 2; i++) S.pop({ when: 0.04 + i * 0.07, vol: 0.18, f: rand(500, 900) }); },
    deal() { S.hiss({ dur: 0.3, vol: 0.06, type: 'bandpass', freq: 400, to: 1800, q: 2 }); },
  },
  chip: {
    pick() { S.blip(880, { to: 1320, dur: 0.05, vol: 0.05 }); },
    place() { S.blip(330, { to: 110, dur: 0.1, vol: 0.09 }); S.hiss({ dur: 0.04, vol: 0.06, type: 'highpass', freq: 3000 }); },
    clear(n) { S.hiss({ dur: 0.3, vol: 0.1, type: 'lowpass', freq: 3000, to: 200, q: 1 }); S.blip(220, { to: 55, dur: 0.25, vol: 0.08 }); for (let i = 0; i < n; i++) S.blip(1760, { when: 0.3 + i * 0.05, dur: 0.03, vol: 0.04 }); },
    deal() { S.blip(660, { to: 990, dur: 0.06, vol: 0.04 }); },
  },
  crystal: {
    pick() { S.tink(1760, { vol: 0.05, dur: 0.3 }); },
    place() { S.thud({ vol: 0.22, f: 130 }); S.tink(rand(1200, 1600), { vol: 0.1, dur: 0.6 }); },
    clear(n) { for (let i = 0; i < n * 2 + 3; i++) S.tink(rand(2000, 4000), { when: 0.05 + i * 0.05, vol: 0.05, dur: 0.5 }); S.thud({ vol: 0.2, f: 100 }); },
    deal() { S.tink(2350, { vol: 0.035, dur: 0.4 }); },
  },
  cup: {
    pick() { S.tink(1500, { vol: 0.05, dur: 0.12 }); },
    place() { S.thud({ vol: 0.22, f: 140 }); S.tink(rand(1300, 1500), { vol: 0.12, dur: 0.25 }); },
    clear(n) {
      for (let i = 0; i < n + 3; i++) S.tink(i % 2 ? 1900 : 1600, { when: 0.03 + i * 0.07, vol: 0.07, dur: 0.12 });
      S.hiss({ dur: 0.5, vol: 0.07, type: 'lowpass', freq: 1200, to: 400, q: 1, when: 0.05 });
    },
    deal() { S.tink(1700, { vol: 0.04, dur: 0.15 }); },
  },
  spooky: {
    pick() { S.tone(240, { dur: 0.1, vol: 0.06, to: 180 }); },
    place() { S.thud({ vol: 0.32, f: 80 }); S.tone(95, { type: 'sawtooth', dur: 0.14, vol: 0.025, to: 70, when: 0.02 }); },
    clear() {
      S.tone(660, { dur: 0.7, vol: 0.08, to: 392, wet: true, attack: 0.05 });
      S.tone(664, { dur: 0.7, vol: 0.06, to: 396, attack: 0.05 });
      S.hiss({ dur: 0.9, vol: 0.07, type: 'bandpass', freq: 400, to: 900, q: 3 });
      S.thud({ vol: 0.25, f: 70 });
    },
    deal() { S.hiss({ dur: 0.4, vol: 0.05, type: 'bandpass', freq: 500, to: 300, q: 3 }); },
  },
  jingle: {
    pick() { S.tink(2800, { vol: 0.04, dur: 0.1 }); },
    place() { S.thud({ vol: 0.22, f: 150 }); for (let i = 0; i < 4; i++) S.tink(rand(2500, 4200), { when: i * 0.025, vol: 0.04, dur: 0.12 }); },
    clear(n) { for (let i = 0; i < n * 4 + 4; i++) S.tink(rand(2500, 4500), { when: Math.random() * 0.5, vol: 0.04, dur: 0.14 }); },
    deal() { S.tink(3000, { vol: 0.03, dur: 0.1 }); S.tink(3600, { vol: 0.03, dur: 0.1, when: 0.04 }); },
  },
  stone: {
    pick() { S.knock(1400, { vol: 0.05 }); },
    place() { S.knock(rand(380, 450), { vol: 0.3 }); S.hiss({ dur: 0.04, vol: 0.08, type: 'bandpass', freq: 2000, q: 1.5 }); },
    clear(n) { S.hiss({ dur: 0.7, vol: 0.05, type: 'highpass', freq: 6000, to: 10000, when: 0.05 }); for (let i = 0; i < n + 1; i++) S.knock(700 - i * 60, { when: i * 0.07, vol: 0.14 }); },
    deal() { S.knock(1600, { vol: 0.04 }); },
  },
  paper: {
    pick() { S.rustle({ vol: 0.04, dur: 0.06 }); },
    place() { S.rustle({ vol: 0.09 }); S.thud({ vol: 0.12, f: 200 }); },
    clear() { S.hiss({ dur: 0.3, vol: 0.1, type: 'bandpass', freq: 600, to: 4000, q: 1 }); S.rustle({ vol: 0.08, dur: 0.3, when: 0.1 }); },
    deal() { S.rustle({ vol: 0.05, dur: 0.2 }); },
  },
  juicy: {
    pick() { S.plop(400, { vol: 0.06, dur: 0.06 }); },
    place() { S.squelch({ vol: 0.09, dur: 0.12 }); S.crunch({ vol: 0.07, n: 2 }); S.thud({ vol: 0.18, f: 140 }); },
    clear(n) {
      S.crunch({ vol: 0.12, n: 5 });
      S.hiss({ dur: 0.35, vol: 0.09, type: 'lowpass', freq: 2200, to: 500, q: 2, when: 0.05 });
      for (let i = 0; i < n + 1; i++) S.plop(rand(500, 800), { when: 0.12 + i * 0.07, vol: 0.09 });
    },
    deal() { S.plop(520, { vol: 0.05, dur: 0.05 }); },
  },
}))(Sfx);
const capHaptics = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
const NATIVE_VIBRATE = !capHaptics && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
const IS_IOS = /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const iosTick = (() => {
  if (capHaptics || NATIVE_VIBRATE || !IS_IOS) return null;
  try {
    const lb = document.createElement('label'), inp = document.createElement('input');
    inp.type = 'checkbox'; inp.setAttribute('switch', ''); inp.tabIndex = -1;
    lb.setAttribute('aria-hidden', 'true');
    lb.style.cssText = 'position:fixed;left:-200px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden';
    lb.appendChild(inp); document.body.appendChild(lb);
    let last = 0;
    return () => { const t = performance.now(); if (t - last < 40) return; last = t; lb.click(); };
  } catch (e) { return null; }
})();
// native: map each vibration pulse (pattern = on, off, on, ...) to a Taptic Engine tap of matching weight
const capTap = d => capHaptics.impact({ style: d >= 40 ? 'HEAVY' : d >= 16 ? 'MEDIUM' : 'LIGHT' }).catch(() => {});
const capBuzz = ms => {
  if (!Array.isArray(ms)) { capTap(ms); return; }
  let t = 0;
  ms.forEach((d, i) => { if (i % 2 === 0) { if (t === 0) capTap(d); else setTimeout(() => capTap(d), t); } t += d; });
};
const CAN_VIBRATE = !!capHaptics || NATIVE_VIBRATE || !!iosTick;
const prefs = { vol: 100, vib: true, lowFx: false }; // player settings, loaded at boot
const buzz = ms => { if (!prefs.vib || !CAN_VIBRATE) return; try { if (capHaptics) capBuzz(ms); else if (NATIVE_VIBRATE) navigator.vibrate(ms); else iosTick(); } catch (e) {} };
// iOS: wake the audio on any real gesture (Safari only counts touchend/click), stop pinch-zoom and the double-tap zoom
['touchend', 'click', 'keydown'].forEach(t => document.addEventListener(t, () => Sfx.unlock(), { capture: true, passive: true }));
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });

/* ---------- Storage ---------- */
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};

/* ---------- DOM ---------- */
const $ = id => document.getElementById(id);
const stage = $('stage'), cv = $('cv'), ctx = cv.getContext('2d');
const bgc = $('bg'), bctx = bgc.getContext('2d');
const elScore = $('score'), elBest = $('best'), elCombo = $('combo');
let metaTheme = document.querySelector('meta[name="theme-color"]');
if (!metaTheme) { metaTheme = document.createElement('meta'); metaTheme.name = 'theme-color'; document.head.appendChild(metaTheme); }

/* ---------- State ---------- */
let grid, tray, score, best, combo, msc, over, overT0, newRecord, moves = 0, fulls = 0, flash = null;
let displayScore = 0, shownScore = -1;
let pop = [...Array(N)].map(() => Array(N).fill(0));
let clearing = [], particles = [], texts = [], shake = null, drag = null, banner = null;
const emptyGrid = () => [...Array(N)].map(() => Array(N).fill(0));

// theme state
const THEME_DUR = 1300;
const theme = { cur: 0, prev: 0, t0: -1e9, start: 0, stage: 0, domDone: false, mode: 'classic', prevMode: 'classic' };
let settings = { auto: true, fixed: 0, block: 'classic' };
let earned = new Set([0]);   // themes the player has really unlocked (saved)
let discovered = earned;      // themes shown as open: the same set, or every theme in developer mode
const DEV_KEY = 'blokzen.dev';
let devMode = false;
function syncOpen() { discovered = devMode ? new Set(THEMES.map((_, i) => i)) : earned; }
let pendingTheme = null;
let fresh = new Set(); // unlocked but not yet seen in the gallery

/* ---------- Theme unlocks: every theme except the first has a task and stays locked until it is done.
   Tasks are spaced so a new theme opens every game or two at first, then every few sessions; the running totals
   (games, total score, blocks, lines) mean steady play always moves some bar forward. ---------- */
const STATS_KEY = 'blokzen.stats';
const UNLOCKS = {
  ocean:   { text: 'Tek oyunda 2.500 puan yap', goal: 2500, val: s => s.bestScore },
  forest:  { text: "Bir oyunda 4'lü kombo yap", goal: 4, val: s => s.bestCombo },
  sunset:  { text: 'Tek hamlede 3 sıra temizle', goal: 3, val: s => s.bestLines },
  snow:    { text: 'Tahtayı tamamen temizle', goal: 1, val: s => s.totalFulls },
  neon:    { text: 'Toplam 150 sıra temizle', goal: 150, val: s => s.totalLines },
  sakura:  { text: 'Tek oyunda 25.000 puan yap', goal: 25000, val: s => s.bestScore },
  volcano: { text: 'Bir oyunda tahtayı 3 kez temizle', goal: 3, val: s => s.bestFulls },
  space:   { text: 'Tek oyunda 100.000 puan yap', goal: 100000, val: s => s.bestScore },
  honey:   { text: 'Toplam 10 oyun oyna', goal: 10, val: s => s.games },
  gold:    { text: 'Toplamda 50.000 puan topla', goal: 50000, val: s => s.totalScore },
  glass:   { text: 'Toplam 500 blok yerleştir', goal: 500, val: s => s.totalPlaced },
  choco:   { text: "Bir oyunda 6'lı kombo yap", goal: 6, val: s => s.bestCombo },
  slime:   { text: 'Tek oyunda 150 hamle yap', goal: 150, val: s => s.bestMoves },
  wood:    { text: 'Toplam 25 oyun oyna', goal: 25, val: s => s.games },
  gum:     { text: 'Toplam 400 sıra temizle', goal: 400, val: s => s.totalLines },
  retro:   { text: 'Tek hamlede 4 sıra temizle', goal: 4, val: s => s.bestLines },
  amethyst:{ text: 'Toplamda 250.000 puan topla', goal: 250000, val: s => s.totalScore },
  coffee:  { text: 'Tahtayı toplam 10 kez temizle', goal: 10, val: s => s.totalFulls },
  halloween:{ text: 'Toplam 2.000 blok yerleştir', goal: 2000, val: s => s.totalPlaced },
  xmas:    { text: "Bir oyunda 8'li kombo yap", goal: 8, val: s => s.bestCombo },
  marble:  { text: 'Toplam 50 oyun oyna', goal: 50, val: s => s.games },
  origami: { text: 'Toplam 1.000 sıra temizle', goal: 1000, val: s => s.totalLines },
  fruit:   { text: 'Toplamda 1.000.000 puan topla', goal: 1000000, val: s => s.totalScore },
  aurora:  { text: '7 farklı günde oyna', goal: 7, val: s => s.daysPlayed },
  coral:   { text: 'Bir oyunda 10 kez tek hamlede 2+ sıra temizle', goal: 10, val: s => s.bestMulti },
  tomb:    { text: 'Bir oyunda tahtayı 5 kez temizle', goal: 5, val: s => s.bestFulls },
  iznik:   { text: 'Tek hamlede 3+ sırayı 50 kez temizle', goal: 50, val: s => s.total3 },
  balloon: { text: 'Sabah 05:00 ile 09:00 arası bir oyun bitir', goal: 1, val: s => s.morningGames },
  ebru:    { text: '10 farklı temada oyun bitir', goal: 10, val: s => s.themesDone },
  clock:   { text: 'Tek oyunda 300 hamle yap', goal: 300, val: s => s.bestMoves },
  storm:   { text: 'Tek hamlede 5 sıra temizle', goal: 5, val: s => s.bestLines },
  zen:     { text: 'Toplam 3 saat oyna', goal: 180, val: s => Math.floor(s.playSec / 60), fmt: (h, g) => `${h} / ${g} dk` },
  lavalamp:{ text: 'Toplam 75 oyun oyna', goal: 75, val: s => s.games },
  cloud:   { text: 'Tahta yarıyı geçmeden tek oyunda 100 hamle yap', goal: 100, val: s => s.bestCalm },
  factory: { text: 'Toplam 5.000 blok yerleştir', goal: 5000, val: s => s.totalPlaced },
  tropic:  { text: 'Tahtayı toplam 25 kez temizle', goal: 25, val: s => s.totalFulls },
  fossil:  { text: 'Toplamda 3.000.000 puan topla', goal: 3000000, val: s => s.totalScore },
  musicbox:{ text: "Bir oyunda 10'lu kombo yap", goal: 10, val: s => s.bestCombo },
  autumn:  { text: 'Toplam 2.500 sıra temizle', goal: 2500, val: s => s.totalLines },
  sushi:   { text: 'Art arda 3 oyunda 10.000+ puan yap', goal: 3, val: s => s.bestStreak10k },
  graffiti:{ text: 'Tek oyunda 50.000 puan yap', goal: 50000, val: s => s.bestScore },
  carnival:{ text: 'Tek oyunda 250.000 puan yap', goal: 250000, val: s => s.bestScore },
  gelato:  { text: 'Bir günde 5 oyun oyna', goal: 5, val: s => s.bestDayGames },
  // daily collection
  news:    { text: 'Günlükte ilk yıldızını al', goal: 1, val: s => s.dailyStars, daily: true },
  calendar:{ text: 'Günlükte 3 günlük seri yap', goal: 3, val: s => s.dailyBestStreak, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  tea:     { text: 'Günlükte sabah 05:00 ile 09:00 arası yıldız al', goal: 1, val: s => s.dailyMorning, daily: true },
  spice:   { text: 'Günlükte 7 günlük seri yap', goal: 7, val: s => s.dailyBestStreak, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  desert:  { text: 'Günlükte bir günün ilk denemesinde 3 yıldız al', goal: 1, val: s => s.dailyFirst3, daily: true },
  letter:  { text: 'Günlükte 5 farklı günde önceki günün en iyi skorunu geç', goal: 5, val: s => s.dailyBeat, daily: true },
  picnic:  { text: 'Günlükte aynı hafta sonu hem cumartesi hem pazar yıldız al', goal: 1, val: s => s.dailyWeekend, daily: true },
  library: { text: 'Günlükte gece 22:00 ile 02:00 arası yıldız al', goal: 1, val: s => s.dailyNight, daily: true },
  stained: { text: 'Günlükte bir oyunda tahtayı 2 kez tamamen temizle', goal: 2, val: s => s.dailyBestFulls, daily: true },
  observatory: { text: 'Günlükte 5 farklı günde 3 yıldız al', goal: 5, val: s => s.dailyThree, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  train:   { text: 'Günlükte 14 günlük seri yap', goal: 14, val: s => s.dailyBestStreak, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  moon:    { text: 'Günlüğü 28 farklı günde oyna', goal: 28, val: s => s.dailyDays, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  zeugma:  { text: 'Günlükte toplam 50 yıldız topla', goal: 50, val: s => s.dailyStars, daily: true },
  comet:   { text: 'Günlükte 30 günlük seri yap. Koleksiyonun finali', goal: 30, val: s => s.dailyBestStreak, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  // zen collection: tasks done only by playing Zen, calm ones that reward time and patience
  zellige: { text: "Zen'de toplam 15 dakika oyna", goal: 15, val: s => Math.floor(s.zenSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
  bojagi:  { text: "Zen'de tahta 25 kez nefes alsın", goal: 25, val: s => s.zenBreaths, zen: true },
  rangoli: { text: "Zen'de sabah 05:00 ile 10:00 arası toplam 20 dakika oyna", goal: 20, val: s => Math.floor(s.zenMorningSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
  kente:   { text: "Zen'de toplam 300 sıra temizle", goal: 300, val: s => s.zenLines, zen: true },
  talavera:{ text: "Zen'de tahtayı toplam 5 kez tamamen temizle", goal: 5, val: s => s.zenFulls, zen: true },
  andes:   { text: "Zen'de art arda 150 hamle boyunca tahta yarıyı geçmesin", goal: 150, val: s => s.zenBestCalm, zen: true },
  batik:   { text: "Zen'de hiç nefes almadan art arda 200 hamle yap", goal: 200, val: s => s.zenBestRun, zen: true },
  santorini:{ text: "Zen'de akşam 19:00 ile 23:00 arası toplam 45 dakika oyna", goal: 45, val: s => Math.floor(s.zenEveningSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
  persian: { text: "Zen'de toplam 3 saat oyna", goal: 180, val: s => Math.floor(s.zenSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
  inkmount:{ text: "Zen'de toplam 1.000 sıra temizle. Koleksiyonun finali", goal: 1000, val: s => s.zenLines, zen: true },
  // puzzle collection: tasks done only by solving levels, each one asks for a different kind of cleverness
  jigsaw:  { text: 'Bulmacada ilk bölümünü bitir', goal: 1, val: s => s.puzzleWins, puzzle: true },
  chalk:   { text: 'Bulmacada kaybettiğin 3 farklı bölümü sonradan 3 yıldızla bitir', goal: 3, val: s => s.puzzleBack, puzzle: true },
  domino:  { text: 'Bulmacada tek hamlede 3 taşı birden temizle', goal: 3, val: s => s.puzzleBestGems, fmt: (h, g) => `${h} / ${g} taş`, puzzle: true },
  tangram: { text: 'Bulmacada dört hedef türünün her birinde bir bölümü 3 yıldızla bitir', goal: 4, val: s => s.puzzleTypes3, fmt: (h, g) => `${h} / ${g} tür`, puzzle: true },
  detective:{ text: 'Bulmacada bir bölümü son parçayla, elinde hiç parça kalmadan bitir', goal: 1, val: s => s.puzzleLast, puzzle: true },
  cipher:  { text: 'Bulmacada 5 bölümü tek denemede, hiç geri almadan 3 yıldızla çöz', goal: 5, val: s => s.puzzleClean, fmt: (h, g) => `${h} / ${g} bölüm`, puzzle: true },
  cube:    { text: 'Bulmacada tek hamlede bir satırı ve bir sütunu birlikte temizle, 5 kez', goal: 5, val: s => s.puzzleCross, puzzle: true },
  blueprint:{ text: "Bulmacada 'tahtayı boşalt' bölümlerinin hepsini 3 yıldızla bitir", goal: 4, val: s => s.puzzleClear3, fmt: (h, g) => `${h} / ${g} bölüm`, puzzle: true },
  alchemy: { text: 'Bulmacada toplam 50 taş kır', goal: 50, val: s => s.puzzleGemsTotal, fmt: (h, g) => `${h} / ${g} taş`, puzzle: true },
  chess:   { text: 'Bulmacada bütün bölümleri 3 yıldızla bitir. Koleksiyonun finali', goal: 60, val: s => s.puzzleStars, fmt: (h, g) => `${h} / ${g} yıldız`, puzzle: true },
};
// the last theme of a collection gets a bigger moment when it opens
const FINALES = { comet: 'GÜNLÜK KOLEKSİYON FİNALİ', inkmount: 'ZEN KOLEKSİYONU FİNALİ', chess: 'BULMACA KOLEKSİYONU FİNALİ' };
// themes that were open from the start before version 2 of the theme meta; older saves lose them until the task is done
const META_V = 2;
const NEW_TASKS = ['honey', 'gold', 'glass', 'choco', 'slime', 'wood', 'gum', 'retro', 'amethyst', 'coffee', 'halloween', 'xmas', 'marble', 'origami', 'fruit'];
let stats = { bestScore: 0, bestCombo: 0, bestLines: 0, totalFulls: 0, totalLines: 0, bestFulls: 0, games: 0, totalScore: 0, totalPlaced: 0, bestMoves: 0,
  daysPlayed: 0, lastDay: 0, todayGames: 0, bestDayGames: 0, bestMulti: 0, total3: 0, morningGames: 0, themesDone: 0, playSec: 0, bestCalm: 0, streak10k: 0, bestStreak10k: 0,
  dailyGames: 0, dailyDays: 0, dailyStars: 0, dailyThree: 0, dailyBestStreak: 0, dailyMorning: 0, dailyFirst3: 0, dailyBeat: 0, dailyWeekend: 0, dailyNight: 0, dailyBestFulls: 0,
  zenMoves: 0, zenLines: 0, zenBreaths: 0, zenSec: 0, zenSessions: 0, zenFulls: 0, zenMorningSec: 0, zenEveningSec: 0, zenBestCalm: 0, zenBestRun: 0,
  puzzlePlaced: 0, puzzleLines: 0, puzzleSec: 0, puzzleWins: 0, puzzleTries: 0, // puzzle keeps its own counters: they move only the puzzle collection's tasks
  puzzleBack: 0, puzzleBestGems: 0, puzzleTypes3: 0, puzzleLast: 0, puzzleClean: 0, puzzleCross: 0, puzzleClear3: 0, puzzleGemsTotal: 0, puzzleStars: 0 };
// per-game counters for tasks measured inside one game (saved with the game). Zen only: lines cleared this session,
// zcalm: moves in a row with the board at most half full, zrun: moves since the board last took a breath
let gs = { multi: 0, calm: 0, broke: false, stars: 0, lines: 0, zcalm: 0, zrun: 0 };
const DONE_KEY = 'blokzen.themesDone';
let themesDone = new Set(); // themes a game has been finished in
let lastInput = 0, playAcc = 0; // play time only counts while someone is actually playing
const dayKey = () => { const d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); };
let hourAt = -1e9, hourVal = 0; // the hour of day, looked up at most every few seconds (time-of-day zen tasks)
const hourNow = () => { const n = performance.now(); if (n - hourAt > 5000) { hourAt = n; hourVal = new Date().getHours(); } return hourVal; };
function touchDay() { const k = dayKey(); if (stats.lastDay !== k) { stats.lastDay = k; stats.daysPlayed++; stats.todayGames = 0; } }
const fmtDur = sec => { const m = Math.floor(sec / 60); return m >= 60 ? `${Math.floor(m / 60)} sa ${m % 60} dk` : `${m} dk`; };
const isLocked = i => !earned.has(i);
// a theme opened on a puzzle win card waits there and is celebrated on the next board
let heldUnlock = null;
function playHeldUnlock(now) {
  if (!heldUnlock) return;
  const { i, finale } = heldUnlock; heldUnlock = null;
  celebrateUnlock(i, finale, now);
}
// unlock every theme whose task is done; celebrate the first new one
function checkUnlocks(now) {
  const got = [];
  THEMES.forEach((th, i) => {
    const u = UNLOCKS[th.id];
    if (u && isLocked(i) && u.val(stats) >= u.goal) { earned.add(i); fresh.add(i); got.push(i); }
  });
  if (!got.length) return;
  saveMeta();
  const fin = got.find(j => FINALES[THEMES[j].id]), finale = fin !== undefined; // a collection's last theme gets a bigger moment
  const i = finale ? fin : got[0];
  if (mode === 'puzzle') { // a level never changes theme halfway: the end card names it and the next board celebrates it
    heldUnlock = { i, finale };
    if (puz.gems) puz.opened.push(...got.map(j => THEMES[j].name));
    return;
  }
  celebrateUnlock(i, finale, now);
}
function celebrateUnlock(i, finale, now) {
  if (settings.auto) pendingTheme = { i, at: now + 700, unlocked: true, finale }; // auto mode moves straight to the new theme
  else {
    banner = { name: THEMES[i].name, sub: finale ? FINALES[THEMES[i].id] : 'YENİ TEMA AÇILDI', t0: now + 700, dur: finale ? 3600 : 2300 };
    setTimeout(() => { burst(performance.now()); Sfx.themeChange(); buzz([12, 50, 12]); }, 650);
  }
  if (finale) setTimeout(() => {
    for (let k = 0; k < 4; k++) setTimeout(() => burst(performance.now()), k * 380);
    flash = { t0: performance.now() };
    Sfx.fullClear(); buzz([30, 40, 30, 40, 80]);
  }, 1100);
}
// in auto mode the theme steps through the open themes as the score passes each milestone
function autoTheme(st) {
  const order = [...discovered].sort((a, b) => a - b);
  const k = Math.max(0, order.indexOf(theme.start));
  return order[(k + st) % order.length];
}
let ambCur = null, ambPrev = null;
const TH = () => THEMES[theme.cur];

/* ---------- Daily challenge ----------
   One game a day that is the same for everyone: a seeded start board, a seeded dealer and three target scores.
   Retries are free and replay the same day; the best score of the day counts. A day with at least one star keeps the streak going.
   Classic and daily keep separate saves, so switching modes never loses a game. */
const DAILY_SAVE_KEY = 'blokzen.daily.game', DAILY_KEY = 'blokzen.daily', MODE_KEY = 'blokzen.mode';
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const WEEKDAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const DAILY_BASE = [5000, 25000, 100000]; // star targets before the day's own ±15% twist
const niceTarget = x => x < 10000 ? Math.round(x / 500) * 500 : Math.round(x / 1000) * 1000;
const dayDate = k => new Date((k / 10000) | 0, (((k / 100) | 0) % 100) - 1, k % 100);
const keyOf = d => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
const dayShift = (k, n) => { const d = dayDate(k); d.setDate(d.getDate() + n); return keyOf(d); };
const fmtDay = k => `${k % 100} ${MONTHS[(((k / 100) | 0) % 100) - 1]}`;
function hash32(n) {
  let h = (n ^ 0x9E3779B9) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85EBCA6B); h = Math.imul(h ^ (h >>> 13), 0xC2B2AE35);
  return (h ^ (h >>> 16)) >>> 0;
}
const dailySeed = k => hash32(k * 7919 + 17);
// The day's start board (a mirrored pattern of 8 to 14 cells that never fills a line) and its three star targets
const dailyCache = new Map();
function dailyStart(k) {
  if (dailyCache.has(k)) return dailyCache.get(k);
  const g = dealStream(dailySeed(k) ^ 0x5bd1e995), R = n => (g.next() * n) | 0;
  const grid = emptyGrid(), perRow = Array(N).fill(0);
  const pairs = 4 + R(4);
  for (let p = 0, tries = 0; p < pairs && tries < 200; tries++) {
    const r = R(N), c = R(N / 2);
    if (grid[r][c] || perRow[r] >= 3) continue; // a fourth pair would complete the row
    const v = 1 + R(7);
    grid[r][c] = grid[r][N - 1 - c] = v; perRow[r]++; p++;
  }
  const f = 0.85 + 0.3 * g.next();
  const targets = DAILY_BASE.map(b => niceTarget(b * f));
  const info = { grid, targets, cells: grid.flat().filter(Boolean).length };
  dailyCache.set(k, info);
  return info;
}
let mode = 'classic';  // 'classic' | 'daily' | 'zen' | 'puzzle'
let gameDay = 0;       // the day the running daily game belongs to
let daily = { days: {}, streak: 0, best: 0, last: 0 }; // per-day records; streak of days with a star, ending at `last`
const dayRec = k => daily.days[k] || (daily.days[k] = { best: 0, stars: 0, tries: 0 });
const dayBest = k => (daily.days[k] && daily.days[k].best) || 0;
const starsFor = (sc, tg) => tg.reduce((n, t) => n + (sc >= t ? 1 : 0), 0);
const curStreak = () => { const t = dayKey(); return daily.last === t || daily.last === dayShift(t, -1) ? daily.streak : 0; };
/* Zen: an endless, calm game with its own save. The dealer stays generous, there are no levels, and when no piece fits
   the board breathes out (its fullest lines clear quietly, no points) instead of ending. */
const ZEN_SAVE_KEY = 'blokzen.zen.game';
const saveKey = () => mode === 'daily' ? DAILY_SAVE_KEY : mode === 'zen' ? ZEN_SAVE_KEY : mode === 'puzzle' ? PUZ_SAVE_KEY : SAVE_KEY;
function saveDaily() {
  const keys = Object.keys(daily.days).map(Number).sort((a, b) => b - a);
  for (const k of keys.slice(120)) delete daily.days[k]; // keep the last 120 days
  store.set(DAILY_KEY, daily);
}
function loadDaily() {
  const d = store.get(DAILY_KEY);
  if (!d || typeof d !== 'object') return;
  if (d.days && typeof d.days === 'object') for (const k in d.days) {
    const r = d.days[k], key = k | 0;
    if (key > 20000000 && r && typeof r === 'object') daily.days[key] = { best: r.best | 0, stars: Math.min(3, r.stars | 0), tries: r.tries | 0, beat: r.beat ? 1 : 0 };
  }
  daily.streak = d.streak | 0; daily.best = d.best | 0; daily.last = d.last | 0;
}
// Called after every daily move: records the day's best, hands out stars and keeps the streak
function dailyProgress(now, midX) {
  const info = dailyStart(gameDay), rec = dayRec(gameDay);
  rec.best = Math.max(rec.best, score);
  stats.dailyBestFulls = Math.max(stats.dailyBestFulls, fulls); // full clears in one daily game (stained glass theme)
  const prev = daily.days[dayShift(gameDay, -1)]; // beating yesterday's best counts once per day (letter theme)
  if (!rec.beat && prev && prev.best > 0 && rec.best > prev.best) { rec.beat = 1; stats.dailyBeat++; }
  const st = starsFor(score, info.targets);
  if (st > gs.stars) {
    gs.stars = st;
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 9) stats.dailyMorning++; // a morning star, for the tea garden theme
    if (hr >= 22 || hr < 2) stats.dailyNight++;  // a late night star, for the library theme
    texts.push({ text: st === 3 ? 'Üç yıldız!' : `${st}. yıldız!`, x: midX, y: L.gy + L.cell * 1.4, t0: now + 260, dur: 1700, size: L.cell * 0.78, role: 'accent' });
    setTimeout(() => { Sfx.star(st); buzz([16, 40, 16]); }, 240);
  }
  if (st > rec.stars) {
    stats.dailyStars += st - rec.stars;
    if (rec.stars === 0) { // first star of this day moves the streak
      if (daily.last !== gameDay) daily.streak = daily.last === dayShift(gameDay, -1) ? daily.streak + 1 : 1;
      daily.last = gameDay;
      daily.best = Math.max(daily.best, daily.streak);
      stats.dailyBestStreak = Math.max(stats.dailyBestStreak, daily.streak);
      const wd = dayDate(gameDay).getDay(), other = wd === 6 ? dayShift(gameDay, 1) : wd === 0 ? dayShift(gameDay, -1) : 0;
      if (other && daily.days[other] && daily.days[other].stars > 0) stats.dailyWeekend++; // both days of one weekend (picnic theme)
    }
    if (st === 3) { stats.dailyThree++; if (rec.tries === 1) stats.dailyFirst3++; } // three stars on the day's first try (desert theme)
    rec.stars = st;
  }
  saveDaily();
}

/* ---------- Puzzle: designed levels, one goal each ----------
   A level is a fixed start board, a fixed list of pieces dealt three at a time in order, and one goal:
     gems:  every gem has to go. A gem ('G') is a filled block with a gem on it; only clearing its row or column removes it
     clear: the board has to end up empty
     score: reach the target before the pieces run out (no level multiplier in this mode, so targets stay predictable)
     combo: push the combo counter up to n
   Running out of pieces, or of room for them, fails the level. Stars count the pieces still unused when the goal is
   reached: stars[k] is how many must be left for k + 1 stars. Every level and its thresholds were checked by a solver
   that tries every order of the tray and every placement (a test script, not part of the game).
   Board rows: '.' empty, '1'-'7' a block colour, 'G' a gem. Pieces: [shape index, colour]. */
const PUZ_KEY = 'blokzen.puzzle', PUZ_SAVE_KEY = 'blokzen.puzzle.game';
const GEM_COLOR = 6; // block colour under a gem unless the level sets gemColor
const PUZZLE_GROUPS = [
  { id: 'c1', name: 'Başlangıç', levels: [
    { id: 'c1-01', title: 'İlk taş', goal: { type: 'gems' }, stars: [0, 1, 2],
      board: [
        '........',
        '........',
        '........',
        '........',
        '12G45...',
        '........',
        '........',
        '........',
      ],
      pieces: [[3, 2], [9, 5], [1, 4]] },
    { id: 'c1-02', title: 'Sütun da sayılır', goal: { type: 'gems' }, stars: [0, 2, 3],
      board: [
        '...G....',
        '...1....',
        '...2....',
        '...3....',
        '...4....',
        '........',
        'G56.712.',
        '........',
      ],
      pieces: [[0, 3], [4, 5], [9, 2], [11, 6], [1, 1], [2, 7]] },
    { id: 'c1-03', title: 'Temiz sayfa', goal: { type: 'clear' }, stars: [0, 2, 4],
      board: [
        '.......1',
        '.......2',
        '.......3',
        '445566..',
        '.......4',
        '.......5',
        '.......6',
        '.......7',
      ],
      pieces: [[9, 2], [3, 6], [1, 3], [10, 5], [5, 1], [0, 4]] },
    { id: 'c1-04', title: 'Puan avı', goal: { type: 'score', target: 120 }, stars: [0, 2, 3],
      board: [
        '11.11111',
        '22.22222',
        '........',
        '.3....3.',
        '.3....3.',
        '........',
        '44444.44',
        '55555.55',
      ],
      pieces: [[13, 5], [2, 1], [24, 3], [14, 4], [10, 5], [19, 3], [3, 1]] },
    { id: 'c1-05', title: 'Zincir', goal: { type: 'combo', n: 3 }, stars: [0, 2, 4],
      board: [
        '1111.111',
        '........',
        '22.22222',
        '........',
        '........',
        '333333..',
        '........',
        '4.444444',
      ],
      pieces: [[5, 1], [23, 3], [16, 7], [20, 1], [10, 6], [10, 2], [13, 6], [5, 5], [9, 3]] },
    { id: 'c1-06', title: 'Dört köşe', goal: { type: 'gems' }, stars: [0, 2, 4],
      board: [
        'G1....1G',
        '2......2',
        '........',
        '...33...',
        '...33...',
        '........',
        '4......4',
        'G5....5G',
      ],
      pieces: [[23, 7], [19, 1], [12, 6], [9, 4], [9, 1], [12, 4], [14, 5], [10, 1], [5, 1]] },
    { id: 'c1-07', title: 'Üçlü vuruş', goal: { type: 'score', target: 300 }, stars: [0, 2, 3],
      board: [
        '111.1111',
        '222.2222',
        '333.3333',
        '........',
        '444.4444',
        '555.5555',
        '666.6666',
        '........',
      ],
      pieces: [[12, 5], [14, 4], [6, 2], [11, 5], [4, 6], [26, 5], [9, 7], [16, 7]] },
    { id: 'c1-08', title: 'Dört ada', goal: { type: 'clear' }, stars: [0, 3, 5],
      board: [
        '123..123',
        '234..234',
        '345..345',
        '........',
        '........',
        '567..567',
        '671..671',
        '712..712',
      ],
      pieces: [[23, 4], [13, 1], [1, 2], [12, 7], [16, 5], [2, 6], [25, 6], [2, 1], [0, 6], [24, 5]] },
    { id: 'c1-09', title: 'Merdiven', goal: { type: 'combo', n: 4 }, stars: [0, 2, 4],
      board: [
        '.7777777',
        '6.666666',
        '55.55555',
        '444.4444',
        '3333.333',
        '22222.22',
        '111111.1',
        '........',
      ],
      pieces: [[13, 5], [21, 6], [2, 4], [20, 7], [19, 1], [19, 5], [21, 2], [23, 3], [5, 4], [24, 2], [3, 1]] },
    { id: 'c1-10', title: 'Usta işi', goal: { type: 'gems' }, stars: [0, 2, 4], master: true,
      board: [
        '1..GG..1',
        '.2....2.',
        '..3..3..',
        'G..44..G',
        'G..44..G',
        '..3..3..',
        '.2....2.',
        '1..GG..1',
      ],
      pieces: [[9, 4], [2, 3], [9, 3], [19, 1], [2, 5], [14, 7], [1, 1], [10, 6], [12, 2], [16, 7], [12, 6], [4, 3]] },
  ] },
  { id: 'c2', name: 'Ustalık', levels: [
    { id: 'c2-01', title: 'Kafes', goal: { type: 'gems' }, stars: [0, 2, 3],
      board: [
        '........',
        '.111111.',
        '.1....1.',
        '.1.GG.1.',
        '.1.GG.1.',
        '.1....1.',
        '.111111.',
        '........',
      ],
      pieces: [[2, 4], [8, 5], [4, 2], [5, 7], [8, 2], [18, 7], [7, 6], [19, 2]] },
    { id: 'c2-02', title: 'Köprü', goal: { type: 'clear' }, stars: [0, 2, 4],
      board: [
        '........',
        '........',
        '11....22',
        '11....22',
        '11....22',
        '11....22',
        '........',
        '........',
      ],
      pieces: [[10, 6], [5, 3], [4, 7], [12, 5], [11, 1], [6, 2], [9, 4], [3, 3]] },
    { id: 'c2-03', title: 'Büyük patlama', goal: { type: 'score', target: 300 }, stars: [0, 3, 5],
      board: [
        '111111..',
        '222222..',
        '333333..',
        '........',
        '........',
        '44444.44',
        '55555.55',
        '66666.66',
      ],
      pieces: [[8, 4], [27, 1], [16, 3], [3, 4], [19, 1], [18, 4], [10, 2], [30, 6], [7, 4]] },
    { id: 'c2-04', title: 'Şelale', goal: { type: 'combo', n: 5 }, stars: [0, 2, 3],
      board: [
        '.1111111',
        '2.222222',
        '........',
        '333.3333',
        '4444.444',
        '........',
        '55555.55',
        '666666.6',
      ],
      pieces: [[0, 4], [31, 3], [23, 1], [31, 5], [26, 1], [12, 5], [20, 1], [9, 6], [12, 1]] },
    { id: 'c2-05', title: 'Kale', goal: { type: 'gems' }, stars: [0, 2, 4],
      board: [
        'G1.11.1G',
        '1......1',
        '........',
        '1......1',
        '1......1',
        '........',
        '1......1',
        'G1.11.1G',
      ],
      pieces: [[21, 2], [25, 6], [14, 1], [25, 4], [4, 6], [14, 4], [15, 3], [26, 2], [32, 4]] },
    { id: 'c2-06', title: 'Ayna', goal: { type: 'clear' }, stars: [0, 2, 4],
      board: [
        '1......1',
        '1..22..1',
        '...22...',
        '........',
        '........',
        '...33...',
        '1..33..1',
        '1......1',
      ],
      pieces: [[6, 4], [9, 5], [1, 2], [3, 6], [6, 7], [1, 3], [0, 1], [2, 5], [9, 6], [6, 2]] },
    { id: 'c2-07', title: 'Çifte temizlik', goal: { type: 'score', target: 1500 }, stars: [0, 3, 5],
      board: [
        '11.11111',
        '22.22222',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
      ],
      pieces: [[2, 4], [9, 6], [11, 1], [11, 3], [3, 5], [0, 7], [5, 2], [5, 6], [9, 5], [1, 3]] },
    { id: 'c2-08', title: 'Altılı zincir', goal: { type: 'combo', n: 6 }, stars: [0, 2, 3],
      board: [
        '1111.111',
        '........',
        '222.2222',
        '3333.333',
        '........',
        '44444.44',
        '5555555.',
        '........',
      ],
      pieces: [[23, 1], [31, 2], [24, 3], [5, 6], [16, 3], [32, 5], [21, 2], [5, 4], [19, 7], [10, 6]] },
    { id: 'c2-09', title: 'Labirent', goal: { type: 'gems' }, stars: [0, 2, 3],
      board: [
        '1111111.',
        '......1.',
        '.1111.1.',
        '.1G.1.1.',
        '.1.G1.1.',
        '.1111.1.',
        '.......1',
        'G1111111',
      ],
      pieces: [[8, 5], [26, 2], [6, 4], [20, 3], [3, 2], [6, 4], [25, 5], [11, 6], [12, 3]] },
    { id: 'c2-10', title: 'Büyük final', goal: { type: 'gems' }, stars: [0, 2, 3], master: true,
      board: [
        'G..11..G',
        '.2.33.2.',
        '..4..4..',
        '13.GG.31',
        '13.GG.31',
        '..4..4..',
        '.2.33.2.',
        'G..11..G',
      ],
      pieces: [[2, 7], [18, 1], [0, 7], [28, 1], [15, 4], [19, 1], [6, 6], [17, 5], [29, 1], [8, 4], [22, 6]] },
  ] },
];
const LEVELS = PUZZLE_GROUPS.flatMap(g => g.levels.map(l => ({ ...l, group: g })));
// two puzzle tasks are measured against the level list itself, so they follow it if levels are added
UNLOCKS.blueprint.goal = LEVELS.filter(l => l.goal.type === 'clear').length;
UNLOCKS.chess.goal = LEVELS.length * 3;
// best stars per level id; levels that have been lost once, and those later won with three stars (chalkboard theme) (saved)
// clean: levels solved with three stars in one attempt that never ran out and never used the undo (cipher theme)
let puzProg = { best: {}, lost: {}, back: {}, clean: {} };
// failed: this attempt has already run out once (an undo does not wash it out); opened: theme names a win just unlocked
let puz = { li: 0, seq: 0, gems: null, gemTotal: 0, prev: null, undoUsed: false, won: false, fail: '', stars: 0, left: 0, newBest: false, failed: false, opened: [] };
const puzLevel = () => LEVELS[puz.li];
const bestStars = id => puzProg.best[id] | 0;
const levelOpen = i => i >= 0 && i < LEVELS.length && (i === 0 || bestStars(LEVELS[i - 1].id) > 0);
const puzTotalStars = () => LEVELS.reduce((n, l) => n + bestStars(l.id), 0);
const puzSolved = () => LEVELS.filter(l => bestStars(l.id) > 0).length;
const nextLevelIndex = () => LEVELS.findIndex(l => !bestStars(l.id)); // first unsolved level, -1 when all are done
const puzStarsFor = (left, th) => left >= th[2] ? 3 : left >= th[1] ? 2 : 1;
const piecesLeft = () => puzLevel().pieces.length - moves;
const countGems = g => g ? g.reduce((n, row) => n + row.filter(Boolean).length, 0) : 0;
const SUFFIX = ["'lu", "'li", "'li", "'lü", "'lü", "'li", "'lı", "'li", "'li", "'lu"];
const comboWord = n => n + SUFFIX[n % 10];
const goalText = lv => { const g = lv.goal; return g.type === 'gems' ? 'Bütün taşları temizle' : g.type === 'clear' ? 'Tahtayı tamamen boşalt' : g.type === 'score' ? `${fmtN(g.target)} puana ulaş` : `${comboWord(g.n)} kombo yap`; };
const GOAL_ICON = {
  gems: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.6l4.6 5.1L12 21.4 7.4 7.7z" opacity=".55"/><path d="M7.4 7.7L12 2.6 3.4 7.7l8.6 13.7zM16.6 7.7L12 2.6l8.6 5.1L12 21.4z"/></svg>',
  clear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3.5" stroke-dasharray="3.4 3"/></svg>',
  score: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7z"/></svg>',
  combo: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 2L4.5 13.6h6.3L9.6 22l9.9-12.4h-6.6z"/></svg>',
};
function loadPuzzle() {
  const d = store.get(PUZ_KEY);
  if (d && d.best && typeof d.best === 'object') {
    for (const id in d.best) { const v = d.best[id] | 0; if (v > 0) puzProg.best[id] = Math.min(3, v); }
    for (const k of ['lost', 'back', 'clean']) if (d[k] && typeof d[k] === 'object') for (const id in d[k]) if (d[k][id]) puzProg[k][id] = 1;
  }
  puzCollect();
}
// the puzzle collection's counters that are read straight from the progress, so older saves count too
function puzCollect() {
  stats.puzzleBack = Math.max(stats.puzzleBack, Object.keys(puzProg.back).length);
  stats.puzzleTypes3 = Math.max(stats.puzzleTypes3, new Set(LEVELS.filter(l => bestStars(l.id) === 3).map(l => l.goal.type)).size);
  stats.puzzleClean = Math.max(stats.puzzleClean, Object.keys(puzProg.clean).length);
  stats.puzzleClear3 = Math.max(stats.puzzleClear3, LEVELS.filter(l => l.goal.type === 'clear' && bestStars(l.id) === 3).length);
  stats.puzzleStars = Math.max(stats.puzzleStars, puzTotalStars());
}
function savePuzzle() { store.set(PUZ_KEY, puzProg); }
// the level's start board, gems and an empty tray
function puzLoad(now) {
  const lv = puzLevel();
  grid = emptyGrid(); puz.gems = emptyGrid();
  lv.board.forEach((row, r) => [...row].forEach((ch, c) => {
    if (ch === '.') return;
    grid[r][c] = ch === 'G' ? (lv.gemColor || GEM_COLOR) : +ch;
    if (ch === 'G') puz.gems[r][c] = 1;
    pop[r][c] = now + 260 + (r + c) * 24;
  }));
  puz.gemTotal = countGems(puz.gems);
  puz.seq = 0; puz.prev = null; puz.undoUsed = false; puz.won = false; puz.fail = ''; puz.newBest = false; puz.failed = false; puz.opened = [];
}
// the next (up to) three pieces of the list
function puzDeal(now) {
  const list = puzLevel().pieces;
  tray = [0, 1, 2].map(i => {
    const k = puz.seq + i;
    return k < list.length ? { piece: { shape: SHAPES[list[k][0]], color: list[k][1] }, appear: now + i * 70, ret: null, fits: true } : null;
  });
  puz.seq = Math.min(list.length, puz.seq + 3);
  refreshFits();
  if (tray.some(Boolean)) Sfx.deal();
}
// where the goal stands: done, and a short label for the HUD
function puzGoal() {
  const g = puzLevel().goal;
  // word: the leading word, dropped on narrow screens where the icon says it
  const out = (done, word, rest) => ({ done, label: word + rest, html: `<span class="pw">${word}</span>${rest}` });
  if (g.type === 'gems') { const left = countGems(puz.gems); return out(!left, 'Taşlar ', `${puz.gemTotal - left} / ${puz.gemTotal}`); }
  if (g.type === 'clear') { const n = grid.reduce((k, row) => k + row.filter(Boolean).length, 0); return n ? out(false, 'Kalan ', `${n} blok`) : out(true, '', 'Tahta boş'); }
  if (g.type === 'score') return out(score >= g.target, 'Puan ', `${fmtN(score)} / ${fmtN(g.target)}`);
  return out(combo >= g.n, 'Kombo ', `${Math.min(combo, g.n)} / ${g.n}`);
}
const trayIds = () => tray.map(t => t ? { s: t.piece.shape.id, c: t.piece.color } : null);
// one undo per attempt: keep the state from before the latest move while it is still available
function puzRemember() {
  puz.prev = puz.undoUsed ? null : { grid: grid.map(r => r.slice()), gems: puz.gems.map(r => r.slice()), tray: trayIds(), score, combo, msc, moves, fulls, seq: puz.seq };
}
/* Classic second chances: three undos per game (up to three moves back) and one continue when the board locks up.
   pendingEnd: the game-over card is up but the player may still undo or continue, so the game is not counted as ended yet. */
const CLS_UNDOS = 3;
const REC_KEYS = ['bestScore', 'bestCombo', 'bestFulls', 'bestMoves', 'bestMulti', 'bestCalm']; // one-game records an undo takes back
const freshCls = () => ({ undoLeft: CLS_UNDOS, contUsed: false, hist: [], pendingEnd: false });
let cls = freshCls();
function clsRemember() {
  if (cls.undoLeft <= 0) { cls.hist = []; return; }
  cls.hist.push({
    grid: grid.map(r => r.slice()), tray: trayIds(), score, combo, msc, moves, fulls, gs: { ...gs },
    stage: theme.stage, best, newRecord, rec: Object.fromEntries(REC_KEYS.map(k => [k, stats[k]])),
  });
  while (cls.hist.length > cls.undoLeft) cls.hist.shift();
}
function readCls(d) {
  const c = freshCls();
  if (!d || typeof d !== 'object') return c;
  c.undoLeft = Math.max(0, Math.min(CLS_UNDOS, d.u == null ? CLS_UNDOS : d.u | 0));
  c.contUsed = !!d.c;
  const okGrid = g => Array.isArray(g) && g.length === N && g.every(row => Array.isArray(row) && row.length === N);
  if (Array.isArray(d.h)) c.hist = d.h.filter(p => p && okGrid(p.grid) && Array.isArray(p.tray)).slice(-c.undoLeft).map(p => ({
    grid: p.grid.map(row => row.map(v => v | 0)),
    tray: [0, 1, 2].map(i => { const t = p.tray[i]; return t && SHAPES[t.s] ? { s: t.s | 0, c: t.c | 0 } : null; }),
    score: p.score | 0, combo: p.combo | 0, msc: p.msc | 0, moves: p.moves | 0, fulls: p.fulls | 0,
    gs: p.gs && typeof p.gs === 'object' ? { multi: p.gs.multi | 0, calm: p.gs.calm | 0, broke: !!p.gs.broke, stars: p.gs.stars | 0, lines: p.gs.lines | 0, zcalm: p.gs.zcalm | 0, zrun: p.gs.zrun | 0 } : { ...gs },
    stage: p.stage | 0, best: p.best | 0, newRecord: !!p.newRecord,
    rec: Object.fromEntries(REC_KEYS.map(k => [k, p.rec && p.rec[k] != null ? +p.rec[k] || 0 : stats[k]])),
  }));
  return c;
}
const canUndo = () => !tut && (mode === 'puzzle' ? !puz.won && !puz.undoUsed && !!puz.prev : mode === 'classic' && cls.undoLeft > 0 && cls.hist.length > 0);
const canRevive = () => mode === 'classic' && !tut && !cls.contUsed;
// a saved undo state from storage, checked cell by cell
function readPrev(p, lv) {
  if (!p || typeof p !== 'object' || !Array.isArray(p.grid) || !Array.isArray(p.gems) || !Array.isArray(p.tray)) return null;
  const okGrid = g => g.length === N && g.every(row => Array.isArray(row) && row.length === N);
  if (!okGrid(p.grid) || !okGrid(p.gems)) return null;
  return {
    grid: p.grid.map(row => row.map(v => v | 0)), gems: p.gems.map(row => row.map(v => v ? 1 : 0)),
    tray: [0, 1, 2].map(i => { const t = p.tray[i]; return t && SHAPES[t.s] ? { s: t.s | 0, c: t.c | 0 } : null; }),
    score: p.score | 0, combo: p.combo | 0, msc: p.msc | 0, moves: p.moves | 0, fulls: p.fulls | 0, seq: Math.min(lv.pieces.length, p.seq | 0),
  };
}

/* ---------- Easing ---------- */
const clamp01 = t => t < 0 ? 0 : t > 1 ? 1 : t;
const outBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const outCubic = t => 1 - Math.pow(1 - t, 3);
const inOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);

/* ---------- Layout ---------- */
let DPR = 1, W = 0, H = 0, L = {}, BW = 0, BH = 0, BDPR = 1;
function layout() {
  const rect = stage.getBoundingClientRect();
  W = rect.width; H = rect.height;
  DPR = Math.min(window.devicePixelRatio || 1, 3);
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  const B = Math.min(W, H / 1.46);
  const trayH = B * 0.42, gap = B * 0.04;
  const bx = (W - B) / 2, by = Math.max(0, (H - (B + gap + trayH)) / 2);
  const pad = B * 0.03, cell = (B - 2 * pad) / N;
  L = { B, bx, by, pad, cell, gx: bx + pad, gy: by + pad, trayY: by + B + gap, trayH, slotW: B / 3 };
  L.trayCell = Math.min(cell * 0.56, (L.slotW * 0.86) / 5, (trayH * 0.86) / 5);
  sprites.clear(); gemSprites.clear();
  BW = window.innerWidth; BH = window.innerHeight;
  BDPR = Math.min(window.devicePixelRatio || 1, 2);
  bgc.width = Math.round(BW * BDPR); bgc.height = Math.round(BH * BDPR);
}

/* ---------- Block sprites (one look per theme style) ---------- */
const sprites = new Map();
function rr(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
  g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y);
  g.closePath();
}
function poly(g, pts, fill) { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = fill; g.fill(); }
function sparkle(g, x, y, r, a) {
  g.save(); g.globalAlpha = a; g.fillStyle = '#fff';
  g.beginPath();
  g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r);
  g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r);
  g.fill(); g.restore();
}
function sprite(ti, v, px, mode) {
  px = px || Math.max(8, Math.ceil(L.cell * DPR));
  mode = mode || theme.mode;
  const key = ti + '|' + v + '|' + px + '|' + mode;
  if (sprites.has(key)) return sprites.get(key);
  const th = THEMES[ti], s = px;
  const c = document.createElement('canvas'); c.width = c.height = s;
  const g = c.getContext('2d');
  if (v === 0 && mode === 'classic') {
    rr(g, s * 0.02, s * 0.02, s * 0.96, s * 0.96, s * 0.05);
    g.fillStyle = th.cell; g.fill();
    g.save(); g.clip();
    g.fillStyle = th.light ? 'rgba(0,0,0,.08)' : 'rgba(0,0,0,.24)'; g.fillRect(0, 0, s, s * 0.09); g.fillRect(0, 0, s * 0.07, s);
    g.fillStyle = th.light ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.04)'; g.fillRect(0, s * 0.93, s, s * 0.07);
    g.restore();
  } else if (v === 0) {
    if (th.style === 'neon') {
      rr(g, s * 0.1, s * 0.1, s * 0.8, s * 0.8, s * 0.14);
      g.fillStyle = rgba(th.cell, 0.6); g.fill();
      g.lineWidth = Math.max(1, s * 0.03); g.strokeStyle = shade(th.cell, 0.12); g.stroke();
    } else {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.16);
      g.fillStyle = th.cell; g.fill();
      g.save(); g.clip();
      g.fillStyle = th.light ? 'rgba(0,0,0,.08)' : 'rgba(0,0,0,.22)'; g.fillRect(0, 0, s, s * 0.14);
      g.restore();
    }
  } else {
    const col = v === GREY ? th.grey : th.blocks[v - 1];
    if (mode === 'classic') {
      // square bevelled tile, finished with the theme's own mark
      drawBlock(g, s, col, 'classic', th.style);
      if (v !== GREY) drawMotif(g, s, col, th.style);
    } else drawBlock(g, s, col, v === GREY && DULL.has(th.style) ? 'flat' : th.style);
  }
  sprites.set(key, c);
  return c;
}
// Puzzle gem: a cut stone in the theme's accent on a dark seat, so it reads on every block colour and theme
const gemSprites = new Map();
function gemSprite(ti, px) {
  const key = ti + '|' + px;
  if (gemSprites.has(key)) return gemSprites.get(key);
  const th = THEMES[ti], s = px, c = document.createElement('canvas'); c.width = c.height = s;
  const g = c.getContext('2d'), P = (x, y) => [s * x, s * y], col = th.accent;
  const seat = g.createRadialGradient(s / 2, s * 0.54, 0, s / 2, s * 0.54, s * 0.5);
  seat.addColorStop(0, 'rgba(0,0,0,.45)'); seat.addColorStop(0.6, 'rgba(0,0,0,.3)'); seat.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = seat; g.fillRect(0, 0, s, s);
  if (GEM_LOOKS[th.id]) { GEM_LOOKS[th.id](g, s, th); gemSprites.set(key, c); return c; } // the puzzle collection draws its own gem
  const OUT = [[0.31, 0.24], [0.69, 0.24], [0.85, 0.42], [0.5, 0.84], [0.15, 0.42]];
  const path = () => { g.beginPath(); OUT.forEach(([x, y], i) => i ? g.lineTo(s * x, s * y) : g.moveTo(s * x, s * y)); g.closePath(); };
  g.lineJoin = 'round';
  path(); g.lineWidth = s * 0.08; g.strokeStyle = 'rgba(0,0,0,.55)'; g.stroke();
  const gr = g.createLinearGradient(0, s * 0.24, 0, s * 0.84);
  gr.addColorStop(0, mixHex(col, '#ffffff', 0.55)); gr.addColorStop(0.4, col); gr.addColorStop(1, shade(col, -0.42));
  path(); g.fillStyle = gr; g.fill();
  poly(g, [P(0.31, 0.24), P(0.5, 0.24), P(0.38, 0.42), P(0.15, 0.42)], 'rgba(255,255,255,.4)');
  poly(g, [P(0.5, 0.24), P(0.69, 0.24), P(0.85, 0.42), P(0.62, 0.42)], 'rgba(255,255,255,.14)');
  poly(g, [P(0.15, 0.42), P(0.38, 0.42), P(0.5, 0.84)], 'rgba(255,255,255,.2)');
  poly(g, [P(0.62, 0.42), P(0.85, 0.42), P(0.5, 0.84)], 'rgba(0,0,0,.22)');
  g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = Math.max(1, s * 0.022); g.lineCap = 'round';
  g.beginPath();
  g.moveTo(...P(0.15, 0.42)); g.lineTo(...P(0.85, 0.42));
  g.moveTo(...P(0.38, 0.42)); g.lineTo(...P(0.5, 0.24)); g.lineTo(...P(0.62, 0.42));
  g.moveTo(...P(0.38, 0.42)); g.lineTo(...P(0.5, 0.84)); g.lineTo(...P(0.62, 0.42));
  g.stroke();
  path(); g.lineWidth = Math.max(1, s * 0.032); g.strokeStyle = 'rgba(255,255,255,.88)'; g.stroke();
  sparkle(g, s * 0.33, s * 0.3, s * 0.11, 0.95);
  gemSprites.set(key, c);
  return c;
}
function drawGemOn(g, ti, x, y, cs, dpr, scale = 0.86) {
  const sz = cs * scale;
  g.drawImage(gemSprite(ti, Math.max(8, Math.ceil(cs * dpr))), x + (cs - sz) / 2, y + (cs - sz) / 2, sz, sz);
}
const DULL = new Set(['neon', 'lava', 'cosmic']); function hexPath(g, x, y, r) {
  g.beginPath();
  for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i + Math.PI / 6; const px = x + r * Math.cos(a), py = y + r * Math.sin(a); i ? g.lineTo(px, py) : g.moveTo(px, py); }
  g.closePath();
}
// the theme's material laid over a classic tile
function drawMotif(g, s, c, style) {
  if (!TEX[style]) return;
  g.save(); rr(g, s * 0.012, s * 0.012, s * 0.976, s * 0.976, s * 0.05); g.clip();
  TEX[style](g, s, c, seeded(c), 0.85);
  g.restore();
}
function drawBlock(g, s, c, style, flavor) {
  if (STYLES[style]) { STYLES[style].block(g, s, c); return; }
  if (style === 'classic') {
    if (STYLES[flavor] && STYLES[flavor].tint) c = STYLES[flavor].tint(c);
    if (flavor === 'lava') c = hexOf(mixHex(c, '#2a0c06', 0.35));
    else if (flavor === 'cosmic') c = hexOf(mixHex(c, '#0a1030', 0.18));
    else if (flavor === 'frost') c = hexOf(mixHex(c, '#ffffff', 0.12));
    // square tile, near-zero gap, bevelled edges
    const o = s * 0.012, e = s - o, b = s * 0.135;
    g.save(); rr(g, o, o, e - o, e - o, s * 0.05); g.clip();
    poly(g, [[o, o], [e, o], [e - b, o + b], [o + b, o + b]], shade(c, 0.4));
    poly(g, [[o, o], [o + b, o + b], [o + b, e - b], [o, e]], shade(c, 0.18));
    poly(g, [[e, o], [e, e], [e - b, e - b], [e - b, o + b]], shade(c, -0.17));
    poly(g, [[o, e], [o + b, e - b], [e - b, e - b], [e, e]], shade(c, -0.36));
    const grad = g.createLinearGradient(0, o + b, 0, e - b);
    grad.addColorStop(0, shade(c, 0.1)); grad.addColorStop(1, shade(c, -0.05));
    g.fillStyle = grad; g.fillRect(o + b, o + b, e - o - 2 * b, e - o - 2 * b);
    g.restore();
    rr(g, o, o, e - o, e - o, s * 0.05);
    g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = Math.max(1, s * 0.02); g.stroke();
  } else if (style === 'honey') {
    rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.2); g.fillStyle = shade(c, -0.5); g.fill();
    const gr = g.createRadialGradient(s * 0.42, s * 0.36, s * 0.04, s * 0.5, s * 0.55, s * 0.62);
    gr.addColorStop(0, shade(c, 0.45)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.32));
    rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.8, s * 0.17); g.fillStyle = gr; g.fill();
    g.save(); rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.8, s * 0.17); g.clip();
    TEX.honey(g, s, c, seeded(c), 1);
    g.restore();
  } else if (style === 'gloss') {
    const r = s * 0.18;
    rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, r); g.fillStyle = shade(c, -0.34); g.fill();
    const grad = g.createLinearGradient(0, 0, 0, s);
    grad.addColorStop(0, shade(c, 0.3)); grad.addColorStop(1, c);
    rr(g, s * 0.09, s * 0.08, s * 0.82, s * 0.76, r * 0.8); g.fillStyle = grad; g.fill();
    g.globalAlpha = 0.5; rr(g, s * 0.2, s * 0.13, s * 0.6, s * 0.1, s * 0.05); g.fillStyle = '#fff'; g.fill(); g.globalAlpha = 1;
  } else if (style === 'jelly') {
    rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.28); g.fillStyle = shade(c, -0.28); g.fill();
    const grad = g.createRadialGradient(s * 0.4, s * 0.35, s * 0.05, s * 0.5, s * 0.5, s * 0.6);
    grad.addColorStop(0, shade(c, 0.35)); grad.addColorStop(1, c);
    rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.8, s * 0.24); g.fillStyle = grad; g.fill();
    g.save(); g.translate(s * 0.37, s * 0.28); g.rotate(-0.45);
    g.beginPath(); g.ellipse(0, 0, s * 0.2, s * 0.09, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.6)'; g.fill(); g.restore();
    g.beginPath(); g.arc(s * 0.7, s * 0.68, s * 0.05, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.35)'; g.fill();
  } else if (style === 'flat' || style === 'leaf') {
    rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * (style === 'leaf' ? 0.2 : 0.13)); g.fillStyle = c; g.fill();
    g.save(); g.clip(); g.fillStyle = shade(c, -0.22); g.fillRect(0, s * 0.74, s, s * 0.26);
    g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(0, 0, s * 0.12, s); g.restore();
    if (style === 'leaf') texIn(g, s, c, 'leaf', 1, 0.05, 0.2);
    else { g.globalAlpha = 0.55; rr(g, s * 0.2, s * 0.18, s * 0.14, s * 0.14, s * 0.04); g.fillStyle = '#fff'; g.fill(); g.globalAlpha = 1; }
  } else if (style === 'lava') {
    rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.12); g.fillStyle = mixHex(c, '#120604', 0.6); g.fill();
    g.save(); g.clip();
    const gr = g.createRadialGradient(s * 0.5, s * 0.52, 0, s * 0.5, s * 0.52, s * 0.62);
    gr.addColorStop(0, rgba(c, 0.85)); gr.addColorStop(1, rgba(c, 0.05));
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
    g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(0, s * 0.8, s, s * 0.2);
    g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, 0, s, s * 0.1);
    g.restore();
    texIn(g, s, c, 'lava', 1, 0.05, 0.12);
  } else if (style === 'cosmic') {
    rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.22); g.fillStyle = shade(c, -0.5); g.fill();
    const gr = g.createRadialGradient(s * 0.34, s * 0.3, s * 0.02, s * 0.5, s * 0.5, s * 0.62);
    gr.addColorStop(0, shade(c, 0.4)); gr.addColorStop(0.5, c); gr.addColorStop(1, shade(c, -0.42));
    rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.82, s * 0.2); g.fillStyle = gr; g.fill();
    texIn(g, s, c, 'cosmic', 1, 0.08, 0.2);
  } else if (style === 'gem' || style === 'frost') {
    const o = s * 0.04, e = s * 0.96, b = s * 0.24, f = s - b;
    g.save(); rr(g, o, o, e - o, e - o, s * 0.09); g.clip();
    const k = style === 'frost' ? 0.28 : 0;
    poly(g, [[o, o], [e, o], [f, b], [b, b]], shade(c, 0.42 + k * 0.5));
    poly(g, [[o, o], [b, b], [b, f], [o, e]], shade(c, 0.18 + k));
    poly(g, [[e, o], [e, e], [f, f], [f, b]], shade(c, -0.18 + k * 0.4));
    poly(g, [[o, e], [b, f], [f, f], [e, e]], shade(c, -0.38 + k * 0.3));
    const grad = g.createLinearGradient(b, b, f, f);
    grad.addColorStop(0, shade(c, 0.12 + k)); grad.addColorStop(1, shade(c, -0.05 + k * 0.6));
    g.fillStyle = grad; g.fillRect(b, b, f - b, f - b);
    g.restore();
    if (style === 'frost') {
      rr(g, o + s * 0.02, o + s * 0.02, e - o - s * 0.04, e - o - s * 0.04, s * 0.08);
      g.strokeStyle = 'rgba(255,255,255,.65)'; g.lineWidth = Math.max(1, s * 0.035); g.stroke();
      texIn(g, s, c, 'frost', 1, 0.04, 0.09);
    } else {
      texIn(g, s, c, 'gem', 1, 0.04, 0.09);
    }
  } else if (style === 'neon') {
    rr(g, s * 0.15, s * 0.15, s * 0.7, s * 0.7, s * 0.14);
    g.fillStyle = rgba(c, 0.22); g.fill();
    g.shadowColor = c; g.shadowBlur = s * 0.16;
    g.lineWidth = s * 0.075; g.strokeStyle = c; g.stroke(); g.stroke();
    g.shadowBlur = 0; g.lineWidth = Math.max(1, s * 0.025); g.strokeStyle = shade(c, 0.6); g.stroke();
  } else if (style === 'candy') {
    rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.26); g.fillStyle = shade(c, -0.15); g.fill();
    rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.83, s * 0.26); g.fillStyle = c; g.fill();
    texIn(g, s, c, 'candy', 1, 0.05, 0.26);
    g.beginPath(); g.ellipse(s * 0.36, s * 0.2, s * 0.2, s * 0.05, -0.15, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.45)'; g.fill();
  }
}

/* ---------- Extra block looks: block() is the Soft look, motif() decorates a Classic tile, tint() shifts the Classic tile colour ---------- */
const seeded = c => { let x = (parseInt(c.slice(1), 16) % 2147483646) + 1; return () => (x = (x * 16807) % 2147483647) / 2147483647; };
function inner(g, s, k = 0.13) { rr(g, s * k, s * k, s * (1 - 2 * k), s * (1 - 2 * k), s * 0.04); g.clip(); }
function beanMark(g, x, y, r, rot, fill, crease) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.beginPath(); g.ellipse(0, 0, r * 0.72, r, 0, 0, Math.PI * 2); g.fillStyle = fill; g.fill();
  g.beginPath(); g.moveTo(0, -r * 0.85); g.bezierCurveTo(r * 0.38, -r * 0.3, -r * 0.38, r * 0.3, 0, r * 0.85);
  g.strokeStyle = crease; g.lineWidth = Math.max(1, r * 0.14); g.lineCap = 'round'; g.stroke();
  g.restore();
}
function woodGrain(g, s, c, a = 1) {
  const rnd = seeded(c);
  g.strokeStyle = `rgba(90,52,20,${0.3 * a})`; g.lineWidth = Math.max(1, s * 0.022);
  for (let i = 0; i < 5; i++) {
    const y = s * (0.14 + i * 0.18) + (rnd() - 0.5) * s * 0.05;
    g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(s * 0.3, y - s * 0.06, s * 0.62, y + s * 0.07, s, y - s * 0.02); g.stroke();
  }
  g.beginPath(); g.ellipse(s * (0.5 + rnd() * 0.2), s * 0.46, s * 0.08, s * 0.045, 0, 0, Math.PI * 2); g.stroke();
}
function marbleVeins(g, s, c, a = 1) {
  const rnd = seeded(c);
  g.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const y0 = s * rnd(), y1 = s * rnd();
    g.beginPath(); g.moveTo(-s * 0.05, y0);
    g.bezierCurveTo(s * 0.3, y0 + (rnd() - 0.5) * s * 0.6, s * 0.7, y1 + (rnd() - 0.5) * s * 0.6, s * 1.05, y1);
    g.strokeStyle = i === 2 ? `rgba(206,166,60,${0.85 * a})` : `rgba(90,96,100,${0.32 * a})`;
    g.lineWidth = Math.max(1, s * (i === 2 ? 0.026 : 0.018)); g.stroke();
  }
  g.fillStyle = `rgba(214,178,70,${0.9 * a})`;
  for (let i = 0; i < 3; i++) g.fillRect(s * (0.2 + rnd() * 0.6), s * (0.2 + rnd() * 0.6), s * 0.03, s * 0.03);
}
function caneStripes(g, s, c, a = 1) {
  g.save(); g.globalAlpha = a; g.lineWidth = s * 0.13; g.strokeStyle = c;
  for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(s * k * 0.34, s * 1.05); g.lineTo(s * (1 + k * 0.34), -s * 0.05); g.stroke(); }
  g.restore();
}
function glassShine(g, s, a) {
  g.fillStyle = `rgba(255,255,255,${0.32 * a})`;
  g.beginPath(); g.moveTo(0, s * 0.6); g.lineTo(s * 0.6, 0); g.lineTo(s * 0.8, 0); g.lineTo(0, s * 0.8); g.closePath(); g.fill();
  g.fillStyle = `rgba(255,255,255,${0.2 * a})`;
  g.beginPath(); g.moveTo(0, s * 0.9); g.lineTo(s * 0.9, 0); g.lineTo(s * 0.97, 0); g.lineTo(0, s * 0.97); g.closePath(); g.fill();
}
function slimePath(g, s) {
  g.beginPath(); g.moveTo(s * 0.06, s * 0.3); g.quadraticCurveTo(s * 0.06, s * 0.05, s * 0.3, s * 0.05); g.lineTo(s * 0.7, s * 0.05);
  g.quadraticCurveTo(s * 0.94, s * 0.05, s * 0.94, s * 0.3); g.lineTo(s * 0.94, s * 0.78); g.quadraticCurveTo(s * 0.94, s * 0.9, s * 0.84, s * 0.88);
  g.quadraticCurveTo(s * 0.78, s * 0.87, s * 0.75, s * 0.9); g.arc(s * 0.69, s * 0.9, s * 0.06, 0, Math.PI);
  g.quadraticCurveTo(s * 0.58, s * 0.84, s * 0.46, s * 0.88); g.quadraticCurveTo(s * 0.36, s * 0.92, s * 0.3, s * 0.87);
  g.quadraticCurveTo(s * 0.22, s * 0.82, s * 0.15, s * 0.88); g.quadraticCurveTo(s * 0.06, s * 0.92, s * 0.06, s * 0.78); g.closePath();
}
// fruit cross-sections: rind, pith and the pattern of the flesh, keyed by block colour
const FRUIT = {
  '#ff4d5e': { rind: '#2f9e44', pith: '#e8ffd8', kind: 'seeds' },  // watermelon
  '#ff9a2a': { rind: '#e07810', kind: 'citrus' },                  // orange
  '#ffe14a': { rind: '#e8c220', kind: 'citrus' },                  // lemon
  '#8ccf3a': { rind: '#7a5a2e', pith: '#cfe8a0', kind: 'kiwi' },   // kiwi
  '#ff5ab4': { rind: '#d8247e', pith: '#ffffff', kind: 'black' },  // dragon fruit
  '#8a4ad8': { rind: '#5a2a9a', pith: '#d8c8f0', kind: 'dots' },   // grape
  '#3fbf6a': { rind: '#2a8a48', kind: 'citrus' },                  // lime
};
function fruitPattern(g, r, kind) { // centred on 0,0
  g.save();
  if (kind === 'citrus') {
    g.strokeStyle = 'rgba(255,255,240,.7)'; g.lineWidth = Math.max(1, r * 0.07);
    for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(an) * r * 0.92, Math.sin(an) * r * 0.92); g.stroke(); }
    g.beginPath(); g.arc(0, 0, r * 0.12, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,240,.85)'; g.fill();
  } else if (kind === 'seeds') {
    g.fillStyle = '#1a1010';
    for (const [an, d] of [[0.3, 0.55], [1.5, 0.6], [2.6, 0.5], [3.7, 0.62], [4.9, 0.55], [5.8, 0.3]]) {
      g.save(); g.rotate(an); g.translate(d * r, 0); g.beginPath(); g.ellipse(0, 0, r * 0.11, r * 0.065, 0, 0, Math.PI * 2); g.fill(); g.restore();
    }
  } else if (kind === 'kiwi') {
    g.beginPath(); g.ellipse(0, 0, r * 0.32, r * 0.24, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(250,255,220,.9)'; g.fill();
    g.fillStyle = '#1a1408';
    for (let i = 0; i < 12; i++) { const an = i * Math.PI / 6; g.beginPath(); g.arc(Math.cos(an) * r * 0.45, Math.sin(an) * r * 0.38, Math.max(0.7, r * 0.045), 0, Math.PI * 2); g.fill(); }
  } else {
    g.fillStyle = kind === 'black' ? '#1a1010' : 'rgba(255,255,255,.7)';
    for (let i = 0; i < 14; i++) { const an = i * 2.4, d = Math.sqrt((i + 0.5) / 14) * 0.85; g.beginPath(); g.arc(Math.cos(an) * d * r, Math.sin(an) * d * r, Math.max(0.6, r * 0.045), 0, Math.PI * 2); g.fill(); }
  }
  g.restore();
}
function fruitSlice(g, x, y, r, c, rot = 0) {
  const F = FRUIT[c] || { rind: shade(c, -0.35), kind: 'dots' };
  g.save(); g.translate(x, y); g.rotate(rot);
  g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fillStyle = F.rind; g.fill();
  g.beginPath(); g.arc(0, 0, r * 0.88, 0, Math.PI * 2); g.fillStyle = F.pith || '#fffbe8'; g.fill();
  g.beginPath(); g.arc(0, 0, r * 0.8, 0, Math.PI * 2); g.fillStyle = c; g.fill();
  fruitPattern(g, r * 0.8, F.kind);
  g.restore();
}

const STYLES = {
  gold: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.05, s * 0.92, s * 0.9, s * 0.1); g.fillStyle = shade(c, -0.5); g.fill();
      const lg = g.createLinearGradient(0, 0, s, s);
      lg.addColorStop(0, shade(c, 0.6)); lg.addColorStop(0.3, c); lg.addColorStop(0.5, shade(c, -0.18)); lg.addColorStop(0.72, shade(c, 0.3)); lg.addColorStop(1, shade(c, -0.25));
      rr(g, s * 0.06, s * 0.06, s * 0.88, s * 0.82, s * 0.09); g.fillStyle = lg; g.fill();
      texIn(g, s, c, 'gold', 1, 0.06, 0.09);
    },
  },
  glass: {
    tint: c => hexOf(mixHex(c, '#ffffff', 0.18)),
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.12); g.fillStyle = rgba(c, 0.36); g.fill();
      g.lineWidth = Math.max(1, s * 0.05); g.strokeStyle = mixHex(c, '#ffffff', 0.6); g.stroke();
      g.save(); g.clip(); glassShine(g, s, 1); g.restore();
    },
  },
  choco: {
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.08); g.fillStyle = shade(c, -0.5); g.fill();
      const o = s * 0.06, e = s * 0.94, b = s * 0.17;
      poly(g, [[o, o], [e, o], [e - b, o + b], [o + b, o + b]], shade(c, 0.22));
      poly(g, [[o, o], [o + b, o + b], [o + b, e - b], [o, e]], shade(c, 0.08));
      poly(g, [[e, o], [e, e], [e - b, e - b], [e - b, o + b]], shade(c, -0.25));
      poly(g, [[o, e], [o + b, e - b], [e - b, e - b], [e, e]], shade(c, -0.38));
      g.fillStyle = c; g.fillRect(o + b, o + b, e - o - 2 * b, e - o - 2 * b);
      texIn(g, s, c, 'choco', 1, 0.06, 0.02);
    },
  },
  slime: {
    block(g, s, c) {
      slimePath(g, s); g.fillStyle = shade(c, -0.35); g.fill();
      g.save(); g.translate(s * 0.5, s * 0.47); g.scale(0.93, 0.92); g.translate(-s * 0.5, -s * 0.5); slimePath(g, s); g.restore();
      const gr = g.createRadialGradient(s * 0.4, s * 0.33, s * 0.03, s * 0.5, s * 0.5, s * 0.6);
      gr.addColorStop(0, shade(c, 0.5)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.15));
      g.fillStyle = gr; g.fill();
      g.save(); slimePath(g, s); g.clip(); TEX.slime(g, s, c, seeded(c), 1); g.restore();
    },
  },
  wood: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.fillStyle = shade(c, -0.4); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.85, s * 0.09); g.fillStyle = c; g.fill();
      g.save(); g.clip(); woodGrain(g, s, c); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(0, 0, s, s * 0.1); g.restore();
    },
  },
  gum: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.34); g.fillStyle = shade(c, -0.22); g.fill();
      const gr = g.createRadialGradient(s * 0.38, s * 0.34, s * 0.04, s * 0.5, s * 0.52, s * 0.56);
      gr.addColorStop(0, shade(c, 0.5)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.08));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.32); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'gum', 1, 0.07, 0.32);
    },
  },
  pixel: {
    block(g, s, c) {
      const p = s / 8;
      g.fillStyle = shade(c, -0.5); g.fillRect(0, 0, s, s);
      g.fillStyle = c; g.fillRect(p * 0.6, p * 0.6, s - p * 1.2, s - p * 1.2);
      g.fillStyle = shade(c, 0.45); g.fillRect(p * 0.6, p * 0.6, s - p * 1.2, p); g.fillRect(p * 0.6, p * 0.6, p, s - p * 1.2);
      g.fillStyle = shade(c, -0.25); g.fillRect(p * 0.6, s - p * 1.6, s - p * 1.2, p); g.fillRect(s - p * 1.6, p * 0.6, p, s - p * 1.2);
      g.fillStyle = '#fff'; g.fillRect(p * 2, p * 2, p, p); g.fillRect(p * 3, p * 2, p, p); g.fillRect(p * 2, p * 3, p, p);
    },
  },
  crystal: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = shade(c, -0.45); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.1); g.fillStyle = c; g.fill();
      texIn(g, s, c, 'crystal', 1, 0.07, 0.1);
    },
  },
  bean: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.2); g.fillStyle = shade(c, -0.32); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.18);
      const lg = g.createLinearGradient(0, 0, 0, s); lg.addColorStop(0, shade(c, 0.22)); lg.addColorStop(1, c); g.fillStyle = lg; g.fill();
      texIn(g, s, c, 'bean', 1, 0.07, 0.18);
    },
  },
  pumpkin: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.08, s * 0.9, s * 0.88, s * 0.32); g.fillStyle = shade(c, -0.38); g.fill();
      const gr = g.createRadialGradient(s * 0.4, s * 0.38, s * 0.04, s * 0.5, s * 0.55, s * 0.58);
      gr.addColorStop(0, shade(c, 0.35)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.18));
      rr(g, s * 0.07, s * 0.09, s * 0.86, s * 0.82, s * 0.3); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'pumpkin', 1, 0.07, 0.3);
    },
  },
  cane: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.18); g.fillStyle = shade(c, -0.35); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.16); g.fillStyle = '#fff7f0'; g.fill();
      g.save(); g.clip(); caneStripes(g, s, c);
      rr(g, s * 0.16, s * 0.1, s * 0.68, s * 0.12, s * 0.06); g.fillStyle = 'rgba(255,255,255,.4)'; g.fill(); g.restore();
    },
  },
  marble: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08);
      const gl = g.createLinearGradient(0, 0, s, s); gl.addColorStop(0, '#f6e08a'); gl.addColorStop(0.5, '#b8902c'); gl.addColorStop(1, '#e8c860');
      g.fillStyle = gl; g.fill();
      rr(g, s * 0.09, s * 0.09, s * 0.82, s * 0.82, s * 0.05);
      const gr = g.createRadialGradient(s * 0.35, s * 0.3, s * 0.05, s * 0.5, s * 0.5, s * 0.7); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, shade(c, -0.08));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); marbleVeins(g, s, c); g.restore();
    },
  },
  paper: {
    block(g, s, c) {
      const o = s * 0.06, e = s * 0.94;
      g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(o + s * 0.02, o + s * 0.03, e - o, e - o);
      poly(g, [[o, o], [e, o], [o, e]], mixHex(c, '#ffffff', 0.14));
      poly(g, [[e, o], [e, e], [o, e]], shade(c, -0.1));
      texIn(g, s, c, 'paper', 1, 0.06, 0);
    },
  },
  fruit: {
    block(g, s, c) {
      const F = FRUIT[c] || { rind: shade(c, -0.35), kind: 'dots' };
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.22); g.fillStyle = F.rind; g.fill();
      rr(g, s * 0.1, s * 0.1, s * 0.8, s * 0.8, s * 0.17); g.fillStyle = F.pith || '#fffbe8'; g.fill();
      rr(g, s * 0.14, s * 0.14, s * 0.72, s * 0.72, s * 0.14);
      const gr = g.createRadialGradient(s * 0.5, s * 0.5, 0, s * 0.5, s * 0.5, s * 0.5); gr.addColorStop(0, mixHex(c, '#ffffff', 0.3)); gr.addColorStop(1, c);
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.fruit(g, s, c, seeded(c), 1); g.restore();
    },
  },
};

/* ---------- Material textures: each theme's block surface, no symbols. Seeded by block colour so a tile looks the same every frame ---------- */
function speckle(g, s, rnd, n, r0, r1, col) {
  for (let i = 0; i < n; i++) { g.beginPath(); g.arc(rnd() * s, rnd() * s, Math.max(0.5, s * (r0 + rnd() * (r1 - r0))), 0, Math.PI * 2); g.fillStyle = col(); g.fill(); }
}
function softGlint(g, x, y, r, a) { // round specular highlight instead of a star
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
// clip to a rounded inset and lay the theme's texture inside it
function texIn(g, s, c, style, k, x0, r) {
  g.save(); rr(g, s * x0, s * x0, s * (1 - 2 * x0), s * (1 - 2 * x0), s * r); g.clip();
  TEX[style](g, s, c, seeded(c), k);
  g.restore();
}
const TEX = {
  gloss(g, s, c, rnd, k) { g.globalAlpha = 0.45 * k; rr(g, s * 0.2, s * 0.19, s * 0.6, s * 0.11, s * 0.05); g.fillStyle = '#fff'; g.fill(); g.globalAlpha = 1; },
  jelly(g, s, c, rnd, k) {
    g.save(); g.translate(s * 0.4, s * 0.33); g.rotate(-0.45);
    g.beginPath(); g.ellipse(0, 0, s * 0.17, s * 0.07, 0, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.55 * k})`; g.fill(); g.restore();
    softGlint(g, s * 0.68, s * 0.68, s * 0.12, 0.25 * k);
  },
  neon(g, s, c) {
    rr(g, s * 0.22, s * 0.22, s * 0.56, s * 0.56, s * 0.08);
    g.shadowColor = shade(c, 0.4); g.shadowBlur = s * 0.14;
    g.strokeStyle = shade(c, 0.65); g.lineWidth = Math.max(1, s * 0.05); g.stroke(); g.stroke(); g.shadowBlur = 0;
  },
  candy(g, s, c, rnd, k) {
    g.strokeStyle = `rgba(255,255,255,${0.3 * k})`; g.lineWidth = s * 0.08;
    for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(s * i * 0.36, s); g.lineTo(s * (1 + i * 0.36), 0); g.stroke(); }
  },
  pixel(g, s, c, rnd, k) {
    const p = s / 8;
    g.fillStyle = `rgba(255,255,255,${0.85 * k})`; g.fillRect(p * 2, p * 2, p, p); g.fillRect(p * 3, p * 2, p, p); g.fillRect(p * 2, p * 3, p, p);
    g.fillStyle = `rgba(0,0,0,${0.18 * k})`; // dithered shadow in the lower right
    for (let y = 4; y < 7; y++) for (let x = 4; x < 7; x++) if ((x + y) % 2) g.fillRect(p * x, p * y, p, p);
  },
  leaf(g, s, c, rnd, k) { // leaf surface: midrib, side veins, mottled colour
    speckle(g, s, rnd, 34, 0.01, 0.035, () => rnd() < 0.5 ? `rgba(255,255,210,${0.12 * k})` : `rgba(0,40,0,${0.14 * k})`);
    const off = (rnd() - 0.5) * s * 0.3, P = t => [-s * 0.1 + off + s * 1.2 * t, s * 1.1 - s * 1.2 * t];
    g.lineCap = 'round'; g.strokeStyle = `rgba(255,255,225,${0.3 * k})`;
    g.lineWidth = Math.max(1, s * 0.022); g.beginPath(); g.moveTo(...P(0)); g.lineTo(...P(1)); g.stroke();
    g.lineWidth = Math.max(1, s * 0.011);
    for (let i = 1; i < 8; i++) {
      const [x, y] = P(i / 8);
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + s * 0.14, y + s * 0.06, x + s * 0.28, y - s * 0.02); g.stroke();
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - s * 0.06, y - s * 0.14, x + s * 0.02, y - s * 0.28); g.stroke();
    }
  },
  gem(g, s, c, rnd, k) { // facets meeting at an off-centre point, light caught in one corner
    const cx = s * (0.4 + rnd() * 0.2), cy = s * (0.4 + rnd() * 0.2), C = [[0, 0], [s, 0], [s, s], [0, s]];
    C.forEach((p, i) => poly(g, [[cx, cy], p, C[(i + 1) % 4]], i % 2 ? `rgba(0,0,0,${0.12 * k})` : `rgba(255,255,255,${0.16 * k})`));
    g.strokeStyle = `rgba(255,255,255,${0.25 * k})`; g.lineWidth = Math.max(1, s * 0.012);
    for (const p of C) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(...p); g.stroke(); }
    softGlint(g, s * 0.3, s * 0.28, s * 0.22, 0.5 * k);
  },
  frost(g, s, c, rnd, k) { // rime crystals growing across the ice
    speckle(g, s, rnd, 30, 0.004, 0.012, () => `rgba(255,255,255,${(0.2 + rnd() * 0.3) * k})`);
    g.strokeStyle = `rgba(255,255,255,${0.45 * k})`; g.lineWidth = Math.max(1, s * 0.012); g.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const x = rnd() * s, y = rnd() * s, an = rnd() * Math.PI * 2, L = s * (0.15 + rnd() * 0.2), dx = Math.cos(an), dy = Math.sin(an);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx * L, y + dy * L); g.stroke();
      for (let j = 1; j <= 3; j++) {
        const bx = x + dx * L * j / 4, by = y + dy * L * j / 4, b = L * 0.25 * (1 - j / 5);
        for (const sg of [1, -1]) { const a2 = an + sg * 0.8; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a2) * b, by + Math.sin(a2) * b); g.stroke(); }
      }
    }
    softGlint(g, s * 0.32, s * 0.28, s * 0.2, 0.35 * k);
  },
  lava(g, s, c, rnd, k) { // cooled crust broken by a network of glowing seams
    speckle(g, s, rnd, 26, 0.01, 0.03, () => `rgba(0,0,0,${0.22 * k})`);
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (let w = 0; w < 3; w++) {
      let x = rnd() * s, y = rnd() < 0.5 ? 0 : s, an = y ? -Math.PI / 2 : Math.PI / 2;
      g.beginPath(); g.moveTo(x, y);
      for (let i = 0; i < 6; i++) { an += (rnd() - 0.5) * 1.4; x += Math.cos(an) * s * 0.17; y += Math.sin(an) * s * 0.17; g.lineTo(x, y); }
      g.shadowColor = c; g.shadowBlur = s * 0.15;
      g.strokeStyle = shade(c, 0.45); g.lineWidth = Math.max(1, s * 0.045 * k); g.stroke();
      g.shadowBlur = 0; g.strokeStyle = `rgba(255,240,190,${0.85 * k})`; g.lineWidth = Math.max(1, s * 0.016); g.stroke();
    }
  },
  cosmic(g, s, c, rnd, k) { // drifting nebula clouds and pinpoint stars
    for (let i = 0; i < 3; i++) {
      const x = rnd() * s, y = rnd() * s, r = s * (0.25 + rnd() * 0.25);
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, i === 1 ? `rgba(10,10,40,${0.35 * k})` : `rgba(255,255,255,${0.22 * k})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
    }
    for (let i = 0; i < 16; i++) { g.fillStyle = `rgba(255,255,255,${(0.35 + rnd() * 0.6) * k})`; const r = Math.max(0.6, s * (0.006 + rnd() * 0.012)); g.fillRect(rnd() * s, rnd() * s, r, r); }
  },
  honey(g, s, c, rnd, k) { // deep amber with air bubbles caught inside and a liquid sheen
    const deep = g.createLinearGradient(0, 0, 0, s); deep.addColorStop(0, 'rgba(120,50,0,0)'); deep.addColorStop(1, `rgba(120,50,0,${0.3 * k})`);
    g.fillStyle = deep; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 7; i++) {
      const x = s * (0.15 + rnd() * 0.7), y = s * (0.25 + rnd() * 0.65), r = s * (0.012 + rnd() * 0.035);
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.strokeStyle = `rgba(255,240,190,${0.4 * k})`; g.lineWidth = Math.max(0.8, r * 0.3); g.stroke();
      g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, Math.max(0.5, r * 0.3), 0, Math.PI * 2); g.fillStyle = `rgba(255,255,240,${0.6 * k})`; g.fill();
    }
    g.beginPath(); g.moveTo(s * 0.12, s * 0.3); g.quadraticCurveTo(s * 0.5, s * 0.14, s * 0.88, s * 0.24);
    g.strokeStyle = `rgba(255,248,210,${0.45 * k})`; g.lineWidth = s * 0.05; g.lineCap = 'round'; g.stroke();
  },
  gold(g, s, c, rnd, k) { // brushed metal with a sweeping highlight
    for (let y = 0; y < s; y += Math.max(1, s / 30)) {
      g.fillStyle = rnd() < 0.5 ? `rgba(255,250,220,${(0.04 + rnd() * 0.12) * k})` : `rgba(90,50,0,${(0.04 + rnd() * 0.1) * k})`;
      g.fillRect(0, y, s, Math.max(1, s / 60));
    }
    const sh = g.createLinearGradient(0, 0, s, s);
    sh.addColorStop(0.2, 'rgba(255,255,240,0)'); sh.addColorStop(0.38, `rgba(255,255,240,${0.4 * k})`); sh.addColorStop(0.5, 'rgba(255,255,240,0)');
    g.fillStyle = sh; g.fillRect(0, 0, s, s);
  },
  glass(g, s, c, rnd, k) { glassShine(g, s, k); },
  choco(g, s, c, rnd, k) { // cocoa surface with a satin sheen
    speckle(g, s, rnd, 28, 0.004, 0.012, () => rnd() < 0.5 ? `rgba(0,0,0,${0.18 * k})` : `rgba(255,220,180,${0.1 * k})`);
    g.beginPath(); g.ellipse(s * 0.42, s * 0.35, s * 0.16, s * 0.045, -0.5, 0, Math.PI * 2); g.fillStyle = `rgba(255,230,200,${0.28 * k})`; g.fill();
  },
  slime(g, s, c, rnd, k) { // trapped bubbles of different sizes and a wet streak
    for (let i = 0; i < 6; i++) {
      const x = s * (0.15 + rnd() * 0.7), y = s * (0.3 + rnd() * 0.55), r = s * (0.015 + rnd() * 0.05);
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.strokeStyle = `rgba(240,255,220,${0.5 * k})`; g.lineWidth = Math.max(0.8, s * 0.018); g.stroke();
      g.beginPath(); g.arc(x - r * 0.4, y - r * 0.4, Math.max(0.5, r * 0.25), 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.7 * k})`; g.fill();
    }
    g.beginPath(); g.ellipse(s * 0.34, s * 0.24, s * 0.16, s * 0.05, -0.3, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.5 * k})`; g.fill();
  },
  wood(g, s, c, rnd, k) { woodGrain(g, s, c, k); },
  gum(g, s, c, rnd, k) { // powdered-sugar dusting and a soft matte highlight
    softGlint(g, s * 0.35, s * 0.3, s * 0.3, 0.45 * k);
    speckle(g, s, rnd, 34, 0.004, 0.01, () => `rgba(255,255,255,${(0.25 + rnd() * 0.35) * k})`);
  },
  crystal(g, s, c, rnd, k) { // amethyst cut into irregular facets
    const edge = () => (rnd() < 0.5 ? rnd() * 0.15 : 0.85 + rnd() * 0.15); // facets fan out from near a corner, not the middle
    const cx = s * edge(), cy = s * edge(), pts = [];
    for (let i = 0; i < 8; i++) { const an = (i + rnd() * 0.6) / 8 * Math.PI * 2; pts.push([cx + Math.cos(an) * s, cy + Math.sin(an) * s]); }
    pts.forEach((p, i) => {
      const a = (0.08 + rnd() * 0.25) * k;
      poly(g, [[cx, cy], p, pts[(i + 1) % 8]], i % 2 ? `rgba(255,255,255,${a})` : `rgba(20,0,40,${a})`);
    });
    g.strokeStyle = `rgba(255,240,255,${0.3 * k})`; g.lineWidth = Math.max(1, s * 0.012);
    for (const p of pts) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(...p); g.stroke(); }
    softGlint(g, cx, cy, s * 0.18, 0.5 * k);
  },
  bean(g, s, c, rnd, k) { // espresso crema: marbled swirls and fine foam
    g.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const y0 = rnd() * s, y1 = rnd() * s;
      g.beginPath(); g.moveTo(-s * 0.1, y0); g.bezierCurveTo(s * 0.35, y0 + (rnd() - 0.5) * s, s * 0.65, y1 + (rnd() - 0.5) * s, s * 1.1, y1);
      g.strokeStyle = i % 2 ? `rgba(70,35,12,${0.28 * k})` : `rgba(255,236,210,${0.32 * k})`; g.lineWidth = s * (0.03 + rnd() * 0.04); g.stroke();
    }
    speckle(g, s, rnd, 26, 0.004, 0.01, () => `rgba(255,245,230,${(0.2 + rnd() * 0.3) * k})`);
  },
  pumpkin(g, s, c, rnd, k) { // ribbed rind with a waxy shine and skin flecks
    g.strokeStyle = `rgba(120,40,0,${0.32 * k})`; g.lineWidth = Math.max(1, s * 0.028);
    for (const x of [0.22, 0.4, 0.6, 0.78]) { g.beginPath(); g.moveTo(s * x, 0); g.quadraticCurveTo(s * (x + (x - 0.5) * 0.5), s * 0.5, s * x, s); g.stroke(); }
    speckle(g, s, rnd, 20, 0.004, 0.01, () => `rgba(255,220,150,${0.3 * k})`);
    for (const x of [0.31, 0.5, 0.69]) { const gr = g.createLinearGradient(s * (x - 0.06), 0, s * (x + 0.06), 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,240,200,${0.22 * k})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(s * (x - 0.06), s * 0.1, s * 0.12, s * 0.5); }
  },
  cane(g, s, c, rnd, k) { caneStripes(g, s, '#ffffff', 0.75 * k); },
  marble(g, s, c, rnd, k) { marbleVeins(g, s, c, k); },
  paper(g, s, c, rnd, k) { // paper fibres and a crease with a light and a dark side
    g.lineCap = 'round';
    for (let i = 0; i < 50; i++) {
      const x = rnd() * s, y = rnd() * s, an = rnd() * Math.PI, L = s * (0.02 + rnd() * 0.06);
      g.strokeStyle = rnd() < 0.5 ? `rgba(255,255,255,${0.18 * k})` : `rgba(0,0,0,${0.07 * k})`; g.lineWidth = Math.max(0.6, s * 0.008);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(an) * L, y + Math.sin(an) * L); g.stroke();
    }
    const y0 = s * (0.2 + rnd() * 0.6), y1 = s * (0.2 + rnd() * 0.6), d = Math.max(1, s * 0.012);
    g.lineWidth = Math.max(1, s * 0.014);
    g.strokeStyle = `rgba(255,255,255,${0.5 * k})`; g.beginPath(); g.moveTo(0, y0); g.lineTo(s, y1); g.stroke();
    g.strokeStyle = `rgba(0,0,0,${0.16 * k})`; g.beginPath(); g.moveTo(0, y0 + d); g.lineTo(s, y1 + d); g.stroke();
  },
  fruit(g, s, c, rnd, k) { // the fruit's own flesh: pulp, seeds or skin bloom
    const kind = (FRUIT[c] || {}).kind || 'dots';
    if (kind === 'citrus') {
      for (let i = 0; i < 26; i++) { g.save(); g.translate(rnd() * s, rnd() * s); g.rotate(rnd() * Math.PI); g.beginPath(); g.ellipse(0, 0, s * 0.06, s * 0.016, 0, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,230,${0.3 * k})`; g.fill(); g.restore(); }
    } else if (kind === 'seeds') {
      speckle(g, s, rnd, 30, 0.006, 0.014, () => `rgba(255,230,230,${0.28 * k})`);
      for (let i = 0; i < 4; i++) { g.save(); g.translate(s * (0.18 + rnd() * 0.64), s * (0.18 + rnd() * 0.64)); g.rotate(rnd() * Math.PI); g.beginPath(); g.ellipse(0, 0, s * 0.055, s * 0.032, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(26,16,16,.9)'; g.fill(); g.restore(); }
    } else if (kind === 'kiwi') {
      for (let i = 0; i < 16; i++) { g.save(); g.translate(rnd() * s, rnd() * s); g.rotate(rnd() * Math.PI); g.fillStyle = `rgba(250,255,215,${0.25 * k})`; g.fillRect(-s * 0.06, -s * 0.008, s * 0.12, s * 0.016); g.restore(); }
      speckle(g, s, rnd, 18, 0.008, 0.016, () => 'rgba(26,20,8,.85)');
    } else if (kind === 'black') {
      speckle(g, s, rnd, 34, 0.006, 0.013, () => 'rgba(26,16,16,.8)');
    } else {
      g.fillStyle = `rgba(255,255,255,${0.12 * k})`; g.fillRect(0, 0, s, s);
      speckle(g, s, rnd, 24, 0.006, 0.016, () => `rgba(255,255,255,${0.22 * k})`);
    }
    g.beginPath(); g.ellipse(s * 0.32, s * 0.26, s * 0.12, s * 0.04, -0.5, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.4 * k})`; g.fill();
  },
};

/* ---------- Living backgrounds ---------- */
const AMBIENTS = {
  orbs(th) {
    const P = [...Array(7)].map((_, i) => ({ x: Math.random(), y: Math.random(), r: rand(0.18, 0.34), vx: rand(-0.014, 0.014), vy: rand(-0.012, 0.012), c: th.blocks[i % 7] }));
    return {
      step(dt) { for (const p of P) { p.x += p.vx * dt; p.y += p.vy * dt; if (p.x < -0.15 || p.x > 1.15) p.vx *= -1; if (p.y < -0.15 || p.y > 1.15) p.vy *= -1; } },
      draw(g, w, h, a) {
        const u = Math.max(w, h);
        for (const p of P) {
          const x = p.x * w, y = p.y * h, r = p.r * u;
          const gr = g.createRadialGradient(x, y, 0, x, y, r);
          gr.addColorStop(0, rgba(p.c, 0.17 * a)); gr.addColorStop(1, rgba(p.c, 0));
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
      },
    };
  },
  bubbles(th) {
    const P = [...Array(34)].map(() => ({ x: Math.random(), y: rand(0, 1.1), r: rand(0.004, 0.016), sp: rand(0.03, 0.09), ph: rand(0, 6.3), wob: rand(0.004, 0.014) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y -= p.sp * dt; p.ph += dt * 1.6; if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h) * 1.6;
        for (let i = 0; i < 4; i++) { // light shafts from the surface
          const x = w * (0.15 + i * 0.24) + Math.sin(t * 0.3 + i * 1.7) * w * 0.05;
          const gr = g.createLinearGradient(0, 0, 0, h * 0.8);
          gr.addColorStop(0, rgba(th.accent, 0.09 * a)); gr.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gr;
          g.beginPath(); g.moveTo(x - w * 0.04, 0); g.lineTo(x + w * 0.05, 0); g.lineTo(x + w * 0.16, h * 0.8); g.lineTo(x - w * 0.02, h * 0.8); g.fill();
        }
        g.lineWidth = 1.2;
        for (const p of P) {
          const x = (p.x + Math.sin(p.ph) * p.wob) * w, y = p.y * h, r = p.r * u;
          g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2);
          g.strokeStyle = `rgba(255,255,255,${0.32 * a})`; g.stroke();
          g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, Math.PI * 2);
          g.fillStyle = `rgba(255,255,255,${0.45 * a})`; g.fill();
        }
      },
    };
  },
  fireflies(th) {
    const P = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, ph: rand(0, 6.3), f: rand(0.5, 1.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt; const damp = Math.pow(0.4, dt);
        for (const p of P) {
          p.vx = (p.vx + (Math.random() - 0.5) * 0.12 * dt) * damp; p.vy = (p.vy + (Math.random() - 0.5) * 0.12 * dt) * damp;
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < -0.05) p.x = 1.05; if (p.x > 1.05) p.x = -0.05; if (p.y < -0.05) p.y = 1.05; if (p.y > 1.05) p.y = -0.05;
        }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const fog = g.createLinearGradient(0, h * 0.6, 0, h);
        fog.addColorStop(0, rgba(th.glow, 0)); fog.addColorStop(1, rgba(th.glow, 0.45 * a));
        g.fillStyle = fog; g.fillRect(0, h * 0.6, w, h * 0.4);
        g.globalCompositeOperation = 'lighter';
        for (const p of P) {
          let b = Math.max(0, Math.sin(t * p.f * 2 + p.ph)); b = b * b * b * a;
          if (b < 0.01) continue;
          const x = p.x * w, y = p.y * h, r = u * 0.05;
          const gr = g.createRadialGradient(x, y, 0, x, y, r);
          gr.addColorStop(0, rgba(th.accent, 0.5 * b)); gr.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
          g.beginPath(); g.arc(x, y, Math.max(1, u * 0.005), 0, Math.PI * 2); g.fillStyle = `rgba(255,252,210,${b})`; g.fill();
        }
        g.globalCompositeOperation = 'source-over';
      },
    };
  },
  dust(th) {
    const P = [...Array(34)].map(() => ({ x: Math.random(), y: Math.random(), vx: rand(-0.01, 0.01), vy: rand(-0.025, -0.008), r: rand(0.6, 2), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.x += p.vx * dt; p.y += p.vy * dt; p.ph += dt; if (p.y < -0.03) { p.y = 1.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const sx = w / 2, sy = h * 0.98, R = Math.max(w, h) * 0.55;
        g.save(); g.translate(sx, sy);
        for (let i = 0; i < 9; i++) {
          const ang = -Math.PI / 2 + (i - 4) * 0.28 + Math.sin(t * 0.25 + i) * 0.04;
          g.save(); g.rotate(ang);
          const gr = g.createLinearGradient(0, 0, R, 0);
          gr.addColorStop(0, rgba(th.accent, 0.14 * a)); gr.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(R, -R * 0.06); g.lineTo(R, R * 0.06); g.fill();
          g.restore();
        }
        const sun = g.createRadialGradient(0, 0, 0, 0, 0, R * 0.45);
        sun.addColorStop(0, rgba(th.accent, 0.55 * a)); sun.addColorStop(0.35, rgba('#ff9a62', 0.28 * a)); sun.addColorStop(1, rgba('#ff9a62', 0));
        g.fillStyle = sun; g.fillRect(-R, -R, 2 * R, 2 * R);
        g.restore();
        for (const p of P) {
          g.beginPath(); g.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
          g.fillStyle = `rgba(255,224,176,${(0.35 + 0.35 * Math.sin(p.ph * 2)) * a})`; g.fill();
        }
      },
    };
  },
  snow() {
    const P = [...Array(80)].map(() => { const r = rand(0.002, 0.009); return { x: Math.random(), y: Math.random(), r, sp: 0.03 + r * 6, ph: rand(0, 6.3), sw: rand(0.004, 0.02) }; });
    return {
      step(dt) { for (const p of P) { p.y += p.sp * dt; p.ph += dt * 1.2; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const hill = g.createLinearGradient(0, h * 0.75, 0, h);
        hill.addColorStop(0, 'rgba(255,255,255,0)'); hill.addColorStop(1, `rgba(255,255,255,${0.5 * a})`);
        g.fillStyle = hill; g.fillRect(0, h * 0.75, w, h * 0.25);
        for (const p of P) {
          g.beginPath(); g.arc((p.x + Math.sin(p.ph) * p.sw) * w, p.y * h, p.r * u, 0, Math.PI * 2);
          g.fillStyle = `rgba(255,255,255,${(p.r > 0.006 ? 0.6 : 0.9) * a})`; g.fill();
        }
      },
    };
  },
  grid(th) {
    const S = [...Array(40)].map(() => ({ x: Math.random(), y: Math.random() * 0.6, r: rand(0.5, 1.4), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        const hy = h * 0.68, R = Math.min(w, h) * 0.26;
        for (const s of S) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.4 * Math.sin(t * 2 + s.ph)) * a})`; g.fillRect(s.x * w, s.y * hy, s.r, s.r); }
        // synth sun
        g.save(); g.beginPath(); g.rect(0, 0, w, hy); g.clip();
        const sun = g.createLinearGradient(0, hy - R, 0, hy);
        sun.addColorStop(0, rgba('#ffd23a', 0.85 * a)); sun.addColorStop(1, rgba(th.accent, 0.85 * a));
        g.beginPath(); g.arc(w / 2, hy, R, Math.PI, 0); g.fillStyle = sun; g.fill();
        g.fillStyle = th.bg;
        for (let k = 0; k < 6; k++) { const y = hy - R * (0.08 + k * 0.13); g.fillRect(w / 2 - R, y, 2 * R, R * (0.012 + k * 0.012)); }
        g.restore();
        // floor grid
        g.fillStyle = rgba(th.bg, a); g.fillRect(0, hy, w, h - hy);
        g.save(); g.strokeStyle = rgba(th.accent, 0.55 * a); g.lineWidth = 1.2; g.shadowColor = th.accent; g.shadowBlur = 6;
        g.beginPath(); g.moveTo(0, hy); g.lineTo(w, hy); g.stroke();
        for (let i = -14; i <= 14; i++) { g.beginPath(); g.moveTo(w / 2 + i * w * 0.012, hy); g.lineTo(w / 2 + i * w * 0.13, h); g.stroke(); }
        const off = (t * 0.35) % 1;
        for (let j = 0; j < 12; j++) { const z = (j + off) / 12, y = hy + (h - hy) * z * z; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
        g.restore();
      },
    };
  },
  petals() {
    const cols = ['#fff3f6', '#ffd1de', '#ffb3c8'];
    const P = [...Array(30)].map(() => ({ x: rand(-0.2, 1), y: Math.random(), s: rand(0.008, 0.018), rot: rand(0, 6.3), vr: rand(-1.5, 1.5), vx: rand(0.01, 0.04), vy: rand(0.03, 0.07), ph: rand(0, 6.3), c: cols[(Math.random() * 3) | 0] }));
    return {
      step(dt) { for (const p of P) { p.ph += dt * 2.2; p.x += (p.vx + Math.sin(p.ph) * 0.02) * dt; p.y += p.vy * dt; p.rot += p.vr * dt; if (p.y > 1.05 || p.x > 1.1) { p.y = -0.05; p.x = rand(-0.2, 1); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h) * 1.4;
        for (const p of P) {
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(p.rot); g.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(p.ph)));
          g.beginPath(); g.ellipse(0, 0, p.s * u, p.s * u * 0.62, 0, 0, Math.PI * 2);
          g.fillStyle = rgba(p.c, 0.85 * a); g.fill(); g.restore();
        }
      },
    };
  },
  embers(th) {
    const P = [...Array(48)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(0.04, 0.13), ph: rand(0, 6.3), r: rand(0.8, 2.6), hot: Math.random() }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y -= p.vy * dt; p.ph += dt * 3; p.x += Math.sin(p.ph * 0.4) * 0.01 * dt; if (p.y < -0.03) { p.y = 1.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const pulse = 0.8 + 0.2 * Math.sin(t * 1.3);
        const lava = g.createLinearGradient(0, h * 0.55, 0, h);
        lava.addColorStop(0, rgba(th.accent, 0)); lava.addColorStop(1, rgba(th.accent, 0.32 * a * pulse));
        g.fillStyle = lava; g.fillRect(0, h * 0.55, w, h * 0.45);
        g.globalCompositeOperation = 'lighter';
        for (const p of P) {
          const fl = (0.5 + 0.5 * Math.sin(p.ph)) * a * (0.4 + 0.6 * p.y);
          g.beginPath(); g.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
          g.fillStyle = p.hot > 0.5 ? `rgba(255,210,90,${fl})` : `rgba(255,120,40,${fl})`; g.fill();
        }
        g.globalCompositeOperation = 'source-over';
      },
    };
  },
  hive(th) {
    // honeycomb wall (pre-rendered), a few cells glowing with honey, drips from the top, bees drifting about
    let comb = null, cw = 0, ch = 0, cells = [];
    const R = 26;
    function build(w, h) {
      cw = w; ch = h; cells = [];
      comb = document.createElement('canvas'); comb.width = Math.ceil(w); comb.height = Math.ceil(h);
      const g = comb.getContext('2d'), dx = R * Math.sqrt(3), dy = R * 1.5;
      g.strokeStyle = rgba(th.accent, 0.13); g.lineWidth = 2; g.lineJoin = 'round';
      for (let row = -1, y = -R; y < h + R; row++, y += dy) {
        for (let x = (row & 1) ? dx / 2 : 0; x < w + dx; x += dx) {
          hexPath(g, x, y, R - 1.5); g.stroke();
          if (Math.random() < 0.09) cells.push({ x, y, ph: rand(0, 6.3), f: rand(0.3, 0.8) });
        }
      }
    }
    const drips = [...Array(6)].map(() => ({ x: Math.random(), len: rand(0, 0.06), max: rand(0.05, 0.13), sp: rand(0.006, 0.02), drop: null }));
    const bees = [...Array(5)].map(() => ({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const d of drips) {
          if (d.drop) { d.drop.v += 1.4 * dt; d.drop.y += d.drop.v * dt; if (d.drop.y > 1.1) d.drop = null; }
          d.len += d.sp * dt;
          if (d.len > d.max) { d.drop = { y: d.len, v: 0.02 }; d.len = 0.015; d.max = rand(0.05, 0.13); d.sp = rand(0.006, 0.02); }
        }
        const damp = Math.pow(0.5, dt);
        for (const b of bees) {
          b.vx = (b.vx + (Math.random() - 0.5) * 0.5 * dt) * damp; b.vy = (b.vy + (Math.random() - 0.5) * 0.5 * dt) * damp;
          b.x += b.vx * dt; b.y += b.vy * dt; b.ph += dt * 40;
          if (b.x < -0.05) b.x = 1.05; if (b.x > 1.05) b.x = -0.05; if (b.y < -0.05) b.y = 1.05; if (b.y > 1.05) b.y = -0.05;
        }
      },
      draw(g, w, h, a) {
        if (!comb || Math.abs(w - cw) > 1 || Math.abs(h - ch) > 1) build(w, h);
        const warm = g.createLinearGradient(0, h * 0.55, 0, h);
        warm.addColorStop(0, rgba(th.accent, 0)); warm.addColorStop(1, rgba(th.accent, 0.2 * a));
        g.fillStyle = warm; g.fillRect(0, h * 0.55, w, h * 0.45);
        g.globalAlpha = a; g.drawImage(comb, 0, 0, w, h); g.globalAlpha = 1;
        for (const c of cells) {
          const k = (0.5 + 0.5 * Math.sin(t * c.f + c.ph)) * a;
          hexPath(g, c.x, c.y, R - 3);
          g.fillStyle = rgba(th.accent, 0.05 + 0.13 * k); g.fill();
        }
        const u = Math.min(w, h);
        for (const d of drips) {
          const x = d.x * w, len = d.len * h, bw = u * 0.012;
          g.fillStyle = rgba('#f2a516', 0.75 * a);
          g.beginPath(); g.moveTo(x - bw * 1.8, 0); g.quadraticCurveTo(x - bw * 0.6, len * 0.5, x - bw, len);
          g.arc(x, len, bw, Math.PI, 0, true); g.quadraticCurveTo(x + bw * 0.6, len * 0.5, x + bw * 1.8, 0); g.fill();
          g.beginPath(); g.arc(x - bw * 0.35, len - bw * 0.1, bw * 0.3, 0, Math.PI * 2); g.fillStyle = `rgba(255,248,220,${0.6 * a})`; g.fill();
          if (d.drop) {
            const y = d.drop.y * h;
            g.beginPath(); g.ellipse(x, y, bw * 0.9, bw * 1.25, 0, 0, Math.PI * 2); g.fillStyle = rgba('#f2a516', 0.7 * a); g.fill();
          }
        }
        const top =g.createLinearGradient(0, 0, 0, u * 0.025);
        top.addColorStop(0, rgba('#f2a516', 0.8 * a)); top.addColorStop(1, rgba('#f2a516', 0));
        g.fillStyle = top; g.fillRect(0, 0, w, u * 0.025);
        const bs = u * 0.016;
        for (const b of bees) {
          const x = b.x * w, y = b.y * h, dir = b.vx < 0 ? -1 : 1, flap = 0.5 + 0.5 * Math.sin(b.ph);
          g.save(); g.translate(x, y); g.scale(dir, 1);
          g.fillStyle = `rgba(255,255,255,${0.45 * a})`;
          g.beginPath(); g.ellipse(-bs * 0.2, -bs * 1.1, bs * 0.9, bs * (0.35 + 0.4 * flap), -0.4, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.ellipse(bs * 0.4, -bs * 1.0, bs * 0.7, bs * (0.3 + 0.35 * flap), 0.3, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.ellipse(0, 0, bs * 1.4, bs, 0, 0, Math.PI * 2); g.fillStyle = rgba('#ffc93a', 0.9 * a); g.fill();
          g.save(); g.clip(); g.fillStyle = rgba('#2a1703', 0.9 * a);
          g.fillRect(-bs * 0.55, -bs, bs * 0.38, bs * 2); g.fillRect(bs * 0.15, -bs, bs * 0.38, bs * 2); g.restore();
          g.restore();
        }
      },
    };
  },
  stars(th) {
    const P = [...Array(110)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.5, 1.7), ph: rand(0, 6.3), f: rand(0.5, 2) }));
    const neb = [0, 1].map(i => ({ x: rand(0.1, 0.9), y: rand(0.1, 0.9), c: th.blocks[i ? 5 : 3] }));
    let t = 0, shoot = null, wait = rand(2, 5);
    return {
      step(dt) {
        t += dt; wait -= dt;
        if (!shoot && wait < 0 && !REDUCED) { shoot = { x: rand(0.1, 0.9), y: rand(0, 0.4), life: 0 }; wait = rand(3, 7); }
        if (shoot) { shoot.life += dt; if (shoot.life > 0.8) shoot = null; }
      },
      draw(g, w, h, a) {
        const u = Math.max(w, h);
        for (const n of neb) {
          const gr = g.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, u * 0.45);
          gr.addColorStop(0, rgba(n.c, 0.12 * a)); gr.addColorStop(1, rgba(n.c, 0));
          g.fillStyle = gr; g.fillRect(0, 0, w, h);
        }
        for (const p of P) {
          g.fillStyle = `rgba(255,255,255,${(0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * p.f + p.ph))) * a})`;
          g.fillRect(p.x * w, p.y * h, p.r, p.r);
        }
        if (shoot) {
          const k = shoot.life / 0.8, x = (shoot.x + k * 0.35) * w, y = (shoot.y + k * 0.2) * h, len = u * 0.12;
          const gr = g.createLinearGradient(x, y, x - len, y - len * 0.57);
          gr.addColorStop(0, `rgba(255,255,255,${(1 - k) * a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
          g.strokeStyle = gr; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x - len, y - len * 0.57); g.stroke();
        }
      },
    };
  },
};

// drips hanging from the top edge that swell and let a drop fall (chocolate, slime)
function makeDrips(n, col) {
  const D = [...Array(n)].map(() => ({ x: Math.random(), len: rand(0, 0.06), max: rand(0.05, 0.14), sp: rand(0.006, 0.02), drop: null }));
  return {
    step(dt) {
      for (const d of D) {
        if (d.drop) { d.drop.v += 1.4 * dt; d.drop.y += d.drop.v * dt; if (d.drop.y > 1.1) d.drop = null; }
        d.len += d.sp * dt;
        if (d.len > d.max) { d.drop = { y: d.len, v: 0.02 }; d.len = 0.015; d.max = rand(0.05, 0.14); d.sp = rand(0.006, 0.02); }
      }
    },
    draw(g, w, h, a) {
      const u = Math.min(w, h), bw = u * 0.013;
      const top = g.createLinearGradient(0, 0, 0, u * 0.03); top.addColorStop(0, rgba(col, 0.85 * a)); top.addColorStop(1, rgba(col, 0));
      g.fillStyle = top; g.fillRect(0, 0, w, u * 0.03);
      for (const d of D) {
        const x = d.x * w, len = d.len * h;
        g.fillStyle = rgba(col, 0.8 * a);
        g.beginPath(); g.moveTo(x - bw * 1.8, 0); g.quadraticCurveTo(x - bw * 0.6, len * 0.5, x - bw, len);
        g.arc(x, len, bw, Math.PI, 0, true); g.quadraticCurveTo(x + bw * 0.6, len * 0.5, x + bw * 1.8, 0); g.fill();
        g.beginPath(); g.arc(x - bw * 0.35, len - bw * 0.1, bw * 0.3, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.35 * a})`; g.fill();
        if (d.drop) { g.beginPath(); g.ellipse(x, d.drop.y * h, bw * 0.9, bw * 1.25, 0, 0, Math.PI * 2); g.fillStyle = rgba(col, 0.75 * a); g.fill(); }
      }
    },
  };
}
function batShape(g, x, y, r, flap, fill, flip) {
  g.save(); g.translate(x, y); if (flip) g.scale(-1, 1);
  const wy = -r * 0.6 * flap;
  g.beginPath();
  g.moveTo(0, -r * 0.3);
  g.lineTo(r * 0.35, -r * 0.15 + wy * 0.4); g.lineTo(r * 1.15, wy - r * 0.15); g.lineTo(r * 0.9, wy + r * 0.2); g.lineTo(r * 0.6, wy * 0.6 + r * 0.15); g.lineTo(r * 0.3, r * 0.3);
  g.lineTo(0, r * 0.2);
  g.lineTo(-r * 0.3, r * 0.3); g.lineTo(-r * 0.6, wy * 0.6 + r * 0.15); g.lineTo(-r * 0.9, wy + r * 0.2); g.lineTo(-r * 1.15, wy - r * 0.15); g.lineTo(-r * 0.35, -r * 0.15 + wy * 0.4);
  g.closePath(); g.fillStyle = fill; g.fill();
  g.beginPath(); g.moveTo(-r * 0.15, -r * 0.3); g.lineTo(-r * 0.1, -r * 0.5); g.lineTo(0, -r * 0.32); g.lineTo(r * 0.1, -r * 0.5); g.lineTo(r * 0.15, -r * 0.3); g.fill();
  g.restore();
}
Object.assign(AMBIENTS, {
  coins(th) { // gold coins tumbling down, a glowing treasure pile below
    const P = [...Array(22)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.012, 0.024), vy: rand(0.05, 0.13), ph: rand(0, 6.3), sp: rand(2, 5) }));
    const G = [...Array(14)].map(() => ({ x: Math.random(), y: rand(0.75, 1), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y += p.vy * dt; p.ph += p.sp * dt; if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const pile = g.createRadialGradient(w / 2, h * 1.05, 0, w / 2, h * 1.05, Math.max(w, h) * 0.6);
        pile.addColorStop(0, rgba(th.accent, 0.38 * a)); pile.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = pile; g.fillRect(0, h * 0.4, w, h * 0.6);
        for (const s of G) { const k = Math.max(0, Math.sin(t * 1.7 + s.ph)); if (k > 0.6) sparkle(g, s.x * w, s.y * h, u * 0.02 * k, (k - 0.6) * 2.5 * a); }
        for (const p of P) {
          const x = p.x * w, y = p.y * h, r = p.r * u, sx = Math.abs(Math.cos(p.ph));
          g.beginPath(); g.ellipse(x, y, Math.max(0.8, r * sx), r, 0, 0, Math.PI * 2);
          g.fillStyle = rgba(sx > 0.3 ? '#f5c542' : '#b88a1c', 0.85 * a); g.fill();
          if (sx > 0.4) { g.beginPath(); g.ellipse(x, y, r * sx * 0.62, r * 0.62, 0, 0, Math.PI * 2); g.strokeStyle = rgba('#fff2b0', 0.6 * a); g.lineWidth = 1; g.stroke(); }
        }
      },
    };
  },
  prism(th) { // two rainbow beams through glass, glinting sparkles
    const RB = ['#ff5a6e', '#ffa64d', '#ffe45c', '#5cf08a', '#5cd6ff', '#7a7dff', '#d47aff'];
    const P = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(-0.02, -0.006), ph: rand(0, 6.3), f: rand(0.6, 1.6) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y += p.vy * dt; if (p.y < -0.03) { p.y = 1.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), len = Math.hypot(w, h);
        g.save(); g.globalCompositeOperation = 'lighter';
        for (let b = 0; b < 2; b++) {
          g.save(); g.translate(b ? w * 0.95 : w * 0.05, -h * 0.02); g.rotate((b ? 2.2 : 0.95) + Math.sin(t * 0.15 + b) * 0.05);
          RB.forEach((c, i) => {
            const gr = g.createLinearGradient(0, 0, len, 0); gr.addColorStop(0, rgba(c, 0.13 * a)); gr.addColorStop(1, rgba(c, 0));
            g.fillStyle = gr; g.fillRect(0, (i - 3.5) * u * 0.02, len, u * 0.02);
          });
          g.restore();
        }
        g.restore();
        for (const p of P) { const k = 0.5 + 0.5 * Math.sin(t * p.f * 2 + p.ph); sparkle(g, p.x * w, p.y * h, u * (0.006 + 0.01 * k), (0.25 + 0.6 * k) * a); }
      },
    };
  },
  cocoa(th) { // melting chocolate from the top, falling sprinkles
    const D = makeDrips(7, '#5a2c12');
    const SPR = ['#ff6b8a', '#ffd166', '#7ae0ff', '#a6f06b', '#ffffff', '#c58bff'];
    const P = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(0.03, 0.08), rot: rand(0, 6.3), vr: rand(-2, 2), c: SPR[(Math.random() * 6) | 0] }));
    return {
      step(dt) { D.step(dt); for (const p of P) { p.y += p.vy * dt; p.rot += p.vr * dt; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const warm = g.createLinearGradient(0, h * 0.6, 0, h); warm.addColorStop(0, rgba(th.glow, 0)); warm.addColorStop(1, rgba(th.glow, 0.5 * a));
        g.fillStyle = warm; g.fillRect(0, h * 0.6, w, h * 0.4);
        const u = Math.min(w, h), l = u * 0.012;
        g.lineCap = 'round'; g.lineWidth = Math.max(2, u * 0.008);
        for (const p of P) {
          const x = p.x * w, y = p.y * h, cx = Math.cos(p.rot) * l, cy = Math.sin(p.rot) * l;
          g.strokeStyle = rgba(p.c, 0.7 * a); g.beginPath(); g.moveTo(x - cx, y - cy); g.lineTo(x + cx, y + cy); g.stroke();
        }
        g.lineCap = 'butt';
        D.draw(g, w, h, a);
      },
    };
  },
  ooze(th) { // slime dripping from above into a bubbling pool
    const D = makeDrips(6, '#7ee03a');
    const B = [...Array(14)].map(() => ({ x: Math.random(), y: rand(0.82, 1), r: rand(0.006, 0.016), vy: rand(0.02, 0.06), life: Math.random() }));
    let t = 0;
    return {
      step(dt) { t += dt; D.step(dt); for (const b of B) { b.y -= b.vy * dt; b.life += dt * 0.4; if (b.life > 1) { b.life = 0; b.y = rand(0.88, 1); b.x = Math.random(); } } },
      draw(g, w, h, a) {
        const base = h * 0.86;
        g.beginPath(); g.moveTo(0, h);
        for (let x = 0; x <= w + 10; x += 10) g.lineTo(x, base + Math.sin(x * 0.02 + t * 1.2) * h * 0.012 + Math.sin(x * 0.047 - t * 0.8) * h * 0.008);
        g.lineTo(w, h); g.closePath();
        const gr = g.createLinearGradient(0, base, 0, h); gr.addColorStop(0, rgba('#8cf04a', 0.55 * a)); gr.addColorStop(1, rgba('#2c6e14', 0.7 * a));
        g.fillStyle = gr; g.fill();
        const u = Math.min(w, h);
        g.lineWidth = 1.5;
        for (const b of B) {
          const r = b.r * u * (0.6 + b.life * 0.6);
          g.beginPath(); g.arc(b.x * w, b.y * h, r, 0, Math.PI * 2); g.strokeStyle = `rgba(220,255,190,${0.5 * a * (1 - b.life)})`; g.stroke();
        }
        D.draw(g, w, h, a);
      },
    };
  },
  workshop() { // wooden planks, a window beam and drifting sawdust
    const P = [...Array(40)].map(() => ({ x: Math.random(), y: Math.random(), vx: rand(-0.01, 0.01), r: rand(0.6, 1.8), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.x += (p.vx + Math.sin(t * 0.5 + p.ph) * 0.006) * dt; p.y += 0.01 * dt; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } if (p.x < -0.03) p.x = 1.03; if (p.x > 1.03) p.x = -0.03; } },
      draw(g, w, h, a) {
        const pw = Math.max(60, w / 6);
        for (let i = 0; i * pw < w + pw; i++) {
          g.fillStyle = i % 2 ? `rgba(0,0,0,${0.05 * a})` : `rgba(255,255,255,${0.025 * a})`; g.fillRect(i * pw, 0, pw, h);
          g.fillStyle = `rgba(0,0,0,${0.3 * a})`; g.fillRect(i * pw, 0, 2, h);
          g.strokeStyle = `rgba(0,0,0,${0.08 * a})`; g.lineWidth = 1.2;
          for (let k = 0; k < 4; k++) { const x = i * pw + pw * (0.2 + k * 0.2); g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + pw * 0.08, h * 0.3, x - pw * 0.08, h * 0.6, x + pw * 0.03, h); g.stroke(); }
        }
        g.save(); g.translate(w * 0.8, 0); g.rotate(0.45);
        const beam = g.createLinearGradient(0, 0, 0, h * 1.2); beam.addColorStop(0, `rgba(255,217,160,${0.16 * a})`); beam.addColorStop(1, 'rgba(255,217,160,0)');
        g.fillStyle = beam; g.fillRect(-w * 0.18, 0, w * 0.36, h * 1.3); g.restore();
        for (const p of P) { g.beginPath(); g.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2); g.fillStyle = `rgba(255,226,170,${(0.3 + 0.3 * Math.sin(t * 2 + p.ph)) * a})`; g.fill(); }
      },
    };
  },
  gumballs(th) { // bubbles that blow up and pop
    const mk = () => ({ x: rand(0.05, 0.95), y: rand(0.05, 0.95), r: 0, max: rand(0.03, 0.08), sp: rand(0.01, 0.03), pop: 0, c: th.blocks[(Math.random() * 7) | 0] });
    const P = [...Array(9)].map(() => { const p = mk(); p.r = Math.random() * p.max; return p; });
    return {
      step(dt) { P.forEach((p, i) => { if (p.pop) { p.pop += dt * 3; if (p.pop > 1) P[i] = mk(); } else { p.r += p.sp * dt; p.y -= 0.01 * dt; if (p.r >= p.max) p.pop = 0.001; } }); },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const p of P) {
          const x = p.x * w, y = p.y * h, r = p.r * u;
          if (p.pop) {
            g.strokeStyle = rgba(p.c, (1 - p.pop) * 0.7 * a); g.lineWidth = 2;
            for (let k = 0; k < 8; k++) { const an = k * Math.PI / 4, r1 = r * (1 + p.pop * 0.6), r2 = r * (1.2 + p.pop); g.beginPath(); g.moveTo(x + Math.cos(an) * r1, y + Math.sin(an) * r1); g.lineTo(x + Math.cos(an) * r2, y + Math.sin(an) * r2); g.stroke(); }
            continue;
          }
          const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.05, x, y, r);
          gr.addColorStop(0, `rgba(255,255,255,${0.5 * a})`); gr.addColorStop(0.4, rgba(p.c, 0.28 * a)); gr.addColorStop(1, rgba(p.c, 0.45 * a));
          g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
          g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, r * 0.15, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.7 * a})`; g.fill();
        }
      },
    };
  },
  arcade(th) { // scrolling pixel stars, marching space invaders, scanlines
    const S = [...Array(70)].map(() => ({ x: Math.random(), y: Math.random(), z: rand(0.3, 1) }));
    const INV = ['00100000100', '00010001000', '00111111100', '01101110110', '11111111111', '10111111101', '10100000101', '00011011000'];
    let t = 0;
    return {
      step(dt) { t += dt; for (const s of S) { s.y += s.z * 0.12 * dt; if (s.y > 1) { s.y = 0; s.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), px = Math.max(2, Math.round(u * 0.006));
        for (const s of S) {
          const q = s.z > 0.7 ? px : Math.max(1, px / 2);
          g.fillStyle = `rgba(255,255,255,${(0.25 + 0.6 * s.z) * a})`; g.fillRect(Math.round(s.x * w / q) * q, Math.round(s.y * h / q) * q, q, q);
        }
        const step = Math.floor(t * 2), frame = step % 2, cw = 15 * px, ph = step % 16, march = (ph < 8 ? ph : 16 - ph) * px * 2;
        const ox = (w - 4 * cw) / 2 - 8 * px + march, oy = h * 0.06;
        const ic = [th.blocks[0], th.blocks[3], th.blocks[4], th.blocks[6]];
        for (let k = 0; k < 4; k++) {
          g.fillStyle = rgba(ic[k], 0.4 * a);
          INV.forEach((row, r) => { const rw = frame && r === 7 ? '01000000010' : row; for (let c = 0; c < 11; c++) if (rw[c] === '1') g.fillRect(ox + k * cw + c * px, oy + r * px, px, px); });
        }
        g.fillStyle = `rgba(0,0,0,${0.18 * a})`; for (let y = 0; y < h; y += 4) g.fillRect(0, y, w, 1.5);
      },
    };
  },
  cave(th) { // stalactites dripping water, glowing amethyst clusters, floating motes
    const top = [...Array(9)].map((_, i) => ({ x: (i + rand(0.1, 0.9)) / 9, len: rand(0.05, 0.14), wd: rand(0.03, 0.06) }));
    const drops = top.map(s => ({ s, y: -1, wait: rand(0.5, 5) }));
    const M = [...Array(24)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(-0.02, -0.005), ph: rand(0, 6.3) }));
    const CL = [[0.08, 1, 1], [0.92, 1, -1], [0.55, 1.02, 1]];
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const d of drops) { if (d.y < 0) { d.wait -= dt; if (d.wait < 0) d.y = d.s.len; } else { d.y += dt * 0.6; if (d.y > 1.05) { d.y = -1; d.wait = rand(1.5, 6); } } }
        for (const m of M) { m.y += m.vy * dt; if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        g.fillStyle = rgba(th.board, 0.9 * a);
        for (const s of top) { const x = s.x * w, ww = s.wd * w; g.beginPath(); g.moveTo(x - ww, 0); g.lineTo(x + ww, 0); g.lineTo(x, s.len * h); g.closePath(); g.fill(); }
        g.fillStyle = rgba('#bfe6ff', 0.7 * a);
        for (const d of drops) if (d.y >= 0) { g.beginPath(); g.ellipse(d.s.x * w, d.y * h, u * 0.004, u * 0.007, 0, 0, Math.PI * 2); g.fill(); }
        for (const [cx, cy, dir] of CL) {
          const x = cx * w, y = cy * h, R = u * 0.32, pulse = 0.75 + 0.25 * Math.sin(t * 1.2 + cx * 5);
          const gl = g.createRadialGradient(x, y, 0, x, y, R); gl.addColorStop(0, rgba(th.accent, 0.35 * a * pulse)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - R, y - R, 2 * R, 2 * R);
          for (let k = -2; k <= 2; k++) {
            const len = u * (0.16 - Math.abs(k) * 0.025), wd = u * 0.022;
            g.save(); g.translate(x + k * u * 0.03, y); g.rotate(k * 0.3 * dir);
            poly(g, [[-wd, 0], [-wd, -len], [0, -len - wd * 1.6], [0, 0]], rgba('#e6b8ff', 0.6 * a));
            poly(g, [[0, 0], [0, -len - wd * 1.6], [wd, -len], [wd, 0]], rgba('#8a4ad8', 0.7 * a));
            g.restore();
          }
        }
        for (const m of M) { const k = 0.5 + 0.5 * Math.sin(t * 2 + m.ph); g.beginPath(); g.arc(m.x * w, m.y * h, 1 + k * 1.5, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, (0.2 + 0.5 * k) * a); g.fill(); }
      },
    };
  },
  steam(th) { // steam rising from below, coffee beans drifting, warm cafe light
    const W3 = [0.2, 0.5, 0.8].map(x => ({ x, P: [] }));
    const BE = [...Array(10)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(0.015, 0.035), rot: rand(0, 6.3), vr: rand(-0.6, 0.6) }));
    let t = 0, acc = 0;
    return {
      step(dt) {
        t += dt; acc += dt;
        if (acc > 0.25) { acc = 0; for (const s of W3) s.P.push({ y: 1.02, life: 0, ph: rand(0, 6.3) }); }
        for (const s of W3) { for (const p of s.P) { p.y -= 0.12 * dt; p.life += dt / 6; } s.P = s.P.filter(p => p.life < 1); }
        for (const b of BE) { b.y += b.vy * dt; b.rot += b.vr * dt; if (b.y > 1.04) { b.y = -0.04; b.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const warm = g.createRadialGradient(w / 2, h, 0, w / 2, h, Math.max(w, h) * 0.7); warm.addColorStop(0, rgba(th.accent, 0.22 * a)); warm.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = warm; g.fillRect(0, 0, w, h);
        for (const b of BE) beanMark(g, b.x * w, b.y * h, u * 0.018, b.rot, rgba('#2a160c', 0.6 * a), rgba('#8a5a3a', 0.55 * a));
        for (const s of W3) for (const p of s.P) {
          const x = (s.x + Math.sin(p.y * 7 + t * 0.6 + p.ph * 0.2) * 0.035) * w, y = p.y * h, r = u * (0.03 + p.life * 0.09);
          const al = Math.sin(p.life * Math.PI) * 0.07 * a;
          const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,245,235,${al})`); gr.addColorStop(1, 'rgba(255,245,235,0)');
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
      },
    };
  },
  night() { // full moon, flapping bats, drifting fog
    const ST = [...Array(50)].map(() => ({ x: Math.random(), y: Math.random() * 0.6, ph: rand(0, 6.3) }));
    const BT = [...Array(6)].map(() => ({ x: Math.random(), y: rand(0.1, 0.5), vx: rand(0.04, 0.09) * (Math.random() < 0.5 ? -1 : 1), ph: rand(0, 6.3), s: rand(0.7, 1.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const b of BT) { b.x += b.vx * dt; b.y += Math.sin(t * 2 + b.ph) * 0.02 * dt; b.ph += dt * 14; if (b.x > 1.1) b.x = -0.1; if (b.x < -0.1) b.x = 1.1; } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const s of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.4 * Math.sin(t * 1.5 + s.ph)) * a})`; g.fillRect(s.x * w, s.y * h, 1.5, 1.5); }
        const mx = w * 0.78, my = h * 0.13, mr = u * 0.11;
        const gl = g.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 3.2); gl.addColorStop(0, `rgba(255,230,176,${0.25 * a})`); gl.addColorStop(1, 'rgba(255,230,176,0)');
        g.fillStyle = gl; g.fillRect(mx - mr * 3.2, my - mr * 3.2, mr * 6.4, mr * 6.4);
        g.beginPath(); g.arc(mx, my, mr, 0, Math.PI * 2); g.fillStyle = `rgba(255,240,200,${0.92 * a})`; g.fill();
        g.fillStyle = `rgba(232,212,160,${0.5 * a})`;
        for (const [dx, dy, r] of [[-0.3, -0.2, 0.18], [0.25, 0.15, 0.24], [-0.1, 0.4, 0.12]]) { g.beginPath(); g.arc(mx + dx * mr, my + dy * mr, r * mr, 0, Math.PI * 2); g.fill(); }
        for (const b of BT) batShape(g, b.x * w, b.y * h, u * 0.03 * b.s, Math.sin(b.ph), `rgba(10,5,16,${0.9 * a})`, b.vx < 0);
        for (let i = 0; i < 3; i++) {
          const y = h * (0.78 + i * 0.08), off = Math.sin(t * 0.2 + i) * w * 0.1;
          const gr = g.createLinearGradient(0, y - h * 0.08, 0, y + h * 0.08);
          gr.addColorStop(0, 'rgba(180,160,200,0)'); gr.addColorStop(0.5, `rgba(180,160,200,${0.1 * a})`); gr.addColorStop(1, 'rgba(180,160,200,0)');
          g.fillStyle = gr; g.fillRect(off - w * 0.2, y - h * 0.08, w * 1.4, h * 0.16);
        }
      },
    };
  },
  lights() { // a string of twinkling bulbs and falling snow
    const BUL = ['#ff4a5a', '#ffd25a', '#4ad08a', '#5ab0ff', '#ff8ad0'];
    const SN = [...Array(60)].map(() => { const r = rand(0.002, 0.007); return { x: Math.random(), y: Math.random(), r, sp: 0.03 + r * 6, ph: rand(0, 6.3) }; });
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of SN) { p.y += p.sp * dt; p.ph += dt * 1.2; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sag = h * 0.06, wireY = x => h * 0.02 + Math.pow(Math.sin(x * Math.PI * 3), 2) * sag;
        g.strokeStyle = `rgba(10,26,16,${0.9 * a})`; g.lineWidth = 2; g.beginPath();
        for (let i = 0; i <= 60; i++) { const x = i / 60; i ? g.lineTo(x * w, wireY(x)) : g.moveTo(0, wireY(0)); }
        g.stroke();
        const n = Math.max(8, Math.round(w / 45));
        for (let i = 0; i < n; i++) {
          const fx = (i + 0.5) / n, x = fx * w, y = wireY(fx) + u * 0.014, c = BUL[i % BUL.length], k = 0.55 + 0.45 * Math.sin(t * 3 + i * 1.7);
          const R = u * 0.05 * k, gl = g.createRadialGradient(x, y, 0, x, y, R); gl.addColorStop(0, rgba(c, 0.5 * a * k)); gl.addColorStop(1, rgba(c, 0));
          g.fillStyle = gl; g.fillRect(x - R, y - R, 2 * R, 2 * R);
          g.beginPath(); g.ellipse(x, y, u * 0.008, u * 0.013, 0, 0, Math.PI * 2); g.fillStyle = rgba(c, (0.6 + 0.4 * k) * a); g.fill();
        }
        for (const p of SN) { g.beginPath(); g.arc((p.x + Math.sin(p.ph) * 0.01) * w, p.y * h, p.r * u, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.8 * a})`; g.fill(); }
      },
    };
  },
  luxe(th) { // art deco sunburst, gold corner frames, floating gold leaf
    const P = [...Array(40)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(-0.015, -0.004), ph: rand(0, 6.3), f: rand(1, 3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y += p.vy * dt; p.x += Math.sin(t * 0.4 + p.ph) * 0.004 * dt; if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), cx = w / 2, cy = h * 1.02, R = Math.hypot(w, h);
        g.strokeStyle = rgba(th.accent, 0.13 * a); g.lineWidth = 1;
        for (let i = 0; i <= 24; i++) { const an = Math.PI + (i / 24) * Math.PI; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an) * R, cy + Math.sin(an) * R); g.stroke(); }
        for (let k = 1; k <= 4; k++) { g.beginPath(); g.arc(cx, cy, u * 0.22 * k, Math.PI, 0); g.stroke(); }
        g.strokeStyle = rgba(th.accent, 0.35 * a); g.lineWidth = 1.5;
        const m = u * 0.04, L3 = u * 0.18;
        for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
          const x = sx > 0 ? m : w - m, y = sy > 0 ? m : h - m;
          g.beginPath(); g.moveTo(x, y + sy * L3); g.lineTo(x, y); g.lineTo(x + sx * L3, y); g.stroke();
          g.beginPath(); g.moveTo(x + sx * 6, y + sy * L3 * 0.6); g.lineTo(x + sx * 6, y + sy * 6); g.lineTo(x + sx * L3 * 0.6, y + sy * 6); g.stroke();
        }
        for (const p of P) {
          const k = Math.max(0, Math.sin(t * p.f + p.ph)), sz = 1.5 + k * 2;
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(t * 0.5 + p.ph);
          g.fillStyle = rgba('#f0d27a', (0.25 + 0.65 * k) * a); g.fillRect(-sz / 2, -sz / 2, sz, sz * (0.3 + 0.7 * Math.abs(Math.cos(t + p.ph))));
          g.restore();
        }
      },
    };
  },
  cranes(th) { // paper planes gliding over lined paper
    const mk = () => ({ x: rand(-0.3, 0), y: rand(0.05, 0.85), vx: rand(0.04, 0.08), vy: rand(-0.01, 0.015), s: rand(0.7, 1.4), ph: rand(0, 6.3), c: th.blocks[(Math.random() * 7) | 0] });
    const P = [...Array(7)].map(() => { const p = mk(); p.x = Math.random(); return p; });
    let t = 0;
    return {
      step(dt) { t += dt; P.forEach((p, i) => { p.x += p.vx * dt; p.y += (p.vy + Math.sin(t * 0.8 + p.ph) * 0.01) * dt; if (p.x > 1.2) P[i] = mk(); }); },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        g.strokeStyle = `rgba(138,122,90,${0.1 * a})`; g.lineWidth = 1;
        for (let y = u * 0.05; y < h; y += u * 0.06) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
        g.strokeStyle = `rgba(226,85,58,${0.15 * a})`; g.beginPath(); g.moveTo(u * 0.12, 0); g.lineTo(u * 0.12, h); g.stroke();
        for (const p of P) {
          const r = u * 0.05 * p.s, tilt = Math.sin(t * 0.8 + p.ph) * 0.15 - 0.1;
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(tilt);
          poly(g, [[r, 0], [-r, -r * 0.45], [-r * 0.55, 0]], rgba(p.c, 0.55 * a));
          poly(g, [[r, 0], [-r * 0.55, 0], [-r * 0.85, r * 0.35]], rgba(p.c, 0.85 * a));
          poly(g, [[r, 0], [-r * 0.55, 0], [-r * 0.2, r * 0.12]], `rgba(0,0,0,${0.15 * a})`);
          g.restore();
        }
      },
    };
  },
  summer(th) { // sun rays, fruit slices floating, fizzy bubbles
    const P = [...Array(9)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(0.015, 0.035), rot: rand(0, 6.3), vr: rand(-0.4, 0.4), r: rand(0.04, 0.07), c: th.blocks[(Math.random() * 7) | 0] }));
    const B = [...Array(24)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.003, 0.008), vy: rand(0.03, 0.08), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const p of P) { p.y += p.vy * dt; p.rot += p.vr * dt; if (p.y > 1.1) { p.y = -0.1; p.x = Math.random(); } }
        for (const b of B) { b.y -= b.vy * dt; b.ph += dt * 2; if (b.y < -0.02) { b.y = 1.02; b.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), len = Math.hypot(w, h);
        g.save(); g.translate(w, 0);
        for (let i = 0; i < 7; i++) {
          g.save(); g.rotate(Math.PI / 2 + 0.1 + i * 0.2 + Math.sin(t * 0.2) * 0.03);
          const gr = g.createLinearGradient(0, 0, len, 0); gr.addColorStop(0, `rgba(255,255,230,${0.35 * a})`); gr.addColorStop(1, 'rgba(255,255,230,0)');
          g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(len, -len * 0.04); g.lineTo(len, len * 0.04); g.fill();
          g.restore();
        }
        g.restore();
        for (const p of P) { g.save(); g.globalAlpha = 0.5 * a; fruitSlice(g, p.x * w, p.y * h, p.r * u, p.c, p.rot); g.restore(); }
        g.lineWidth = 1.2;
        for (const b of B) { g.beginPath(); g.arc((b.x + Math.sin(b.ph) * 0.008) * w, b.y * h, b.r * u, 0, Math.PI * 2); g.strokeStyle = `rgba(255,255,255,${0.6 * a})`; g.stroke(); }
      },
    };
  },
});

function paintBase(g, th, w, h, a) {
  g.globalAlpha = a;
  const R = Math.hypot(w, h) * 0.8;
  const gr = g.createRadialGradient(w / 2, h * 0.14, 0, w / 2, h * 0.14, R);
  gr.addColorStop(0, th.glow); gr.addColorStop(0.72, th.bg); gr.addColorStop(1, th.bg);
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.globalAlpha = 1;
}
function drawBg(now, dt) {
  const g = bctx;
  g.setTransform(BDPR, 0, 0, BDPR, 0, 0);
  const m = inOut(clamp01((now - theme.t0) / THEME_DUR));
  const sdt = REDUCED ? dt * 0.15 : dt;
  if (m < 1 && ambPrev) {
    paintBase(g, THEMES[theme.prev], BW, BH, 1);
    ambPrev.step(sdt); ambPrev.draw(g, BW, BH, 1 - m);
    paintBase(g, TH(), BW, BH, m);
  } else {
    ambPrev = null;
    paintBase(g, TH(), BW, BH, 1);
  }
  ambCur.step(sdt); ambCur.draw(g, BW, BH, theme.prev === theme.cur ? 1 : m);
}

/* ---------- Theme switching ---------- */
function applyDomColors(now) {
  const m = clamp01((now - theme.t0) / THEME_DUR);
  if (m >= 1 && theme.domDone) return;
  const a = THEMES[theme.prev], b = TH(), e = inOut(m), st = document.documentElement.style;
  const mixK = k => (a[k].startsWith('#') && b[k].startsWith('#')) ? mixHex(a[k], b[k], e) : (e < 0.5 ? a[k] : b[k]);
  for (const k of ['bg', 'board', 'fg', 'muted', 'accent', 'ink', 'btn']) st.setProperty('--' + k, mixK(k));
  st.setProperty('--surface', e < 0.5 ? a.surface : b.surface);
  st.colorScheme = b.light ? 'light' : 'dark';
  metaTheme.content = mixK('bg');
  theme.domDone = m >= 1;
}
function setTheme(i, now, { show = true, sound = true, unlocked = false, finale = false } = {}) {
  if (i === theme.cur && now - theme.t0 >= THEME_DUR && !unlocked) return;
  theme.prev = theme.cur; theme.cur = i; theme.t0 = now; theme.domDone = false; theme.prevMode = theme.mode;
  ambPrev = ambCur; ambCur = AMBIENTS[THEMES[i].amb](THEMES[i]);
  Sfx.snd = THEMES[i].snd;
  if (show) {
    banner = { name: THEMES[i].name, sub: finale ? FINALES[THEMES[i].id] || 'KOLEKSİYON FİNALİ' : unlocked ? 'YENİ TEMA AÇILDI' : 'TEMA', t0: now + 120, dur: finale ? 3600 : unlocked ? 2300 : 1900 };
    burst(now);
  }
  if (sound) { Sfx.themeChange(); buzz([12, 50, 12]); }
  updateRing();
}
function snapTheme(i) { // instant, no animation
  theme.prev = theme.cur = i; theme.t0 = -1e9; theme.domDone = false; theme.prevMode = theme.mode;
  ambCur = AMBIENTS[THEMES[i].amb](THEMES[i]); ambPrev = null;
  Sfx.snd = THEMES[i].snd;
}
function burst(now) {
  if (REDUCED) return;
  const th = TH(), cx = L.bx + L.B / 2, cy = L.by + L.B / 2;
  for (let i = 0; i < 36; i++) {
    const ang = Math.random() * Math.PI * 2, v = rand(0.8, 2.2) * L.cell * 4;
    particles.push(fxParticle(th.fx, { x: cx, y: cy, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - L.cell * 3, life: -0.12, max: rand(0.7, 1.1),
      size: L.cell * rand(0.12, 0.24), rot: Math.random() * 6, vr: rand(-8, 8), color: i % 3 ? th.blocks[i % 7] : th.accent }));
  }
}
function pickStartTheme() {
  if (!settings.auto) return settings.fixed;
  const pool = [...discovered];
  if (pool.length <= 1) return pool[0] || 0;
  const others = pool.filter(i => i !== theme.cur);
  return others[(Math.random() * others.length) | 0];
}
function updateRing() {
  const r = $('ringRect');
  if (!settings.auto || mode === 'puzzle') { r.style.strokeDashoffset = 100; return; } // a puzzle level never changes the theme
  const a = milestone(theme.stage), b = milestone(theme.stage + 1);
  r.style.strokeDashoffset = 100 * (1 - clamp01((score - a) / (b - a)));
}
function saveMeta() { store.set(THEME_KEY, { v: META_V, disc: [...earned], fresh: [...fresh], auto: settings.auto, fixed: settings.fixed, block: settings.block }); }
function setBlockMode(mode, now) {
  if (mode === theme.mode) return;
  settings.block = mode; saveMeta();
  theme.prevMode = theme.mode; theme.mode = mode;
  theme.prev = theme.cur; theme.t0 = now; ambPrev = null;
  if (Sfx.ok()) { Sfx.hiss({ dur: 0.5, vol: 0.06, type: 'bandpass', freq: 600, to: 5000, q: 0.8 }); Sfx.note(Sfx.snd.root, { when: 0.15, vol: 0.1 }); }
  buzz(12);
}

/* ---------- Game flow ---------- */
function deal(now = performance.now()) {
  const set = colorize(generateSet(grid, moves));
  tray = set.map((piece, i) => ({ piece, appear: now + i * 70, ret: null, fits: true }));
  refreshFits();
  Sfx.deal();
}
function refreshFits() {
  const [lo, hi] = bitsOf(grid);
  for (const t of tray) if (t) t.fits = fitsAnywhere(lo, hi, t.piece.shape);
}
// One played game, counted once when a classic or daily game ends with at least one piece placed.
// Counting at the start let empty games (new game spam, in and out of the menu) open the "play N games" themes.
function countGame() {
  if (mode === 'zen' || mode === 'puzzle' || moves < 1) return;
  touchDay();
  stats.todayGames++; stats.bestDayGames = Math.max(stats.bestDayGames, stats.todayGames); stats.games++;
}
function newGame() {
  endClassic();
  if (grid && !over && !tut) countGame(); // the game on the board is given up: it counts if a piece was placed
  const now = performance.now();
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (grid && grid[r][c]) clearing.push({ r, c, v: grid[r][c], t0: now, delay: (r + c) * 18, spawned: true });
  }
  grid = emptyGrid();
  const pz = mode === 'puzzle';
  if (pz) { puzLoad(now); dealRng = null; }
  else if (mode === 'daily') {
    gameDay = dayKey();
    const info = dailyStart(gameDay);
    dealRng = dealStream(dailySeed(gameDay));
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (info.grid[r][c]) { grid[r][c] = info.grid[r][c]; pop[r][c] = now + 260 + (r + c) * 24; }
    const rec = dayRec(gameDay);
    if (!rec.tries) stats.dailyDays++;
    rec.tries++; stats.dailyGames++;
    saveDaily();
  } else dealRng = null;
  score = 0; displayScore = 0; combo = 0; msc = 0; moves = 0; fulls = 0; over = false; newRecord = false; pendingTheme = null;
  cls = freshCls();
  $('over').hidden = true;
  cancelBreath();
  gs = { multi: 0, calm: 0, broke: false, stars: 0, lines: 0, zcalm: 0, zrun: 0 };
  if (pz) { // a level keeps the theme the player is in, and counts nowhere but in the puzzle stats
    theme.stage = 0;
    puzDeal(now + 200);
    stats.puzzleTries++;
    store.set(STATS_KEY, stats);
    playHeldUnlock(now + 200);
    updateHud();
    save();
    return;
  }
  const start = pickStartTheme();
  theme.start = start; theme.stage = 0;
  if (start !== theme.cur) setTheme(start, now + 150, { show: true, sound: false });
  deal(now + 200);
  touchDay();
  if (mode === 'zen') stats.zenSessions++; // a zen session never ends, so it does not count as a played game
  // classic and daily games are counted when they end (countGame), not here
  store.set(STATS_KEY, stats);
  checkUnlocks(now + 400);
  playHeldUnlock(now + 600);
  updateHud();
  save();
}
function save() {
  store.set(saveKey(), snapshot());
  store.set(BEST_KEY, best);
}
function snapshot() {
  return {
    mode, day: mode === 'daily' ? gameDay : 0, rs: dealRng ? dealRng.s : null,
    grid, score, combo, msc, moves, fulls, gs,
    tray: tray.map(t => t ? { s: t.piece.shape.id, c: t.piece.color } : null),
    th: { cur: theme.cur, start: theme.start, stage: theme.stage },
    ...(mode === 'classic' ? { cls: { u: cls.undoLeft, c: cls.contUsed, h: cls.hist } } : {}),
    ...(mode === 'puzzle' && puz.gems ? { puz: { id: puzLevel().id, n: puzLevel().pieces.length, seq: puz.seq, gems: puz.gems, undoUsed: puz.undoUsed, prev: puz.prev, failed: puz.failed } } : {}),
  };
}
// keepTheme: entering puzzle from another mode keeps the theme on screen instead of the one saved with the level
function restore(d, keepTheme = false) {
  if (!d || !Array.isArray(d.grid) || !Array.isArray(d.tray)) return false;
  if (d.mode === 'puzzle') {
    const p = d.puz, li = p ? LEVELS.findIndex(l => l.id === p.id) : -1;
    if (li < 0 || p.n !== LEVELS[li].pieces.length || !Array.isArray(p.gems) || p.gems.length !== N) return false; // a level that changed since the save starts fresh
    mode = 'puzzle'; dealRng = null;
    puz = { li, seq: Math.min(LEVELS[li].pieces.length, p.seq | 0), gems: p.gems.map(row => [...Array(N)].map((_, c) => row && row[c] ? 1 : 0)), gemTotal: 0,
      prev: null, undoUsed: !!p.undoUsed, won: false, fail: '', stars: 0, left: 0, newBest: false, failed: !!p.failed, opened: [] };
    puz.gemTotal = LEVELS[li].board.join('').split('G').length - 1;
    puz.prev = puz.undoUsed ? null : readPrev(p.prev, LEVELS[li]);
  } else if (d.mode === 'daily') {
    if (!(d.day > 20000000) || typeof d.rs !== 'number') return false;
    mode = 'daily'; gameDay = d.day | 0; dealRng = dealStream(d.rs);
  } else { mode = d.mode === 'zen' ? 'zen' : 'classic'; dealRng = null; }
  if (mode === 'classic') cls = readCls(d.cls);
  cancelBreath();
  goalShown = 0; // stars of a restored game light up without the pop
  // v1 saves stored hex colors; map them to color slots
  const conv = v => typeof v === 'string' ? (OLD_COLORS.indexOf(v) + 1 || 1) : (v | 0);
  grid = d.grid.map(row => row.map(v => v ? conv(v) : 0));
  score = d.score | 0; combo = d.combo | 0; msc = d.msc | 0; over = false; newRecord = false;
  moves = d.moves != null ? d.moves | 0 : Math.round(score / 18); fulls = d.fulls | 0;
  gs = d.gs && typeof d.gs === 'object' ? { multi: d.gs.multi | 0, calm: d.gs.calm | 0, broke: !!d.gs.broke, stars: d.gs.stars | 0, lines: d.gs.lines | 0, zcalm: d.gs.zcalm | 0, zrun: d.gs.zrun | 0 } : { multi: 0, calm: 0, broke: true, stars: 0, lines: 0, zcalm: 0, zrun: 0 };
  const now = performance.now();
  tray = [0, 1, 2].map(i => { const t = d.tray[i]; return t && SHAPES[t.s] ? { piece: { shape: SHAPES[t.s], color: conv(t.c) }, appear: now + i * 70, ret: null, fits: true } : null; });
  if (tray.every(t => !t)) { if (mode === 'puzzle') puzDeal(now); else deal(now); }
  const open = i => discovered.has(i) ? i : 0;
  if (mode === 'puzzle' && keepTheme) { if (!settings.auto && settings.fixed !== theme.cur) snapTheme(settings.fixed); }
  else if (d.th) { theme.start = open(d.th.start | 0); theme.stage = d.th.stage | 0; snapTheme(settings.auto ? open((d.th.cur | 0) % T) : settings.fixed); }
  else { theme.start = 0; theme.stage = stageAt(score); snapTheme(settings.auto ? autoTheme(theme.stage) : settings.fixed); }
  refreshFits();
  displayScore = score;
  return true;
}

// Move between classic and daily. Each mode has its own save, so the game being left is kept and the other one is picked up.
function switchMode(m) {
  if (m === mode) {
    if (m === 'daily' && gameDay !== dayKey()) newGame(); // a daily from an earlier day: today's board instead
    return;
  }
  endClassic();
  if (!over && grid) save();
  mode = m; store.set(MODE_KEY, m);
  pendingTheme = null; banner = null; texts = []; shake = null; flash = null; drag = null;
  over = false; $('over').hidden = true;
  cancelBreath();
  const d = store.get(saveKey());
  if (d && (d.mode || 'classic') === m && (m !== 'daily' || d.day === dayKey()) && restore(d, m === 'puzzle')) { refreshFits(); updateHud(); checkOver(performance.now()); }
  else {
    mode = m;
    moves = 0; // the board still in memory is the game of the mode just left: it was saved, not given up, so newGame must not count it
    if (m === 'puzzle') { const n = nextLevelIndex(); puz.li = n < 0 ? 0 : n; }
    newGame();
  }
  if (!over) playHeldUnlock(performance.now() + 300);
  applyPrefs(); // zen plays a little quieter
}
// Start a puzzle level from the level list, the menu or the win card. A half-played level of another number is dropped.
function startLevel(li) {
  if (!levelOpen(li)) return;
  Sfx.unlock(); Sfx.pick(); buzz(10);
  const firstRun = !store.get(TUT_KEY);
  if (mode !== 'puzzle') {
    endClassic();
    if (!over && grid) save();
    mode = 'puzzle'; store.set(MODE_KEY, 'puzzle');
    pendingTheme = null; banner = null; shake = null; flash = null; drag = null;
    cancelBreath();
  }
  texts = []; over = false; $('over').hidden = true;
  puz.li = li;
  newGame();
  applyPrefs();
  closeLevels(); closeMenu();
  if (firstRun) startTutorial();
}

function placePiece(slot, r0, c0) {
  const now = performance.now();
  const pz = mode === 'puzzle';
  if (pz) puzRemember();
  else if (mode === 'classic') clsRemember();
  const { shape, color } = tray[slot].piece;
  tray[slot] = null;
  for (const [dr, dc] of shape.cells) {
    grid[r0 + dr][c0 + dc] = color;
    pop[r0 + dr][c0 + dc] = now + (dr + dc) * 16;
  }
  let gained = 0; moves++;
  const lvlBefore = levelOf(score);

  const rows = [], cols = [];
  for (let r = 0; r < N; r++) if (grid[r].every(Boolean)) rows.push(r);
  for (let c = 0; c < N; c++) if (grid.every(row => row[c])) cols.push(c);
  const lines = rows.length + cols.length;
  const pcx = L.gx + (c0 + shape.w / 2) * L.cell, pcy = L.gy + (r0 + shape.h / 2) * L.cell;
  const midX = L.gx + L.B / 2 - L.pad;

  if (lines) {
    combo += 1; msc = 0;
    const centerR = r0 + shape.h / 2, centerC = c0 + shape.w / 2;
    const hit = new Map();
    for (const r of rows) for (let c = 0; c < N; c++) hit.set(r * N + c, Math.abs(c + 0.5 - centerC));
    for (const c of cols) for (let r = 0; r < N; r++) {
      const k = r * N + c, d = Math.abs(r + 0.5 - centerR);
      hit.set(k, hit.has(k) ? Math.min(hit.get(k), d) : d);
    }
    let gemHit = 0;
    for (const [k, d] of hit) {
      const r = (k / N) | 0, c = k % N, gem = pz && puz.gems[r][c] ? 1 : 0;
      clearing.push({ r, c, v: grid[r][c], t0: now + 60, delay: d * 26, spawned: false, few: hit.size > 16, gem });
      grid[r][c] = 0; pop[r][c] = 0;
      if (gem) { puz.gems[r][c] = 0; gemHit++; }
    }
    if (pz) {
      stats.puzzleBestGems = Math.max(stats.puzzleBestGems, gemHit); // gems broken by one move (domino theme)
      stats.puzzleGemsTotal += gemHit; // every gem ever broken (alchemy theme)
      if (rows.length && cols.length) stats.puzzleCross++; // a row and a column in the same move (magic cube theme)
    }
    const boardClean = grid.every(row => row.every(v => !v));
    const sc = scoreMove(shape.size, lines, combo, boardClean, fulls, score);
    gained = sc.place + sc.clear + sc.full;
    const pts = sc.clear + sc.full;
    const grow = Math.min(1.7, 1 + pts / 2500);

    texts.push({ text: '+' + pts.toLocaleString('tr-TR'), x: pcx, y: pcy, t0: now + 80, dur: 950, size: L.cell * 0.62 * grow, role: pts >= 400 ? 'accent' : 'fg' });
    let praise = boardClean ? (fulls ? `Tertemiz ×${fulls + 1}!` : 'Tahta tertemiz!') : lines >= 4 ? 'Muhteşem!' : lines === 3 ? 'Harika!' : lines === 2 ? 'Güzel!' : null;
    if (gemHit && !boardClean) { const gl = countGems(puz.gems); praise = !gl ? 'Son taş!' : gemHit > 1 ? `${gemHit} taş birden!` : 'Bir taş gitti!'; }
    if (praise) texts.push({ text: praise, x: midX, y: L.gy + L.cell * 2.6, t0: now + 120, dur: boardClean ? 1500 : 1100, size: L.cell * (boardClean ? 1.0 : 0.82), role: 'accent' });
    if (combo >= 2) texts.push({ text: `Kombo ${combo} · Puan ${fmtMult(comboMult(combo))}`, x: midX, y: L.gy + L.cell * (praise ? (boardClean ? 3.8 : 3.6) : 2.8), t0: now + 200, dur: 1050, size: L.cell * 0.5 * Math.min(1.45, 1 + combo * 0.05), role: 'fg' });
    if (boardClean) {
      fulls++;
      texts.push({ text: '+' + sc.full.toLocaleString('tr-TR') + ' bonus', x: midX, y: L.gy + L.cell * 5.2, t0: now + 320, dur: 1400, size: L.cell * 0.6, role: 'accent' });
      flash = { t0: now + 80 };
      burst(now + 60);
      Sfx.fullClear();
      buzz([30, 40, 30, 40, 60]);
    }

    if (!REDUCED && mode !== 'zen') shake = { amp: Math.min(3 + lines * 3 + combo + (boardClean ? 8 : 0), 20), t0: now + 60 };
    Sfx.clear(lines, combo);
    buzz(lines >= 2 ? [18, 30, 24] : 20);
  } else {
    gained = scoreMove(shape.size, 0, 0, false, 0, score).place;
    msc += 1;
    if (msc >= 3) combo = 0;
    Sfx.place();
    buzz(10);
  }

  score += gained;
  if (mode === 'daily') {
    const db = dayBest(gameDay);
    if (score > db && !newRecord && db > 0) newRecord = true;
    dailyProgress(now, midX);
  } else if (mode === 'zen') {
    gs.lines += lines; stats.zenLines += lines; stats.zenMoves++;
    if (lines && grid.every(row => row.every(v => !v))) stats.zenFulls++;
    gs.zrun++; stats.zenBestRun = Math.max(stats.zenBestRun, gs.zrun); // moves since the last breath (batik theme)
    if (cellsOf(...bitsOf(grid)) > 32) gs.zcalm = 0; // moves in a row with the board at most half full (andes theme)
    else { gs.zcalm++; stats.zenBestCalm = Math.max(stats.zenBestCalm, gs.zcalm); }
  }
  else if (pz) { stats.puzzlePlaced++; stats.puzzleLines += lines; }
  else if (score > best) { if (!newRecord && best > 0) newRecord = true; best = score; }
  bumpScore();
  if (pz) { // a level: its own counters only, no level-ups, theme steps or records; only the puzzle collection's tasks move
    store.set(STATS_KEY, stats);
    checkUnlocks(now);
    if (puzGoal().done) { puzWin(now); return; }
    if (tray.every(t => !t)) puzDeal(now + 120);
    refreshFits();
    updateHud();
    save();
    checkOver(now);
    return;
  }
  const lvl = levelOf(score);
  if (lvl > lvlBefore && mode !== 'zen') {
    texts.push({ text: `Seviye ${lvl} · Puan ${fmtMult(levelMult(lvl))}`, x: midX, y: L.gy + L.cell * 6.4, t0: now + (lines ? 900 : 400), dur: 1800, size: L.cell * 0.52, role: 'accent' });
    $('lvl').classList.add('up'); setTimeout(() => $('lvl').classList.remove('up'), 900);
  }

  if (settings.auto) {
    const st = stageAt(score);
    if (st > theme.stage) { theme.stage = st; pendingTheme = { i: autoTheme(st), at: now + (lines ? 650 : 250) }; }
  }
  // single-game records (best score, longest combo, most moves...) only count outside zen, where a game can end;
  // totals count in every mode
  const oneGame = mode !== 'zen';
  if (oneGame) {
    stats.bestScore = Math.max(stats.bestScore, score);
    stats.bestCombo = Math.max(stats.bestCombo, combo);
    stats.bestFulls = Math.max(stats.bestFulls, fulls);
    stats.bestMoves = Math.max(stats.bestMoves, moves);
  }
  stats.bestLines = Math.max(stats.bestLines, lines);
  stats.totalLines += lines;
  if (lines && grid.every(row => row.every(v => !v))) stats.totalFulls++;
  stats.totalScore += gained;
  stats.totalPlaced++;
  touchDay();
  if (lines >= 2 && oneGame) { gs.multi++; stats.bestMulti = Math.max(stats.bestMulti, gs.multi); }
  if (lines >= 3) stats.total3++;
  if (!gs.broke && oneGame) { if (cellsOf(...bitsOf(grid)) > 32) gs.broke = true; else { gs.calm = moves; stats.bestCalm = Math.max(stats.bestCalm, gs.calm); } }
  store.set(STATS_KEY, stats);
  checkUnlocks(now);

  if (tray.every(t => !t)) deal(now + 120);
  refreshFits();
  updateHud();
  save();
  checkOver(now);
}
// The goal is reached: the level ends at once. Stars come from the pieces still unused.
function puzWin(now) {
  const lv = puzLevel(), left = Math.max(0, lv.pieces.length - moves), st = puzStarsFor(left, lv.stars), before = bestStars(lv.id);
  over = true; overT0 = now;
  Object.assign(puz, { won: true, prev: null, stars: st, left, newBest: before > 0 && st > before });
  if (st > before) puzProg.best[lv.id] = st;
  if (st === 3 && puzProg.lost[lv.id] && !puz.failed) puzProg.back[lv.id] = 1; // lost once, now solved cleanly on a fresh try (chalkboard theme)
  if (st === 3 && !puz.failed && !puz.undoUsed) puzProg.clean[lv.id] = 1; // cracked in one go: no fail, no undo (cipher theme)
  savePuzzle();
  stats.puzzleWins++;
  if (left === 0) stats.puzzleLast++; // the goal fell with the very last piece (detective theme)
  puzCollect();
  store.set(STATS_KEY, stats);
  checkUnlocks(now); // held for the next board; the card names what opened
  store.set(PUZ_SAVE_KEY, null);
  drag = null;
  refreshFits(); updateHud();
  const midX = L.gx + L.B / 2 - L.pad;
  texts.push({ text: 'Bölüm tamam!', x: midX, y: L.gy + L.cell * 4.1, t0: now + 380, dur: 1500, size: L.cell * 0.9, role: 'accent' });
  setTimeout(() => { if (!puz.won) return; burst(performance.now()); Sfx.star(st); buzz([16, 40, 16, 40, 30]); }, 420);
  setTimeout(showOver, REDUCED ? 800 : 1500);
}
// a finished game: time of day, which theme it ended in, scoring streak
function gameEnded() {
  countGame();
  const hr = new Date().getHours();
  if (hr >= 5 && hr < 9) stats.morningGames++;
  themesDone.add(THEMES[theme.cur].id); store.set(DONE_KEY, [...themesDone]); stats.themesDone = themesDone.size;
  stats.streak10k = score >= 10000 ? stats.streak10k + 1 : 0;
  stats.bestStreak10k = Math.max(stats.bestStreak10k, stats.streak10k);
  store.set(STATS_KEY, stats);
  checkUnlocks(performance.now() + 900);
}
// Zen breath: clear the fullest rows and columns one by one (at least two, at most five) until a waiting piece fits again.
// Cells drift away in a slow wave from the line's middle; no points, the combo rests.
let breathTimer = 0;
function cancelBreath() { clearTimeout(breathTimer); breathTimer = 0; }
// The fullest rows and columns drift away, one by one (at least two, at most five), until a waiting piece fits again. No points.
function clearFullest(now) {
  const g = grid.map(row => row.slice());
  const lines = [];
  for (let r = 0; r < N; r++) lines.push({ cells: [...Array(N)].map((_, c) => [r, c]) });
  for (let c = 0; c < N; c++) lines.push({ cells: [...Array(N)].map((_, r) => [r, c]) });
  const anyFits = () => { const [lo, hi] = bitsOf(g); return tray.some(t => t && fitsAnywhere(lo, hi, t.piece.shape)); };
  const picked = [];
  while (picked.length < 5) {
    let bestL = null, bestN = 0;
    for (const L2 of lines) {
      if (picked.includes(L2)) continue;
      const n = L2.cells.filter(([r, c]) => g[r][c]).length;
      if (n > bestN || (n === bestN && bestL && Math.random() < 0.5)) { bestN = n; bestL = L2; }
    }
    if (!bestL || !bestN) break;
    picked.push(bestL);
    for (const [r, c] of bestL.cells) g[r][c] = 0;
    if (picked.length >= 2 && anyFits()) break;
  }
  const seen = new Set();
  picked.forEach((L2, k) => L2.cells.forEach(([r, c], j) => {
    const key = r * N + c;
    if (seen.has(key) || !grid[r][c]) return;
    seen.add(key);
    clearing.push({ r, c, v: grid[r][c], t0: now + 80, delay: k * 140 + Math.abs(j + 0.5 - N / 2) * 55, spawned: false, few: true });
    grid[r][c] = 0; pop[r][c] = 0;
  }));
}
function zenBreath(now) {
  clearFullest(now);
  combo = 0; msc = 0; gs.zrun = 0;
  stats.zenBreaths++; store.set(STATS_KEY, stats);
  checkUnlocks(now);
  texts.push({ text: 'Nefes al, devam et', x: L.gx + L.B / 2 - L.pad, y: L.gy + L.cell * 3.2, t0: now + 160, dur: 1900, size: L.cell * 0.66, role: 'accent' });
  Sfx.breath(); buzz([8, 60, 8]);
  refreshFits();
  if (!tray.some(t => t && t.fits)) deal(now + 500); // the cleared board still has no room for these pieces: new ones
  updateHud();
  save();
}
function checkOver(now) {
  if (mode === 'puzzle' && puz.won) return;
  if (tray.some(t => t && t.fits)) return;
  if (mode === 'zen') { // zen never ends: after a short pause, the board breathes out
    if (!breathTimer) breathTimer = setTimeout(() => {
      breathTimer = 0;
      if (mode === 'zen' && !tut && !over && grid && !tray.some(t => t && t.fits)) zenBreath(performance.now());
    }, 650);
    return;
  }
  over = true; overT0 = now + 450;
  if (mode === 'puzzle') { // a failed level is not a finished game
    puz.fail = tray.some(Boolean) ? 'room' : 'pieces';
    puz.failed = true;
    if (!puzProg.lost[puzLevel().id]) { puzProg.lost[puzLevel().id] = 1; savePuzzle(); }
  }
  else if (mode === 'classic' && (canRevive() || canUndo())) cls.pendingEnd = true; // a second chance is still there: the game stays saved
  else gameEnded();
  setTimeout(() => Sfx.over(), 400);
  if (newRecord) Sfx.record();
  setTimeout(showOver, 450 + N * 70 + 350);
  if (!(mode === 'classic' && cls.pendingEnd)) store.set(saveKey(), null);
  store.set(BEST_KEY, best);
}
// A classic game whose game-over card offered a second chance is counted as finished once the player moves on without it
function endClassic() {
  if (!cls.pendingEnd) return;
  cls.pendingEnd = false;
  gameEnded();
  store.set(SAVE_KEY, null);
}
// Classic continue, once per game: the board breathes out like zen, the combo rests, and play goes on
function classicRevive() {
  if (!over || !canRevive() || drag) return;
  const now = performance.now();
  cls.contUsed = true; cls.pendingEnd = false; cls.hist = []; // the moves before the continue cannot be undone any more
  over = false; $('over').hidden = true;
  texts = []; shake = null; flash = null;
  clearFullest(now);
  combo = 0; msc = 0;
  texts.push({ text: 'İkinci şans!', x: L.gx + L.B / 2 - L.pad, y: L.gy + L.cell * 3.2, t0: now + 160, dur: 1700, size: L.cell * 0.8, role: 'accent' });
  Sfx.breath(); buzz([8, 60, 8]);
  refreshFits();
  if (!tray.some(t => t && t.fits)) deal(now + 500); // the cleared board still has no room for these pieces: new ones
  updateHud(); save();
}
// Classic undo: back one move (board, tray, score, combo, level step and the records it set); three per game
function classicUndo() {
  if (!canUndo() || drag) return;
  const p = cls.hist.pop(), now = performance.now();
  cls.undoLeft--;
  while (cls.hist.length > cls.undoLeft) cls.hist.shift();
  grid = p.grid.map(r => r.slice());
  tray = p.tray.map((t, i) => t ? { piece: { shape: SHAPES[t.s], color: t.c }, appear: now + i * 50, ret: null, fits: true } : null);
  score = p.score; displayScore = score; combo = p.combo; msc = p.msc; moves = p.moves; fulls = p.fulls; gs = { ...p.gs };
  theme.stage = p.stage; pendingTheme = null;
  best = Math.min(best, p.best); newRecord = p.newRecord;
  for (const k of REC_KEYS) stats[k] = Math.min(stats[k], p.rec[k]);
  store.set(STATS_KEY, stats);
  cls.pendingEnd = false;
  over = false; $('over').hidden = true;
  clearing = []; texts = []; shake = null; flash = null;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) pop[r][c] = grid[r][c] ? now + (r + c) * 10 : 0;
  texts.push({ text: cls.undoLeft ? `Geri alındı · ${cls.undoLeft} hak kaldı` : 'Geri alındı · son hak', x: L.gx + L.B / 2 - L.pad, y: L.gy + L.cell * 3.2, t0: now + 60, dur: 1100, size: L.cell * 0.56, role: 'fg' });
  if (Sfx.ok()) { Sfx.hiss({ dur: 0.3, vol: 0.06, type: 'bandpass', freq: 3000, to: 600, q: 0.8 }); Sfx.pick(); }
  buzz(12);
  refreshFits(); updateHud(); save();
}
const doUndo = () => mode === 'puzzle' ? puzUndo() : classicUndo();
function showOver() {
  if (!over) return; // a new game started meanwhile
  const pz = mode === 'puzzle';
  $('finalScore').classList.toggle('txt', pz);
  $('overStars').classList.toggle('big', pz);
  $('puzRetry').hidden = $('puzLevels').hidden = $('puzUndo').hidden = !pz;
  $('toMenu').hidden = pz;
  $('puzUndo').textContent = 'Geri al';
  const rv = canRevive();
  $('revive').hidden = !rv;
  $('again').className = rv ? 'ghost' : 'cta'; // with a continue on offer, a new game is the quieter choice
  if (pz) { showPuzzleOver(); return; }
  const dl = mode === 'daily';
  $('finalScore').textContent = fmtN(score);
  $('overTitle').textContent = dl ? 'Günlük · ' + fmtDay(gameDay) : 'Yer kalmadı';
  $('newRec').textContent = dl ? 'Bugünün rekoru!' : 'Yeni rekor!';
  $('newRec').hidden = !newRecord;
  $('overStars').hidden = !dl; $('share').hidden = !dl;
  $('again').textContent = dl ? 'Tekrar dene' : 'Tekrar oyna';
  if (dl) {
    const tg = dailyStart(gameDay).targets, st = starsFor(score, tg), dayStars = dayRec(gameDay).stars;
    paintStars($('overStars'), st, tg);
    const next = tg.find(t => t > score);
    $('overSub').textContent = `Bugünün en iyisi: ${fmtN(dayBest(gameDay))}` + (dayStars > st ? ` · ${dayStars} yıldız` : '');
    const sk = curStreak();
    $('overNote').textContent = next ? `Sonraki yıldız ${fmtN(next)} puanda.` + (sk ? ` Seri: ${sk} gün.` : '') : (sk ? `Seri: ${sk} gün. Yarın yeni tahta!` : 'Yarın yeni tahta!');
    $('overNote').hidden = false;
    resetShare();
  } else {
    $('overSub').textContent = `En iyi: ${fmtN(best)}`;
    const un = canUndo();
    $('puzUndo').hidden = !un;
    if (un) $('puzUndo').textContent = `Geri al · ${cls.undoLeft}`;
    const note = rv ? 'Devam edersen en dolu sıralar temizlenir. Oyun başına bir kez.' : un ? `${cls.undoLeft} geri alma hakkın kaldı.` : '';
    $('overNote').textContent = note;
    $('overNote').hidden = !note;
  }
  $('over').hidden = false;
  $(rv ? 'revive' : 'again').focus({ preventScroll: true });
}
// win: the level name, its stars and how to earn the next one; fail: what ran out, how far the goal got, and the undo if it is still there
function showPuzzleOver() {
  const lv = puzLevel(), won = puz.won, hasNext = puz.li + 1 < LEVELS.length;
  $('overTitle').textContent = won ? 'Bölüm tamam' : `Bölüm ${puz.li + 1} · ${lv.title}`;
  $('finalScore').textContent = won ? lv.title : puz.fail === 'pieces' ? 'Parçalar bitti' : 'Yer kalmadı';
  $('overStars').hidden = !won; $('share').hidden = true;
  $('newRec').textContent = 'Yeni en iyi!'; $('newRec').hidden = !(won && puz.newBest);
  const note = $('overNote');
  if (won) {
    $('overStars').innerHTML = [0, 1, 2].map(i => `<span class="star${i < puz.stars ? ' on' : ''}">${STAR_SVG}</span>`).join('');
    $('overStars').setAttribute('aria-label', `${puz.stars} / 3 yıldız`);
    $('overSub').textContent = `Kalan parça: ${puz.left}`;
    const need = puz.stars < 3 ? lv.stars[puz.stars] - puz.left : 0;
    note.textContent = need > 0 ? `${puz.stars + 1}. yıldız için ${need} parça daha az kullan.` : hasNext ? '' : 'Bu grubun bütün bölümlerini bitirdin!';
    if (puz.opened.length) note.textContent = `Yeni tema açıldı: ${puz.opened.join(', ')}!` + (note.textContent ? ' ' + note.textContent : '');
    $('again').textContent = hasNext ? 'Sonraki bölüm' : 'Bölümler';
    $('puzLevels').hidden = !hasNext;
    $('puzRetry').hidden = false; $('puzUndo').hidden = true;
  } else {
    $('overSub').textContent = `Hedef: ${goalText(lv)} · ` + puzGoal().label.replace(/ /g, '\u00a0'); // the progress stays on one line
    const undo = canUndo();
    note.textContent = undo ? 'Son hamleni bir kez geri alabilirsin.' : '';
    if (puz.opened.length) note.textContent = `Yeni tema açıldı: ${puz.opened.join(', ')}!` + (note.textContent ? ' ' + note.textContent : '');
    $('again').textContent = 'Tekrar dene';
    $('puzRetry').hidden = true; $('puzUndo').hidden = !undo; $('puzLevels').hidden = false;
  }
  note.hidden = !note.textContent;
  $('over').hidden = false;
  $('again').focus({ preventScroll: true });
}
// back one move: board, gems, tray, score, combo and the place in the piece list; once per attempt
function puzUndo() {
  if (!canUndo() || drag) return;
  const p = puz.prev, now = performance.now();
  grid = p.grid.map(r => r.slice()); puz.gems = p.gems.map(r => r.slice());
  tray = p.tray.map((t, i) => t ? { piece: { shape: SHAPES[t.s], color: t.c }, appear: now + i * 50, ret: null, fits: true } : null);
  score = p.score; displayScore = score; combo = p.combo; msc = p.msc; moves = p.moves; fulls = p.fulls; puz.seq = p.seq;
  puz.prev = null; puz.undoUsed = true; puz.fail = '';
  over = false; $('over').hidden = true;
  clearing = []; texts = []; shake = null; flash = null;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) pop[r][c] = grid[r][c] ? now + (r + c) * 10 : 0;
  texts.push({ text: 'Geri alındı', x: L.gx + L.B / 2 - L.pad, y: L.gy + L.cell * 3.2, t0: now + 60, dur: 1000, size: L.cell * 0.6, role: 'fg' });
  if (Sfx.ok()) { Sfx.hiss({ dur: 0.3, vol: 0.06, type: 'bandpass', freq: 3000, to: 600, q: 0.8 }); Sfx.pick(); }
  buzz(12);
  refreshFits(); updateHud(); save();
}

// three stars, each labelled with its target score; filled up to n
const STAR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.75 5.9 6.45.75-4.78 4.4 1.3 6.37L12 17.05l-5.72 3.17 1.3-6.37L2.8 9.45l6.45-.75z"/></svg>';
function paintStars(el, n, tg) {
  el.innerHTML = tg.map((t, i) => `<span class="star${i < n ? ' on' : ''}">${STAR_SVG}<small>${fmtN(t)}</small></span>`).join('');
  el.setAttribute('aria-label', `${n} / 3 yıldız`);
}
function shareText() {
  const tg = dailyStart(gameDay).targets, st = starsFor(score, tg), sk = curStreak();
  return `Blokzen Günlük · ${fmtDay(gameDay)}\n${'★'.repeat(st)}${'☆'.repeat(3 - st)}  ${fmtN(score)} puan` + (sk ? `\nSeri: ${sk} gün` : '');
}
let shareTimer = 0;
function resetShare() { clearTimeout(shareTimer); $('share').textContent = 'Sonucu kopyala'; }
async function copyText(text) {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; } } catch (e) {}
  try {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch (e) { return false; }
}

/* ---------- HUD ---------- */
let bumpTimer = 0;
function bumpScore() {
  if (REDUCED) return;
  elScore.classList.add('bump');
  clearTimeout(bumpTimer);
  bumpTimer = setTimeout(() => elScore.classList.remove('bump'), 140);
}
function updateHud() {
  const dl = mode === 'daily', zen = mode === 'zen', pz = mode === 'puzzle';
  elBest.textContent = pz ? `${puz.li + 1}/${LEVELS.length}` : fmtN(dl ? Math.max(dayBest(gameDay), score) : zen ? gs.lines : best);
  $('bestBox').title = dl ? 'Bugünün en iyisi' : zen ? 'Bu oturumda temizlenen sıra' : pz ? 'Bölüm' : 'En iyi skor';
  $('icoBest').toggleAttribute('hidden', zen || pz); $('icoZen').toggleAttribute('hidden', !zen); $('icoPuz').toggleAttribute('hidden', !pz); // svg elements have no .hidden property
  document.body.classList.toggle('daily', dl);
  document.body.classList.toggle('zen', zen);
  document.body.classList.toggle('puzzle', pz);
  $('goalRow').hidden = !dl;
  if (dl) updateGoal();
  $('puzRow').hidden = !pz;
  $('undo').hidden = !(pz || mode === 'classic');
  if (pz) updatePuzzleHud();
  else if (mode === 'classic') updateUndoBtn();
  if (!$('restart').classList.contains('confirm')) $('restart').setAttribute('aria-label', restartLabel());
  const lvl = levelOf(score), el = $('lvl');
  el.hidden = lvl < 2 || zen || pz;
  el.innerHTML = `Seviye ${lvl}<b>${fmtMult(levelMult(lvl))}</b>`;
  if (combo >= 2) {
    const left = 3 - msc;
    elCombo.innerHTML = 'Kombo ' + combo + ' ' + fmtMult(comboMult(combo)) + ' <span class="dots">' + [0, 1, 2].map(i => `<i class="${i < left ? 'on' : ''}"></i>`).join('') + '</span>';
    elCombo.hidden = false;
  } else elCombo.hidden = true;
  updateRing();
}
// puzzle row: level name (opens the level list), goal progress, pieces left with the stars a win right now would give
const MINI_STAR = on => STAR_SVG.replace('<svg ', `<svg class="${on ? 'on' : ''}" `);
function updatePuzzleHud() {
  const lv = puzLevel(), g = puzGoal(), left = piecesLeft(), pot = puzStarsFor(left, lv.stars);
  $('puzName').textContent = `${puz.li + 1} · ${lv.title}`;
  $('puzTitle').setAttribute('aria-label', `Bölüm ${puz.li + 1}, ${lv.title}. Bölüm listesini aç`);
  const goal = $('puzGoal');
  goal.innerHTML = GOAL_ICON[lv.goal.type] + `<span>${g.html}</span>`;
  goal.classList.toggle('done', g.done);
  goal.title = goalText(lv);
  goal.setAttribute('aria-label', `Hedef: ${goalText(lv)}. ${g.label}`);
  const lf = $('puzLeft');
  lf.innerHTML = `<span>${left} parça</span><span class="pst">${[0, 1, 2].map(i => MINI_STAR(i < pot)).join('')}</span>`;
  lf.title = `Kalan parça ${left}. Şimdi bitirirsen ${pot} yıldız`;
  lf.setAttribute('aria-label', lf.title);
  updateUndoBtn();
}
// the undo button in the tools: puzzle has one undo per attempt, classic three per game; the badge counts what is left
function updateUndoBtn() {
  const u = $('undo'), ok = canUndo(), pz = mode === 'puzzle';
  const left = pz ? (puz.undoUsed ? 0 : 1) : cls.undoLeft;
  u.classList.toggle('off', !ok);
  u.setAttribute('aria-disabled', String(!ok));
  $('undoBadge').hidden = !left;
  $('undoBadge').textContent = left;
  u.setAttribute('aria-label', !left ? (pz ? 'Geri alma hakkı kullanıldı' : 'Geri alma hakların bitti') : ok ? `Son hamleyi geri al (${left} hak)` : 'Geri alınacak hamle yok');
}
// daily goal bar: three equal thirds, one per star, so the first target is as visible as the last
const goalPos = (sc, tg) => { let lo = 0; for (let i = 0; i < 3; i++) { if (sc < tg[i]) return (i + (sc - lo) / (tg[i] - lo)) / 3; lo = tg[i]; } return 1; };
let goalBuilt = 0, goalShown = 0; // goalShown: the bar has been drawn for this day, so newly lit stars may pop
function updateGoal() {
  const tg = dailyStart(gameDay).targets, st = starsFor(score, tg);
  if (goalBuilt !== gameDay) {
    goalBuilt = gameDay;
    $('goalDay').textContent = fmtDay(gameDay);
    $('goalMarks').innerHTML = tg.map((t, i) => `<span class="gmark" style="left:${(100 * (i + 1) / 3).toFixed(2)}%">${STAR_SVG}</span>`).join('');
  }
  $('goalFill').style.width = (100 * goalPos(score, tg)).toFixed(2) + '%';
  [...$('goalMarks').children].forEach((m, i) => {
    const was = m.classList.contains('on');
    m.classList.toggle('on', i < st);
    if (!was && i < st && goalShown === gameDay) { m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop'); }
  });
  goalShown = gameDay;
  const next = tg.find(t => t > score);
  $('goalNext').textContent = next ? fmtN(next) : 'Tamam!';
  $('goalRow').setAttribute('aria-label', `Günlük hedef: ${st} / 3 yıldız` + (next ? `, sonraki ${fmtN(next)}` : ''));
}

/* ---------- Input ---------- */
function pt(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
function slotAt(p) {
  if (p.y < L.trayY - L.cell * 0.4 || p.y > L.trayY + L.trayH + L.cell) return -1;
  const i = Math.floor((p.x - L.bx) / L.slotW);
  return i >= 0 && i < 3 ? i : -1;
}
const liftFor = d => d.touch ? d.piece.shape.h * L.cell / 2 + L.cell * 1.1 : 0;
function computeTarget() {
  const d = drag, s = d.piece.shape, cs = L.cell;
  const cx = d.x, cy = d.y - liftFor(d);
  const c = Math.round((cx - s.w * cs / 2 - L.gx) / cs);
  const r = Math.round((cy - s.h * cs / 2 - L.gy) / cs);
  let valid = r >= 0 && c >= 0 && r + s.h <= N && c + s.w <= N;
  if (valid) for (const [dr, dc] of s.cells) if (grid[r + dr][c + dc]) { valid = false; break; }
  if (valid && tut && !TUT[tut.step].free) { const [tr, tc] = TUT[tut.step].target; if (r !== tr || c !== tc) valid = false; } // guided steps accept only the shown spot
  let hl = null;
  if (valid) {
    const g = grid.map(row => row.slice());
    for (const [dr, dc] of s.cells) g[r + dr][c + dc] = 1;
    hl = new Set();
    for (let r2 = 0; r2 < N; r2++) if (g[r2].every(Boolean)) for (let cc = 0; cc < N; cc++) hl.add(r2 * N + cc);
    for (let cc = 0; cc < N; cc++) if (g.every(row => row[cc])) for (let r2 = 0; r2 < N; r2++) hl.add(r2 * N + cc);
  }
  d.target = valid ? { r, c, hl } : null;
}

cv.addEventListener('pointerdown', e => {
  lastInput = performance.now();
  Sfx.unlock();
  if (over || drag || (tut && tut.next)) return;
  const p = pt(e), i = slotAt(p);
  if (i < 0) return;
  const t = tray[i];
  if (!t || t.ret) return;
  e.preventDefault();
  drag = { slot: i, piece: t.piece, x: p.x, y: p.y, touch: e.pointerType !== 'mouse', t0: performance.now(), target: null, id: e.pointerId };
  try { cv.setPointerCapture(e.pointerId); } catch (err) {}
  computeTarget();
  Sfx.pick(); buzz(6);
});
cv.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.id) return;
  const p = pt(e); drag.x = p.x; drag.y = p.y;
  computeTarget();
});
function endDrag(e, cancelled) {
  if (!drag || e.pointerId !== drag.id) return;
  const d = drag; drag = null;
  if (!cancelled && d.target) { if (tut) tutPlace(d.slot, d.target.r, d.target.c); else placePiece(d.slot, d.target.r, d.target.c); return; }
  if (tut) tut.t0 = performance.now() + 450; // replay the hand after a missed drop
  const t = tray[d.slot];
  if (t) {
    const tl = clamp01((performance.now() - d.t0) / 110);
    t.ret = { x: d.x, y: d.y - liftFor(d) * outCubic(tl), cell: lerp(L.trayCell, L.cell, outCubic(tl)), t0: performance.now() };
  }
  if (!cancelled && d.y < L.trayY - L.cell * 0.5) Sfx.bad();
}
cv.addEventListener('pointerup', e => endDrag(e, false));
cv.addEventListener('pointercancel', e => endDrag(e, true));
cv.addEventListener('contextmenu', e => e.preventDefault());

function toggleMute() {
  Sfx.unlock();
  Sfx.muted = !Sfx.muted;
  store.set(MUTE_KEY, Sfx.muted);
  syncMute();
  if (!Sfx.muted) Sfx.pick();
}
$('mute').addEventListener('click', toggleMute);
function syncMute() {
  $('icoOn').hidden = Sfx.muted; $('icoOff').hidden = !Sfx.muted;
  $('mute').setAttribute('aria-label', Sfx.muted ? 'Sesi aç' : 'Sesi kapat');
  syncSettings();
}
let confirmTimer = 0;
function resetConfirm() {
  const b = $('restart');
  clearTimeout(confirmTimer); b.classList.remove('confirm');
  $('icoRestart').hidden = false; $('icoCheck').hidden = true;
  b.setAttribute('aria-label', restartLabel());
}
function restartLabel() { return mode === 'daily' ? 'Günlüğü baştan dene' : mode === 'zen' ? 'Zen tahtasını sıfırla' : mode === 'puzzle' ? 'Bölümü baştan al' : 'Yeni oyun'; }
$('restart').addEventListener('click', () => {
  Sfx.unlock();
  const b = $('restart');
  if (over) { newGame(); return; }
  if (b.classList.contains('confirm')) { resetConfirm(); newGame(); return; }
  b.classList.add('confirm'); $('icoRestart').hidden = true; $('icoCheck').hidden = false;
  b.setAttribute('aria-label', 'Yeni oyunu onayla');
  confirmTimer = setTimeout(resetConfirm, 2500);
});
$('again').addEventListener('click', () => {
  Sfx.unlock();
  if (mode === 'puzzle' && puz.won) { if (puz.li + 1 < LEVELS.length) startLevel(puz.li + 1); else openLevels(); return; }
  newGame();
});
$('puzRetry').addEventListener('click', () => { Sfx.unlock(); Sfx.pick(); newGame(); });
$('puzLevels').addEventListener('click', () => openLevels());
$('puzUndo').addEventListener('click', () => { Sfx.unlock(); doUndo(); });
$('undo').addEventListener('click', () => { Sfx.unlock(); if (canUndo()) doUndo(); else Sfx.bad(); });
$('revive').addEventListener('click', () => { Sfx.unlock(); classicRevive(); });
$('puzTitle').addEventListener('click', () => openLevels());

/* ---------- Main menu ---------- */
const LOGO = [[1, 1, 0, 0, 5], [0, 1, 3, 3, 5], [2, 2, 3, 3, 5]];
const ART_CLASSIC = [[1, 1, 0, 4], [0, 2, 2, 4], [6, 2, 2, 4], [6, 6, 0, 0]];
const ART_ZEN = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [3, 3, 0, 5, 0]]; // a few stones under an open circle
const ART_PUZZLE = [[2, 2, 0, 4, 4], [9, 1, 0, 0, 4], [1, 1, 0, 3, 3], [0, 0, 0, 3, 9], [5, 5, 5, 0, 7]]; // 9: a gem
let menuOpen = false, menuNewTimer = 0;
const inProgress = () => !over && moves > 0;
const fmtN = n => (n | 0).toLocaleString('tr-TR');
// size a canvas for its CSS box; returns null when nothing changed since the last draw with this key
function prepCanvas(c, key) {
  const w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const k = [key, theme.cur, theme.mode, w, h, dpr].join('|');
  if (c.dataset.k === k) return null;
  c.dataset.k = k;
  c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
  const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
  return { g, w, h, dpr };
}
// logo and the two mode pictures, all drawn with the current theme's blocks
function drawLogo() {
  let p = prepCanvas($('logo'), 'logo');
  if (p) {
    const { g, w, h, dpr } = p, cs = Math.min(w / 5, h / 3), ox = (w - cs * 5) / 2, oy = (h - cs * 3) / 2, px = Math.ceil(cs * dpr);
    LOGO.forEach((row, r) => row.forEach((v, cc) => { if (v) g.drawImage(sprite(theme.cur, v, px), ox + cc * cs, oy + r * cs, cs, cs); }));
  }
  const th = TH();
  p = prepCanvas($('artClassic'), 'classic');
  if (p) {
    const { g, w, dpr } = p, pad = w * 0.13, cs = (w - 2 * pad) / 4, px = Math.ceil(cs * dpr);
    rr(g, 0, 0, w, w, w * 0.24); g.fillStyle = th.board; g.fill();
    ART_CLASSIC.forEach((row, r) => row.forEach((v, cc) => g.drawImage(sprite(theme.cur, v, px), pad + cc * cs, pad + r * cs, cs, cs)));
  }
  const today = dayKey();
  p = prepCanvas($('artDaily'), 'daily' + today);
  if (p) { // today's start board in miniature
    const { g, w, dpr } = p, pad = w * 0.09, cs = (w - 2 * pad) / N, px = Math.ceil(cs * dpr), sg = dailyStart(today).grid;
    rr(g, 0, 0, w, w, w * 0.24); g.fillStyle = th.board; g.fill();
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) g.drawImage(sprite(theme.cur, sg[r][c], px), pad + c * cs, pad + r * cs, cs, cs);
  }
  p = prepCanvas($('artPuzzle'), 'puzzle');
  if (p) { // a small board with two gems set into it
    const { g, w, dpr } = p, pad = w * 0.11, cs = (w - 2 * pad) / 5, px = Math.ceil(cs * dpr);
    rr(g, 0, 0, w, w, w * 0.24); g.fillStyle = th.board; g.fill();
    ART_PUZZLE.forEach((row, r) => row.forEach((v, cc) => {
      g.drawImage(sprite(theme.cur, v === 9 ? GEM_COLOR : v, px), pad + cc * cs, pad + r * cs, cs, cs);
      if (v === 9) drawGemOn(g, theme.cur, pad + cc * cs, pad + r * cs, cs, dpr);
    }));
  }
  p = prepCanvas($('artZen'), 'zen');
  if (p) { // a few stones on a quiet board, under an open ensō circle
    const { g, w, dpr } = p, pad = w * 0.11, cs = (w - 2 * pad) / 5, px = Math.ceil(cs * dpr);
    rr(g, 0, 0, w, w, w * 0.24); g.fillStyle = th.board; g.fill();
    ART_ZEN.forEach((row, r) => row.forEach((v, cc) => g.drawImage(sprite(theme.cur, v, px), pad + cc * cs, pad + r * cs, cs, cs)));
    g.save();
    g.lineCap = 'round'; g.lineWidth = w * 0.065; g.strokeStyle = th.accent;
    g.beginPath(); g.arc(w / 2, w * 0.4, w * 0.24, Math.PI * 0.62, Math.PI * 2.38); g.stroke();
    g.restore();
  }
}
// what each mode card should say, read from the live game or from that mode's save
function classicStatus() {
  if (mode === 'classic') return { prog: inProgress(), score };
  const d = store.get(SAVE_KEY);
  return d && Array.isArray(d.grid) ? { prog: (d.moves | 0) > 0, score: d.score | 0 } : { prog: false, score: 0 };
}
function dailyStatus() {
  const t = dayKey();
  if (mode === 'daily' && gameDay === t) return { prog: inProgress(), score };
  const d = store.get(DAILY_SAVE_KEY);
  return d && d.day === t ? { prog: (d.moves | 0) > 0, score: d.score | 0 } : { prog: false, score: 0 };
}
function zenStatus() {
  if (mode === 'zen') return { prog: inProgress(), score, lines: gs.lines };
  const d = store.get(ZEN_SAVE_KEY);
  return d && d.mode === 'zen' && Array.isArray(d.grid) ? { prog: (d.moves | 0) > 0, score: d.score | 0, lines: (d.gs && d.gs.lines) | 0 } : { prog: false, score: 0, lines: 0 };
}
function puzzleStatus() {
  if (mode === 'puzzle' && puz.gems) return { prog: inProgress() && !puz.won, li: puz.li };
  const d = store.get(PUZ_SAVE_KEY), li = d && d.puz ? LEVELS.findIndex(l => l.id === d.puz.id) : -1;
  return li >= 0 && d.mode === 'puzzle' ? { prog: (d.moves | 0) > 0, li } : { prog: false, li: -1 };
}
let zenNewTimer = 0;
function resetMenuNew() {
  clearTimeout(menuNewTimer);
  const b = $('menuNew'); b.classList.remove('confirm'); b.textContent = 'Yeni oyun';
  clearTimeout(zenNewTimer);
  const z = $('zenNew'); z.classList.remove('confirm'); z.textContent = 'Sıfırla';
}
function renderMenu() {
  const cs = classicStatus();
  $('playLbl').textContent = cs.prog ? 'Devam et' : 'Oyna';
  $('classicSub').textContent = best ? `En iyi ${fmtN(best)}` : 'Yer kalmayana kadar';
  const zs = zenStatus();
  $('zenLbl').textContent = zs.prog ? 'Devam et' : 'Oyna';
  $('zenSub').textContent = 'Bitmez, acele yok';
  $('zenFoot').hidden = !zs.prog;
  if (zs.prog) $('zenInfo').textContent = `${fmtN(zs.lines)} sıra · ${fmtN(zs.score)} puan`;
  $('classicFoot').hidden = !cs.prog;
  if (cs.prog) $('resumeInfo').textContent = `Yarım oyun · ${fmtN(cs.score)} puan`;
  const ps = puzzleStatus(), solved = puzSolved(), nx = nextLevelIndex();
  $('puzzleSub').textContent = `${puzTotalStars()} / ${LEVELS.length * 3} yıldız`;
  $('puzzleLbl').textContent = ps.prog ? 'Devam et' : nx < 0 ? 'Bölümler' : 'Başla';
  $('puzzleInfo').textContent = ps.prog ? `Bölüm ${ps.li + 1} yarım kaldı` : nx < 0 ? `${solved} bölümün hepsi çözüldü` : `Sıradaki: Bölüm ${nx + 1}`;
  $('playPuzzle').querySelector('.mode-go').classList.toggle('soft', !ps.prog && nx < 0);
  const t = dayKey(), info = dailyStart(t), rec = daily.days[t], ds = dailyStatus(), st = rec ? rec.stars : 0;
  const nb = x => x.replace(/ /g, '\u00a0'); // keep each half on one line; wrap only at the dot
  $('dailySub').textContent = nb(fmtDay(t)) + ' · ' + nb(rec && rec.best ? `En iyi ${fmtN(rec.best)}` : 'Herkese aynı tahta');
  $('dailyLbl').textContent = ds.prog ? 'Devam et' : rec && rec.tries ? 'Tekrar' : 'Başla';
  $('playDaily').querySelector('.mode-go').classList.toggle('soft', st === 3 && !ds.prog);
  paintStars($('dailyStars'), st, info.targets);
  const sk = curStreak(), saved = daily.last === t;
  $('streakTxt').textContent = sk ? `${sk} gün seri` : 'Seri yok';
  $('dailyStreak').classList.toggle('off', !sk);
  $('dailyStreak').title = sk ? (saved ? 'Bugün yıldızını aldın, seri sürüyor' : 'Seriyi korumak için bugün bir yıldız al') : 'Bir yıldız al, seri başlasın';
  resetMenuNew(); syncMute();
  drawLogo();
}
function openMenu(focus = true) {
  if (drag) return;
  resetConfirm();
  menuOpen = true; $('menu').hidden = false;
  renderMenu();
  if (focus) $(mode === 'daily' ? 'playDaily' : mode === 'zen' ? 'playZen' : mode === 'puzzle' ? 'playPuzzle' : 'play').focus({ preventScroll: true });
}
function closeMenu() { menuOpen = false; $('menu').hidden = true; resetMenuNew(); }
$('menuBtn').addEventListener('click', () => { Sfx.unlock(); Sfx.pick(); openMenu(); });
$('toMenu').addEventListener('click', () => { Sfx.unlock(); openMenu(); });
function startMode(m) {
  Sfx.unlock(); Sfx.pick(); buzz(10);
  const firstRun = !store.get(TUT_KEY);
  switchMode(m);
  if (over) newGame();
  closeMenu();
  if (firstRun) startTutorial();
}
$('play').addEventListener('click', () => startMode('classic'));
$('playDaily').addEventListener('click', () => startMode('daily'));
$('playZen').addEventListener('click', () => startMode('zen'));
// puzzle card: carry on with a half-played level, else start the next unsolved one; with every level solved, show the list
$('playPuzzle').addEventListener('click', () => {
  const ps = puzzleStatus(), nx = nextLevelIndex();
  if (ps.prog) startMode('puzzle');
  else if (nx < 0) openLevels();
  else startLevel(nx);
});
$('puzzleLevels').addEventListener('click', () => openLevels());

/* ---------- Puzzle level list ---------- */
const LOCK_SVG = '<svg class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>';
function renderLevels() {
  const body = $('lvBody'); body.textContent = '';
  $('lvCount').textContent = `${puzTotalStars()} / ${LEVELS.length * 3} yıldız`;
  const nx = nextLevelIndex(), cur = mode === 'puzzle' && puzzleStatus().prog ? puz.li : -1;
  let i0 = 0;
  PUZZLE_GROUPS.forEach((grp, gi) => {
    const h = document.createElement('h3'); h.className = 'gal-sec'; h.textContent = `${gi + 1}. grup · ${grp.name}`;
    const grid2 = document.createElement('div'); grid2.className = 'lvgrid';
    grp.levels.forEach((lv, j) => {
      const i = i0 + j, open = levelOpen(i), st = bestStars(lv.id);
      const b = document.createElement('button');
      b.type = 'button'; b.id = 'lv-' + lv.id;
      b.className = 'lv' + (open ? '' : ' locked') + (i === nx || i === cur ? ' next' : '') + (lv.master ? ' master' : '');
      b.innerHTML = open
        ? `<span class="lvg">${GOAL_ICON[lv.goal.type]}</span><b>${i + 1}</b><span class="lvs">${[0, 1, 2].map(k => MINI_STAR(k < st)).join('')}</span>`
        : `<b>${i + 1}</b>${LOCK_SVG}`;
      b.title = `${i + 1} · ${lv.title}` + (lv.master ? ' (usta bölümü)' : '');
      b.setAttribute('aria-label', `Bölüm ${i + 1}, ${lv.title}${lv.master ? ', usta bölümü' : ''}. ` + (open ? `Hedef: ${goalText(lv)}. ${st ? st + ' yıldız' : 'Henüz çözülmedi'}` : 'Kilitli, önceki bölümü bitir'));
      if (!open) b.setAttribute('aria-disabled', 'true');
      b.addEventListener('click', () => { if (levelOpen(i)) startLevel(i); else Sfx.bad(); });
      grid2.appendChild(b);
    });
    body.append(h, grid2);
    i0 += grp.levels.length;
  });
  const show = cur >= 0 ? cur : nx;
  const nxEl = $('lvNext');
  if (show >= 0) {
    const lv = LEVELS[show];
    nxEl.innerHTML = `<b></b><span></span>`;
    nxEl.firstChild.textContent = (cur >= 0 ? 'Yarım kalan: ' : 'Sıradaki: ') + `${show + 1} · ${lv.title}`;
    nxEl.lastChild.textContent = `Hedef: ${goalText(lv)} · ${lv.pieces.length} parça`;
    nxEl.hidden = false;
  } else nxEl.hidden = true;
}
function openLevels() {
  Sfx.unlock(); Sfx.pick();
  if (drag) return;
  renderLevels();
  $('levels').hidden = false;
  const nx = nextLevelIndex(), focusEl = nx >= 0 ? $('lv-' + LEVELS[nx].id) : null;
  (focusEl || $('lvClose')).focus({ preventScroll: true });
}
function closeLevels() {
  if ($('levels').hidden) return;
  $('levels').hidden = true;
  if (menuOpen) $('playPuzzle').focus({ preventScroll: true });
}
$('lvClose').addEventListener('click', closeLevels);
$('levels').addEventListener('click', e => { if (e.target.id === 'levels') closeLevels(); });
$('zenNew').addEventListener('click', () => {
  Sfx.unlock();
  const b = $('zenNew');
  if (b.classList.contains('confirm')) { resetMenuNew(); switchMode('zen'); newGame(); closeMenu(); return; }
  b.classList.add('confirm'); b.textContent = 'Silinecek · Onayla';
  zenNewTimer = setTimeout(resetMenuNew, 3000);
});
$('menuNew').addEventListener('click', () => {
  Sfx.unlock();
  const b = $('menuNew');
  if (b.classList.contains('confirm')) { resetMenuNew(); switchMode('classic'); newGame(); closeMenu(); return; }
  b.classList.add('confirm'); b.textContent = 'Silinecek · Onayla';
  menuNewTimer = setTimeout(resetMenuNew, 3000);
});
$('share').addEventListener('click', async () => {
  Sfx.unlock(); Sfx.pick();
  const ok = await copyText(shareText());
  $('share').textContent = ok ? 'Kopyalandı' : 'Kopyalanamadı';
  clearTimeout(shareTimer); shareTimer = setTimeout(resetShare, 2200);
});
$('menuThemes').addEventListener('click', () => openGallery());
$('menuSettings').addEventListener('click', () => openSettings());
$('menuHelp').addEventListener('click', () => openInfo('help'));
$('menuStats').addEventListener('click', () => openInfo('stats'));
function renderStats() {
  const wrap = $('statsBody'); wrap.textContent = '';
  const head = text => { const h = document.createElement('h3'); h.textContent = text; wrap.appendChild(h); };
  const group = (title, rows) => {
    head(title);
    const grid = document.createElement('div'); grid.className = 'stats';
    for (const [k, v, hi] of rows) {
      const d = document.createElement('div'); d.className = 'stat' + (hi ? ' hi' : '');
      const b = document.createElement('b'); b.textContent = v;
      const sp = document.createElement('span'); sp.textContent = k;
      d.append(b, sp); grid.appendChild(d);
    }
    wrap.appendChild(grid);
  };
  group('Genel', [
    ['En iyi skor', fmtN(Math.max(best, stats.bestScore)), true],
    ['Oynanan oyun', fmtN(stats.games)],
    ['Toplam puan', fmtN(stats.totalScore)],
    ['Yerleştirilen blok', fmtN(stats.totalPlaced)],
    ['Oynanan gün', fmtN(stats.daysPlayed)],
    ['Oyun süresi', fmtDur(stats.playSec)],
    ['Temizlenen sıra', fmtN(stats.totalLines)],
    ['En uzun kombo', fmtN(stats.bestCombo)],
    ['Tek hamlede en çok sıra', fmtN(stats.bestLines)],
    ['Tahta temizleme', fmtN(stats.totalFulls)],
    ['Bir oyunda en çok temizleme', fmtN(stats.bestFulls)],
    ['Açık temalar', `${earned.size}/${T}`],
  ]);
  group('Günlük meydan okuma', [
    ['Şu anki seri', `${fmtN(curStreak())} gün`, true],
    ['En uzun seri', `${fmtN(Math.max(daily.best, stats.dailyBestStreak))} gün`],
    ['Toplam yıldız', fmtN(stats.dailyStars)],
    ['Üç yıldızlı gün', fmtN(stats.dailyThree)],
    ['Katıldığın gün', fmtN(stats.dailyDays)],
    ['Günlük deneme', fmtN(stats.dailyGames)],
  ]);
  group('Zen', [
    ['Zen süresi', fmtDur(stats.zenSec), true],
    ['Temizlenen sıra', fmtN(stats.zenLines)],
    ['Hamle', fmtN(stats.zenMoves)],
    ['Nefes', fmtN(stats.zenBreaths)],
    ['Tahta temizleme', fmtN(stats.zenFulls)],
    ['En uzun nefessiz seri', `${fmtN(stats.zenBestRun)} hamle`],
  ]);
  group('Bulmaca', [
    ['Çözülen bölüm', `${puzSolved()} / ${LEVELS.length}`, true],
    ['Toplam yıldız', `${puzTotalStars()} / ${LEVELS.length * 3}`],
    ['Üç yıldızlı bölüm', fmtN(LEVELS.filter(l => bestStars(l.id) === 3).length)],
    ['Bulmaca süresi', fmtDur(stats.puzzleSec)],
    ['Tek hamlede en çok taş', fmtN(stats.puzzleBestGems)],
    ['Son parçayla biten bölüm', fmtN(stats.puzzleLast)],
    ['Kırılan taş', fmtN(stats.puzzleGemsTotal)],
    ['Tek denemede kusursuz', `${fmtN(stats.puzzleClean)} bölüm`],
  ]);
  head('Son 7 gün');
  const week = document.createElement('div'); week.className = 'week';
  const today = dayKey();
  for (let i = -6; i <= 0; i++) {
    const k = dayShift(today, i), rec = daily.days[k], n = rec ? rec.stars : 0;
    const d = document.createElement('div'); d.className = 'wday' + (i === 0 ? ' today' : '');
    const lb = document.createElement('span'); lb.textContent = WEEKDAYS[dayDate(k).getDay()];
    const ws = document.createElement('div'); ws.className = 'ws';
    ws.innerHTML = [0, 1, 2].map(j => STAR_SVG.replace('<svg ', `<svg class="${j < n ? 'on' : ''}" `)).join('');
    d.title = `${fmtDay(k)}: ` + (rec && rec.tries ? `${n} yıldız, en iyi ${fmtN(rec.best)}` : 'oynanmadı');
    d.setAttribute('aria-label', d.title);
    d.append(lb, ws); week.appendChild(d);
  }
  wrap.appendChild(week);
}
function openInfo(kind) {
  Sfx.unlock(); Sfx.pick();
  const help = kind === 'help';
  $('infoTitle').textContent = help ? 'Nasıl oynanır' : 'İstatistikler';
  $('helpBody').hidden = !help; $('statsBody').hidden = help; $('helpTut').hidden = !help;
  if (!help) renderStats();
  $('info').hidden = false;
  $('infoClose').focus({ preventScroll: true });
}
function closeInfo() {
  $('info').hidden = true;
  if (menuOpen) $('play').focus({ preventScroll: true });
}
$('infoClose').addEventListener('click', closeInfo);
$('info').addEventListener('click', e => { if (e.target.id === 'info') closeInfo(); });

/* ---------- Settings ---------- */
function savePrefs() { store.set(PREFS_KEY, prefs); }
function applyPrefs() {
  Sfx.setVol(prefs.vol / 100 * (mode === 'zen' ? 0.75 : 1)); // zen plays a little quieter
  REDUCED = OS_REDUCED || prefs.lowFx;
  document.body.classList.toggle('lowfx', !!prefs.lowFx);
}
function syncSettings() {
  $('optSound').checked = !Sfx.muted;
  $('optVol').value = prefs.vol; $('optVol').disabled = Sfx.muted;
  $('volVal').textContent = prefs.vol + '%';
  $('volRow').classList.toggle('off', Sfx.muted);
  $('optVib').checked = prefs.vib && CAN_VIBRATE; $('optVib').disabled = !CAN_VIBRATE;
  $('vibRow').classList.toggle('off', !CAN_VIBRATE);
  if (!CAN_VIBRATE) $('vibNote').textContent = 'Bu cihaz ya da tarayıcı titreşimi desteklemiyor';
  else if (iosTick) $('vibNote').textContent = 'Hamlelerde hafif dokunuş hissi (iOS 18 ve sonrası)';
  $('optLow').checked = prefs.lowFx;
  $('devGroup').hidden = !devMode; $('optDev').checked = devMode;
}
function openSettings() {
  Sfx.unlock(); Sfx.pick();
  syncSettings();
  $('settings').hidden = false;
  $('setClose').focus({ preventScroll: true });
}
function closeSettings() {
  $('settings').hidden = true;
  if (menuOpen) $('menuSettings').focus({ preventScroll: true });
}
$('setClose').addEventListener('click', closeSettings);
$('settings').addEventListener('click', e => { if (e.target.id === 'settings') closeSettings(); });
$('optSound').addEventListener('change', e => { if (e.target.checked === Sfx.muted) toggleMute(); });
$('optVol').addEventListener('input', e => {
  prefs.vol = e.target.value | 0; applyPrefs();
  $('volVal').textContent = prefs.vol + '%';
});
$('optVol').addEventListener('change', () => { savePrefs(); Sfx.unlock(); Sfx.place(); });
$('optVib').addEventListener('change', e => { prefs.vib = e.target.checked; savePrefs(); buzz(25); });
$('optLow').addEventListener('change', e => { prefs.lowFx = e.target.checked; applyPrefs(); savePrefs(); Sfx.pick(); });
$('optDev').addEventListener('change', e => { setDev(e.target.checked); Sfx.pick(); });

/* ---------- Developer mode: tap the menu title 7 times to show every theme while building the game ---------- */
function setDev(on) {
  devMode = on; store.set(DEV_KEY, on); syncOpen();
  if (!on) { // back to the real unlocks: leave any theme that is still locked
    if (!discovered.has(settings.fixed)) settings.fixed = 0;
    if (!discovered.has(theme.start)) theme.start = 0;
    if (!discovered.has(theme.cur)) setTheme(settings.auto ? autoTheme(theme.stage) : settings.fixed, performance.now(), { show: false, sound: false });
    saveMeta();
  }
  syncSettings();
  if (!$('gallery').hidden) renderGallery();
}
let devTaps = 0, devLast = 0, devMsgTimer = 0;
function devMsg(text) {
  const el = $('menuTag'); el.textContent = text;
  clearTimeout(devMsgTimer); devMsgTimer = setTimeout(() => { el.textContent = 'Yerleştir, temizle, rahatla.'; }, 2200);
}
$('menuTitle').addEventListener('click', () => {
  const now = performance.now();
  devTaps = now - devLast < 1200 ? devTaps + 1 : 1; devLast = now;
  if (devTaps >= 7) { devTaps = 0; setDev(!devMode); devMsg(devMode ? 'Geliştirici modu açık: tüm temalar görünüyor' : 'Geliştirici modu kapandı'); buzz([12, 50, 12]); Sfx.unlock(); Sfx.pick(); }
  else if (devTaps >= 3) devMsg(`Geliştirici modu için ${7 - devTaps} dokunuş`);
});

/* ---------- Theme gallery ---------- */
const PREVIEW = [[0, 0, 3, 0, 0], [0, 2, 3, 4, 0], [1, 2, 5, 4, 7], [1, 6, 5, 6, 7], [0, 6, 6, 6, 0]];
function drawPreview(c, i, known) {
  const size = c.getBoundingClientRect().width || 90;
  const dpr = Math.min(window.devicePixelRatio || 1, 2), px = Math.round(size * dpr);
  c.width = c.height = px;
  const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const th = THEMES[i];
  paintBase(g, th, size, size, 1);
  const pad = size * 0.12, bs = size - 2 * pad, cs = bs / 5;
  rr(g, pad - 3, pad - 3, bs + 6, bs + 6, size * 0.06); g.fillStyle = th.board; g.fill();
  const cpx = Math.ceil(cs * dpr);
  PREVIEW.forEach((row, r) => row.forEach((v, cc) => g.drawImage(sprite(i, v, cpx), pad + cc * cs, pad + r * cs, cs, cs)));
  if (known) return;
  // locked: a faded glimpse of the theme under a padlock, so players see what they are working toward
  g.globalAlpha = 0.58; g.fillStyle = TH().board; g.fillRect(0, 0, size, size);
  const lw = size * 0.26, lh = size * 0.2, lx = (size - lw) / 2, ly = size * 0.5;
  g.globalAlpha = 0.92; g.strokeStyle = g.fillStyle = TH().fg;
  g.lineWidth = size * 0.045; g.lineCap = 'round';
  g.beginPath(); g.arc(size / 2, ly, lw * 0.32, Math.PI, 0); g.lineTo(size / 2 + lw * 0.32, ly + 1); g.moveTo(size / 2 - lw * 0.32, ly + 1); g.lineTo(size / 2 - lw * 0.32, ly); g.stroke();
  rr(g, lx, ly, lw, lh, size * 0.035); g.fill();
  g.globalAlpha = 1;
}
function renderGallery() {
  const wrap = $('cards'); wrap.textContent = '';
  $('autoTheme').checked = settings.auto;
  $('galCount').textContent = `${earned.size}/${T} açık` + (devMode ? ' · geliştirici' : '');
  const nextAt = milestone(theme.stage + 1);
  $('galHint').textContent = (settings.auto
    ? `Tema ${nextAt.toLocaleString('tr-TR')} puanda açık temalardan bir sonrakine geçer. `
    : 'Seçtiğin tema sabit kalır. ') + (devMode ? 'Geliştirici modu açık: kilitli temalar da gösteriliyor ve "Test" yazıyor.' : 'Kilitli temalar, altlarında yazan görevi tamamlayınca açılır.');
  THEMES.forEach((th, i) => {
    const sec = { news: 'Günlük koleksiyon', zellige: 'Zen koleksiyonu', jigsaw: 'Bulmaca koleksiyonu' }[th.id];
    if (sec) { const h = document.createElement('h3'); h.className = 'gal-sec'; h.textContent = sec; wrap.appendChild(h); }
    const known = discovered.has(i), cur = i === theme.cur;
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'tcard-' + th.id;
    b.className = 'tcard' + (cur ? ' cur' : '') + (known ? '' : ' locked');
    if (!known) b.setAttribute('aria-disabled', 'true');
    const c = document.createElement('canvas');
    const n = document.createElement('span'); n.className = 'tname'; n.textContent = th.name;
    const s = document.createElement('span'); s.className = 'tstate' + (fresh.has(i) && !cur ? ' new' : '');
    s.textContent = cur ? (settings.auto ? 'Şu an' : 'Seçili') : fresh.has(i) ? 'Yeni!' : !known ? 'Kilitli' : devMode && !earned.has(i) ? 'Test' : 'Uygula';
    b.append(c, n, s);
    const u = UNLOCKS[th.id];
    if (!known && u) {
      const have = Math.min(u.val(stats), u.goal);
      const t = document.createElement('span'); t.className = 'tgoal'; t.textContent = u.text;
      const bar = document.createElement('span'); bar.className = 'tbar';
      const fill = document.createElement('i'); fill.style.width = (100 * have / u.goal) + '%'; bar.appendChild(fill);
      const pr = document.createElement('span'); pr.className = 'tprog'; pr.textContent = u.fmt ? u.fmt(have, u.goal) : have.toLocaleString('tr-TR') + ' / ' + u.goal.toLocaleString('tr-TR');
      b.append(t, bar, pr);
      b.setAttribute('aria-label', th.name + ', kilitli tema. ' + u.text + '. ' + pr.textContent);
    }
    wrap.appendChild(b);
    b.addEventListener('click', () => { if (known) chooseTheme(i); });
  });
  [['modeClassic', 'classic'], ['modeSoft', 'soft']].forEach(([id, mode]) => $(id).setAttribute('aria-checked', String(theme.mode === mode)));
  requestAnimationFrame(() => {
    // long single-word names (Alacakaranlık) shrink to fit the card instead of spilling over it
    wrap.querySelectorAll('.tname, .tprog').forEach(el => { el.style.fontSize = ''; let f = parseFloat(getComputedStyle(el).fontSize); while (el.scrollWidth > el.clientWidth + 1 && f > 8) { f -= 0.5; el.style.fontSize = f + 'px'; } });
    THEMES.forEach((th, i) => drawPreview($('tcard-' + th.id).querySelector('canvas'), i, discovered.has(i)));
    drawModePreview($('modeClassic').querySelector('canvas'), 'classic');
    drawModePreview($('modeSoft').querySelector('canvas'), 'soft');
  });
}
function drawModePreview(c, mode) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2), size = 24, px = Math.round(size * dpr), h = size / 2;
  c.width = c.height = px;
  const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, size, size);
  const cp = Math.ceil(h * dpr);
  [[1, 2], [4, 5]].forEach((row, r) => row.forEach((v, cc) => g.drawImage(sprite(theme.cur, v, cp, mode), cc * h, r * h, h, h)));
}
['modeClassic', 'modeSoft'].forEach(id => $(id).addEventListener('click', () => {
  const mode = id === 'modeClassic' ? 'classic' : 'soft';
  if (mode === theme.mode) return;
  closeGallery();
  setBlockMode(mode, performance.now() + 120);
}));
function chooseTheme(i) {
  settings.auto = false; settings.fixed = i; saveMeta();
  pendingTheme = null;
  closeGallery();
  setTheme(i, performance.now() + 120, { show: true, sound: true });
  updateRing();
}
function openGallery() { Sfx.unlock(); renderGallery(); $('gallery').hidden = false; $('galClose').focus({ preventScroll: true }); }
function closeGallery() { $('gallery').hidden = true; if (fresh.size) { fresh.clear(); saveMeta(); } }
$('themeBtn').addEventListener('click', openGallery);
$('galClose').addEventListener('click', closeGallery);
$('gallery').addEventListener('click', e => { if (e.target.id === 'gallery') closeGallery(); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (tut) { endTutorial(); return; }
  if (!$('levels').hidden) closeLevels();
  else if (!$('info').hidden) closeInfo();
  else if (!$('settings').hidden) closeSettings();
  else if (!$('gallery').hidden) closeGallery();
  else if (menuOpen) { if (inProgress()) closeMenu(); }
  else openMenu();
});
$('autoTheme').addEventListener('change', e => {
  settings.auto = e.target.checked;
  if (settings.auto) {
    theme.stage = stageAt(score);
    const order = [...discovered].sort((a, b) => a - b), k = order.indexOf(theme.cur);
    theme.start = order[(((k - theme.stage) % order.length) + order.length) % order.length];
  } else settings.fixed = theme.cur;
  saveMeta(); updateRing(); renderGallery();
});

/* ---------- First-run guide: three scripted boards, a hand shows each move ---------- */
const tutCol = (r, c) => 1 + ((r * 3 + c * 2) % 7);
const TUT = [
  { title: 'Sürükle ve bırak', text: 'Alttaki parçayı parmağınla tut, tahtada boş bir yere sürükle ve bırak.',
    piece: 9, color: 4, target: [3, 3], free: true, fill: [] },
  { title: 'Satırı tamamla', text: 'Bir satır baştan sona dolunca temizlenir ve puan kazanırsın. Parçayı parlayan boşluğa koy.',
    piece: 3, color: 2, target: [4, 5],
    fill: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [5, 0], [5, 1], [6, 0], [7, 0], [7, 1], [7, 2], [5, 6], [6, 7], [2, 1], [3, 0]] },
  { title: 'Sütunlar da temizlenir', text: 'Bu boşluğu doldurursan iki satır ve iki sütun birden gider. Dene!',
    piece: 9, color: 6, target: [6, 6],
    fill: (() => { const f = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if ((r >= 6) !== (c >= 6)) f.push([r, c]); return f; })() },
];
let tut = null;
function startTutorial() {
  if (drag) return;
  const now = performance.now();
  tut = { step: -1, stash: snapshot(), stashOver: over, next: 0, t0: 0 };
  over = false; $('over').hidden = true; combo = 0; msc = 0;
  pendingTheme = null; banner = null; shake = null;
  resetConfirm();
  document.body.classList.add('tut-on');
  $('tutDone').hidden = true;
  tutGo(0, now);
}
function tutGo(i, now) {
  const st = TUT[i];
  tut.step = i; tut.next = 0; tut.t0 = now + 750;
  // sweep away what is left, then pop the new board in
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (grid[r][c]) clearing.push({ r, c, v: grid[r][c], t0: now, delay: (r + c) * 14, spawned: true });
  grid = emptyGrid();
  for (const [r, c] of st.fill) { grid[r][c] = tutCol(r, c); pop[r][c] = now + 220 + (r + c) * 22; }
  tray = [null, { piece: { shape: SHAPES[st.piece], color: st.color }, appear: now + 420, ret: null, fits: true }, null];
  $('tutStep').textContent = `${i + 1}/${TUT.length}`;
  $('tutTitle').textContent = st.title;
  $('tutText').textContent = st.text;
  const tip = $('tutTip'); tip.hidden = false; tip.style.animation = 'none'; void tip.offsetWidth; tip.style.animation = '';
}
function tutPlace(slot, r0, c0) {
  const now = performance.now();
  const { shape, color } = tray[slot].piece;
  tray[slot] = null;
  for (const [dr, dc] of shape.cells) { grid[r0 + dr][c0 + dc] = color; pop[r0 + dr][c0 + dc] = now + (dr + dc) * 16; }
  const rows = [], cols = [];
  for (let r = 0; r < N; r++) if (grid[r].every(Boolean)) rows.push(r);
  for (let c = 0; c < N; c++) if (grid.every(row => row[c])) cols.push(c);
  const lines = rows.length + cols.length;
  if (lines) {
    const centerR = r0 + shape.h / 2, centerC = c0 + shape.w / 2, hit = new Map();
    for (const r of rows) for (let c = 0; c < N; c++) hit.set(r * N + c, Math.abs(c + 0.5 - centerC));
    for (const c of cols) for (let r = 0; r < N; r++) { const k = r * N + c, d = Math.abs(r + 0.5 - centerR); hit.set(k, hit.has(k) ? Math.min(hit.get(k), d) : d); }
    for (const [k, d] of hit) {
      const r = (k / N) | 0, c = k % N;
      clearing.push({ r, c, v: grid[r][c], t0: now + 60, delay: d * 26, spawned: false, few: hit.size > 16 });
      grid[r][c] = 0; pop[r][c] = 0;
    }
    const clean = grid.every(row => row.every(v => !v));
    const midX = L.gx + L.B / 2 - L.pad;
    texts.push({ text: clean ? 'Tahta tertemiz!' : lines >= 2 ? 'Harika!' : 'Güzel!', x: midX, y: L.gy + L.cell * 2.6, t0: now + 120, dur: 1300, size: L.cell * (clean ? 0.95 : 0.82), role: 'accent' });
    if (clean) { flash = { t0: now + 80 }; burst(now + 60); Sfx.fullClear(); buzz([30, 40, 30, 40, 60]); }
    if (!REDUCED) shake = { amp: Math.min(3 + lines * 3 + (clean ? 8 : 0), 20), t0: now + 60 };
    Sfx.clear(lines, 1);
    buzz(lines >= 2 ? [18, 30, 24] : 20);
  } else { Sfx.place(); buzz(10); }
  tut.next = now + (lines ? 1500 : 800);
}
function tutFinish() {
  tray = [null, null, null];
  $('tutTip').hidden = true;
  $('tutDone').hidden = false;
  $('tutStart').focus({ preventScroll: true });
}
function endTutorial() {
  if (!tut) return;
  const t = tut; tut = null; drag = null;
  store.set(TUT_KEY, true);
  document.body.classList.remove('tut-on');
  $('tutTip').hidden = true; $('tutDone').hidden = true;
  const now = performance.now();
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (grid[r][c]) clearing.push({ r, c, v: grid[r][c], t0: now, delay: (r + c) * 18, spawned: true });
  grid = emptyGrid();
  if (t.stashOver || !restore(t.stash)) { grid = null; newGame(); }
  else { refreshFits(); updateHud(); checkOver(performance.now()); }
}
$('tutSkip').addEventListener('click', () => { Sfx.unlock(); Sfx.pick(); endTutorial(); });
$('tutStart').addEventListener('click', () => { Sfx.unlock(); Sfx.pick(); buzz(10); endTutorial(); });
$('helpTut').addEventListener('click', () => { closeInfo(); closeMenu(); startTutorial(); });

// a pointing hand, fingertip at 0,0; outline pass first so overlapping parts read as one shape
function drawHand(x, y, u, a, press) {
  const parts = [
    () => rr(ctx, -0.15 * u, 0, 0.3 * u, 1.0 * u, 0.15 * u),            // index finger
    () => rr(ctx, 0.12 * u, 0.42 * u, 0.27 * u, 0.55 * u, 0.135 * u),   // middle knuckle
    () => rr(ctx, 0.36 * u, 0.52 * u, 0.26 * u, 0.48 * u, 0.13 * u),    // ring knuckle
    () => rr(ctx, -0.2 * u, 0.6 * u, 0.84 * u, 0.82 * u, 0.26 * u),     // palm
    () => { ctx.beginPath(); ctx.ellipse(-0.27 * u, 0.98 * u, 0.14 * u, 0.3 * u, -0.6, 0, Math.PI * 2); }, // thumb
  ];
  ctx.save();
  ctx.translate(x, y); ctx.rotate(-0.3);
  const sc = 1 - 0.1 * press; ctx.scale(sc, sc);
  ctx.globalAlpha = a;
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = u * 0.25; ctx.shadowOffsetY = u * 0.12;
  ctx.lineWidth = u * 0.13; ctx.strokeStyle = '#1d1630'; ctx.lineJoin = 'round';
  for (const p of parts) { p(); ctx.stroke(); }
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#ffffff';
  for (const p of parts) { p(); ctx.fill(); }
  rr(ctx, -0.085 * u, 0.06 * u, 0.17 * u, 0.2 * u, 0.08 * u); ctx.fillStyle = 'rgba(255,170,170,.45)'; ctx.fill(); // nail
  ctx.restore();
}
function ripple(x, y, e, cs, a) {
  if (e <= 0 || e >= 1) return;
  ctx.save(); ctx.globalAlpha = (1 - e) * a;
  ctx.beginPath(); ctx.arc(x, y, cs * (0.25 + 0.75 * e), 0, Math.PI * 2);
  ctx.lineWidth = Math.max(2, cs * 0.08); ctx.strokeStyle = TH().accent; ctx.stroke();
  ctx.restore();
}
function drawTutHand(now) {
  const slot = tray.findIndex(Boolean);
  if (slot < 0 || now < tut.t0) return;
  const t = tray[slot]; if (t.ret) return;
  const st = TUT[tut.step], s = t.piece.shape, cs = L.cell;
  const k = ((now - tut.t0) % 2900) / 2900;
  const lift = s.h * cs / 2 + cs * 1.1;
  const sx = L.bx + L.slotW * (slot + 0.5), sy = L.trayY + L.trayH / 2;
  const [tr, tc] = st.target;
  const tx = L.gx + (tc + s.w / 2) * cs, ty = L.gy + (tr + s.h / 2) * cs; // where the piece's centre lands
  let fx, fy, carry = 0, press = 0, a = 1, ghost = 0, gx = tx, gy = ty;
  if (k < 0.16) { const e = k / 0.16; fx = sx + cs * 0.7 * (1 - e); fy = sy + cs * 0.9 * (1 - e); a = Math.min(1, e * 1.6); press = e > 0.75 ? (e - 0.75) / 0.25 : 0; }
  else if (k < 0.62) { const e = inOut((k - 0.16) / 0.46); fx = lerp(sx, tx, e); fy = lerp(sy, ty + lift, e); carry = clamp01((k - 0.16) / 0.08); press = 1; ghost = 0.7; gx = fx; gy = fy - lift * carry; }
  else if (k < 0.7) { fx = tx; fy = ty + lift; press = 1 - (k - 0.62) / 0.08; carry = 1; ghost = 0.7; }
  else { const e = (k - 0.7) / 0.3; fx = tx + cs * 0.6 * e; fy = ty + lift + cs * 0.7 * e; a = 1 - e; ghost = 0.7 * Math.max(0, 1 - e * 2.5); }
  if (ghost > 0) drawPiece(theme.cur, t.piece, gx, gy, lerp(L.trayCell, cs, carry), ghost);
  ripple(sx, sy, (k - 0.12) / 0.14, cs, 0.9);
  ripple(tx, ty + lift, (k - 0.66) / 0.14, cs, 0.9);
  drawHand(fx, fy, cs * 1.25, a, press);
}

/* ---------- Rendering ---------- */
function drawSprite(spr, x, y, size, scale = 1) {
  const sz = size * scale;
  ctx.drawImage(spr, x + (size - sz) / 2, y + (size - sz) / 2, sz, sz);
}
// card-flip from old theme sprite to new one
function drawFlip(sOld, sNew, x, y, cs, t, scale = 1) {
  if (t >= 1) return drawSprite(sNew, x, y, cs, scale);
  if (t <= 0) return drawSprite(sOld, x, y, cs, scale);
  const k = Math.cos(t * Math.PI);
  ctx.save();
  ctx.translate(x + cs / 2, y + cs / 2);
  ctx.scale(Math.max(0.02, Math.abs(k)) * scale, scale * (1 + 0.14 * Math.sin(t * Math.PI)));
  ctx.drawImage(k > 0 ? sOld : sNew, -cs / 2, -cs / 2, cs, cs);
  ctx.restore();
}
const flipT = (now, delay) => REDUCED ? (now >= theme.t0 ? 1 : 0) : clamp01((now - theme.t0 - delay) / 280);

function drawPiece(ti, piece, cx, cy, cs, alpha = 1, flip = 1) {
  const s = piece.shape;
  const x0 = cx - s.w * cs / 2, y0 = cy - s.h * cs / 2;
  ctx.globalAlpha = alpha;
  const sNew = sprite(ti, piece.color), sOld = flip < 1 ? sprite(theme.prev, piece.color, 0, theme.prevMode) : sNew;
  for (const [r, c] of s.cells) drawFlip(sOld, sNew, x0 + c * cs, y0 + r * cs, cs, flip);
  ctx.globalAlpha = 1;
}
// stamp a particle with the theme's effect: shape, how it falls or floats, glow
function fxParticle(fx, p) {
  p.kind = fx.p; p.g = fx.g; p.drag = fx.drag || 0; p.wob = fx.wobble || 0; p.glow = !!fx.glow; p.ph = Math.random() * 6.28;
  if (p.drag) p.max *= 1.5; // floaty kinds linger a little longer
  if (fx.p === 'bubble' || fx.p === 'firefly' || fx.p === 'ember' || fx.p === 'star') p.vr *= 0.3;
  return p;
}
function spawnParticles(it) {
  const th = TH(), fx = th.fx;
  const n = REDUCED ? 1 : it.few ? 3 : 5;
  const cx = L.gx + (it.c + 0.5) * L.cell, cy = L.gy + (it.r + 0.5) * L.cell;
  const color = th.blocks[(it.v - 1) % 7] || th.accent;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = (0.6 + Math.random()) * L.cell * 4;
    particles.push(fxParticle(fx, {
      x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - L.cell * 4,
      life: 0, max: 0.55 + Math.random() * 0.35, size: L.cell * (0.14 + Math.random() * 0.14),
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 12, color,
    }));
  }
  if (it.gem) for (let i = 0; i < (REDUCED ? 2 : 7); i++) { // a breaking gem throws a few accent sparks
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, v = (0.8 + Math.random()) * L.cell * 4.5;
    particles.push(fxParticle({ p: 'star', g: 0.5, drag: 1.4, glow: true }, {
      x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 0.6 + Math.random() * 0.4,
      size: L.cell * (0.18 + Math.random() * 0.14), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 8, color: th.accent,
    }));
  }
}
// soft round glow, cached per color, drawn additively
const glows = new Map();
function glowSprite(color) {
  if (glows.has(color)) return glows.get(color);
  const c = document.createElement('canvas'); c.width = c.height = 48;
  const g = c.getContext('2d'), gr = g.createRadialGradient(24, 24, 0, 24, 24, 24);
  gr.addColorStop(0, rgba(color, 0.9)); gr.addColorStop(0.35, rgba(color, 0.4)); gr.addColorStop(1, rgba(color, 0));
  g.fillStyle = gr; g.fillRect(0, 0, 48, 48);
  glows.set(color, c);
  return c;
}
// clear-effect particles for the newer themes; drawn on ctx already moved to the particle
const PARTS = {
  coin(p, s) {
    ctx.rotate(p.rot * 0.2); ctx.scale(Math.abs(Math.cos(p.life * 12 + p.ph)) + 0.08, 1);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2); ctx.fillStyle = shade(p.color, 0.1); ctx.fill();
    ctx.lineWidth = Math.max(1, s * 0.12); ctx.strokeStyle = shade(p.color, -0.3); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,245,200,.8)'; ctx.lineWidth = Math.max(1, s * 0.08); ctx.stroke();
  },
  shard(p, s) {
    ctx.rotate(p.rot);
    ctx.beginPath(); ctx.moveTo(0, -s * 0.8); ctx.lineTo(s * 0.45, s * 0.4); ctx.lineTo(-s * 0.3, s * 0.55); ctx.closePath();
    ctx.fillStyle = rgba(p.color, 0.5); ctx.fill(); ctx.lineWidth = Math.max(1, s * 0.08); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.stroke();
  },
  crumb(p, s) {
    ctx.rotate(p.rot);
    ctx.beginPath(); ctx.moveTo(-s * 0.4, -s * 0.3); ctx.lineTo(s * 0.35, -s * 0.4); ctx.lineTo(s * 0.45, s * 0.25); ctx.lineTo(-s * 0.2, s * 0.42); ctx.closePath();
    ctx.fillStyle = shade(p.color, -0.1); ctx.fill();
    ctx.fillStyle = 'rgba(255,220,190,.35)'; ctx.fillRect(-s * 0.3, -s * 0.3, s * 0.3, s * 0.15);
  },
  chip(p, s) {
    ctx.rotate(p.rot); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.5, 0.2, 2.6);
    ctx.lineWidth = Math.max(1.5, s * 0.28); ctx.strokeStyle = shade(p.color, 0.15); ctx.stroke();
    ctx.lineWidth = Math.max(1, s * 0.08); ctx.strokeStyle = shade(p.color, -0.25); ctx.stroke();
  },
  ring(p, s, k) {
    const r = p.size * (0.4 + (1 - k) * 1.8);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.lineWidth = Math.max(1, p.size * 0.2 * k); ctx.strokeStyle = shade(p.color, 0.25); ctx.stroke();
    ctx.beginPath(); ctx.arc(-r * 0.4, -r * 0.4, Math.max(0.8, r * 0.12), 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fill();
  },
  pixel(p, s) {
    const q = Math.max(2, Math.round(s * 0.7));
    ctx.fillStyle = p.color; ctx.fillRect(-q / 2, -q / 2, q, q);
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(-q / 2, -q / 2, q / 2, q / 2);
  },
  bat(p, s) { batShape(ctx, 0, 0, s * 0.9, Math.sin(p.life * 28 + p.ph), shade(p.color, -0.6), p.vx < 0); },
  fleck(p, s) {
    ctx.rotate(p.rot); const k = Math.abs(Math.cos(p.life * 9 + p.ph));
    ctx.fillStyle = mixHex('#e8c45a', '#fff6d0', k * 0.7); ctx.fillRect(-s * 0.35, -s * 0.35 * (0.2 + 0.8 * k), s * 0.7, s * 0.7 * (0.2 + 0.8 * k));
  },
  paper(p, s) {
    ctx.rotate(p.rot * 0.5); ctx.scale(1, 0.15 + 0.85 * Math.abs(Math.sin(p.life * 6 + p.ph)));
    ctx.fillStyle = mixHex(p.color, '#ffffff', 0.15); ctx.fillRect(-s * 0.55, -s * 0.4, s * 1.1, s * 0.8);
    ctx.strokeStyle = 'rgba(0,0,0,.15)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.4); ctx.lineTo(s * 0.55, s * 0.4); ctx.stroke();
  },
};
function drawParticle(p, k, light) {
  const s = p.size * (0.4 + 0.6 * k);
  const a = Math.min(1, k * 1.5);
  ctx.save();
  ctx.translate(p.x, p.y);
  if (p.glow && !light) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = a * 0.8;
    const gs = s * (p.kind === 'streak' ? 2.4 : 3.2);
    ctx.drawImage(glowSprite(p.color), -gs / 2, -gs / 2, gs, gs);
  }
  ctx.globalAlpha = a;
  switch (p.kind) {
    case 'bubble': {
      const r = s * 0.7;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = rgba(p.color, 0.18); ctx.fill();
      ctx.lineWidth = Math.max(1, r * 0.22); ctx.strokeStyle = shade(p.color, 0.35); ctx.stroke();
      ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.35, r * 0.22, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill();
      break;
    }
    case 'firefly': case 'ember': {
      ctx.beginPath(); ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = p.kind === 'ember' ? shade(p.color, 0.55) : shade(p.color, 0.7); ctx.fill();
      break;
    }
    case 'diamond': {
      ctx.rotate(p.rot);
      ctx.beginPath(); ctx.moveTo(0, -s * 0.75); ctx.lineTo(s * 0.4, 0); ctx.lineTo(0, s * 0.75); ctx.lineTo(-s * 0.4, 0); ctx.closePath();
      ctx.fillStyle = p.color; ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, -s * 0.75); ctx.lineTo(s * 0.4, 0); ctx.lineTo(0, 0); ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fill();
      break;
    }
    case 'flake': {
      ctx.rotate(p.rot * 0.4);
      ctx.strokeStyle = mixHex(p.color, '#ffffff', 0.6); ctx.lineWidth = Math.max(1, s * 0.16); ctx.lineCap = 'round';
      const r = s * 0.7;
      for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke(); }
      break;
    }
    case 'streak': {
      if (!light) ctx.globalCompositeOperation = 'lighter';
      const sp = Math.hypot(p.vx, p.vy) || 1, len = Math.min(s * 4, s * 0.8 + sp * 0.03);
      ctx.rotate(Math.atan2(p.vy, p.vx));
      ctx.lineCap = 'round';
      ctx.strokeStyle = p.color; ctx.lineWidth = Math.max(1, s * 0.4);
      ctx.beginPath(); ctx.moveTo(-len, 0); ctx.lineTo(0, 0); ctx.stroke();
      ctx.strokeStyle = shade(p.color, 0.7); ctx.lineWidth = Math.max(1, s * 0.15); ctx.stroke();
      break;
    }
    case 'petal': {
      ctx.rotate(p.rot * 0.5);
      ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.sin(p.life * 5 + p.ph)));
      ctx.beginPath(); ctx.moveTo(0, -s * 0.7);
      ctx.quadraticCurveTo(s * 0.6, -s * 0.1, 0, s * 0.7); ctx.quadraticCurveTo(-s * 0.6, -s * 0.1, 0, -s * 0.7);
      ctx.fillStyle = mixHex(p.color, '#ffffff', 0.35); ctx.fill();
      break;
    }
    case 'drop': { // honey drop, stretched along its fall
      const sp = Math.hypot(p.vx, p.vy) || 1, st = Math.min(1.8, 1 + sp * 0.002);
      ctx.rotate(Math.atan2(p.vy, p.vx) - Math.PI / 2);
      const r = s * 0.5;
      ctx.beginPath(); ctx.moveTo(0, -r * 1.6 * st);
      ctx.quadraticCurveTo(r * 1.05, r * 0.1, 0, r); ctx.quadraticCurveTo(-r * 1.05, r * 0.1, 0, -r * 1.6 * st);
      ctx.fillStyle = shade(p.color, 0.1); ctx.fill();
      ctx.beginPath(); ctx.arc(-r * 0.3, r * 0.15, r * 0.25, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,250,225,.8)'; ctx.fill();
      break;
    }
    case 'star': {
      ctx.rotate(p.rot * 0.3);
      const r = s * 0.8, q = r * 0.22;
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.quadraticCurveTo(q, -q, r, 0); ctx.quadraticCurveTo(q, q, 0, r);
      ctx.quadraticCurveTo(-q, q, -r, 0); ctx.quadraticCurveTo(-q, -q, 0, -r);
      ctx.fillStyle = shade(p.color, 0.55); ctx.fill();
      break;
    }
    default:
      if (PARTS[p.kind]) { PARTS[p.kind](p, s, k); break; }
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-s / 2, -s / 2, s, s);
  }
  ctx.restore();
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;

  if (tut && tut.next && now >= tut.next) { tut.next = 0; if (tut.step + 1 < TUT.length) tutGo(tut.step + 1, now); else tutFinish(); }
  if (pendingTheme && now >= pendingTheme.at) { const p = pendingTheme; pendingTheme = null; setTheme(p.i, now, { unlocked: !!p.unlocked, finale: !!p.finale }); if (!over) save(); }
  applyDomColors(now);

  displayScore += (score - displayScore) * Math.min(1, dt * 9);
  if (Math.abs(score - displayScore) < 0.5) displayScore = score;
  const ds = Math.round(displayScore);
  if (ds !== shownScore) { shownScore = ds; elScore.textContent = ds.toLocaleString('tr-TR'); }

  const gravity = L.cell * 22;
  for (const p of particles) {
    p.life += dt; if (p.life < 0) continue;
    if (p.drag) { const d = Math.exp(-p.drag * dt); p.vx *= d; p.vy *= d; }
    p.vy += gravity * (p.g ?? 1) * dt;
    p.x += p.vx * dt + (p.wob ? Math.sin(p.life * 6 + p.ph) * L.cell * 1.2 * p.wob * dt : 0);
    p.y += p.vy * dt; p.rot += p.vr * dt;
  }
  particles = particles.filter(p => p.life < p.max);

  if (!menuOpen && !over && !tut && !document.hidden && now - lastInput < 45000 && $('gallery').hidden && $('info').hidden && $('settings').hidden && $('levels').hidden) {
    if (mode === 'puzzle') stats.puzzleSec += dt; // kept apart: total play time drives a theme task
    else stats.playSec += dt;
    playAcc += dt;
    if (mode === 'zen') {
      stats.zenSec += dt;
      const hr = hourNow();
      if (hr >= 5 && hr < 10) stats.zenMorningSec += dt; else if (hr >= 19 && hr < 23) stats.zenEveningSec += dt;
    }
    if (playAcc > 10) { playAcc = 0; store.set(STATS_KEY, stats); checkUnlocks(now); }
  }
  drawBg(now, dt);
  draw(now);
  if (menuOpen) drawLogo();
  requestAnimationFrame(frame);
}

function draw(now) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const cs = L.cell, th = TH(), ti = theme.cur, tp = theme.prev;
  const pm = theme.prevMode;
  const FI = theme.mode === 'classic' ? 0.015 : 0.06, FR = theme.mode === 'classic' ? 0.05 : 0.16;
  const flipping = now - theme.t0 < THEME_DUR + 200 && (tp !== ti || pm !== theme.mode);
  const bm = inOut(clamp01((now - theme.t0) / THEME_DUR));

  let sx = 0, sy = 0;
  if (shake) {
    const t = (now - shake.t0) / 280;
    if (t >= 1) shake = null;
    else if (t > 0) { const a = shake.amp * Math.pow(1 - t, 2); sx = (Math.random() * 2 - 1) * a; sy = (Math.random() * 2 - 1) * a; }
  }
  ctx.save(); ctx.translate(sx, sy);

  // board
  rr(ctx, L.bx, L.by, L.B, L.B, L.B * (theme.mode === 'classic' ? 0.022 : 0.035));
  ctx.fillStyle = flipping ? mixHex(THEMES[tp].board, th.board, bm) : th.board; ctx.fill();
  ctx.strokeStyle = th.light ? 'rgba(255,255,255,.45)' : 'rgba(255,255,255,.07)'; ctx.lineWidth = 2; ctx.stroke();

  const tgt = drag && drag.target;
  const dragColor = drag && drag.piece.color;
  const pzg = mode === 'puzzle' && !tut ? puz.gems : null; // gems on the board
  const greyRows = over && !(pzg && puz.won) ? Math.floor((now - overT0) / 70) : -1; // a won level does not grey out
  const pulse = 0.5 + 0.5 * Math.sin(now / 90);

  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const x = L.gx + c * cs, y = L.gy + r * cs;
    const ft = flipping ? flipT(now, 150 + (r + c) * 45) : 1;
    drawFlip(sprite(tp, 0, 0, pm), sprite(ti, 0), x, y, cs, ft);
    let v = grid[r][c];
    if (!v) continue;
    let s = 1;
    const a = pop[r][c];
    if (a) {
      const t = clamp01((now - a) / 240);
      s = 0.6 + 0.4 * outBack(t);
      if (t >= 1) pop[r][c] = 0;
    }
    if (over && r < greyRows) v = GREY;
    const lit = tgt && tgt.hl && tgt.hl.has(r * N + c);
    if (lit) v = dragColor;
    drawFlip(sprite(tp, v, 0, pm), sprite(ti, v), x, y, cs, ft, s);
    if (pzg && pzg[r][c]) drawGemOn(ctx, ti, x, y, cs, DPR, 0.86 * s);
    if (lit) {
      ctx.globalAlpha = 0.12 + 0.12 * pulse;
      rr(ctx, x + cs * FI, y + cs * FI, cs * (1 - 2 * FI), cs * (1 - 2 * FI), cs * FR);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  if (tut && !tut.next && !drag && tray.some(Boolean) && !TUT[tut.step].free) {
    const st = TUT[tut.step], k = 0.5 + 0.5 * Math.sin(now / 240);
    ctx.globalAlpha = 0.16 + 0.22 * k; ctx.fillStyle = th.accent;
    for (const [dr, dc] of SHAPES[st.piece].cells) { rr(ctx, L.gx + (st.target[1] + dc) * cs + cs * FI, L.gy + (st.target[0] + dr) * cs + cs * FI, cs * (1 - 2 * FI), cs * (1 - 2 * FI), cs * FR); ctx.fill(); }
    ctx.globalAlpha = 1;
  }

  if (tgt) {
    const spr = sprite(ti, dragColor);
    ctx.globalAlpha = 0.38;
    for (const [dr, dc] of drag.piece.shape.cells) ctx.drawImage(spr, L.gx + (tgt.c + dc) * cs, L.gy + (tgt.r + dr) * cs, cs, cs);
    ctx.globalAlpha = 1;
  }

  for (const it of clearing) {
    const t = (now - it.t0 - it.delay) / 300;
    const x = L.gx + it.c * cs, y = L.gy + it.r * cs;
    if (t >= 0 && !it.spawned) { it.spawned = true; spawnParticles(it); }
    const spr = sprite(ti, it.v);
    const fl = th.fx.flash || shade(th.blocks[(it.v - 1) % 7] || th.accent, 0.45);
    if (t < 0) {
      drawSprite(spr, x, y, cs, 1);
      if (now > it.t0) {
        ctx.globalAlpha = 0.45;
        rr(ctx, x + cs * FI, y + cs * FI, cs * (1 - 2 * FI), cs * (1 - 2 * FI), cs * FR);
        ctx.fillStyle = fl; ctx.fill(); ctx.globalAlpha = 1;
      }
    } else if (t < 1) {
      const s = 1 - t * t;
      ctx.globalAlpha = 1 - t * 0.4;
      drawSprite(spr, x, y, cs, s * (1 + 0.15 * Math.sin(t * Math.PI)));
      ctx.globalAlpha = (1 - t) * 0.6;
      const w = cs * (1 - 2 * FI) * s;
      rr(ctx, x + (cs - w) / 2, y + (cs - w) / 2, w, w, cs * FR * s);
      ctx.fillStyle = fl; ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (it.gem && t < 1) { // the gem lifts off its block and fades as the line clears
      const k = clamp01(t);
      ctx.globalAlpha = 1 - k;
      drawGemOn(ctx, ti, x, y - cs * 0.5 * outCubic(k), cs, DPR, 0.86 * (1 + 0.5 * k));
      ctx.globalAlpha = 1;
    }
  }
  clearing = clearing.filter(it => (now - it.t0 - it.delay) / 300 < 1);
  if (flash) {
    const t = (now - flash.t0) / 700;
    if (t >= 1) flash = null;
    else if (t > 0) {
      rr(ctx, L.bx, L.by, L.B, L.B, L.B * 0.03);
      ctx.fillStyle = rgba(th.accent, 0.35 * (1 - t) * (1 - t)); ctx.fill();
    }
  }
  ctx.restore();

  // tray
  for (let i = 0; i < 3; i++) {
    const t = tray[i];
    if (!t || (drag && drag.slot === i)) continue;
    let cx = L.bx + L.slotW * (i + 0.5), cy = L.trayY + L.trayH / 2, c2 = L.trayCell;
    let alpha = t.fits ? 1 : 0.32;
    const ta = (now - t.appear) / 340;
    if (ta < 1) {
      if (ta <= 0) continue;
      c2 *= Math.max(0.01, outBack(ta));
      cy += (1 - outCubic(ta)) * L.trayH * 0.3;
    }
    if (t.ret) {
      const tr = clamp01((now - t.ret.t0) / 180), e = outCubic(tr);
      cx = lerp(t.ret.x, cx, e); cy = lerp(t.ret.y, cy, e); c2 = lerp(t.ret.cell, L.trayCell, e);
      alpha = 1;
      if (tr >= 1) t.ret = null;
    }
    drawPiece(ti, t.piece, cx, cy, c2, alpha, flipping ? flipT(now, 380 + i * 90) : 1);
  }

  // particles
  for (const p of particles) {
    if (p.life < 0) continue;
    drawParticle(p, 1 - p.life / p.max, !!th.light);
  }
  ctx.globalAlpha = 1;

  // floating texts
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  for (const tx of texts) {
    const t = (now - tx.t0) / tx.dur;
    if (t < 0 || t >= 1) continue;
    const sc = t < 0.18 ? outBack(t / 0.18) : 1;
    const y = tx.y - outCubic(t) * cs * 1.1;
    ctx.globalAlpha = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
    ctx.font = `800 ${Math.max(1, tx.size * sc)}px "Baloo 2", "Trebuchet MS", sans-serif`;
    ctx.lineWidth = tx.size * 0.22;
    ctx.strokeStyle = rgba(th.stroke, 0.88);
    const half = ctx.measureText(tx.text).width / 2 + tx.size * 0.15;
    const x = Math.max(L.bx + half, Math.min(L.bx + L.B - half, tx.x)); // keep the text on the board
    ctx.strokeText(tx.text, x, y);
    ctx.fillStyle = tx.role === 'accent' ? th.accent : th.fg;
    ctx.fillText(tx.text, x, y);
  }
  ctx.globalAlpha = 1;
  texts = texts.filter(tx => (now - tx.t0) / tx.dur < 1);

  // theme banner
  if (banner) {
    const t = (now - banner.t0) / banner.dur;
    if (t >= 1) banner = null;
    else if (t > 0) {
      const inT = clamp01(t / 0.16), outT = clamp01((t - 0.78) / 0.22);
      const a = inT * (1 - outT), cx = L.bx + L.B / 2, cy = L.by + L.B / 2;
      const bh = cs * 2.5 * outCubic(inT);
      ctx.globalAlpha = a;
      ctx.fillStyle = rgba(th.light ? th.stroke : th.board, 0.78);
      ctx.fillRect(L.bx, cy - bh / 2, L.B, bh);
      ctx.fillStyle = th.accent;
      ctx.fillRect(L.bx + L.B * (0.5 - 0.3 * outCubic(inT)), cy - bh / 2, L.B * 0.6 * outCubic(inT), 2);
      ctx.fillRect(L.bx + L.B * (0.5 - 0.3 * outCubic(inT)), cy + bh / 2 - 2, L.B * 0.6 * outCubic(inT), 2);
      const slide = (1 - outCubic(inT)) * cs * 0.8 - outT * cs * 0.5;
      try { ctx.letterSpacing = Math.round(cs * 0.08) + 'px'; } catch (e) {}
      ctx.font = `700 ${cs * 0.3}px "Baloo 2", "Trebuchet MS", sans-serif`;
      ctx.fillStyle = th.accent;
      ctx.fillText(banner.sub, cx + slide, cy - cs * 0.55);
      try { ctx.letterSpacing = '0px'; } catch (e) {}
      const fs = cs * 0.86 * (0.85 + 0.15 * outBack(inT));
      ctx.font = `800 ${fs}px "Baloo 2", "Trebuchet MS", sans-serif`;
      ctx.lineWidth = fs * 0.16; ctx.strokeStyle = rgba(th.stroke, 0.9);
      ctx.strokeText(banner.name, cx - slide, cy + cs * 0.22);
      ctx.fillStyle = th.fg;
      ctx.fillText(banner.name, cx - slide, cy + cs * 0.22);
      ctx.globalAlpha = 1;
    }
  }

  // dragged piece
  if (drag) {
    const tl = outCubic(clamp01((now - drag.t0) / 110));
    const c2 = lerp(L.trayCell, cs, tl);
    const cy = drag.y - liftFor(drag) * tl;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 8;
    drawPiece(ti, drag.piece, drag.x, cy, c2 * 1.02, 1);
    ctx.restore();
  }

  if (tut && !drag && !tut.next && tray.some(Boolean)) drawTutHand(now);
}

/* ---------- Third theme set: shapes shared by blocks, backgrounds and particles ---------- */
function fishShape(g, x, y, r, dir, fill, wag = 0) {
  g.save(); g.translate(x, y); g.scale(dir, 1);
  g.beginPath(); g.ellipse(0, 0, r, r * 0.45, 0, 0, Math.PI * 2);
  g.moveTo(-r * 0.75, 0); g.lineTo(-r * 1.5, -r * 0.45 * (1 + 0.25 * wag)); g.lineTo(-r * 1.5, r * 0.45 * (1 - 0.25 * wag)); g.closePath();
  g.fillStyle = fill; g.fill();
  g.restore();
}
// hieroglyphs: eye, water, sun disc, feather (path only, stroked by the caller)
function glyph(g, kind, x, y, r) {
  g.beginPath();
  if (kind === 0) {
    g.moveTo(x - r, y); g.quadraticCurveTo(x, y - r * 0.8, x + r, y); g.quadraticCurveTo(x, y + r * 0.8, x - r, y);
    g.moveTo(x + r * 0.25, y); g.arc(x, y, r * 0.25, 0, Math.PI * 2);
    g.moveTo(x - r * 0.25, y + r * 0.35); g.lineTo(x - r * 0.45, y + r * 0.95);
  } else if (kind === 1) {
    for (let i = 0; i < 3; i++) { const yy = y - r * 0.5 + i * r * 0.5; g.moveTo(x - r, yy); for (let j = 1; j <= 6; j++) g.lineTo(x - r + j * r / 3, yy + (j % 2 ? -r * 0.2 : 0)); }
  } else if (kind === 2) {
    g.moveTo(x + r * 0.7, y); g.arc(x, y, r * 0.7, 0, Math.PI * 2);
    g.moveTo(x + r * 0.15, y); g.arc(x, y, r * 0.15, 0, Math.PI * 2);
  } else {
    g.moveTo(x, y + r); g.quadraticCurveTo(x - r * 0.65, y - r * 0.1, x + r * 0.1, y - r);
    g.quadraticCurveTo(x + r * 0.45, y, x, y + r); g.moveTo(x, y + r * 0.6); g.lineTo(x + r * 0.05, y - r * 0.6);
  }
}
function rosette(g, x, y, r, petal, center) {
  g.fillStyle = petal;
  for (let i = 0; i < 8; i++) { g.save(); g.translate(x, y); g.rotate(i * Math.PI / 4); g.beginPath(); g.ellipse(r * 0.55, 0, r * 0.45, r * 0.2, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
  g.beginPath(); g.arc(x, y, r * 0.25, 0, Math.PI * 2); g.fillStyle = center; g.fill();
}
function tulipPath(g, x, y, r) {
  g.beginPath(); g.moveTo(x, y + r * 0.35);
  g.quadraticCurveTo(x - r * 0.95, y + r * 0.05, x - r * 0.5, y - r * 0.85);
  g.quadraticCurveTo(x - r * 0.25, y - r * 0.3, x, y - r);
  g.quadraticCurveTo(x + r * 0.25, y - r * 0.3, x + r * 0.5, y - r * 0.85);
  g.quadraticCurveTo(x + r * 0.95, y + r * 0.05, x, y + r * 0.35);
  g.closePath();
}
function gearPath(g, x, y, r, n, rot = 0, hole = 0.35) {
  g.beginPath();
  const ri = r * 0.78, st = Math.PI * 2 / n;
  for (let i = 0; i < n; i++) {
    const a = rot + i * st;
    [[ri, a], [r, a + st * 0.15], [r, a + st * 0.45], [ri, a + st * 0.6]].forEach(([rad, an], j) => {
      const px = x + Math.cos(an) * rad, py = y + Math.sin(an) * rad;
      if (i === 0 && j === 0) g.moveTo(px, py); else g.lineTo(px, py);
    });
  }
  g.closePath();
  if (hole) { g.moveTo(x + r * hole, y); g.arc(x, y, r * hole, 0, Math.PI * 2); }
}
const MAPLE = (() => {
  const R = [[0, -1], [0.18, -0.62], [0.42, -0.78], [0.4, -0.38], [0.86, -0.42], [0.66, -0.1], [0.9, 0.12], [0.42, 0.22], [0.36, 0.5], [0.08, 0.36], [0.04, 0.6], [0.04, 0.95]];
  return [...R, ...R.slice(1).reverse().map(([x, y]) => [-x, y])];
})();
function mapleShape(g, x, y, r, rot) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.beginPath(); MAPLE.forEach(([px, py], i) => i ? g.lineTo(px * r, py * r) : g.moveTo(px * r, py * r)); g.closePath();
  g.restore();
}
function noteShape(g, x, y, r) { // eighth note, filled with the current fillStyle
  g.save(); g.translate(x, y);
  g.beginPath(); g.ellipse(-r * 0.2, r * 0.55, r * 0.32, r * 0.22, -0.4, 0, Math.PI * 2); g.fill();
  g.fillRect(r * 0.04, -r * 0.75, r * 0.1, r * 1.3);
  g.beginPath(); g.moveTo(r * 0.14, -r * 0.75); g.quadraticCurveTo(r * 0.55, -r * 0.45, r * 0.42, -r * 0.05); g.quadraticCurveTo(r * 0.42, -r * 0.35, r * 0.14, -r * 0.42); g.fill();
  g.restore();
}
const CLOUD = [[0.3, 0.4, 0.2], [0.53, 0.3, 0.24], [0.74, 0.42, 0.2], [0.24, 0.64, 0.2], [0.5, 0.62, 0.26], [0.76, 0.66, 0.2]];
function cloudPath(g, s, dy = 0) {
  g.beginPath();
  for (const [x, y, r] of CLOUD) { g.moveTo(s * x + s * r, s * y + dy); g.arc(s * x, s * y + dy, s * r, 0, Math.PI * 2); }
  g.rect(s * 0.2, s * 0.35 + dy, s * 0.6, s * 0.38);
}
function koiShape(g, x, y, r, ang, body, wag) {
  g.save(); g.translate(x, y); g.rotate(ang);
  g.beginPath(); g.ellipse(0, 0, r, r * 0.36, 0, 0, Math.PI * 2);
  g.moveTo(-r * 0.8, 0); g.quadraticCurveTo(-r * 1.25, -r * 0.2 + wag * r * 0.2, -r * 1.55, -r * 0.42); g.lineTo(-r * 1.4, 0); g.lineTo(-r * 1.55, r * 0.42); g.quadraticCurveTo(-r * 1.25, r * 0.2 + wag * r * 0.2, -r * 0.8, 0);
  g.fillStyle = body; g.fill();
  g.beginPath(); g.ellipse(r * 0.15, -r * 0.05, r * 0.28, r * 0.16, 0.3, 0, Math.PI * 2); g.fillStyle = 'rgba(216,64,40,.55)'; g.fill();
  g.restore();
}
function palm(g, x, y, H, dir, sway, a) {
  const tx = x + dir * H * 0.28 + sway * H, ty = y - H;
  g.strokeStyle = `rgba(90,60,30,${0.55 * a})`; g.lineWidth = H * 0.05; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + dir * H * 0.02, y - H * 0.6, tx, ty); g.stroke();
  g.fillStyle = `rgba(40,120,60,${0.6 * a})`;
  for (let i = 0; i < 6; i++) {
    const an = -Math.PI / 2 + (i - 2.5) * 0.55 + sway * 2, L = H * 0.32;
    const ex = tx + Math.cos(an) * L, ey = ty + Math.sin(an) * L + L * 0.35;
    g.beginPath(); g.moveTo(tx, ty);
    g.quadraticCurveTo(tx + Math.cos(an) * L * 0.6, ty + Math.sin(an) * L * 0.6 - L * 0.15, ex, ey);
    g.quadraticCurveTo(tx + Math.cos(an) * L * 0.5, ty + Math.sin(an) * L * 0.5 + L * 0.05, tx, ty);
    g.fill();
  }
  g.lineCap = 'butt';
}
// stroke the current path twice: a light edge offset down-right, then the dark cut, so it reads as carved
function carved(g, build, lw, light, dark) {
  g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
  g.save(); g.translate(lw * 0.6, lw * 0.6); build(); g.strokeStyle = light; g.stroke(); g.restore();
  build(); g.strokeStyle = dark; g.stroke();
}

/* ---------- Third theme set, part 1: block looks and textures ---------- */
Object.assign(STYLES, {
  aurora: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.16); g.fillStyle = mixHex(c, '#06121e', 0.55); g.fill();
      g.save(); rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.84, s * 0.14); g.clip();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#0a1a2a', 0.2)); gr.addColorStop(1, mixHex(c, '#06121e', 0.62));
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      TEX.aurora(g, s, c, seeded(c), 1);
      g.restore();
      rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.84, s * 0.14); g.strokeStyle = 'rgba(220,255,250,.5)'; g.lineWidth = Math.max(1, s * 0.03); g.stroke();
    },
  },
  coral: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.26); g.fillStyle = shade(c, -0.3); g.fill();
      const gr = g.createRadialGradient(s * 0.4, s * 0.35, s * 0.05, s * 0.5, s * 0.5, s * 0.62);
      gr.addColorStop(0, shade(c, 0.3)); gr.addColorStop(1, shade(c, -0.08));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.24); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'coral', 1, 0.07, 0.24);
    },
  },
  tomb: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.06); g.fillStyle = shade(c, -0.45); g.fill();
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, shade(c, 0.22)); gr.addColorStop(1, shade(c, -0.12));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.05); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'tomb', 1, 0.06, 0.05);
    },
  },
  iznik: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.fillStyle = shade(c, -0.3); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.08); g.fillStyle = mixHex(c, '#fbfdff', 0.84); g.fill();
      g.save(); rr(g, s * 0.12, s * 0.11, s * 0.76, s * 0.74, s * 0.05); g.clip();
      g.globalAlpha = 0.4; g.fillStyle = c;
      for (const [x, y] of [[0.12, 0.11], [0.88, 0.11], [0.12, 0.85], [0.88, 0.85]]) { g.beginPath(); g.arc(s * x, s * y, s * 0.14, 0, Math.PI * 2); g.fill(); }
      g.globalAlpha = 1;
      g.strokeStyle = '#2f8a4a'; g.lineWidth = Math.max(1, s * 0.03); g.lineCap = 'round';
      g.beginPath(); g.moveTo(s * 0.5, s * 0.58); g.quadraticCurveTo(s * 0.47, s * 0.7, s * 0.5, s * 0.82); g.stroke();
      g.fillStyle = '#2f8a4a';
      for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(s * (0.5 + sd * 0.11), s * 0.72, s * 0.1, s * 0.035, sd * -0.6, 0, Math.PI * 2); g.fill(); }
      tulipPath(g, s * 0.5, s * 0.5, s * 0.25); g.fillStyle = c; g.fill();
      g.beginPath(); g.arc(s * 0.5, s * 0.45, s * 0.05, 0, Math.PI * 2); g.fillStyle = c === '#d8402e' ? '#1f5fc8' : '#d8402e'; g.fill();
      g.restore();
      rr(g, s * 0.12, s * 0.11, s * 0.76, s * 0.74, s * 0.05); g.strokeStyle = c; g.lineWidth = Math.max(1, s * 0.03); g.stroke();
      g.beginPath(); g.ellipse(s * 0.32, s * 0.18, s * 0.18, s * 0.04, -0.3, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill();
    },
  },
  balloon: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.2); g.fillStyle = shade(c, -0.3); g.fill();
      g.save(); rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.83, s * 0.18); g.clip();
      g.fillStyle = c; g.fillRect(0, 0, s, s);
      TEX.balloon(g, s, c, seeded(c), 1);
      const sh = g.createLinearGradient(0, 0, s, 0); sh.addColorStop(0, 'rgba(0,0,0,.16)'); sh.addColorStop(0.35, 'rgba(255,255,255,.18)'); sh.addColorStop(1, 'rgba(0,0,0,.22)');
      g.fillStyle = sh; g.fillRect(0, 0, s, s);
      g.restore();
    },
  },
  ebru: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = shade(c, -0.35); g.fill();
      g.save(); rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.1); g.clip();
      g.fillStyle = c; g.fillRect(0, 0, s, s);
      TEX.ebru(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
  gear: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.09); g.fillStyle = shade(c, -0.5); g.fill();
      const lg = g.createLinearGradient(0, 0, s, s);
      lg.addColorStop(0, shade(c, 0.45)); lg.addColorStop(0.45, c); lg.addColorStop(0.7, shade(c, -0.15)); lg.addColorStop(1, shade(c, 0.15));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.07); g.fillStyle = lg; g.fill();
      texIn(g, s, c, 'gear', 1, 0.07, 0.07);
    },
  },
  storm: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.18); g.fillStyle = mixHex(c, '#05080e', 0.6); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.12)); gr.addColorStop(1, mixHex(c, '#05080e', 0.45));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.16); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'storm', 1, 0.07, 0.16);
    },
  },
  stone: {
    block(g, s, c) {
      g.beginPath(); g.ellipse(s * 0.5, s * 0.56, s * 0.44, s * 0.4, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.16)'; g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.36); g.fillStyle = shade(c, -0.25); g.fill();
      const gr = g.createRadialGradient(s * 0.38, s * 0.32, s * 0.04, s * 0.5, s * 0.5, s * 0.6);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.4)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.12));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.8, s * 0.34); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'stone', 1, 0.07, 0.34);
    },
  },
  lamp: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.22); g.fillStyle = mixHex(c, '#120604', 0.6); g.fill();
      g.save(); rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.2); g.clip();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#1a0804', 0.6)); gr.addColorStop(1, mixHex(c, '#1a0804', 0.3));
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      TEX.lamp(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  aurora(g, s, c, rnd, k) { // curtains of light hanging from a wavy edge, a few stars
    const hi = hexOf(mixHex(c, '#ffffff', 0.55)), ph = rnd() * 6.3, n = 14, sw = s / n;
    const top = i => s * (0.18 + 0.12 * Math.sin(i / n * 5 + ph));
    const gr = g.createLinearGradient(0, 0, 0, s * 0.5); gr.addColorStop(0, rgba(hi, 0.55 * k)); gr.addColorStop(1, rgba(hi, 0));
    g.fillStyle = gr;
    for (let i = 0; i < n; i++) { g.save(); g.translate(i * sw, top(i)); g.fillRect(0, 0, sw + 0.6, s * 0.5); g.restore(); }
    g.beginPath(); for (let i = 0; i <= n; i++) i ? g.lineTo(i * sw, top(i)) : g.moveTo(0, top(0));
    g.strokeStyle = rgba(hi, 0.75 * k); g.lineWidth = Math.max(1, s * 0.02); g.stroke();
    for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(255,255,255,${(0.4 + rnd() * 0.5) * k})`; const r = Math.max(0.6, s * 0.015); g.fillRect(rnd() * s, rnd() * s * 0.16, r, r); }
  },
  coral(g, s, c, rnd, k) { // porous polyp cups
    const dk = shade(c, -0.38), lt = shade(c, 0.45);
    for (let i = 0; i < 16; i++) {
      const x = rnd() * s, y = rnd() * s, r = s * (0.025 + rnd() * 0.035);
      g.globalAlpha = 0.6 * k; g.beginPath(); g.arc(x, y + r * 0.25, r, 0, Math.PI * 2); g.fillStyle = lt; g.fill();
      g.globalAlpha = 0.75 * k; g.beginPath(); g.arc(x, y, r * 0.7, 0, Math.PI * 2); g.fillStyle = dk; g.fill();
    }
    g.globalAlpha = 1;
    softGlint(g, s * 0.32, s * 0.28, s * 0.22, 0.3 * k);
  },
  tomb(g, s, c, rnd, k) { // sandstone grain and one carved glyph
    speckle(g, s, rnd, 40, 0.004, 0.012, () => rnd() < 0.5 ? `rgba(70,40,10,${0.22 * k})` : `rgba(255,240,200,${0.18 * k})`);
    const kind = (rnd() * 4) | 0;
    carved(g, () => glyph(g, kind, s * 0.5, s * 0.5, s * 0.25), Math.max(1, s * 0.045), `rgba(255,240,205,${0.45 * k})`, `rgba(60,30,8,${0.6 * k})`);
  },
  iznik(g, s, c, rnd, k) { // a white rosette and a glazed inner frame
    rosette(g, s * 0.5, s * 0.5, s * 0.3, `rgba(255,255,255,${0.55 * k})`, `rgba(216,64,46,${0.8 * k})`);
    rr(g, s * 0.14, s * 0.14, s * 0.72, s * 0.72, s * 0.05); g.strokeStyle = `rgba(255,255,255,${0.35 * k})`; g.lineWidth = Math.max(1, s * 0.02); g.stroke();
  },
  balloon(g, s, c, rnd, k) { // envelope gores bulging outwards, seams and stitching
    const seams = [0.2, 0.4, 0.6, 0.8], bend = x => s / 2 + (x * s - s / 2) * 1.3;
    g.fillStyle = mixHex(c, '#ffffff', 0.35); g.globalAlpha = 0.75 * k;
    for (let i = 0; i < seams.length - 1; i += 2) {
      const a = seams[i] * s, b = seams[i + 1] * s;
      g.beginPath(); g.moveTo(a, -1); g.quadraticCurveTo(bend(seams[i]), s / 2, a, s + 1); g.lineTo(b, s + 1); g.quadraticCurveTo(bend(seams[i + 1]), s / 2, b, -1); g.closePath(); g.fill();
    }
    g.lineWidth = Math.max(1, s * 0.015);
    for (const x of seams) {
      g.globalAlpha = 0.35 * k; g.strokeStyle = '#3a1a10';
      g.beginPath(); g.moveTo(x * s, 0); g.quadraticCurveTo(bend(x), s / 2, x * s, s); g.stroke();
      g.globalAlpha = 0.5 * k; g.strokeStyle = '#ffffff'; g.setLineDash([s * 0.025, s * 0.03]);
      g.beginPath(); g.moveTo(x * s + s * 0.025, 0); g.quadraticCurveTo(bend(x) + s * 0.025, s / 2, x * s + s * 0.025, s); g.stroke();
      g.setLineDash([]);
    }
    g.globalAlpha = 1;
  },
  ebru(g, s, c, rnd, k) { // dropped paint spreading into rings, then combed through
    const L = hexOf(mixHex(c, '#fff6e6', 0.6)), D = hexOf(mixHex(c, '#101820', 0.35));
    for (let i = 0; i < 4; i++) {
      const x = s * (0.1 + rnd() * 0.8), y = s * (0.1 + rnd() * 0.8), r = s * (0.12 + rnd() * 0.16);
      for (const [q, col, al] of [[1, L, 0.55], [0.72, D, 0.5], [0.45, L, 0.6], [0.22, c, 1]]) { g.beginPath(); g.arc(x, y, r * q, 0, Math.PI * 2); g.fillStyle = rgba(col, al * k); g.fill(); }
    }
    g.lineWidth = Math.max(1, s * 0.018); g.strokeStyle = `rgba(255,250,240,${0.5 * k})`;
    const ph = rnd() * 6.3;
    for (let i = 0; i < 4; i++) {
      const y0 = s * (0.15 + i * 0.24);
      g.beginPath(); for (let j = 0; j <= 16; j++) { const x = j * s / 16, y = y0 + Math.sin(x / s * 9 + ph + i) * s * 0.05; j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    }
  },
  gear(g, s, c, rnd, k) { // an engraved cog and four rivets
    const rot = rnd() * 6.3;
    carved(g, () => gearPath(g, s * 0.5, s * 0.5, s * 0.24, 8, rot, 0.4), Math.max(1, s * 0.03), `rgba(255,245,215,${0.4 * k})`, `rgba(40,25,10,${0.5 * k})`);
    for (const [x, y] of [[0.17, 0.17], [0.83, 0.17], [0.17, 0.83], [0.83, 0.83]]) {
      g.beginPath(); g.arc(s * x, s * y, s * 0.05, 0, Math.PI * 2); g.fillStyle = `rgba(40,25,10,${0.45 * k})`; g.fill();
      g.beginPath(); g.arc(s * x - s * 0.012, s * y - s * 0.012, s * 0.03, 0, Math.PI * 2); g.fillStyle = `rgba(255,245,215,${0.55 * k})`; g.fill();
    }
  },
  storm(g, s, c, rnd, k) { // cloud puffs with a lightning crack running through
    g.fillStyle = `rgba(255,255,255,${0.16 * k})`;
    for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(s * (0.12 + i * 0.19), s * (0.18 + rnd() * 0.12), s * (0.12 + rnd() * 0.08), 0, Math.PI * 2); g.fill(); }
    const pts = []; let x = s * (0.3 + rnd() * 0.4), y = s * 0.04; pts.push([x, y]);
    while (y < s * 0.95) { y += s * (0.12 + rnd() * 0.1); x += s * (rnd() - 0.5) * 0.3; pts.push([x, y]); }
    const line = () => { g.beginPath(); pts.forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py)); };
    g.lineJoin = 'round'; g.lineCap = 'round';
    g.save(); g.shadowColor = '#9fd8ff'; g.shadowBlur = s * 0.12; line(); g.strokeStyle = `rgba(160,220,255,${0.8 * k})`; g.lineWidth = Math.max(1, s * 0.05); g.stroke(); g.restore();
    line(); g.strokeStyle = `rgba(255,255,255,${0.9 * k})`; g.lineWidth = Math.max(1, s * 0.018); g.stroke();
  },
  stone(g, s, c, rnd, k) { // river stone: grain, a pale vein, soft shine
    speckle(g, s, rnd, 36, 0.004, 0.012, () => rnd() < 0.5 ? `rgba(0,0,0,${0.12 * k})` : `rgba(255,255,255,${0.2 * k})`);
    const y = s * (0.35 + rnd() * 0.3);
    g.beginPath(); g.moveTo(-s * 0.05, y); g.bezierCurveTo(s * 0.3, y - s * 0.12, s * 0.6, y + s * 0.12, s * 1.05, y - s * 0.04);
    g.strokeStyle = `rgba(255,255,255,${0.28 * k})`; g.lineWidth = Math.max(1, s * 0.025); g.stroke();
    softGlint(g, s * 0.33, s * 0.28, s * 0.2, 0.35 * k);
  },
  lamp(g, s, c, rnd, k) { // glowing wax blobs inside glass
    const hi = hexOf(mixHex(c, '#fff0c0', 0.35));
    for (let i = 0; i < 3; i++) {
      const x = s * (0.2 + rnd() * 0.6), y = s * (0.2 + rnd() * 0.6), rx = s * (0.12 + rnd() * 0.12), ry = rx * (1.1 + rnd() * 0.5);
      const gr = g.createRadialGradient(x - rx * 0.3, y - ry * 0.3, 0, x, y, Math.max(rx, ry));
      gr.addColorStop(0, rgba(hi, 0.95 * k)); gr.addColorStop(0.7, rgba(c, 0.85 * k)); gr.addColorStop(1, rgba(c, 0));
      g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
    }
    const sh = g.createLinearGradient(s * 0.12, 0, s * 0.3, 0);
    sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.5, `rgba(255,255,255,${0.25 * k})`); sh.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = sh; g.fillRect(s * 0.12, s * 0.08, s * 0.18, s * 0.84);
  },
});

/* ---------- Third theme set, part 1: living backgrounds ---------- */
Object.assign(AMBIENTS, {
  aurora(th) { // light curtains rippling over snowy hills
    const ST = [...Array(90)].map(() => ({ x: Math.random(), y: Math.random() * 0.7, r: rand(0.5, 1.5), ph: rand(0, 6.3), f: rand(0.5, 2) }));
    const CU = [0, 1, 2].map(i => ({ y: 0.1 + i * 0.1, amp: rand(0.04, 0.08), f: rand(3, 6), sp: rand(0.15, 0.3) * (i % 2 ? -1 : 1), ph: rand(0, 6.3), c: [th.blocks[0], th.blocks[2], th.blocks[4]][i], len: rand(0.25, 0.4) }));
    let t = 0, hills = null, hw = 0, hh = 0;
    function build(w, h) {
      hw = w; hh = h; hills = document.createElement('canvas'); hills.width = Math.ceil(w); hills.height = Math.ceil(h * 0.3);
      const g = hills.getContext('2d'), H = hills.height;
      for (let L = 0; L < 2; L++) {
        g.beginPath(); g.moveTo(0, H);
        for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, H * (0.35 + L * 0.25) + Math.sin(x * 0.006 + L * 2) * H * 0.12 + Math.sin(x * 0.017 + L) * H * 0.05);
        g.lineTo(w, H); g.closePath(); g.globalAlpha = L ? 0.22 : 0.15; g.fillStyle = L ? '#e8f4fa' : '#9fbccc'; g.fill();
      }
    }
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        for (const s of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * s.f + s.ph))) * a})`; g.fillRect(s.x * w, s.y * h, s.r, s.r); }
        g.save(); g.globalCompositeOperation = 'lighter';
        const n = Math.ceil(w / 10), sw = w / n;
        for (const cu of CU) {
          const L = cu.len * h, gr = g.createLinearGradient(0, 0, 0, L);
          gr.addColorStop(0, rgba(cu.c, 0.02 * a)); gr.addColorStop(0.15, rgba(cu.c, 0.22 * a)); gr.addColorStop(1, rgba(cu.c, 0));
          g.fillStyle = gr;
          for (let i = 0; i < n; i++) {
            const x = i * sw, y = h * (cu.y + cu.amp * Math.sin(x / w * cu.f + t * cu.sp + cu.ph) + 0.02 * Math.sin(x / w * 17 + t * 0.7));
            g.globalAlpha = 0.6 + 0.4 * Math.sin(x / w * 9 - t * 0.5 + cu.ph);
            g.translate(x, y); g.fillRect(0, 0, sw + 0.6, L); g.translate(-x, -y);
          }
        }
        g.restore();
        if (!hills || Math.abs(w - hw) > 1 || Math.abs(h - hh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(hills, 0, h * 0.7, w, h * 0.3); g.globalAlpha = 1;
      },
    };
  },
  reef(th) { // shafts of light, schools of fish, swaying seaweed, rising bubbles
    const WEED = [...Array(10)].map((_, i) => ({ x: (i + rand(0.1, 0.9)) / 10, hg: rand(0.12, 0.3), ph: rand(0, 6.3), c: i % 3 ? '#2f9a6a' : '#e0708a', n: 2 + ((Math.random() * 2) | 0) }));
    const school = init => {
      const dir = Math.random() < 0.5 ? 1 : -1;
      return { x: init ? Math.random() : (dir > 0 ? -0.25 : 1.25), y: rand(0.12, 0.62), v: rand(0.03, 0.06), dir, c: th.blocks[(Math.random() * 7) | 0],
        F: [...Array(6 + ((Math.random() * 6) | 0))].map(() => [rand(-0.07, 0.07), rand(-0.04, 0.04), rand(0, 6.3)]) };
    };
    const SC = [school(true), school(true), school(true)];
    const BU = [...Array(18)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.003, 0.009), v: rand(0.04, 0.09), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt;
        SC.forEach((s, i) => { s.x += s.v * s.dir * dt; if (s.x < -0.3 || s.x > 1.3) SC[i] = school(false); });
        for (const b of BU) { b.y -= b.v * dt; if (b.y < -0.02) { b.y = 1.02; b.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (let i = 0; i < 3; i++) {
          const x = w * (0.2 + i * 0.3) + Math.sin(t * 0.4 + i * 2) * w * 0.06;
          const gr = g.createLinearGradient(0, 0, 0, h * 0.7); gr.addColorStop(0, `rgba(255,255,230,${0.08 * a})`); gr.addColorStop(1, 'rgba(255,255,230,0)');
          g.fillStyle = gr; g.beginPath(); g.moveTo(x - w * 0.05, 0); g.lineTo(x + w * 0.06, 0); g.lineTo(x + w * 0.18, h * 0.7); g.lineTo(x - w * 0.03, h * 0.7); g.fill();
        }
        const fr = u * 0.014;
        for (const s of SC) for (const [ox, oy, ph] of s.F) fishShape(g, (s.x + ox) * w, (s.y + oy + Math.sin(t * 2 + ph) * 0.006) * h, fr, s.dir, rgba(s.c, 0.6 * a), Math.sin(t * 9 + ph));
        g.lineCap = 'round'; g.lineWidth = u * 0.016;
        for (const wd of WEED) {
          const x0 = wd.x * w, H = wd.hg * h;
          for (let k = 0; k < wd.n; k++) {
            const sw = Math.sin(t * 0.9 + wd.ph + k) * u * 0.05, xo = (k - (wd.n - 1) / 2) * u * 0.02;
            g.beginPath(); g.moveTo(x0 + xo, h); g.bezierCurveTo(x0 + xo - sw, h - H * 0.35, x0 + xo + sw, h - H * 0.7, x0 + xo + sw * 1.4, h - H * (0.85 + 0.1 * k));
            g.strokeStyle = rgba(wd.c, 0.5 * a); g.stroke();
          }
        }
        g.lineCap = 'butt'; g.lineWidth = 1;
        g.strokeStyle = `rgba(255,255,255,${0.35 * a})`;
        for (const b of BU) { g.beginPath(); g.arc((b.x + Math.sin(t + b.ph) * 0.006) * w, b.y * h, b.r * u, 0, Math.PI * 2); g.stroke(); }
      },
    };
  },
  tomb(th) { // carved stone wall, two torches, trickles of sand, dust
    let wall = null, ww = 0, wh = 0, t = 0;
    const DUST = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.01, 0.01), ph: rand(0, 6.3) }));
    const SAND = [0, 1, 2].map(() => ({ x: rand(0.15, 0.85), on: rand(0, 3), wait: rand(0, 3), acc: 0, G: [] }));
    function build(w, h) {
      ww = w; wh = h; wall = document.createElement('canvas'); wall.width = Math.ceil(w); wall.height = Math.ceil(h);
      const g = wall.getContext('2d'), u = Math.min(w, h), rh = u * 0.085, bw = rh * 2.2;
      g.strokeStyle = 'rgba(255,214,150,.07)'; g.lineWidth = 1.5;
      for (let r = 0, y = 0; y < h; r++, y += rh) { const off = (r % 2) * bw / 2; for (let x = -off; x < w; x += bw) g.strokeRect(x + 1, y + 1, bw - 2, rh - 2); }
      g.lineWidth = Math.max(1.5, u * 0.008); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = 'rgba(255,200,120,.09)';
      for (const cx of [0.28, 0.72]) for (let i = 0, y = h * 0.12; y < h * 0.9; i++, y += u * 0.12) { glyph(g, (i + (cx > 0.5 ? 2 : 0)) % 4, cx * w, y, u * 0.035); g.stroke(); }
    }
    return {
      step(dt) {
        t += dt;
        for (const s of SAND) {
          if (s.on > 0) { s.on -= dt; s.acc += dt; while (s.acc > 0.03) { s.acc -= 0.03; s.G.push({ y: 0, v: rand(0.05, 0.15), dx: rand(-0.004, 0.004) }); } }
          else { s.wait -= dt; if (s.wait <= 0) { s.on = rand(1.5, 4); s.wait = rand(2, 6); s.x = rand(0.15, 0.85); } }
          for (const p of s.G) { p.v += 1.2 * dt; p.y += p.v * dt; }
          s.G = s.G.filter(p => p.y < 1.05);
        }
        for (const d of DUST) { d.x += d.v * dt; d.y -= 0.006 * dt; if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        if (!wall || Math.abs(w - ww) > 1 || Math.abs(h - wh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(wall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const tx of [0.08, 0.92]) {
          const x = tx * w, y = h * 0.34, fl = 0.85 + 0.15 * Math.sin(t * 13 + tx * 9) * Math.sin(t * 7.3), R = u * 0.32 * fl;
          const gl = g.createRadialGradient(x, y, 0, x, y, R); gl.addColorStop(0, rgba(th.accent, 0.3 * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - R, y - R, 2 * R, 2 * R);
          g.fillStyle = `rgba(60,36,16,${0.9 * a})`; g.fillRect(x - u * 0.008, y, u * 0.016, u * 0.09);
          const fh = u * 0.05 * fl;
          g.beginPath(); g.moveTo(x, y - fh); g.quadraticCurveTo(x + u * 0.022, y - fh * 0.2, x, y + u * 0.006); g.quadraticCurveTo(x - u * 0.022, y - fh * 0.2, x, y - fh);
          g.fillStyle = `rgba(255,190,80,${0.9 * a})`; g.fill();
        }
        g.fillStyle = `rgba(230,190,120,${0.55 * a})`;
        const gs2 = Math.max(1, u * 0.004);
        for (const s of SAND) for (const p of s.G) g.fillRect((s.x + p.dx) * w, p.y * h, gs2, gs2);
        for (const d of DUST) { g.fillStyle = `rgba(255,220,160,${(0.2 + 0.15 * Math.sin(t + d.ph)) * a})`; g.fillRect(d.x * w, d.y * h, 2, 2); }
      },
    };
  },
  iznik(th) { // tiled wall, a pointed arch window letting light in, floating motes
    let wall = null, ww = 0, wh = 0, t = 0;
    const M = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.012, -0.004), ph: rand(0, 6.3) }));
    function build(w, h) {
      ww = w; wh = h; wall = document.createElement('canvas'); wall.width = Math.ceil(w); wall.height = Math.ceil(h);
      const g = wall.getContext('2d'), ts = Math.max(48, Math.min(w, h) * 0.16);
      for (let y = 0; y < h + ts; y += ts) for (let x = 0; x < w + ts; x += ts) {
        g.strokeStyle = 'rgba(160,200,255,.07)'; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, ts - 1, ts - 1);
        rosette(g, x + ts / 2, y + ts / 2, ts * 0.28, 'rgba(90,170,255,.09)', 'rgba(255,120,90,.12)');
        g.fillStyle = 'rgba(40,200,210,.06)';
        for (const [cx, cy] of [[x, y], [x + ts, y], [x, y + ts], [x + ts, y + ts]]) { g.beginPath(); g.arc(cx, cy, ts * 0.12, 0, Math.PI * 2); g.fill(); }
      }
    }
    return {
      step(dt) { t += dt; for (const m of M) { m.y += m.v * dt; m.x += Math.sin(t * 0.5 + m.ph) * 0.003 * dt; if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!wall || Math.abs(w - ww) > 1 || Math.abs(h - wh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(wall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), cx = w / 2, aw = u * 0.16, top = h * 0.02, bot = h * 0.2;
        const beam = g.createLinearGradient(0, bot, 0, h); beam.addColorStop(0, `rgba(255,236,190,${0.13 * a})`); beam.addColorStop(1, 'rgba(255,236,190,0)');
        g.fillStyle = beam; g.beginPath(); g.moveTo(cx - aw, bot); g.lineTo(cx + aw, bot); g.lineTo(cx + aw * 3, h); g.lineTo(cx - aw * 0.4, h); g.fill();
        g.beginPath(); g.moveTo(cx - aw, bot); g.lineTo(cx - aw, top + aw); g.quadraticCurveTo(cx - aw, top + aw * 0.2, cx, top);
        g.quadraticCurveTo(cx + aw, top + aw * 0.2, cx + aw, top + aw); g.lineTo(cx + aw, bot); g.closePath();
        g.fillStyle = `rgba(255,240,205,${0.16 * a})`; g.fill(); g.strokeStyle = `rgba(255,200,120,${0.3 * a})`; g.lineWidth = 2; g.stroke();
        for (const m of M) { const k = 0.5 + 0.5 * Math.sin(t * 2 + m.ph); g.fillStyle = `rgba(255,236,190,${(0.15 + 0.35 * k) * a})`; g.fillRect(m.x * w, m.y * h, 2, 2); }
      },
    };
  },
  cappadocia(th) { // hot air balloons drifting up behind fairy chimneys
    let land = null, lw = 0, lh = 0, t = 0;
    const mkB = init => ({ x: rand(0.05, 0.95), y: init ? rand(0.05, 0.85) : 1.1, v: rand(0.008, 0.02), s: rand(0.6, 1.3), c1: th.blocks[(Math.random() * 7) | 0], c2: th.blocks[(Math.random() * 7) | 0], ph: rand(0, 6.3), burn: 0 });
    const B = [...Array(7)].map(() => mkB(true)).sort((p, q) => p.s - q.s);
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h * 0.32);
      const g = land.getContext('2d'), H = land.height, u = Math.min(w, h);
      g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= w + 10; x += 10) g.lineTo(x, H * 0.45 + Math.sin(x * 0.008) * H * 0.1 + Math.sin(x * 0.023) * H * 0.05); g.lineTo(w, H); g.closePath();
      g.fillStyle = 'rgba(160,90,70,.22)'; g.fill();
      for (let i = 0; i < 10; i++) {
        const x = (i + 0.2 + Math.random() * 0.6) / 10 * w, hh = H * rand(0.35, 0.75), bw = u * rand(0.035, 0.065);
        g.beginPath(); g.moveTo(x - bw, H); g.quadraticCurveTo(x - bw * 0.6, H - hh * 0.6, x - bw * 0.25, H - hh); g.lineTo(x + bw * 0.25, H - hh); g.quadraticCurveTo(x + bw * 0.6, H - hh * 0.6, x + bw, H); g.closePath();
        g.fillStyle = 'rgba(176,116,86,.42)'; g.fill();
        g.beginPath(); g.ellipse(x, H - hh, bw * 0.45, bw * 0.25, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(96,56,44,.5)'; g.fill();
      }
      g.fillStyle = 'rgba(140,80,60,.3)'; g.fillRect(0, H * 0.88, w, H * 0.12);
    }
    return {
      step(dt) {
        t += dt;
        B.forEach((b, i) => {
          b.y -= b.v * dt; b.burn = Math.max(0, b.burn - dt);
          if (!b.burn && Math.random() < dt * 0.15) b.burn = 0.7;
          if (b.y < -0.2) { B[i] = mkB(false); B.sort((p, q) => p.s - q.s); }
        });
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const b of B) {
          const x = (b.x + Math.sin(t * 0.2 + b.ph) * 0.01) * w, y = b.y * h, r = u * 0.045 * b.s;
          const env = () => {
            g.beginPath(); g.arc(x, y, r, Math.PI * 0.85, Math.PI * 0.15);
            g.quadraticCurveTo(x + r * 0.55, y + r * 1.15, x + r * 0.28, y + r * 1.45); g.lineTo(x - r * 0.28, y + r * 1.45);
            g.quadraticCurveTo(x - r * 0.55, y + r * 1.15, x + Math.cos(Math.PI * 0.85) * r, y + Math.sin(Math.PI * 0.85) * r); g.closePath();
          };
          env(); g.fillStyle = rgba(b.c1, 0.8 * a); g.fill();
          g.save(); env(); g.clip(); g.fillStyle = rgba(b.c2, 0.8 * a);
          for (let k = -2; k <= 2; k += 2) g.fillRect(x + k * r * 0.4 - r * 0.1, y - r, r * 0.2, r * 2.5);
          const sh = g.createRadialGradient(x - r * 0.4, y - r * 0.4, 0, x, y, r * 1.5); sh.addColorStop(0, `rgba(255,255,255,${0.35 * a})`); sh.addColorStop(1, `rgba(0,0,0,${0.15 * a})`);
          g.fillStyle = sh; g.fillRect(x - r, y - r, r * 2, r * 2.6); g.restore();
          g.strokeStyle = `rgba(80,50,30,${0.6 * a})`; g.lineWidth = 1;
          g.beginPath(); g.moveTo(x - r * 0.28, y + r * 1.45); g.lineTo(x - r * 0.16, y + r * 1.75); g.moveTo(x + r * 0.28, y + r * 1.45); g.lineTo(x + r * 0.16, y + r * 1.75); g.stroke();
          g.fillStyle = `rgba(110,70,40,${0.85 * a})`; g.fillRect(x - r * 0.18, y + r * 1.75, r * 0.36, r * 0.26);
          if (b.burn) { const fl = 0.6 + 0.4 * Math.sin(t * 40); g.beginPath(); g.ellipse(x, y + r * 1.55, r * 0.08, r * 0.18 * fl, 0, 0, Math.PI * 2); g.fillStyle = `rgba(255,170,60,${0.9 * a})`; g.fill(); }
        }
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, h * 0.68, w, h * 0.32); g.globalAlpha = 1;
      },
    };
  },
  ebru(th) { // paint dropped on water spreading into rings, slow combed waves
    const D = []; let t = 0, next = 0;
    const add = init => D.push({ x: Math.random(), y: Math.random(), max: rand(0.12, 0.28), life: init ? rand(0, 0.6) : 0, cs: [0, 1, 2].map(() => th.blocks[(Math.random() * 7) | 0]) });
    for (let i = 0; i < 6; i++) add(true);
    return {
      step(dt) {
        t += dt; next -= dt;
        if (next <= 0) { add(false); next = rand(1.2, 2.4); }
        for (const d of D) d.life += dt / 16;
        for (let i = D.length - 1; i >= 0; i--) if (D[i].life >= 1) D.splice(i, 1);
      },
      draw(g, w, h, a) {
        const u = Math.max(w, h);
        for (const d of D) {
          const grow = 1 - Math.pow(1 - Math.min(1, d.life * 4), 3), fade = d.life < 0.7 ? 1 : 1 - (d.life - 0.7) / 0.3;
          const R = d.max * u * grow, x = d.x * w + Math.sin(t * 0.1 + d.max * 40) * u * 0.02 * d.life, y = d.y * h;
          for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(x, y, R * (1 - k * 0.3), R * (1 - k * 0.3) * (0.9 + 0.08 * Math.sin(t * 0.3 + k)), d.life, 0, Math.PI * 2); g.fillStyle = rgba(d.cs[k], 0.12 * a * fade); g.fill(); }
          g.beginPath(); g.arc(x, y, R, 0, Math.PI * 2); g.strokeStyle = `rgba(255,250,235,${0.12 * a * fade})`; g.lineWidth = 1.5; g.stroke();
        }
        g.strokeStyle = `rgba(255,250,235,${0.06 * a})`; g.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const y0 = h * (0.1 + i * 0.2);
          g.beginPath(); for (let x = 0; x <= w + 12; x += 12) { const y = y0 + Math.sin(x * 0.015 + t * 0.25 + i) * u * 0.03; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
        }
      },
    };
  },
  clockwork(th) { // big meshing gears, a swinging pendulum, puffs of steam
    const G = [[0.06, 0.85, 0.24, 16, 1], [0.3, 0.97, 0.13, 9, -1], [0.95, 0.12, 0.2, 14, -1], [0.78, 0.02, 0.11, 8, 1], [0.98, 0.62, 0.15, 11, 1]];
    let t = 0, acc = 0, P = [];
    return {
      step(dt) {
        t += dt; acc += dt;
        if (acc > 0.6) { acc = 0; P.push({ x: rand(0.12, 0.24), y: 1.02, life: 0 }); }
        for (const p of P) { p.y -= 0.08 * dt; p.life += dt / 6; }
        P = P.filter(p => p.life < 1);
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const [x, y, r, n, dir] of G) {
          gearPath(g, x * w, y * h, r * u, n, t * 0.35 * (12 / n) * dir, 0.25);
          g.fillStyle = rgba(th.accent, 0.08 * a); g.fill('evenodd');
          g.strokeStyle = rgba(th.accent, 0.16 * a); g.lineWidth = 2; g.stroke();
        }
        const px = w * 0.5, L = h * 0.3, an = 0.32 * Math.sin(t * 1.8), bx = px + Math.sin(an) * L, by = Math.cos(an) * L;
        g.strokeStyle = rgba(th.accent, 0.22 * a); g.lineWidth = 3; g.beginPath(); g.moveTo(px, 0); g.lineTo(bx, by); g.stroke();
        const bg = g.createRadialGradient(bx - u * 0.01, by - u * 0.01, 0, bx, by, u * 0.04); bg.addColorStop(0, rgba('#fff2c0', 0.5 * a)); bg.addColorStop(1, rgba(th.accent, 0.3 * a));
        g.beginPath(); g.arc(bx, by, u * 0.04, 0, Math.PI * 2); g.fillStyle = bg; g.fill();
        for (const p of P) {
          const r = u * (0.04 + p.life * 0.12), al = Math.sin(p.life * Math.PI) * 0.08 * a;
          const gr = g.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, r); gr.addColorStop(0, `rgba(255,248,235,${al})`); gr.addColorStop(1, 'rgba(255,248,235,0)');
          g.fillStyle = gr; g.fillRect(p.x * w - r, p.y * h - r, 2 * r, 2 * r);
        }
      },
    };
  },
  storm(th) { // dark clouds, slanting rain, now and then a lightning strike
    const R = [...Array(140)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.9, 1.4), l: rand(0.02, 0.04) }));
    const CL = [...Array(6)].map(() => ({ x: Math.random(), y: rand(-0.05, 0.12), r: rand(0.2, 0.35), v: rand(0.004, 0.012) }));
    let t = 0, bolt = null, wait = rand(3, 7);
    const mkBolt = () => {
      const P = []; let x = rand(0.15, 0.85), y = 0; P.push([x, y]);
      while (y < 0.55) { y += rand(0.04, 0.08); x += rand(-0.05, 0.05); P.push([x, y]); }
      const bi = 2 + ((Math.random() * (P.length - 3)) | 0), Bp = [P[bi]]; let bx = P[bi][0], by = P[bi][1];
      for (let i = 0; i < 4; i++) { by += rand(0.03, 0.06); bx += rand(0.02, 0.06) * (Math.random() < 0.5 ? -1 : 1); Bp.push([bx, by]); }
      return { P, Bp, life: 0 };
    };
    return {
      step(dt) {
        t += dt;
        for (const d of R) { d.y += d.v * dt; d.x += 0.25 * dt; if (d.y > 1.05) { d.y = -0.05; d.x = Math.random() - 0.1; } if (d.x > 1.05) d.x -= 1.1; }
        for (const c of CL) { c.x += c.v * dt; if (c.x > 1.4) c.x = -0.4; }
        wait -= dt;
        if (!bolt && wait < 0 && !REDUCED) { bolt = mkBolt(); wait = rand(4, 9); }
        if (bolt) { bolt.life += dt / 0.45; if (bolt.life >= 1) bolt = null; }
      },
      draw(g, w, h, a) {
        const u = Math.max(w, h);
        for (const c of CL) {
          const gr = g.createRadialGradient(c.x * w, c.y * h, 0, c.x * w, c.y * h, c.r * u);
          gr.addColorStop(0, `rgba(8,12,20,${0.5 * a})`); gr.addColorStop(1, 'rgba(8,12,20,0)');
          g.fillStyle = gr; g.fillRect(0, 0, w, h);
        }
        if (bolt) {
          const f = 1 - bolt.life, fl = f * (0.6 + 0.4 * Math.sin(bolt.life * 40));
          g.fillStyle = `rgba(200,225,255,${0.1 * fl * a})`; g.fillRect(0, 0, w, h);
          const line = P => { g.beginPath(); P.forEach(([x, y], i) => i ? g.lineTo(x * w, y * h) : g.moveTo(x * w, y * h)); };
          g.save(); g.shadowColor = '#bfe4ff'; g.shadowBlur = 18; g.lineJoin = 'round'; g.strokeStyle = `rgba(230,245,255,${0.9 * fl * a})`;
          g.lineWidth = 2.5; line(bolt.P); g.stroke(); g.lineWidth = 1.5; line(bolt.Bp); g.stroke(); g.restore();
        }
        g.strokeStyle = `rgba(170,195,230,${0.28 * a})`; g.lineWidth = 1; g.beginPath();
        for (const d of R) { const x = d.x * w, y = d.y * h, l = d.l * h; g.moveTo(x, y); g.lineTo(x - l * 0.25, y - l); }
        g.stroke();
      },
    };
  },
  zen(th) { // raked gravel round the rocks, koi circling a pond, maple leaves drifting
    let sand = null, sw = 0, sh = 0, t = 0;
    const ROCKS = [[0.18, 0.2, 0.06], [0.84, 0.62, 0.08], [0.9, 0.16, 0.045]];
    const POND = { x: 0.2, y: 0.88, rx: 0.34, ry: 0.13 };
    const KOI = [0, 1, 2].map(i => ({ a: i * 2.1, sp: rand(0.25, 0.4) * (i % 2 ? -1 : 1), k: rand(0.55, 0.85), c: i === 1 ? 'rgba(255,248,240,.9)' : 'rgba(255,122,58,.9)' }));
    const LV = [...Array(10)].map(() => ({ x: Math.random(), y: Math.random(), rot: rand(0, 6.3), vr: rand(-1, 1), v: rand(0.02, 0.05), ph: rand(0, 6.3), c: ['#c8442e', '#e0782a', '#d85a3a'][(Math.random() * 3) | 0] }));
    function build(w, h) {
      sw = w; sh = h; sand = document.createElement('canvas'); sand.width = Math.ceil(w); sand.height = Math.ceil(h);
      const g = sand.getContext('2d'), u = Math.min(w, h);
      g.save(); g.beginPath(); g.rect(0, 0, w, h);
      for (const [x, y, r] of ROCKS) { const R = r * u * 2.4; g.moveTo(x * w + R, y * h); g.arc(x * w, y * h, R, 0, Math.PI * 2); }
      g.ellipse(POND.x * w, POND.y * h, POND.rx * w * 1.08, POND.ry * h * 1.25, 0, 0, Math.PI * 2);
      g.clip('evenodd');
      for (let y = 0; y < h; y += u * 0.026) {
        g.beginPath(); for (let x = 0; x <= w + 12; x += 12) { const yy = y + Math.sin(x * 0.01 + y * 0.02) * u * 0.004; x ? g.lineTo(x, yy) : g.moveTo(x, yy); }
        g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.5; g.stroke();
        g.save(); g.translate(0, 2); g.strokeStyle = 'rgba(0,0,0,.05)'; g.stroke(); g.restore();
      }
      g.restore();
      for (const [x, y, r] of ROCKS) {
        for (let k = 1; k <= 4; k++) { g.beginPath(); g.arc(x * w, y * h, r * u * (1.1 + k * 0.32), 0, Math.PI * 2); g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1.5; g.stroke(); }
        const gr = g.createRadialGradient(x * w - r * u * 0.3, y * h - r * u * 0.3, 0, x * w, y * h, r * u);
        gr.addColorStop(0, 'rgba(150,156,146,.8)'); gr.addColorStop(1, 'rgba(90,96,88,.8)');
        g.beginPath(); g.ellipse(x * w, y * h, r * u * 1.1, r * u * 0.85, 0.3, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
      }
      g.beginPath(); g.ellipse(POND.x * w, POND.y * h, POND.rx * w, POND.ry * h, 0, 0, Math.PI * 2);
      g.fillStyle = 'rgba(70,120,110,.35)'; g.fill(); g.strokeStyle = 'rgba(110,116,104,.35)'; g.lineWidth = 3; g.stroke();
    }
    return {
      step(dt) {
        t += dt;
        for (const f of KOI) f.a += f.sp * dt;
        for (const l of LV) { l.y += l.v * dt; l.x += Math.sin(t * 1.3 + l.ph) * 0.02 * dt; l.rot += l.vr * dt; if (l.y > 1.05) { l.y = -0.05; l.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        if (!sand || Math.abs(w - sw) > 1 || Math.abs(h - sh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(sand, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        g.save(); g.beginPath(); g.ellipse(POND.x * w, POND.y * h, POND.rx * w, POND.ry * h, 0, 0, Math.PI * 2); g.clip();
        g.globalAlpha = a;
        for (const f of KOI) {
          const x = POND.x * w + Math.cos(f.a) * POND.rx * w * f.k, y = POND.y * h + Math.sin(f.a) * POND.ry * h * f.k;
          const ang = Math.atan2(Math.cos(f.a) * POND.ry * h * f.sp, -Math.sin(f.a) * POND.rx * w * f.sp);
          koiShape(g, x, y, u * 0.035, ang, f.c, Math.sin(t * 6 + f.a));
        }
        g.restore();
        for (const l of LV) { mapleShape(g, l.x * w, l.y * h, u * 0.018, l.rot); g.fillStyle = rgba(l.c, 0.7 * a); g.fill(); }
      },
    };
  },
  lavalamp(th) { // groovy seventies bands and big slow blobs of light
    let bands = null, bw = 0, bh = 0, t = 0;
    const BL = [...Array(7)].map((_, i) => ({ x: rand(0.05, 0.95), ph: rand(0, 6.3), sp: rand(0.12, 0.25), r: rand(0.1, 0.18), c: th.blocks[i % 7] }));
    function build(w, h) {
      bw = w; bh = h; bands = document.createElement('canvas'); bands.width = Math.ceil(w); bands.height = Math.ceil(h);
      const g = bands.getContext('2d'), u = Math.max(w, h), cols = ['rgba(255,138,42,.1)', 'rgba(232,176,58,.09)', 'rgba(168,64,42,.1)'];
      g.lineWidth = u * 0.07;
      cols.forEach((c, i) => {
        g.strokeStyle = c;
        g.beginPath(); g.arc(0, h, u * (0.42 + i * 0.08), -Math.PI / 2, 0); g.stroke();
        g.beginPath(); g.arc(w, 0, u * (0.3 + i * 0.08), Math.PI / 2, Math.PI); g.stroke();
      });
    }
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        if (!bands || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(bands, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const b of BL) {
          const x = (b.x + Math.sin(t * 0.1 + b.ph) * 0.04) * w, y = (0.5 + 0.45 * Math.sin(t * b.sp + b.ph)) * h, r = b.r * u * (1 + 0.15 * Math.cos(t * b.sp * 2 + b.ph));
          const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(b.c, 0.32 * a)); gr.addColorStop(0.6, rgba(b.c, 0.16 * a)); gr.addColorStop(1, rgba(b.c, 0));
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
      },
    };
  },
});

/* ---------- Third theme set, part 2: block looks and textures ---------- */
Object.assign(STYLES, {
  cloud: {
    block(g, s, c) {
      cloudPath(g, s, s * 0.045); g.fillStyle = shade(c, -0.22); g.fill();
      cloudPath(g, s);
      const gr = g.createLinearGradient(0, s * 0.08, 0, s * 0.88); gr.addColorStop(0, mixHex(c, '#ffffff', 0.55)); gr.addColorStop(1, c);
      g.fillStyle = gr; g.fill();
      g.save(); cloudPath(g, s); g.clip(); TEX.cloud(g, s, c, seeded(c), 1); g.restore();
    },
  },
  metal: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.07); g.fillStyle = shade(c, -0.5); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.06); g.fillStyle = c; g.fill();
      g.save(); g.clip(); TEX.metal(g, s, c, seeded(c), 1);
      g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(0, 0, s, s * 0.07); g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(0, s * 0.84, s, s * 0.16);
      g.restore();
    },
  },
  tiki: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.14); g.fillStyle = shade(c, -0.35); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.12); g.fillStyle = c; g.fill();
      g.save(); g.clip(); TEX.tiki(g, s, c, seeded(c), 1); g.restore();
    },
  },
  fossil: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.fillStyle = shade(c, -0.45); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.08); g.fillStyle = c; g.fill();
      g.save(); g.clip(); TEX.fossil(g, s, c, seeded(c), 1); g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(0, 0, s, s * 0.08); g.restore();
    },
  },
  lacquer: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.14);
      const gl = g.createLinearGradient(0, 0, s, s); gl.addColorStop(0, '#f6e08a'); gl.addColorStop(0.5, '#b8902c'); gl.addColorStop(1, '#e8c860');
      g.fillStyle = gl; g.fill();
      rr(g, s * 0.09, s * 0.09, s * 0.82, s * 0.82, s * 0.1);
      const gr = g.createRadialGradient(s * 0.38, s * 0.3, s * 0.04, s * 0.5, s * 0.55, s * 0.65);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.25)); gr.addColorStop(0.5, c); gr.addColorStop(1, shade(c, -0.45));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.lacquer(g, s, c, seeded(c), 1); g.restore();
    },
  },
  maple: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.16); g.fillStyle = shade(c, -0.38); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, shade(c, 0.18)); gr.addColorStop(1, shade(c, -0.1));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.14); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'maple', 1, 0.07, 0.14);
    },
  },
  sushi: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.06, s * 0.92, s * 0.9, s * 0.24); g.fillStyle = '#c9bca8'; g.fill();
      rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.88, s * 0.24); g.fillStyle = '#f7f2ea'; g.fill();
      g.save(); g.clip();
      const rnd = seeded(c);
      g.strokeStyle = 'rgba(170,158,136,.55)'; g.lineWidth = Math.max(0.6, s * 0.01);
      for (let i = 0; i < 34; i++) { g.save(); g.translate(rnd() * s, rnd() * s); g.rotate(rnd() * 3.14); g.beginPath(); g.ellipse(0, 0, s * 0.035, s * 0.016, 0, 0, Math.PI * 2); g.stroke(); g.restore(); }
      g.restore();
      rr(g, s * 0.13, s * 0.12, s * 0.74, s * 0.7, s * 0.2);
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.25)); gr.addColorStop(0.5, c); gr.addColorStop(1, shade(c, -0.15));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.sushi(g, s, c, seeded(c), 1); g.restore();
      if (rnd() < 0.45) { // a strip of nori round the middle
        g.fillStyle = '#1c281e'; g.fillRect(s * 0.42, s * 0.05, s * 0.16, s * 0.87);
        g.fillStyle = 'rgba(120,150,110,.25)'; for (let y = s * 0.1; y < s * 0.9; y += s * 0.08) g.fillRect(s * 0.42, y, s * 0.16, Math.max(0.6, s * 0.01));
      }
    },
  },
  spray: {
    block(g, s, c) {
      const rnd = seeded(c);
      for (let i = 0; i < 70; i++) { g.globalAlpha = 0.25 + rnd() * 0.35; g.fillStyle = c; const r = Math.max(0.6, s * (0.006 + rnd() * 0.012)); g.fillRect(s * (0.02 + rnd() * 0.96), s * (0.02 + rnd() * 0.96), r, r); }
      g.globalAlpha = 1;
      for (let i = 0; i < 1 + ((rnd() * 2) | 0); i++) { // paint drips
        const x = s * (0.2 + rnd() * 0.6), len = s * (0.06 + rnd() * 0.08), dw = s * 0.05;
        g.fillStyle = c; g.fillRect(x - dw / 2, s * 0.8, dw, len); g.beginPath(); g.arc(x, s * 0.8 + len, dw * 0.65, 0, Math.PI * 2); g.fill();
      }
      rr(g, s * 0.09, s * 0.08, s * 0.82, s * 0.78, s * 0.12); g.fillStyle = c; g.fill();
      g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = Math.max(1, s * 0.03); g.stroke();
      g.save(); g.clip(); TEX.spray(g, s, c, seeded(c), 1); g.restore();
    },
  },
  marquee: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = shade(c, -0.5); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.1); g.fillStyle = shade(c, -0.2); g.fill();
      const gr = g.createLinearGradient(0, s * 0.2, 0, s * 0.8); gr.addColorStop(0, shade(c, 0.3)); gr.addColorStop(1, c);
      rr(g, s * 0.21, s * 0.2, s * 0.58, s * 0.56, s * 0.06); g.fillStyle = gr; g.fill();
      TEX.marquee(g, s, c, seeded(c), 1);
    },
  },
  gelato: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.06, s * 0.9, s * 0.88, s * 0.3); g.fillStyle = shade(c, -0.2); g.fill();
      const gr = g.createRadialGradient(s * 0.4, s * 0.32, s * 0.05, s * 0.5, s * 0.5, s * 0.6);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.45)); gr.addColorStop(0.65, c); gr.addColorStop(1, shade(c, -0.06));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.84, s * 0.3); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'gelato', 1, 0.06, 0.3);
    },
  },
});

Object.assign(TEX, {
  cloud(g, s, c, rnd, k) { // sunlit puffs on top, a soft shadowed base
    g.fillStyle = `rgba(255,255,255,${0.45 * k})`;
    for (const [x, y, r] of CLOUD.slice(0, 3)) { g.beginPath(); g.arc(s * (x - r * 0.25), s * (y - r * 0.3), s * r * 0.45, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = `rgba(0,0,0,${0.06 * k})`; g.fillRect(0, s * 0.78, s, s * 0.22);
  },
  metal(g, s, c, rnd, k) { // brushed plate with four slotted screws
    for (let y = 0; y < s; y += Math.max(1, s / 36)) {
      g.fillStyle = rnd() < 0.5 ? `rgba(255,255,255,${(0.03 + rnd() * 0.08) * k})` : `rgba(0,0,0,${(0.03 + rnd() * 0.08) * k})`;
      g.fillRect(0, y, s, Math.max(0.6, s / 72));
    }
    for (const [x, y] of [[0.16, 0.16], [0.84, 0.16], [0.16, 0.8], [0.84, 0.8]]) {
      g.beginPath(); g.arc(s * x, s * y, s * 0.07, 0, Math.PI * 2); g.fillStyle = `rgba(30,34,40,${0.45 * k})`; g.fill();
      g.beginPath(); g.arc(s * x - s * 0.01, s * y - s * 0.01, s * 0.052, 0, Math.PI * 2); g.fillStyle = `rgba(230,236,242,${0.6 * k})`; g.fill();
      g.save(); g.translate(s * x - s * 0.01, s * y - s * 0.01); g.rotate(0.7 + rnd()); g.fillStyle = `rgba(30,34,40,${0.6 * k})`; g.fillRect(-s * 0.042, -s * 0.009, s * 0.084, s * 0.018); g.restore();
    }
  },
  tiki(g, s, c, rnd, k) { // two bamboo stalks side by side: round shading, fibres, a node each
    const sw = s / 2;
    for (let i = 0; i < 2; i++) {
      const x = i * sw, gr = g.createLinearGradient(x, 0, x + sw, 0);
      gr.addColorStop(0, `rgba(0,0,0,${0.22 * k})`); gr.addColorStop(0.35, `rgba(255,255,230,${0.22 * k})`); gr.addColorStop(1, `rgba(0,0,0,${0.25 * k})`);
      g.fillStyle = gr; g.fillRect(x, 0, sw, s);
      const ny = s * (0.3 + rnd() * 0.4);
      g.fillStyle = `rgba(60,30,0,${0.35 * k})`; g.fillRect(x, ny, sw, Math.max(1, s * 0.035));
      g.fillStyle = `rgba(255,250,220,${0.35 * k})`; g.fillRect(x, ny + s * 0.035, sw, Math.max(1, s * 0.02));
      g.strokeStyle = `rgba(60,30,0,${0.12 * k})`; g.lineWidth = Math.max(0.6, s * 0.008);
      for (let f = 0; f < 3; f++) { const fx = x + sw * (0.25 + f * 0.25); g.beginPath(); g.moveTo(fx, 0); g.lineTo(fx, s); g.stroke(); }
    }
  },
  fossil(g, s, c, rnd, k) { // rock strata with an ammonite or a bone pressed into it
    for (let i = 0; i < 4; i++) {
      const y = s * (0.15 + i * 0.24 + rnd() * 0.05);
      g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(s * 0.3, y + (rnd() - 0.5) * s * 0.1, s * 0.6, y + (rnd() - 0.5) * s * 0.1, s, y);
      g.lineTo(s, y + s * 0.07); g.lineTo(0, y + s * 0.07); g.closePath();
      g.fillStyle = i % 2 ? `rgba(0,0,0,${0.1 * k})` : `rgba(255,240,210,${0.1 * k})`; g.fill();
    }
    speckle(g, s, rnd, 24, 0.004, 0.01, () => `rgba(40,20,0,${0.2 * k})`);
    const kind = rnd() < 0.6 ? 0 : 1, rot = rnd() * 6.3;
    const shape = () => {
      g.beginPath();
      if (kind === 0) {
        for (let an = 0; an < Math.PI * 5; an += 0.2) { const r = s * 0.27 * Math.exp(-0.17 * an), x = Math.cos(an + rot) * r, y = Math.sin(an + rot) * r; an ? g.lineTo(s * 0.5 + x, s * 0.52 + y) : g.moveTo(s * 0.5 + x, s * 0.52 + y); }
        for (let an = 0; an < Math.PI * 2; an += 0.45) { const r = s * 0.27 * Math.exp(-0.17 * an), cx = Math.cos(an + rot), cy = Math.sin(an + rot); g.moveTo(s * 0.5 + cx * r, s * 0.52 + cy * r); g.lineTo(s * 0.5 + cx * r * 0.72, s * 0.52 + cy * r * 0.72); }
      } else {
        const L = s * 0.24, kr = s * 0.05, ca = Math.cos(rot), sa = Math.sin(rot), P = (x, y) => [s * 0.5 + x * ca - y * sa, s * 0.52 + x * sa + y * ca];
        g.moveTo(...P(-L, 0)); g.lineTo(...P(L, 0));
        for (const sx of [-1, 1]) for (const sy of [-1, 1]) { const [x, y] = P(sx * L, sy * kr * 0.8); g.moveTo(x + kr, y); g.arc(x, y, kr, 0, Math.PI * 2); }
      }
    };
    carved(g, shape, Math.max(1, s * 0.03), `rgba(255,245,220,${0.45 * k})`, `rgba(50,30,15,${0.55 * k})`);
  },
  lacquer(g, s, c, rnd, k) { // glossy shine, a gold note and a gold inner line
    g.beginPath(); g.ellipse(s * 0.38, s * 0.2, s * 0.26, s * 0.06, -0.2, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.35 * k})`; g.fill();
    g.fillStyle = `rgba(255,214,110,${0.75 * k})`; noteShape(g, s * 0.5, s * 0.52, s * 0.26);
    rr(g, s * 0.16, s * 0.16, s * 0.68, s * 0.68, s * 0.06); g.strokeStyle = `rgba(255,214,110,${0.5 * k})`; g.lineWidth = Math.max(1, s * 0.02); g.stroke();
  },
  maple(g, s, c, rnd, k) { // mottled autumn colour and a pale maple leaf with its veins
    speckle(g, s, rnd, 30, 0.01, 0.04, () => rnd() < 0.5 ? `rgba(255,220,120,${0.12 * k})` : `rgba(80,20,0,${0.14 * k})`);
    const rot = (rnd() - 0.5) * 0.8, r = s * 0.36;
    mapleShape(g, s * 0.5, s * 0.5, r, rot); g.fillStyle = `rgba(255,236,190,${0.32 * k})`; g.fill();
    g.save(); g.translate(s * 0.5, s * 0.5); g.rotate(rot);
    g.strokeStyle = `rgba(110,40,10,${0.4 * k})`; g.lineWidth = Math.max(1, s * 0.015); g.beginPath();
    for (const [x, y] of [[0, -0.85], [0.75, -0.35], [0.7, 0.2], [-0.75, -0.35], [-0.7, 0.2], [0, 0.95]]) { g.moveTo(0, r * 0.3); g.lineTo(x * r, y * r); }
    g.stroke(); g.restore();
  },
  sushi(g, s, c, rnd, k) { // the white lines of fat running through raw fish, a glaze
    g.strokeStyle = `rgba(255,255,255,${0.45 * k})`; g.lineWidth = Math.max(1, s * 0.035); g.lineCap = 'round';
    for (let i = -2; i <= 3; i++) { const x = s * (i * 0.2 + rnd() * 0.05); g.beginPath(); g.moveTo(x, s); g.quadraticCurveTo(x + s * 0.25, s * 0.5, x + s * 0.45, 0); g.stroke(); }
    g.beginPath(); g.ellipse(s * 0.36, s * 0.26, s * 0.2, s * 0.05, -0.4, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.3 * k})`; g.fill();
  },
  spray(g, s, c, rnd, k) { // spray grain, a darker lower edge, a white shine stroke
    speckle(g, s, rnd, 40, 0.003, 0.008, () => rnd() < 0.5 ? `rgba(255,255,255,${0.25 * k})` : `rgba(0,0,0,${0.2 * k})`);
    const gr = g.createLinearGradient(0, s * 0.4, 0, s); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${0.22 * k})`);
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
    g.strokeStyle = `rgba(255,255,255,${0.8 * k})`; g.lineWidth = Math.max(1, s * 0.045); g.lineCap = 'round';
    g.beginPath(); g.moveTo(s * 0.2, s * 0.36); g.quadraticCurveTo(s * 0.22, s * 0.2, s * 0.38, s * 0.18); g.stroke();
    g.beginPath(); g.arc(s * 0.48, s * 0.18, Math.max(0.8, s * 0.025), 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.8 * k})`; g.fill();
  },
  marquee(g, s, c, rnd, k) { // a ring of light bulbs, every other one lit
    const P = [0.13, 0.37, 0.63, 0.87], pts = [];
    for (const v of P) pts.push([v, 0.13]); for (const v of P.slice(1)) pts.push([0.87, v]);
    for (const v of P.slice(0, 3).reverse()) pts.push([v, 0.87]); for (const v of [0.63, 0.37]) pts.push([0.13, v]);
    const r = s * 0.045;
    pts.forEach(([x, y], i) => {
      const lit = i % 2 === 0;
      if (lit) { const gl = g.createRadialGradient(s * x, s * y, 0, s * x, s * y, r * 2.6); gl.addColorStop(0, `rgba(255,240,170,${0.7 * k})`); gl.addColorStop(1, 'rgba(255,240,170,0)'); g.fillStyle = gl; g.fillRect(s * x - r * 2.6, s * y - r * 2.6, r * 5.2, r * 5.2); }
      g.beginPath(); g.arc(s * x, s * y, r, 0, Math.PI * 2); g.fillStyle = lit ? `rgba(255,250,215,${k})` : `rgba(255,240,200,${0.35 * k})`; g.fill();
    });
    g.beginPath(); g.ellipse(s * 0.4, s * 0.3, s * 0.14, s * 0.04, -0.2, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.35 * k})`; g.fill();
  },
  gelato(g, s, c, rnd, k) { // ridges left by the spatula, flecks of vanilla or nut, a creamy shine
    g.lineCap = 'round'; g.lineWidth = Math.max(1, s * 0.03);
    for (let i = 0; i < 3; i++) {
      const y = s * (0.3 + i * 0.2 + rnd() * 0.04);
      const ridge = dy => { g.beginPath(); g.moveTo(s * 0.12, y + s * 0.04 + dy); g.quadraticCurveTo(s * 0.5, y - s * 0.12 + dy, s * 0.88, y + s * 0.02 + dy); };
      ridge(s * 0.035); g.strokeStyle = `rgba(0,0,0,${0.08 * k})`; g.stroke();
      ridge(0); g.strokeStyle = `rgba(255,255,255,${0.4 * k})`; g.stroke();
    }
    speckle(g, s, rnd, 14, 0.006, 0.012, () => `rgba(80,40,20,${0.35 * k})`);
    g.beginPath(); g.ellipse(s * 0.34, s * 0.22, s * 0.16, s * 0.05, -0.4, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.4 * k})`; g.fill();
  },
});

/* ---------- Third theme set, part 2: living backgrounds ---------- */
Object.assign(AMBIENTS, {
  sky(th) { // a faint rainbow, drifting clouds, a few birds
    const CL = [...Array(7)].map(() => ({ x: Math.random() * 1.4 - 0.2, y: rand(0.05, 0.85), s: rand(0.5, 1.2), v: rand(0.006, 0.018), P: [...Array(5)].map((_, i) => [(i - 2) * 0.3 + rand(-0.06, 0.06), (i % 2 ? rand(-0.14, -0.04) : rand(-0.02, 0.04)), rand(0.22, 0.34)]) }));
    const BD = [...Array(4)].map(() => ({ x: Math.random(), y: rand(0.1, 0.45), v: rand(0.02, 0.04), ph: rand(0, 6.3), s: rand(0.7, 1.2) }));
    const RB = ['#ff6a6a', '#ffb04a', '#ffe46a', '#7ae08a', '#6ab8ff', '#a88aff'];
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const c of CL) { c.x += c.v * dt; if (c.x > 1.4) c.x = -0.4; }
        for (const b of BD) { b.x += b.v * dt; b.ph += dt * 8; if (b.x > 1.1) { b.x = -0.1; b.y = rand(0.1, 0.45); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), M = Math.max(w, h);
        g.lineWidth = M * 0.025;
        RB.forEach((c, i) => { g.beginPath(); g.arc(w * 0.5, h * 1.05, M * (0.75 - i * 0.025), Math.PI, Math.PI * 2); g.strokeStyle = rgba(c, 0.1 * a); g.stroke(); });
        for (const c of CL) {
          const cx = c.x * w, cy = c.y * h, base = u * 0.12 * c.s;
          g.beginPath(); for (const [px, py, pr] of c.P) { const x = cx + px * base * 2, y = cy + py * base * 2; g.moveTo(x + pr * base * 2, y); g.arc(x, y, pr * base * 2, 0, Math.PI * 2); }
          g.fillStyle = `rgba(255,255,255,${0.6 * a})`; g.fill();
        }
        g.strokeStyle = `rgba(40,60,90,${0.45 * a})`; g.lineWidth = 1.6;
        for (const b of BD) {
          const x = b.x * w, y = b.y * h, bs = u * 0.018 * b.s, f = Math.sin(b.ph) * 0.5 + 0.5;
          g.beginPath(); g.moveTo(x - bs, y - bs * 0.3 * f); g.quadraticCurveTo(x - bs * 0.45, y - bs * 0.6 * f, x, y); g.quadraticCurveTo(x + bs * 0.45, y - bs * 0.6 * f, x + bs, y - bs * 0.3 * f); g.stroke();
        }
      },
    };
  },
  factory(th) { // a rotating beacon, a welding robot arm, a conveyor belt of crates
    let t = 0, spk = [], swait = rand(1, 3);
    const BOX = [...Array(6)].map((_, i) => ({ x: i / 6, c: th.blocks[(Math.random() * 7) | 0], s: rand(0.7, 1) }));
    return {
      step(dt) {
        t += dt;
        for (const b of BOX) { b.x += 0.05 * dt; if (b.x > 1.1) { b.x -= 1.2; b.c = th.blocks[(Math.random() * 7) | 0]; } }
        swait -= dt;
        if (swait < 0) { swait = rand(1.5, 4); if (!REDUCED) for (let i = 0; i < 22; i++) spk.push({ x: 0, y: 0, vx: rand(-0.25, 0.25), vy: rand(-0.35, 0.05), life: 0, max: rand(0.4, 0.9) }); }
        for (const p of spk) { p.life += dt; p.vy += 0.9 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
        spk = spk.filter(p => p.life < p.max);
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const bx = w * 0.1, by = h * 0.06, R = u * 0.5;
        g.save(); g.translate(bx, by); g.rotate(t * 2.4);
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, R); gr.addColorStop(0, rgba(th.accent, 0.2 * a)); gr.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, -0.3, 0.3); g.closePath(); g.fill(); g.restore();
        g.beginPath(); g.arc(bx, by, u * 0.02, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.8 * a); g.fill();
        const ax = w * 0.86, ay = h * 0.74, a1 = -1.9 + 0.35 * Math.sin(t * 0.7), a2 = a1 + 1.2 + 0.5 * Math.sin(t * 0.7 + 1), L1 = u * 0.22, L2 = u * 0.17;
        const ex = ax + Math.cos(a1) * L1, ey = ay + Math.sin(a1) * L1, tx = ex + Math.cos(a2) * L2, ty = ey + Math.sin(a2) * L2;
        g.fillStyle = `rgba(150,160,175,${0.3 * a})`; g.fillRect(ax - u * 0.05, ay, u * 0.1, h - ay);
        g.lineCap = 'round'; g.strokeStyle = `rgba(150,160,175,${0.35 * a})`; g.lineWidth = u * 0.035;
        g.beginPath(); g.moveTo(ax, ay); g.lineTo(ex, ey); g.lineTo(tx, ty); g.stroke();
        g.fillStyle = `rgba(170,180,195,${0.45 * a})`; for (const [x, y] of [[ax, ay], [ex, ey]]) { g.beginPath(); g.arc(x, y, u * 0.03, 0, Math.PI * 2); g.fill(); }
        const cl = 0.4 + 0.2 * Math.sin(t * 2);
        g.strokeStyle = rgba(th.accent, 0.5 * a); g.lineWidth = u * 0.012;
        g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(a2 - cl) * u * 0.04, ty + Math.sin(a2 - cl) * u * 0.04); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(a2 + cl) * u * 0.04, ty + Math.sin(a2 + cl) * u * 0.04); g.stroke();
        g.lineCap = 'butt';
        for (const p of spk) { const k = 1 - p.life / p.max; g.fillStyle = `rgba(255,${(180 + 70 * k) | 0},90,${k * a})`; g.fillRect(tx + p.x * u, ty + p.y * u, 2, 2); }
        const cy = h * 0.9, ch = h * 0.035, sp = u * 0.05, off = (t * 0.05 * w) % sp;
        g.fillStyle = `rgba(20,22,26,${0.85 * a})`; g.fillRect(0, cy, w, ch);
        g.strokeStyle = `rgba(120,130,140,${0.35 * a})`; g.lineWidth = 2;
        g.beginPath(); for (let x = -sp + off; x < w + sp; x += sp) { g.moveTo(x, cy); g.lineTo(x, cy + ch); } g.stroke();
        g.lineWidth = 1;
        for (const b of BOX) { const bs = u * 0.06 * b.s; g.fillStyle = rgba(b.c, 0.55 * a); g.fillRect(b.x * w, cy - bs, bs, bs); g.strokeStyle = `rgba(0,0,0,${0.3 * a})`; g.strokeRect(b.x * w, cy - bs, bs, bs); }
        g.save(); g.beginPath(); g.rect(0, cy + ch, w, h - cy - ch); g.clip();
        g.fillStyle = rgba(th.accent, 0.22 * a); const hh = h - cy;
        for (let x = -hh; x < w; x += u * 0.06) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + u * 0.03, h); g.lineTo(x + u * 0.03 + hh, cy); g.lineTo(x + hh, cy); g.fill(); }
        g.restore();
      },
    };
  },
  island(th) { // sun, rolling sea, palms leaning in from both sides, gulls
    let t = 0;
    const GU = [...Array(3)].map(() => ({ x: Math.random(), y: rand(0.08, 0.3), v: rand(0.02, 0.04), ph: rand(0, 6.3) }));
    return {
      step(dt) { t += dt; for (const b of GU) { b.x += b.v * dt; b.ph += dt * 6; if (b.x > 1.1) b.x = -0.1; } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sy = h * 0.74, sx = w * 0.78, sr = u * 0.09, syy = h * 0.14;
        const gl = g.createRadialGradient(sx, syy, 0, sx, syy, sr * 3.5); gl.addColorStop(0, `rgba(255,240,180,${0.7 * a})`); gl.addColorStop(1, 'rgba(255,240,180,0)');
        g.fillStyle = gl; g.fillRect(sx - sr * 3.5, syy - sr * 3.5, sr * 7, sr * 7);
        g.beginPath(); g.arc(sx, syy, sr, 0, Math.PI * 2); g.fillStyle = `rgba(255,250,220,${0.9 * a})`; g.fill();
        const sea = g.createLinearGradient(0, sy, 0, h); sea.addColorStop(0, `rgba(30,150,170,${0.35 * a})`); sea.addColorStop(1, `rgba(20,110,140,${0.5 * a})`);
        g.fillStyle = sea; g.fillRect(0, sy, w, h - sy);
        g.strokeStyle = `rgba(255,255,255,${0.45 * a})`; g.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const y0 = sy + (h - sy) * (0.1 + i * 0.2);
          g.beginPath(); for (let x = 0; x <= w + 10; x += 10) { const y = y0 + Math.sin(x * 0.03 + t * (1 + i * 0.2) + i) * u * 0.006; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
        }
        palm(g, w * 0.04, h * 0.98, u * 0.5, 1, Math.sin(t * 0.8) * 0.05, a);
        palm(g, w * 0.96, h * 0.98, u * 0.45, -1, Math.sin(t * 0.8 + 2) * 0.05, a);
        g.strokeStyle = `rgba(40,60,60,${0.5 * a})`; g.lineWidth = 1.6;
        for (const b of GU) {
          const x = b.x * w, y = b.y * h, bs = u * 0.02, f = Math.sin(b.ph) * 0.5 + 0.5;
          g.beginPath(); g.moveTo(x - bs, y - bs * 0.3 * f); g.quadraticCurveTo(x - bs * 0.45, y - bs * 0.6 * f, x, y); g.quadraticCurveTo(x + bs * 0.45, y - bs * 0.6 * f, x + bs, y - bs * 0.3 * f); g.stroke();
        }
      },
    };
  },
  prehistoric(th) { // a smoking volcano on the horizon, ferns, gliding pterosaurs
    let land = null, lw = 0, lh = 0, t = 0, acc = 0, SM = [];
    const PT = [0, 1].map(i => ({ x: Math.random(), y: rand(0.1, 0.32), v: rand(0.015, 0.03) * (i ? -1 : 1), ph: rand(0, 6.3), s: rand(0.8, 1.2) }));
    const CR = [0.78, 0.46];
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d'), u = Math.min(w, h), hy = h * 0.72;
      g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 10; x += 10) g.lineTo(x, hy - Math.abs(Math.sin(x * 0.006)) * h * 0.08 - Math.sin(x * 0.02) * h * 0.015); g.lineTo(w, h); g.closePath();
      g.fillStyle = 'rgba(90,60,40,.28)'; g.fill();
      g.beginPath(); g.moveTo(w * 0.58, hy); g.lineTo(w * (CR[0] - 0.05), h * CR[1]); g.lineTo(w * (CR[0] + 0.05), h * CR[1]); g.lineTo(w * 1.02, hy); g.closePath();
      g.fillStyle = 'rgba(70,45,30,.5)'; g.fill();
      g.strokeStyle = 'rgba(30,50,25,.5)'; g.lineCap = 'round';
      for (let i = 0; i < 14; i++) {
        const x = (i + Math.random()) / 14 * w, dir = Math.random() < 0.5 ? -1 : 1, H = u * rand(0.14, 0.26), ex = x + dir * H * 0.45, ey = h - H;
        g.lineWidth = 2; g.beginPath(); g.moveTo(x, h); g.quadraticCurveTo(x, h - H * 0.7, ex, ey); g.stroke();
        g.lineWidth = 1.5;
        for (let j = 1; j < 9; j++) {
          const q = j / 9, px = (1 - q) * (1 - q) * x + 2 * (1 - q) * q * x + q * q * ex, py = (1 - q) * (1 - q) * h + 2 * (1 - q) * q * (h - H * 0.7) + q * q * ey, L = H * 0.22 * (1 - q * 0.7);
          g.beginPath(); g.moveTo(px - L, py - L * 0.3); g.lineTo(px, py); g.lineTo(px + L, py - L * 0.3); g.stroke();
        }
      }
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        if (acc > 0.5) { acc = 0; SM.push({ x: CR[0] + rand(-0.01, 0.01), y: CR[1], life: 0 }); }
        for (const p of SM) { p.y -= 0.025 * dt; p.x += 0.008 * dt; p.life += dt / 8; }
        SM = SM.filter(p => p.life < 1);
        for (const p of PT) { p.x += p.v * dt; p.ph += dt * 3; if (p.x > 1.2) p.x = -0.2; if (p.x < -0.2) p.x = 1.2; }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const p of SM) {
          const r = u * (0.03 + p.life * 0.12), al = Math.sin(p.life * Math.PI) * 0.16 * a;
          const gr = g.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, r); gr.addColorStop(0, `rgba(120,100,90,${al})`); gr.addColorStop(1, 'rgba(120,100,90,0)');
          g.fillStyle = gr; g.fillRect(p.x * w - r, p.y * h - r, 2 * r, 2 * r);
        }
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        const pulse = 0.7 + 0.3 * Math.sin(t * 1.5), cx = CR[0] * w, cy = CR[1] * h, R = u * 0.12;
        const gl = g.createRadialGradient(cx, cy, 0, cx, cy, R); gl.addColorStop(0, rgba(th.accent, 0.45 * a * pulse)); gl.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gl; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
        g.fillStyle = `rgba(40,25,15,${0.6 * a})`;
        for (const p of PT) {
          const x = p.x * w, y = p.y * h, bs = u * 0.04 * p.s, f = Math.sin(p.ph) * 0.4, dir = p.v > 0 ? 1 : -1;
          g.save(); g.translate(x, y); g.scale(dir, 1);
          g.beginPath(); g.moveTo(-bs * 0.1, 0); g.quadraticCurveTo(-bs * 0.5, -bs * (0.3 + f), -bs * 1.4, -bs * (0.15 + f)); g.lineTo(-bs * 0.25, bs * 0.12); g.closePath(); g.fill();
          g.beginPath(); g.moveTo(bs * 0.1, 0); g.quadraticCurveTo(bs * 0.5, -bs * (0.3 + f), bs * 1.4, -bs * (0.15 + f)); g.lineTo(bs * 0.25, bs * 0.12); g.closePath(); g.fill();
          g.beginPath(); g.ellipse(0, bs * 0.04, bs * 0.32, bs * 0.1, 0, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.moveTo(bs * 0.28, 0); g.lineTo(bs * 0.6, bs * 0.06); g.lineTo(bs * 0.3, bs * 0.1); g.closePath(); g.fill();
          g.beginPath(); g.moveTo(bs * 0.3, -bs * 0.02); g.lineTo(bs * 0.12, -bs * 0.22); g.lineTo(bs * 0.22, -bs * 0.02); g.closePath(); g.fill();
          g.restore();
        }
      },
    };
  },
  musicbox(th) { // a turning pin cylinder under its comb, notes rising
    const N2 = [...Array(14)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.02, 0.05), ph: rand(0, 6.3), s: rand(0.6, 1.2), c: Math.random() < 0.5 ? th.accent : th.blocks[(Math.random() * 7) | 0] }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const n of N2) { n.y -= n.v * dt; if (n.y < -0.05) { n.y = 1.05; n.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), M = Math.max(w, h);
        const sp = g.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, M * 0.6); sp.addColorStop(0, rgba(th.accent, 0.08 * a)); sp.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = sp; g.fillRect(0, 0, w, h);
        for (const n of N2) { g.fillStyle = rgba(n.c, 0.4 * a); noteShape(g, (n.x + Math.sin(t + n.ph) * 0.02) * w, n.y * h, u * 0.03 * n.s); }
        const cy = h * 0.9, ch = u * 0.07;
        const cg = g.createLinearGradient(0, cy - ch / 2, 0, cy + ch / 2); cg.addColorStop(0, `rgba(246,224,138,${0.35 * a})`); cg.addColorStop(0.5, `rgba(184,144,44,${0.35 * a})`); cg.addColorStop(1, `rgba(120,90,30,${0.35 * a})`);
        g.fillStyle = cg; g.fillRect(0, cy - ch / 2, w, ch);
        const gap = u * 0.035, pos = t * u * 0.06, base = Math.floor(pos / gap), off = pos - base * gap;
        g.fillStyle = `rgba(255,240,190,${0.6 * a})`;
        for (let j = -1; j * gap < w + gap; j++) for (let r = 0; r < 4; r++) if (((j + base) * 7 + r * 3) % 5 === 0) g.fillRect(j * gap - off, cy - ch * 0.35 + r * ch * 0.22, 2.5, 2.5);
        g.strokeStyle = `rgba(220,220,230,${0.25 * a})`; g.lineWidth = 2;
        g.beginPath(); for (let x = u * 0.04; x < w; x += u * 0.025) { g.moveTo(x, cy - ch * 1.3); g.lineTo(x, cy - ch * 0.55); } g.stroke();
      },
    };
  },
  autumn(th) { // misty tree trunks, maple leaves blown about by gusts
    let trees = null, tw = 0, th2 = 0, t = 0;
    const LV = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), rot: rand(0, 6.3), vr: rand(-1.5, 1.5), v: rand(0.03, 0.07), ph: rand(0, 6.3), s: rand(0.6, 1.2), c: th.blocks[(Math.random() * 7) | 0] }));
    function build(w, h) {
      tw = w; th2 = h; trees = document.createElement('canvas'); trees.width = Math.ceil(w); trees.height = Math.ceil(h);
      const g = trees.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 9; i++) {
        const x = (i + Math.random()) / 9 * w, tw2 = u * rand(0.03, 0.07), al = rand(0.15, 0.35);
        g.fillStyle = `rgba(20,10,4,${al})`; g.strokeStyle = `rgba(20,10,4,${al})`;
        g.beginPath(); g.moveTo(x - tw2, h); g.lineTo(x - tw2 * 0.4, 0); g.lineTo(x + tw2 * 0.4, 0); g.lineTo(x + tw2, h); g.closePath(); g.fill();
        g.lineCap = 'round';
        for (let j = 0; j < 3; j++) { const by = h * rand(0.1, 0.5), dir = Math.random() < 0.5 ? -1 : 1; g.lineWidth = tw2 * 0.3; g.beginPath(); g.moveTo(x, by); g.quadraticCurveTo(x + dir * u * 0.08, by - u * 0.04, x + dir * u * 0.16, by - u * 0.12); g.stroke(); }
      }
    }
    return {
      step(dt) {
        t += dt;
        const wind = 0.05 * Math.sin(t * 0.3) + 0.03 * Math.sin(t * 1.1);
        for (const l of LV) { l.y += l.v * dt; l.x += (wind + Math.sin(t * 1.5 + l.ph) * 0.02) * dt; l.rot += l.vr * dt; if (l.y > 1.05) { l.y = -0.05; l.x = Math.random(); } if (l.x > 1.05) l.x = -0.05; if (l.x < -0.05) l.x = 1.05; }
      },
      draw(g, w, h, a) {
        if (!trees || Math.abs(w - tw) > 1 || Math.abs(h - th2) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(trees, 0, 0, w, h); g.globalAlpha = 1;
        for (let i = 0; i < 2; i++) {
          const y = h * (0.7 + i * 0.15), off = Math.sin(t * 0.15 + i) * w * 0.1;
          const fg = g.createLinearGradient(0, y - h * 0.1, 0, y + h * 0.1); fg.addColorStop(0, 'rgba(255,220,180,0)'); fg.addColorStop(0.5, `rgba(255,220,180,${0.08 * a})`); fg.addColorStop(1, 'rgba(255,220,180,0)');
          g.fillStyle = fg; g.fillRect(off - w * 0.2, y - h * 0.1, w * 1.4, h * 0.2);
        }
        const u = Math.min(w, h);
        for (const l of LV) { mapleShape(g, l.x * w, l.y * h, u * 0.022 * l.s, l.rot); g.fillStyle = rgba(l.c, 0.75 * a); g.fill(); }
      },
    };
  },
  sushibar(th) { // paper lanterns over a conveyor of sushi plates
    let t = 0;
    const PL = [...Array(8)].map((_, i) => ({ x: i / 8, c: th.blocks[(Math.random() * 7) | 0], rim: ['#d8344a', '#3a8ad8', '#e8b030'][(Math.random() * 3) | 0] }));
    const LN = [0.12, 0.38, 0.62, 0.88].map(x => ({ x, ph: rand(0, 6.3) }));
    return {
      step(dt) { t += dt; for (const p of PL) { p.x += 0.04 * dt; if (p.x > 1.1) { p.x -= 1.2; p.c = th.blocks[(Math.random() * 7) | 0]; } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), by = h * 0.86;
        const wood = g.createLinearGradient(0, by, 0, h); wood.addColorStop(0, `rgba(140,84,46,${0.4 * a})`); wood.addColorStop(1, `rgba(90,50,26,${0.5 * a})`);
        g.fillStyle = wood; g.fillRect(0, by, w, h - by);
        g.fillStyle = `rgba(60,60,66,${0.7 * a})`; g.fillRect(0, by - u * 0.03, w, u * 0.03);
        g.strokeStyle = `rgba(150,150,160,${0.3 * a})`; g.lineWidth = 1; const sp = u * 0.03, off = (t * 0.04 * w) % sp;
        g.beginPath(); for (let x = -sp + off; x < w + sp; x += sp) { g.moveTo(x, by - u * 0.03); g.lineTo(x, by); } g.stroke();
        for (const p of PL) {
          const x = p.x * w, y = by - u * 0.035;
          g.beginPath(); g.ellipse(x, y, u * 0.05, u * 0.016, 0, 0, Math.PI * 2); g.fillStyle = `rgba(250,248,244,${0.75 * a})`; g.fill();
          g.strokeStyle = rgba(p.rim, 0.7 * a); g.lineWidth = 2; g.stroke();
          rr(g, x - u * 0.028, y - u * 0.028, u * 0.056, u * 0.022, u * 0.008); g.fillStyle = `rgba(247,242,234,${0.9 * a})`; g.fill();
          rr(g, x - u * 0.03, y - u * 0.04, u * 0.06, u * 0.016, u * 0.008); g.fillStyle = rgba(p.c, 0.9 * a); g.fill();
        }
        for (const l of LN) {
          const sw = Math.sin(t * 0.9 + l.ph) * 0.06, x0 = l.x * w, L = h * 0.08, x = x0 + Math.sin(sw) * L, y = Math.cos(sw) * L, lr = u * 0.035;
          const gl = g.createRadialGradient(x, y + lr, 0, x, y + lr, lr * 4); gl.addColorStop(0, `rgba(255,140,80,${0.25 * a})`); gl.addColorStop(1, 'rgba(255,140,80,0)');
          g.fillStyle = gl; g.fillRect(x - lr * 4, y + lr - lr * 4, lr * 8, lr * 8);
          g.strokeStyle = `rgba(30,20,20,${0.6 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x, y); g.stroke();
          g.beginPath(); g.ellipse(x, y + lr * 1.2, lr, lr * 1.25, 0, 0, Math.PI * 2); g.fillStyle = `rgba(216,52,42,${0.75 * a})`; g.fill();
          g.strokeStyle = `rgba(120,20,16,${0.5 * a})`; for (let k = -2; k <= 2; k++) { g.beginPath(); g.ellipse(x, y + lr * 1.2 + k * lr * 0.4, lr * Math.sqrt(Math.max(0.05, 1 - (k * 0.32) ** 2)), lr * 0.08, 0, 0, Math.PI * 2); g.stroke(); }
          g.fillStyle = `rgba(30,20,20,${0.8 * a})`; g.fillRect(x - lr * 0.4, y - lr * 0.1, lr * 0.8, lr * 0.15); g.fillRect(x - lr * 0.4, y + lr * 2.4, lr * 0.8, lr * 0.15);
        }
      },
    };
  },
  graffiti(th) { // a brick wall covered in old tags under a flickering street lamp
    let wall = null, ww = 0, wh = 0, t = 0, fwait = rand(3, 7);
    function build(w, h) {
      ww = w; wh = h; wall = document.createElement('canvas'); wall.width = Math.ceil(w); wall.height = Math.ceil(h);
      const g = wall.getContext('2d'), u = Math.min(w, h), bh = u * 0.045, bw = bh * 2.6;
      for (let r = 0, y = 0; y < h; r++, y += bh) {
        const off = (r % 2) * bw / 2;
        for (let x = -off; x < w; x += bw) { g.fillStyle = `rgba(140,70,56,${0.05 + Math.random() * 0.08})`; g.fillRect(x + 1, y + 1, bw - 2, bh - 2); }
      }
      g.lineCap = 'round'; g.lineJoin = 'round';
      for (let i = 0; i < 10; i++) {
        const c = th.blocks[(Math.random() * 7) | 0], x = Math.random() * w, y = Math.random() * h, L = u * rand(0.15, 0.35);
        g.strokeStyle = rgba(c, rand(0.1, 0.16)); g.lineWidth = u * rand(0.015, 0.035);
        g.beginPath(); g.moveTo(x, y);
        for (let j = 0; j < 3; j++) g.bezierCurveTo(x + rand(-L, L), y + rand(-L, L) * 0.5, x + rand(-L, L), y + rand(-L, L) * 0.5, x + rand(-L, L), y + rand(-L, L) * 0.4);
        g.stroke();
        g.lineWidth = u * 0.006;
        for (let j = 0; j < 3; j++) { const dx = x + rand(-L, L) * 0.6, dy = y + rand(-L, L) * 0.3; g.beginPath(); g.moveTo(dx, dy); g.lineTo(dx, dy + u * rand(0.03, 0.08)); g.stroke(); }
      }
    }
    return {
      step(dt) { t += dt; fwait -= dt; if (fwait < -0.5) fwait = rand(3, 7); },
      draw(g, w, h, a) {
        if (!wall || Math.abs(w - ww) > 1 || Math.abs(h - wh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(wall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), lx = w * 0.84, fl = fwait < 0 && !REDUCED ? (Math.sin(t * 60) > 0 ? 0.35 : 1) : 1;
        const cone = g.createLinearGradient(0, u * 0.05, 0, h); cone.addColorStop(0, `rgba(255,220,150,${0.18 * fl * a})`); cone.addColorStop(1, 'rgba(255,220,150,0)');
        g.fillStyle = cone; g.beginPath(); g.moveTo(lx - u * 0.03, u * 0.05); g.lineTo(lx + u * 0.03, u * 0.05); g.lineTo(lx + w * 0.35, h); g.lineTo(lx - w * 0.35, h); g.fill();
        g.fillStyle = `rgba(40,40,44,${0.9 * a})`; g.fillRect(lx - u * 0.04, u * 0.02, u * 0.08, u * 0.03);
        g.fillStyle = `rgba(255,236,190,${0.9 * fl * a})`; g.fillRect(lx - u * 0.03, u * 0.05, u * 0.06, u * 0.008);
      },
    };
  },
  carnival(th) { // a turning ferris wheel, bulb strings, bursts of fireworks
    let t = 0, fw = [], fwait = rand(1, 3);
    const BUL = [...Array(14)].map((_, i) => th.blocks[i % 7]);
    return {
      step(dt) {
        t += dt; fwait -= dt;
        if (fwait < 0) {
          fwait = rand(1.5, 3.5);
          if (!REDUCED) { const x = rand(0.25, 0.85), y = rand(0.08, 0.3), c = th.blocks[(Math.random() * 7) | 0]; for (let i = 0; i < 28; i++) { const an = i / 28 * Math.PI * 2, v = rand(0.12, 0.22); fw.push({ x, y, vx: Math.cos(an) * v, vy: Math.sin(an) * v, life: 0, c }); } }
        }
        for (const p of fw) { p.life += dt / 1.4; p.vx *= Math.exp(-1.5 * dt); p.vy = p.vy * Math.exp(-1.5 * dt) + 0.08 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
        fw = fw.filter(p => p.life < 1);
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), cx = w * 0.16, cy = h * 0.66, R = u * 0.34, rot = t * 0.15;
        g.strokeStyle = `rgba(200,180,230,${0.25 * a})`; g.lineWidth = 4;
        g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx - R * 0.5, h); g.moveTo(cx, cy); g.lineTo(cx + R * 0.5, h); g.stroke();
        g.strokeStyle = `rgba(255,220,150,${0.28 * a})`; g.lineWidth = 3;
        g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(cx, cy, R * 0.9, 0, Math.PI * 2); g.stroke();
        g.lineWidth = 1.5; g.beginPath();
        for (let i = 0; i < 12; i++) { const an = rot + i * Math.PI / 6; g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an) * R, cy + Math.sin(an) * R); }
        g.stroke();
        const step = Math.floor(t * 4);
        for (let i = 0; i < 24; i++) { const an = rot + i * Math.PI / 12, on = (i + step) % 3 === 0; g.beginPath(); g.arc(cx + Math.cos(an) * R, cy + Math.sin(an) * R, on ? 3 : 2, 0, Math.PI * 2); g.fillStyle = on ? `rgba(255,246,200,${0.9 * a})` : `rgba(255,220,150,${0.35 * a})`; g.fill(); }
        for (let i = 0; i < 8; i++) {
          const an = rot + i * Math.PI / 4, x = cx + Math.cos(an) * R, y = cy + Math.sin(an) * R, gs2 = u * 0.035;
          g.strokeStyle = `rgba(255,220,150,${0.4 * a})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + gs2 * 0.5); g.stroke();
          rr(g, x - gs2 * 0.5, y + gs2 * 0.5, gs2, gs2 * 0.7, gs2 * 0.2); g.fillStyle = rgba(th.blocks[i % 7], 0.6 * a); g.fill();
        }
        const sag = h * 0.05, wy = x => h * 0.02 + Math.pow(Math.sin(x * Math.PI * 2), 2) * sag;
        g.strokeStyle = `rgba(30,10,40,${0.8 * a})`; g.lineWidth = 1.5; g.beginPath();
        for (let i = 0; i <= 40; i++) { const x = i / 40; i ? g.lineTo(x * w, wy(x)) : g.moveTo(0, wy(0)); } g.stroke();
        BUL.forEach((c, i) => { const fx = (i + 0.5) / BUL.length, k = 0.55 + 0.45 * Math.sin(t * 3 + i * 1.3); g.beginPath(); g.arc(fx * w, wy(fx) + u * 0.012, u * 0.009, 0, Math.PI * 2); g.fillStyle = rgba(c, (0.4 + 0.5 * k) * a); g.fill(); });
        g.save(); g.globalCompositeOperation = 'lighter';
        for (const p of fw) { g.fillStyle = rgba(p.c, (1 - p.life) * 0.9 * a); g.fillRect(p.x * w - 1.5, p.y * h - 1.5, 3, 3); }
        g.restore();
      },
    };
  },
  gelateria(th) { // a striped awning, pastel bokeh, sprinkles and waffle crumbs falling
    let awn = null, aw = 0, ah = 0, t = 0;
    const SP = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.03, 0.07), rot: rand(0, 6.3), vr: rand(-2, 2), c: th.blocks[(Math.random() * 7) | 0], waffle: Math.random() < 0.3 }));
    const BK = [...Array(10)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.04, 0.09), v: rand(0.005, 0.015), c: th.blocks[(Math.random() * 6) | 0] }));
    function build(w, h) {
      aw = w; ah = h; const u = Math.min(w, h), H = Math.ceil(u * 0.13), sw = u * 0.07, base = H * 0.68;
      awn = document.createElement('canvas'); awn.width = Math.ceil(w); awn.height = H;
      const g = awn.getContext('2d');
      g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, base);
      for (let x = Math.ceil(w / sw) * sw; x > 0; x -= sw) g.arc(x - sw / 2, base, sw / 2, 0, Math.PI);
      g.closePath(); g.save(); g.clip();
      for (let i = 0, x = 0; x < w; i++, x += sw) { g.fillStyle = i % 2 ? '#fff8f2' : th.accent; g.fillRect(x, 0, sw, H); }
      const sh = g.createLinearGradient(0, 0, 0, H); sh.addColorStop(0, 'rgba(0,0,0,.12)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sh; g.fillRect(0, 0, w, H);
      g.restore();
    }
    return {
      step(dt) {
        t += dt;
        for (const p of SP) { p.y += p.v * dt; p.rot += p.vr * dt; if (p.y > 1.03) { p.y = 0.08; p.x = Math.random(); } }
        for (const b of BK) { b.y -= b.v * dt; if (b.y < -0.1) { b.y = 1.1; b.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const b of BK) { const r = b.r * u, gr = g.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, r); gr.addColorStop(0, rgba(b.c, 0.22 * a)); gr.addColorStop(1, rgba(b.c, 0)); g.fillStyle = gr; g.fillRect(b.x * w - r, b.y * h - r, 2 * r, 2 * r); }
        g.lineCap = 'round';
        for (const p of SP) {
          const x = p.x * w, y = p.y * h;
          g.save(); g.translate(x, y); g.rotate(p.rot);
          if (p.waffle) { const q = u * 0.014; g.fillStyle = `rgba(216,160,96,${0.8 * a})`; g.fillRect(-q, -q, q * 2, q * 2); g.strokeStyle = `rgba(150,100,50,${0.6 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(-q, 0); g.lineTo(q, 0); g.moveTo(0, -q); g.lineTo(0, q); g.stroke(); }
          else { g.strokeStyle = rgba(p.c, 0.85 * a); g.lineWidth = Math.max(2, u * 0.006); g.beginPath(); g.moveTo(-u * 0.008, 0); g.lineTo(u * 0.008, 0); g.stroke(); }
          g.restore();
        }
        g.lineCap = 'butt';
        if (!awn || Math.abs(w - aw) > 1 || Math.abs(h - ah) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(awn, 0, 0); g.globalAlpha = 1;
      },
    };
  },
});

/* ---------- Third theme set: clear-effect particles ---------- */
Object.assign(PARTS, {
  fish(p, s) { ctx.rotate(Math.atan2(p.vy, p.vx)); fishShape(ctx, 0, 0, s * 0.6, 1, shade(p.color, 0.15), Math.sin(p.life * 30 + p.ph)); },
  tile(p, s) {
    ctx.rotate(p.rot); rr(ctx, -s * 0.45, -s * 0.45, s * 0.9, s * 0.9, s * 0.12); ctx.fillStyle = '#f4f8ff'; ctx.fill();
    ctx.lineWidth = Math.max(1, s * 0.12); ctx.strokeStyle = p.color; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
  },
  balloon(p, s) {
    const r = s * 0.5;
    ctx.beginPath(); ctx.arc(0, -r * 0.2, r, Math.PI * 0.85, Math.PI * 0.15); ctx.lineTo(0, r * 1.1); ctx.closePath(); ctx.fillStyle = p.color; ctx.fill();
    ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.5, r * 0.25, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fill();
    ctx.fillStyle = '#6a4020'; ctx.fillRect(-r * 0.18, r * 1.25, r * 0.36, r * 0.3);
  },
  cog(p, s) { ctx.rotate(p.rot); gearPath(ctx, 0, 0, s * 0.6, 8, 0, 0.3); ctx.fillStyle = shade(p.color, 0.1); ctx.fill('evenodd'); },
  leaf(p, s) { ctx.rotate(p.rot * 0.5); ctx.scale(1, 0.4 + 0.6 * Math.abs(Math.sin(p.life * 5 + p.ph))); mapleShape(ctx, 0, 0, s * 0.7, 0); ctx.fillStyle = shade(p.color, 0.05); ctx.fill(); },
  blob(p, s) {
    const r = s * 0.6, gr = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
    gr.addColorStop(0, mixHex(p.color, '#fff0c0', 0.5)); gr.addColorStop(1, p.color);
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * (1 + 0.2 * Math.sin(p.life * 8 + p.ph)), 0, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
  },
  puff(p, s, k) {
    const r = p.size * (0.4 + (1 - k) * 1.2); ctx.fillStyle = mixHex(p.color, '#ffffff', 0.6);
    ctx.beginPath(); for (const [x, y, q] of [[-0.5, 0.1, 0.6], [0, -0.2, 0.8], [0.5, 0.1, 0.6]]) { ctx.moveTo(x * r + q * r, y * r); ctx.arc(x * r, y * r, q * r, 0, Math.PI * 2); } ctx.fill();
  },
  nut(p, s) { ctx.rotate(p.rot); hexPath(ctx, 0, 0, s * 0.6); ctx.moveTo(s * 0.25, 0); ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2); ctx.fillStyle = mixHex('#c8d0d8', p.color, 0.3); ctx.fill('evenodd'); },
  note(p, s) { ctx.rotate(Math.sin(p.life * 4 + p.ph) * 0.3); ctx.fillStyle = shade(p.color, 0.2); noteShape(ctx, 0, 0, s * 0.8); },
  rice(p, s) { ctx.rotate(p.rot); ctx.beginPath(); ctx.ellipse(0, 0, s * 0.4, s * 0.2, 0, 0, Math.PI * 2); ctx.fillStyle = '#fbf6ec'; ctx.fill(); },
  confetti(p, s) { ctx.rotate(p.rot); ctx.scale(1, 0.15 + 0.85 * Math.abs(Math.sin(p.life * 9 + p.ph))); ctx.fillStyle = p.color; ctx.fillRect(-s * 0.5, -s * 0.28, s, s * 0.56); },
  sprinkle(p, s) { ctx.rotate(p.rot); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.5, s * 0.3); ctx.strokeStyle = p.color; ctx.beginPath(); ctx.moveTo(-s * 0.4, 0); ctx.lineTo(s * 0.4, 0); ctx.stroke(); },
});

/* ---------- Third theme set: sound kits ---------- */
Object.assign(Sfx, {
  // like hiss(), but the noise loops so a sound can outlast the half-second buffer (thunder, waves)
  hissL({ dur = 1, vol = 0.1, type = 'lowpass', freq = 1200, to = null, when = 0, q = 0.7 } = {}) {
    const c = this.ctx, t = c.currentTime + when;
    const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = c.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.08, dur * 0.2)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.out);
    s.start(t); s.stop(t + dur + 0.02);
  },
  // a sawtooth through a sweeping band-pass: the funk guitar "wah"
  wah(f, { when = 0, vol = 0.05, dur = 0.5 } = {}) {
    const c = this.ctx, t = c.currentTime + when;
    const o = c.createOscillator(), bp = c.createBiquadFilter(), g = c.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t);
    bp.type = 'bandpass'; bp.Q.value = 6; bp.frequency.setValueAtTime(400, t); bp.frequency.exponentialRampToValueAtTime(2200, t + dur * 0.35); bp.frequency.exponentialRampToValueAtTime(500, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(bp); bp.connect(g); g.connect(this.out);
    o.start(t); o.stop(t + dur + 0.05);
  },
});
Object.assign(KITS, (S => {
  const gong = (f, when, vol) => { S.tone(f, { dur: 1.8, vol, when, attack: 0.005, wet: true }); S.tone(f * 2.76, { dur: 0.9, vol: vol * 0.4, when }); S.tone(f * 1.52, { dur: 1.3, vol: vol * 0.5, when, detune: -12 }); };
  const burner = (when, dur, vol) => { S.hissL({ dur, vol, type: 'bandpass', freq: 350, to: 900, q: 0.8, when }); S.hissL({ dur: dur * 0.8, vol: vol * 0.6, type: 'lowpass', freq: 300, when }); };
  const MEL = [0, 4, 7, 12, 7, 4, 5, 9, 12, 9, 5, 4, 2, 7, 11, 14, 11, 7, 0, 4, 7, 12, 16, 12];
  let mi = 0;
  const comb = (st, { when = 0, vol = 0.08 } = {}) => { const f = S.snd.root * 0.5 * Math.pow(2, st / 12); S.tone(f, { dur: 0.7, vol, when, attack: 0.002, wet: true }); S.tone(f * 3, { dur: 0.2, vol: vol * 0.25, when, attack: 0.002 }); };
  const kick = (when, vol) => S.tone(130, { dur: 0.18, vol, to: 45, when });
  const snare = (when, vol) => { S.hiss({ dur: 0.12, vol, type: 'bandpass', freq: 1800, q: 0.8, when }); S.tone(210, { dur: 0.08, vol: vol * 0.8, to: 150, when }); };
  const hat = when => S.hiss({ dur: 0.03, vol: 0.04, type: 'highpass', freq: 7000, when });
  return {
    aurora: {
      pick() { S.tink(2600, { vol: 0.04, dur: 0.3 }); },
      place() { S.thud({ vol: 0.2, f: 140 }); S.tone(S.snd.root * 0.5, { dur: 0.5, vol: 0.05, attack: 0.03, wet: true }); },
      clear(n) {
        const r = S.snd.root * 0.5;
        [0, 7, 12].forEach(st => { const f = r * Math.pow(2, st / 12); S.tone(f, { dur: 1.2, vol: 0.05, attack: 0.12, wet: true, when: 0.02 }); S.tone(f, { dur: 1.2, vol: 0.04, attack: 0.12, detune: 9, when: 0.02 }); });
        for (let i = 0; i < n + 2; i++) S.tink(r * 4 * Math.pow(2, [0, 4, 7, 11, 14, 19, 23][i % 7] / 12), { when: 0.08 + i * 0.06, vol: 0.035, dur: 0.5 });
      },
      deal() { S.tink(3100, { vol: 0.03, dur: 0.4 }); },
    },
    reef: {
      pick() { S.plop(260, { vol: 0.07, dur: 0.06 }); },
      place() { S.thud({ vol: 0.3, f: 100 }); S.plop(180, { vol: 0.12, dur: 0.1, when: 0.02 }); S.hiss({ dur: 0.12, vol: 0.05, type: 'lowpass', freq: 500 }); },
      clear(n) {
        S.tone(280, { dur: 1.1, vol: 0.07, to: 520, attack: 0.15, wet: true }); S.tone(520, { dur: 0.8, vol: 0.05, to: 360, attack: 0.1, when: 0.9, wet: true });
        for (let i = 0; i < n + 2; i++) S.plop(rand(300, 700), { when: 0.05 + i * 0.07, vol: 0.08 });
      },
      deal() { S.plop(420, { vol: 0.05 }); S.plop(560, { vol: 0.04, when: 0.06 }); },
    },
    tomb: {
      pick() { S.hiss({ dur: 0.07, vol: 0.05, type: 'bandpass', freq: 900, q: 1.5 }); },
      place() { S.knock(260, { vol: 0.3 }); S.hiss({ dur: 0.15, vol: 0.07, type: 'bandpass', freq: 700, to: 300, q: 1.2, when: 0.01 }); },
      clear(n) { gong(110 + n * 6, 0, 0.16); S.hissL({ dur: 0.9, vol: 0.05, type: 'lowpass', freq: 2500, to: 400, when: 0.15 }); },
      deal() { S.hiss({ dur: 0.25, vol: 0.05, type: 'bandpass', freq: 600, to: 1400, q: 1.2 }); },
    },
    iznik: {
      pick() { S.tink(2300, { vol: 0.05, dur: 0.12 }); },
      place() { S.thud({ vol: 0.22, f: 160 }); S.tink(rand(1700, 2000), { vol: 0.1, dur: 0.2 }); },
      clear(n) { // a quick kanun run in a hijaz scale
        const H = [0, 1, 4, 5, 7, 8, 11, 12];
        for (let i = 0; i < n + 3; i++) { const f = S.snd.root * Math.pow(2, H[i % 8] / 12); S.tone(f, { type: 'triangle', dur: 0.18, vol: 0.09, when: i * 0.07, attack: 0.002 }); S.tone(f * 2, { dur: 0.1, vol: 0.03, when: i * 0.07 }); }
        S.tink(2600, { vol: 0.05, when: 0.05 });
      },
      deal() { S.tink(2000, { vol: 0.04, dur: 0.1 }); S.tink(2500, { vol: 0.03, dur: 0.1, when: 0.05 }); },
    },
    balloon: {
      pick() { S.rustle({ vol: 0.04, dur: 0.06 }); },
      place() { S.thud({ vol: 0.22, f: 130 }); burner(0.02, 0.18, 0.06); },
      clear(n) { burner(0, 0.5 + n * 0.08, 0.1); S.tone(S.snd.root * 0.5, { dur: 0.8, vol: 0.05, to: S.snd.root, attack: 0.1, wet: true }); S.hissL({ dur: 1, vol: 0.03, type: 'bandpass', freq: 500, to: 1500, q: 0.5, when: 0.3 }); },
      deal() { S.hissL({ dur: 0.4, vol: 0.04, type: 'bandpass', freq: 400, to: 900, q: 0.6 }); },
    },
    ebru: {
      pick() { S.tone(1400, { dur: 0.05, vol: 0.05, to: 2200 }); },
      place() { S.plop(220, { vol: 0.2, dur: 0.09 }); S.thud({ vol: 0.15, f: 120 }); S.tone(900, { dur: 0.25, vol: 0.03, to: 500, when: 0.05, wet: true }); },
      clear(n) { S.hiss({ dur: 0.45, vol: 0.07, type: 'bandpass', freq: 800, to: 2600, q: 1 }); for (let i = 0; i < n + 1; i++) S.plop(rand(350, 650), { when: 0.12 + i * 0.09, vol: 0.08 }); },
      deal() { S.tone(700, { dur: 0.3, vol: 0.03, to: 450, wet: true }); },
    },
    clock: {
      pick() { S.knock(2200, { vol: 0.05 }); },
      place() { S.knock(1600, { vol: 0.14 }); S.knock(1250, { vol: 0.12, when: 0.09 }); S.thud({ vol: 0.2, f: 120 }); },
      clear(n) { S.hiss({ dur: 0.45, vol: 0.08, type: 'highpass', freq: 2500, to: 6000 }); [880, 659.25, 783.99, 523.25].slice(0, Math.max(2, Math.min(4, n))).forEach((f, i) => S.tink(f, { when: 0.15 + i * 0.22, vol: 0.08, dur: 1 })); },
      deal() { for (let i = 0; i < 4; i++) S.knock(2400, { vol: 0.05, when: i * 0.04 }); },
    },
    storm: {
      pick() { S.hiss({ dur: 0.03, vol: 0.05, type: 'highpass', freq: 5000 }); },
      place() { S.thud({ vol: 0.28, f: 100 }); for (let i = 0; i < 3; i++) S.hiss({ dur: 0.02, vol: 0.04, type: 'highpass', freq: 4000, when: 0.02 + i * 0.04 * Math.random() }); },
      clear(n) { // a crack, then thunder that grows with the lines cleared
        const k = Math.min(1, 0.4 + n * 0.15);
        S.hiss({ dur: 0.08, vol: 0.16 * k, type: 'highpass', freq: 2000 });
        S.hissL({ dur: 1.2 + n * 0.25, vol: 0.22 * k, type: 'lowpass', freq: 500, to: 70, q: 1, when: 0.05 });
        S.tone(60, { dur: 1, vol: 0.22 * k, to: 35, when: 0.05 });
      },
      deal() { S.hissL({ dur: 0.5, vol: 0.03, type: 'highpass', freq: 3000 }); },
    },
    zen: {
      pick() { S.tone(1300, { dur: 0.06, vol: 0.04, to: 2000 }); },
      place() { S.knock(320, { vol: 0.3 }); S.tone(160, { dur: 0.12, vol: 0.12, to: 120 }); },
      clear(n) { // wind chimes on a pentatonic scale and a drop in the pond
        const P = [0, 2, 4, 7, 9, 12, 14, 16];
        for (let i = 0; i < n + 3; i++) S.tink(S.snd.root * 2 * Math.pow(2, P[(Math.random() * 8) | 0] / 12), { when: 0.05 + i * 0.09 + Math.random() * 0.04, vol: 0.04, dur: 0.8 });
        S.plop(400, { when: 0.1, vol: 0.06 });
      },
      deal() { S.tone(1100, { dur: 0.08, vol: 0.03, to: 1700 }); },
    },
    funk: {
      pick() { S.tone(300, { dur: 0.08, vol: 0.08, to: 600 }); },
      place() { S.tone(180, { dur: 0.12, vol: 0.2, to: 110 }); S.thud({ vol: 0.15, f: 90 }); },
      clear(n) {
        const r = S.snd.root * 0.5;
        [0, 4, 7, 10].forEach(st => S.wah(r * Math.pow(2, st / 12), { vol: 0.035, dur: 0.5 }));
        if (n > 2) [0, 4, 7, 10].forEach(st => S.wah(r * Math.pow(2, (st + 5) / 12), { vol: 0.03, dur: 0.4, when: 0.25 }));
        S.tone(110, { dur: 0.25, vol: 0.2, to: 70 });
      },
      deal() { S.tone(260, { dur: 0.07, vol: 0.06, to: 520 }); S.tone(330, { dur: 0.07, vol: 0.05, to: 660, when: 0.07 }); },
    },
    cloud: {
      pick() { S.hiss({ dur: 0.06, vol: 0.04, type: 'lowpass', freq: 1200 }); },
      place() { S.hiss({ dur: 0.12, vol: 0.08, type: 'lowpass', freq: 900, to: 300 }); S.thud({ vol: 0.12, f: 160 }); },
      clear(n) { S.hissL({ dur: 0.6, vol: 0.06, type: 'bandpass', freq: 500, to: 1800, q: 0.5 }); for (let i = 0; i < n + 3; i++) S.tink(rand(2200, 3800), { when: 0.08 + Math.random() * 0.5, vol: 0.03, dur: 0.6 }); },
      deal() { S.hiss({ dur: 0.15, vol: 0.04, type: 'lowpass', freq: 1000 }); },
    },
    factory: {
      pick() { S.tone(500, { type: 'square', dur: 0.06, vol: 0.02, to: 800 }); },
      place() { S.hiss({ dur: 0.09, vol: 0.1, type: 'bandpass', freq: 900, q: 1.5 }); S.thud({ vol: 0.35, f: 70 }); S.knock(800, { vol: 0.08, when: 0.02 }); },
      clear(n) { // welding crackle and a two-tone alarm
        for (let i = 0; i < 8 + n * 3; i++) S.hiss({ dur: rand(0.01, 0.04), vol: rand(0.04, 0.1), type: 'highpass', freq: rand(3000, 7000), when: Math.random() * 0.5 });
        S.blip(880, { when: 0.05, dur: 0.09, vol: 0.05 }); S.blip(660, { when: 0.22, dur: 0.09, vol: 0.05 });
      },
      deal() { S.knock(500, { vol: 0.1 }); S.knock(500, { vol: 0.08, when: 0.12 }); },
    },
    ukulele: {
      pick() { S.tone(1046, { type: 'triangle', dur: 0.06, vol: 0.05, attack: 0.002 }); },
      place() { S.knock(700, { vol: 0.2 }); S.thud({ vol: 0.15, f: 140 }); },
      clear() { // one strum of a ukulele, then a wave washing in
        [392, 261.63, 329.63, 440].forEach((f, i) => { S.tone(f * 1.5, { type: 'triangle', dur: 0.35, vol: 0.07, when: i * 0.025, attack: 0.002 }); S.tone(f * 3, { dur: 0.15, vol: 0.02, when: i * 0.025 }); });
        S.hissL({ dur: 1.2, vol: 0.06, type: 'lowpass', freq: 700, to: 200, when: 0.15 });
      },
      deal() { S.hissL({ dur: 0.7, vol: 0.03, type: 'lowpass', freq: 600, to: 250 }); },
    },
    fossil: {
      pick() { S.tink(2600, { vol: 0.03, dur: 0.08 }); },
      place() { S.knock(220, { vol: 0.3 }); S.crunch({ vol: 0.08, n: 3 }); },
      clear(n) { // rocks breaking and a distant roar
        S.crunch({ vol: 0.12, n: 6 });
        S.hissL({ dur: 1 + n * 0.1, vol: 0.1, type: 'bandpass', freq: 260, to: 140, q: 2.5, when: 0.1 });
        S.tone(85, { type: 'sawtooth', dur: 0.9, vol: 0.04, to: 60, when: 0.1, attack: 0.1 });
      },
      deal() { S.crunch({ vol: 0.05, n: 2 }); },
    },
    musicbox: {
      pick() { comb(24, { vol: 0.03 }); },
      place() { comb(MEL[mi++ % MEL.length], { vol: 0.09 }); S.thud({ vol: 0.1, f: 180 }); }, // each block plays the next note of the tune
      clear(n) { for (let i = 0; i < Math.min(n, 5); i++) comb(MEL[mi++ % MEL.length] + 12, { when: i * 0.1, vol: 0.07 }); comb(0, { when: 0.02, vol: 0.05 }); comb(7, { when: 0.02, vol: 0.04 }); },
      deal() { for (let i = 0; i < 4; i++) S.knock(3000, { vol: 0.03, when: i * 0.035 }); },
    },
    autumn: {
      pick() { S.crunch({ vol: 0.04, n: 2 }); },
      place() { S.thud({ vol: 0.25, f: 110 }); S.crunch({ vol: 0.09, n: 4 }); },
      clear(n) { S.hissL({ dur: 0.9, vol: 0.08, type: 'bandpass', freq: 300, to: 1400, q: 0.7 }); for (let i = 0; i < n + 1; i++) S.crunch({ when: 0.1 + i * 0.08, vol: 0.07, n: 4 }); },
      deal() { S.rustle({ vol: 0.05, dur: 0.15 }); },
    },
    sushi: {
      pick() { S.knock(2100, { vol: 0.05 }); S.knock(2300, { vol: 0.04, when: 0.04 }); },
      place() { S.thud({ vol: 0.18, f: 150 }); S.tink(rand(1700, 1900), { vol: 0.07, dur: 0.15 }); },
      clear(n) { S.tink(1320, { vol: 0.1, dur: 1.1 }); S.tink(1980, { vol: 0.05, dur: 0.8, when: 0.15 }); for (let i = 0; i < n; i++) S.knock(2200, { vol: 0.05, when: 0.1 + i * 0.06 }); },
      deal() { S.tink(1800, { vol: 0.04, dur: 0.1 }); S.tink(2100, { vol: 0.03, dur: 0.1, when: 0.06 }); },
    },
    spray: {
      pick() { S.knock(1800, { vol: 0.06 }); S.knock(1700, { vol: 0.05, when: 0.05 }); },
      place() { S.hiss({ dur: 0.1, vol: 0.07, type: 'highpass', freq: 3500 }); kick(0, 0.25); },
      clear(n) { // a spray burst over a boom-bap beat
        S.hiss({ dur: 0.3, vol: 0.08, type: 'highpass', freq: 3000, to: 6000 });
        kick(0, 0.3); hat(0.12); snare(0.24, 0.12);
        if (n > 2) { hat(0.36); kick(0.42, 0.25); snare(0.6, 0.12); }
      },
      deal() { for (let i = 0; i < 3; i++) S.knock(1900, { vol: 0.05, when: i * 0.06 }); },
    },
    carnival: {
      pick() { S.tink(2100, { vol: 0.04, dur: 0.12 }); },
      place() { S.thud({ vol: 0.2, f: 150 }); S.tone(S.snd.root, { type: 'square', dur: 0.12, vol: 0.03 }); },
      clear(n) { S.pop({ vol: 0.15, f: 800 }); S.tink(1760, { vol: 0.07, dur: 0.6, when: 0.05 }); [0, 4, 7, 12].slice(0, Math.max(2, Math.min(4, n))).forEach((st, i) => S.tone(S.snd.root * Math.pow(2, st / 12), { type: 'square', dur: 0.12, vol: 0.025, when: 0.1 + i * 0.08 })); },
      deal() { S.tink(2000, { vol: 0.04, dur: 0.15 }); S.tink(2000, { vol: 0.03, dur: 0.15, when: 0.12 }); },
    },
    gelato: {
      pick() { S.tink(2500, { vol: 0.03, dur: 0.08 }); },
      place() { S.squelch({ vol: 0.07, dur: 0.12 }); S.thud({ vol: 0.15, f: 150 }); },
      clear(n) { S.crunch({ vol: 0.11, n: 5 }); for (let i = 0; i < n + 1; i++) S.tink(rand(2400, 3600), { when: 0.12 + i * 0.05, vol: 0.03, dur: 0.2 }); },
      deal() { S.tink(2600, { vol: 0.03, dur: 0.1 }); },
    },
  };
})(Sfx));

/* ---------- Daily collection: newspaper, tear-off calendar, tea garden, spice bazaar ---------- */
Object.assign(STYLES, {
  news: { // a colour panel printed on newsprint
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.06, s * 0.92, s * 0.9, s * 0.04); g.fillStyle = 'rgba(0,0,0,.18)'; g.fill();
      rr(g, s * 0.04, s * 0.03, s * 0.92, s * 0.9, s * 0.04); g.fillStyle = '#f4efe2'; g.fill();
      g.save(); rr(g, s * 0.1, s * 0.09, s * 0.8, s * 0.78, s * 0.02); g.clip();
      g.fillStyle = c; g.fillRect(0, 0, s, s);
      TEX.news(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
  leaflet: { // a tear-off calendar leaf: coloured header with binder holes, perforation, curled corner
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.07, s * 0.9, s * 0.88, s * 0.08); g.fillStyle = 'rgba(0,0,0,.28)'; g.fill();
      rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.88, s * 0.08); g.fillStyle = mixHex(c, '#ffffff', 0.8); g.fill();
      g.save(); rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.88, s * 0.08); g.clip();
      g.fillStyle = c; g.fillRect(0, 0, s, s * 0.34);
      TEX.leaflet(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
  teaglass: { // tea in a glass: clear top, coloured brew, sugar at the bottom
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.14); g.fillStyle = mixHex(c, '#0a0604', 0.6); g.fill();
      g.save(); rr(g, s * 0.08, s * 0.06, s * 0.84, s * 0.86, s * 0.12); g.clip();
      g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(0, 0, s, s);
      const lg = g.createLinearGradient(0, s * 0.24, 0, s); lg.addColorStop(0, shade(c, 0.15)); lg.addColorStop(1, shade(c, -0.35));
      g.fillStyle = lg; g.fillRect(0, s * 0.25, s, s);
      TEX.teaglass(g, s, c, seeded(c), 1);
      g.restore();
      rr(g, s * 0.08, s * 0.06, s * 0.84, s * 0.86, s * 0.12); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = Math.max(1, s * 0.025); g.stroke();
    },
  },
  spice: { // a heap of ground spice in a brass bowl
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = shade(c, -0.6); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.1); g.fillStyle = shade(c, -0.3); g.fill();
      g.save(); rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.1); g.clip();
      g.beginPath(); g.moveTo(-s * 0.02, s * 0.8); g.quadraticCurveTo(s * 0.5, -s * 0.12, s * 1.02, s * 0.8); g.lineTo(s, s); g.lineTo(0, s); g.closePath();
      const gr = g.createRadialGradient(s * 0.42, s * 0.34, s * 0.03, s * 0.5, s * 0.55, s * 0.6);
      gr.addColorStop(0, shade(c, 0.32)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.22));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.spice(g, s, c, seeded(c), 1); g.restore();
      const br = g.createLinearGradient(0, s * 0.74, 0, s); br.addColorStop(0, '#f0cc6a'); br.addColorStop(0.5, '#b8862c'); br.addColorStop(1, '#7a5418');
      g.fillStyle = br; g.fillRect(0, s * 0.76, s, s * 0.24);
      g.fillStyle = 'rgba(255,240,190,.6)'; g.fillRect(0, s * 0.76, s, Math.max(1, s * 0.025));
      g.restore();
    },
  },
});

Object.assign(TEX, {
  news(g, s, c, rnd, k) { // halftone dots growing toward one corner, a headline and a column of text
    const step = s / 9;
    g.save(); g.globalAlpha = 0.35 * k; g.fillStyle = shade(c, -0.5);
    for (let y = 0, row = 0; y < s + step; y += step, row++) for (let x = (row % 2) * step / 2; x < s + step; x += step) {
      g.beginPath(); g.arc(x, y, step * (0.08 + 0.32 * (x + y) / (2 * s)), 0, Math.PI * 2); g.fill();
    }
    g.restore();
    g.fillStyle = `rgba(20,18,14,${0.55 * k})`; g.fillRect(s * 0.16, s * 0.16, s * (0.42 + rnd() * 0.2), s * 0.08);
    g.fillStyle = `rgba(20,18,14,${0.28 * k})`;
    for (let i = 0; i < 4; i++) g.fillRect(s * 0.16, s * (0.34 + i * 0.12), s * (i === 3 ? 0.36 : 0.6 - rnd() * 0.1), Math.max(1, s * 0.035));
  },
  leaflet(g, s, c, rnd, k) { // binder holes, a perforated tear line, a couple of pencil notes, a curled corner
    g.fillStyle = `rgba(0,0,0,${0.38 * k})`;
    for (const x of [0.3, 0.7]) { g.beginPath(); g.arc(s * x, s * 0.15, s * 0.045, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = `rgba(255,255,255,${0.75 * k})`; g.lineWidth = Math.max(1, s * 0.022); g.setLineDash([s * 0.04, s * 0.035]);
    g.beginPath(); g.moveTo(0, s * 0.34); g.lineTo(s, s * 0.34); g.stroke(); g.setLineDash([]);
    g.fillStyle = `rgba(40,40,60,${0.16 * k})`;
    g.fillRect(s * 0.16, s * 0.5, s * (0.5 + rnd() * 0.15), Math.max(1, s * 0.03));
    g.fillRect(s * 0.16, s * 0.62, s * (0.3 + rnd() * 0.15), Math.max(1, s * 0.03));
    const q = s * 0.22;
    poly(g, [[s - q, s], [s, s - q], [s, s]], `rgba(0,0,0,${0.3 * k})`);
    poly(g, [[s - q, s], [s, s - q], [s - q * 0.95, s - q * 0.95]], `rgba(255,255,255,${0.6 * k})`);
  },
  teaglass(g, s, c, rnd, k) { // the surface of the tea, a glass shine, a waisted glass, sugar and bubbles
    g.fillStyle = `rgba(255,236,200,${0.55 * k})`; g.beginPath(); g.ellipse(s * 0.5, s * 0.26, s * 0.42, s * 0.045, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = `rgba(0,0,0,${0.2 * k})`;
    for (const x of [0, 1]) { g.beginPath(); g.ellipse(s * x, s * 0.6, s * 0.12, s * 0.26, 0, 0, Math.PI * 2); g.fill(); }
    const hl = g.createLinearGradient(s * 0.14, 0, s * 0.32, 0);
    hl.addColorStop(0, 'rgba(255,255,255,0)'); hl.addColorStop(0.5, `rgba(255,255,255,${0.38 * k})`); hl.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = hl; g.fillRect(s * 0.14, s * 0.08, s * 0.18, s * 0.84);
    for (let i = 0; i < 3; i++) {
      g.save(); g.translate(s * (0.4 + rnd() * 0.3), s * (0.8 + rnd() * 0.06)); g.rotate(rnd() * 1.5);
      const q = s * 0.06; g.fillStyle = `rgba(255,252,245,${0.75 * k})`; g.fillRect(-q / 2, -q / 2, q, q); g.restore();
    }
    g.strokeStyle = `rgba(255,240,210,${0.5 * k})`; g.lineWidth = Math.max(0.8, s * 0.012);
    for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(s * (0.3 + rnd() * 0.45), s * (0.38 + rnd() * 0.35), Math.max(0.8, s * (0.012 + rnd() * 0.015)), 0, Math.PI * 2); g.stroke(); }
  },
  spice(g, s, c, rnd, k) { // fine grains, lighter and darker, a soft sheen on top
    speckle(g, s, rnd, 90, 0.004, 0.011, () => rnd() < 0.5 ? `rgba(255,236,190,${0.3 * k})` : `rgba(30,10,0,${0.3 * k})`);
    softGlint(g, s * 0.42, s * 0.3, s * 0.2, 0.3 * k);
  },
});

Object.assign(PARTS, {
  newsclip(p, s) {
    ctx.rotate(p.rot * 0.5); ctx.scale(1, 0.2 + 0.8 * Math.abs(Math.sin(p.life * 6 + p.ph)));
    ctx.fillStyle = '#f4efe2'; ctx.fillRect(-s * 0.55, -s * 0.42, s * 1.1, s * 0.84);
    ctx.fillStyle = p.color; ctx.fillRect(-s * 0.45, -s * 0.32, s * 0.9, s * 0.2);
    ctx.fillStyle = 'rgba(30,28,24,.4)'; ctx.fillRect(-s * 0.45, 0, s * 0.8, s * 0.07); ctx.fillRect(-s * 0.45, s * 0.16, s * 0.6, s * 0.07);
  },
  leaflet(p, s) {
    ctx.rotate(p.rot * 0.5); ctx.scale(1, 0.2 + 0.8 * Math.abs(Math.sin(p.life * 5 + p.ph)));
    ctx.fillStyle = '#fdf8ee'; ctx.fillRect(-s * 0.5, -s * 0.55, s, s * 1.1);
    ctx.fillStyle = p.color; ctx.fillRect(-s * 0.5, -s * 0.55, s, s * 0.35);
  },
  sugar(p, s) {
    ctx.rotate(p.rot); rr(ctx, -s * 0.35, -s * 0.35, s * 0.7, s * 0.7, s * 0.08); ctx.fillStyle = '#fffaf0'; ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.1)'; ctx.fillRect(-s * 0.35, s * 0.15, s * 0.7, s * 0.2);
  },
  grain(p, s) {
    ctx.fillStyle = shade(p.color, 0.1);
    for (const [x, y, r] of [[0, 0, 0.22], [0.35, 0.2, 0.15], [-0.3, 0.25, 0.13], [0.1, -0.35, 0.12]]) { ctx.beginPath(); ctx.arc(x * s, y * s, Math.max(0.8, r * s), 0, Math.PI * 2); ctx.fill(); }
  },
});

Object.assign(AMBIENTS, {
  newsroom() { // column rules and a halftone corner on the page, a coffee ring, sheets of newspaper drifting down
    let page = null, sheet = null, pw = 0, ph = 0;
    const mkSheet = () => {
      const c = document.createElement('canvas'); c.width = 120; c.height = 160;
      const g = c.getContext('2d');
      g.fillStyle = '#fbf8f0'; g.fillRect(0, 0, 120, 160);
      g.fillStyle = '#2a2824'; g.fillRect(10, 10, 100, 14);
      g.fillRect(10, 30, 100, 2);
      g.fillStyle = '#c8321e'; g.fillRect(10, 38, 62, 9);
      g.fillStyle = 'rgba(42,40,36,.35)';
      for (let col = 0; col < 3; col++) for (let y = 54; y < 150; y += 6) g.fillRect(10 + col * 34, y, 30 - ((y * 7 + col * 13) % 9), 2);
      g.fillStyle = 'rgba(42,40,36,.18)'; g.fillRect(78, 38, 32, 30);
      return c;
    };
    const S2 = [...Array(7)].map(() => ({ x: Math.random(), y: Math.random(), rot: rand(-0.6, 0.6), vr: rand(-0.3, 0.3), v: rand(0.015, 0.035), ph: rand(0, 6.3), s: rand(0.7, 1.2) }));
    let t = 0;
    function build(w, h) {
      pw = w; ph = h; page = document.createElement('canvas'); page.width = Math.ceil(w); page.height = Math.ceil(h);
      const g = page.getContext('2d'), u = Math.min(w, h), cw = Math.max(70, w / 5);
      g.strokeStyle = 'rgba(40,36,30,.07)'; g.lineWidth = 1;
      for (let x = cw; x < w; x += cw) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      g.fillStyle = 'rgba(40,36,30,.07)';
      const st = u * 0.025;
      for (let y = 0; y < h * 0.4; y += st) for (let x = w * 0.55; x < w; x += st) { const r = st * 0.45 * (1 - y / (h * 0.4)) * ((x - w * 0.55) / (w * 0.45)); if (r > 0.4) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); } }
      g.strokeStyle = 'rgba(120,80,40,.16)'; g.lineWidth = u * 0.012;
      g.beginPath(); g.arc(w * 0.18, h * 0.82, u * 0.11, 0.3, Math.PI * 1.85); g.stroke();
      g.lineWidth = u * 0.004; g.beginPath(); g.arc(w * 0.18, h * 0.82, u * 0.095, 0, Math.PI * 2); g.stroke();
    }
    return {
      step(dt) { t += dt; for (const p of S2) { p.y += p.v * dt; p.rot += p.vr * dt; p.ph += dt; if (p.y > 1.15) { p.y = -0.15; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!page || Math.abs(w - pw) > 1 || Math.abs(h - ph) > 1) build(w, h);
        if (!sheet) sheet = mkSheet();
        g.globalAlpha = a; g.drawImage(page, 0, 0, w, h);
        const u = Math.min(w, h);
        for (const p of S2) {
          const sw = u * 0.16 * p.s, sh = sw * 4 / 3;
          g.save(); g.translate((p.x + Math.sin(t * 0.4 + p.ph) * 0.03) * w, p.y * h); g.rotate(p.rot); g.scale(1, 0.55 + 0.45 * Math.abs(Math.cos(p.ph * 0.8)));
          g.globalAlpha = 0.5 * a; g.drawImage(sheet, -sw / 2, -sh / 2, sw, sh); g.restore();
        }
        g.globalAlpha = 1;
      },
    };
  },
  tearoff(th) { // a big faint month grid with today circled, leaves tearing off and fluttering down
    let grid2 = null, gw = 0, gh = 0, t = 0;
    const today = new Date(), first = new Date(today.getFullYear(), today.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7, day = today.getDate();
    const mk = init => ({ x: Math.random(), y: init ? Math.random() : -0.1, rot: rand(0, 6.3), vr: rand(-1.4, 1.4), v: rand(0.03, 0.06), ph: rand(0, 6.3), c: th.blocks[(Math.random() * 7) | 0], s: rand(0.7, 1.2) });
    const LV = [...Array(14)].map(() => mk(true));
    let cell = { x: 0, y: 0, r: 0 };
    function build(w, h) {
      gw = w; gh = h; grid2 = document.createElement('canvas'); grid2.width = Math.ceil(w); grid2.height = Math.ceil(h);
      const g = grid2.getContext('2d'), cs = Math.min(w * 0.9 / 7, h * 0.7 / 6), ox = (w - cs * 7) / 2, oy = h * 0.14;
      g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 1.5;
      for (let i = 0; i < 42; i++) {
        const r = (i / 7) | 0, c = i % 7;
        g.strokeRect(ox + c * cs + 3, oy + r * cs + 3, cs - 6, cs - 6);
        const d = i - offset + 1;
        if (d >= 1 && d <= 31) { g.fillStyle = c >= 5 ? 'rgba(255,120,100,.14)' : 'rgba(255,255,255,.1)'; g.font = `700 ${cs * 0.26}px "Baloo 2", sans-serif`; g.fillText(String(d), ox + c * cs + cs * 0.14, oy + r * cs + cs * 0.36); }
        if (d === day) cell = { x: ox + c * cs + cs / 2, y: oy + r * cs + cs / 2, r: cs * 0.42 };
      }
    }
    return {
      step(dt) { t += dt; LV.forEach((l, i) => { l.y += l.v * dt; l.rot += l.vr * dt; l.ph += dt * 4; l.x += Math.sin(t + l.ph * 0.2) * 0.012 * dt; if (l.y > 1.1) LV[i] = mk(false); }); },
      draw(g, w, h, a) {
        if (!grid2 || Math.abs(w - gw) > 1 || Math.abs(h - gh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(grid2, 0, 0, w, h); g.globalAlpha = 1;
        if (cell.r) { g.beginPath(); g.arc(cell.x, cell.y, cell.r * (1 + 0.04 * Math.sin(t * 2)), 0, Math.PI * 2); g.strokeStyle = rgba(th.accent, 0.35 * a); g.lineWidth = 3; g.stroke(); }
        const u = Math.min(w, h);
        for (const l of LV) {
          const lw = u * 0.06 * l.s, lh = lw * 1.15;
          g.save(); g.translate(l.x * w, l.y * h); g.rotate(l.rot); g.scale(1, 0.25 + 0.75 * Math.abs(Math.sin(l.ph)));
          g.fillStyle = `rgba(253,248,238,${0.6 * a})`; g.fillRect(-lw / 2, -lh / 2, lw, lh);
          g.fillStyle = rgba(l.c, 0.7 * a); g.fillRect(-lw / 2, -lh / 2, lw, lh * 0.32);
          g.restore();
        }
      },
    };
  },
  bosphorus(th) { // the Istanbul skyline at sunrise over the water, a ferry crossing, gulls, steam from a tea glass
    let sky = null, sw = 0, sh = 0, t = 0, acc = 0, steam = [];
    const ferry = { x: -0.2, v: 0.02, puffs: [] };
    const GU = [...Array(4)].map(() => ({ x: Math.random(), y: rand(0.12, 0.38), v: rand(0.02, 0.04), ph: rand(0, 6.3) }));
    function build(w, h) {
      sw = w; sh = h; sky = document.createElement('canvas'); sky.width = Math.ceil(w); sky.height = Math.ceil(h * 0.2);
      const g = sky.getContext('2d'), H = sky.height, u = Math.min(w, h);
      g.fillStyle = 'rgba(16,26,40,.55)';
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, H * 0.7 - Math.sin(x * 0.004) * H * 0.18 - Math.sin(x * 0.013) * H * 0.06);
      g.lineTo(w, H); g.closePath(); g.fill();
      const dome = (x, r) => { // a dome with half domes and two minarets
        const base = H * 0.66;
        g.beginPath(); g.arc(x, base, r, Math.PI, 0); g.fill();
        g.beginPath(); g.arc(x - r * 1.1, base + r * 0.1, r * 0.55, Math.PI, 0); g.arc(x + r * 1.1, base + r * 0.1, r * 0.55, Math.PI, 0); g.fill();
        g.fillRect(x - r * 1.7, base, r * 3.4, H - base);
        for (const mx of [x - r * 2, x + r * 2]) { g.fillRect(mx - r * 0.07, base - r * 2.2, r * 0.14, r * 2.2 + H); g.beginPath(); g.moveTo(mx - r * 0.1, base - r * 2.2); g.lineTo(mx, base - r * 2.6); g.lineTo(mx + r * 0.1, base - r * 2.2); g.fill(); }
      };
      dome(w * 0.32, u * 0.05); dome(w * 0.7, u * 0.04);
      g.fillRect(w * 0.88, H * 0.3, u * 0.025, H); g.beginPath(); g.moveTo(w * 0.88 - u * 0.01, H * 0.3); g.lineTo(w * 0.88 + u * 0.0125, H * 0.18); g.lineTo(w * 0.88 + u * 0.035, H * 0.3); g.fill(); // a tower on the far hill
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        ferry.x += ferry.v * dt; if (ferry.x > 1.25) ferry.x = -0.25;
        if (acc > 0.35) { acc = 0; ferry.puffs.push({ x: ferry.x, y: 0, life: 0 }); steam.push({ x: rand(0.42, 0.58), y: 1.02, life: 0, ph: rand(0, 6.3) }); }
        for (const p of ferry.puffs) p.life += dt / 3;
        ferry.puffs = ferry.puffs.filter(p => p.life < 1);
        for (const p of steam) { p.y -= 0.07 * dt; p.life += dt / 7; }
        steam = steam.filter(p => p.life < 1);
        for (const b of GU) { b.x += b.v * dt; b.ph += dt * 6; if (b.x > 1.1) { b.x = -0.1; b.y = rand(0.12, 0.38); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), hy = h * 0.82, sx = w * 0.82, sy = h * 0.3; // the shore sits low so the board does not hide it
        const sun = g.createRadialGradient(sx, sy, 0, sx, sy, u * 0.5);
        sun.addColorStop(0, `rgba(255,214,150,${0.45 * a})`); sun.addColorStop(1, 'rgba(255,214,150,0)');
        g.fillStyle = sun; g.fillRect(0, 0, w, h);
        g.beginPath(); g.arc(sx, sy, u * 0.06, 0, Math.PI * 2); g.fillStyle = `rgba(255,236,200,${0.7 * a})`; g.fill();
        if (!sky || Math.abs(w - sw) > 1 || Math.abs(h - sh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(sky, 0, hy - h * 0.2, w, h * 0.2); g.globalAlpha = 1;
        const sea = g.createLinearGradient(0, hy, 0, h); sea.addColorStop(0, `rgba(60,110,140,${0.5 * a})`); sea.addColorStop(1, `rgba(20,46,66,${0.6 * a})`);
        g.fillStyle = sea; g.fillRect(0, hy, w, h - hy);
        g.strokeStyle = `rgba(255,220,170,${0.3 * a})`; g.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) { const y = hy + (h - hy) * (0.12 + i * 0.15), len = u * (0.1 + i * 0.05), x0 = sx - len / 2 + Math.sin(t + i) * u * 0.02; g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + len, y); g.stroke(); }
        const fx = ferry.x * w, fy = hy + (h - hy) * 0.3, fs = u * 0.045;
        for (const p of ferry.puffs) { const r = fs * (0.25 + p.life * 0.8); g.beginPath(); g.arc(p.x * w + p.life * fs * 0.6, fy - fs * 0.9 - p.life * fs * 1.2, r, 0, Math.PI * 2); g.fillStyle = `rgba(230,230,235,${0.28 * (1 - p.life) * a})`; g.fill(); }
        g.fillStyle = `rgba(20,24,30,${0.85 * a})`; g.beginPath(); g.moveTo(fx - fs * 1.4, fy - fs * 0.2); g.lineTo(fx + fs * 1.5, fy - fs * 0.2); g.lineTo(fx + fs * 1.2, fy + fs * 0.25); g.lineTo(fx - fs * 1.2, fy + fs * 0.25); g.closePath(); g.fill();
        g.fillStyle = `rgba(245,242,235,${0.85 * a})`; g.fillRect(fx - fs, fy - fs * 0.6, fs * 2, fs * 0.4);
        g.fillStyle = `rgba(20,24,30,${0.85 * a})`; g.fillRect(fx - fs * 0.15, fy - fs * 0.95, fs * 0.22, fs * 0.36);
        g.strokeStyle = `rgba(20,30,40,${0.5 * a})`; g.lineWidth = 1.6;
        for (const b of GU) { const x = b.x * w, y = b.y * h, bs = u * 0.018, f = Math.sin(b.ph) * 0.5 + 0.5; g.beginPath(); g.moveTo(x - bs, y - bs * 0.3 * f); g.quadraticCurveTo(x - bs * 0.45, y - bs * 0.6 * f, x, y); g.quadraticCurveTo(x + bs * 0.45, y - bs * 0.6 * f, x + bs, y - bs * 0.3 * f); g.stroke(); }
        for (const p of steam) {
          const x = (p.x + Math.sin(p.y * 8 + t * 0.6 + p.ph) * 0.03) * w, y = p.y * h, r = u * (0.03 + p.life * 0.08), al = Math.sin(p.life * Math.PI) * 0.07 * a;
          const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,245,235,${al})`); gr.addColorStop(1, 'rgba(255,245,235,0)');
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
      },
    };
  },
  bazaar(th) { // striped stone arches, swaying mosaic lanterns, sacks of spice below, dust in the light
    let hall = null, hw = 0, hh = 0, t = 0;
    const LN = [0.14, 0.38, 0.62, 0.86].map((x, i) => ({ x, len: rand(0.1, 0.22), ph: rand(0, 6.3), c: th.blocks[[0, 5, 4, 6][i]] }));
    const DU = [...Array(36)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.012, -0.004), ph: rand(0, 6.3) }));
    function build(w, h) {
      hw = w; hh = h; hall = document.createElement('canvas'); hall.width = Math.ceil(w); hall.height = Math.ceil(h);
      const g = hall.getContext('2d'), u = Math.min(w, h), aw = Math.max(90, w / 3.2);
      for (let x = 0; x < w + aw; x += aw) { // striped arches
        for (let k = 0; k < 9; k++) { g.beginPath(); g.arc(x, h * 0.32, aw * 0.5 - k * 5, Math.PI, Math.PI * 2); g.strokeStyle = k % 2 ? 'rgba(240,200,140,.07)' : 'rgba(150,60,30,.1)'; g.lineWidth = 5; g.stroke(); }
        g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x - aw * 0.06, h * 0.32, aw * 0.12, h);
      }
      const sy = h * 0.88;
      for (let i = 0; i < 9; i++) { // spice sacks along the floor
        const x = (i + 0.5) / 9 * w, r = u * rand(0.06, 0.08), c = th.blocks[i % 7];
        g.fillStyle = 'rgba(140,100,60,.4)'; rr(g, x - r, sy - r * 0.5, r * 2, h - sy + r, r * 0.4); g.fill();
        g.beginPath(); g.ellipse(x, sy - r * 0.45, r * 0.95, r * 0.5, 0, Math.PI, 0); g.fillStyle = rgba(c, 0.55); g.fill();
        g.fillStyle = 'rgba(90,60,30,.5)'; g.fillRect(x - r, sy - r * 0.5, r * 2, r * 0.12);
      }
    }
    return {
      step(dt) { t += dt; for (const d of DU) { d.y += d.v * dt; d.x += Math.sin(t * 0.5 + d.ph) * 0.004 * dt; if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!hall || Math.abs(w - hw) > 1 || Math.abs(h - hh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(hall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        g.save(); g.translate(w * 0.9, 0); g.rotate(0.5);
        const beam = g.createLinearGradient(0, 0, 0, h * 1.2); beam.addColorStop(0, `rgba(255,210,140,${0.14 * a})`); beam.addColorStop(1, 'rgba(255,210,140,0)');
        g.fillStyle = beam; g.fillRect(-w * 0.12, 0, w * 0.24, h * 1.3); g.restore();
        for (const l of LN) {
          const sw = Math.sin(t * 0.8 + l.ph) * 0.08, x0 = l.x * w, L = l.len * h, x = x0 + Math.sin(sw) * L, y = Math.cos(sw) * L, r = u * 0.04;
          g.strokeStyle = `rgba(200,160,90,${0.5 * a})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x, y); g.stroke();
          const gl = g.createRadialGradient(x, y + r, 0, x, y + r, r * 4); gl.addColorStop(0, rgba(l.c, 0.35 * a)); gl.addColorStop(1, rgba(l.c, 0));
          g.fillStyle = gl; g.fillRect(x - r * 4, y + r - r * 4, r * 8, r * 8);
          g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + r * 1.1, y + r, x, y + r * 2.2); g.quadraticCurveTo(x - r * 1.1, y + r, x, y); g.fillStyle = rgba(l.c, 0.75 * a); g.fill();
          g.strokeStyle = `rgba(255,220,150,${0.6 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x - r * 0.75, y + r); g.lineTo(x + r * 0.75, y + r); g.stroke();
          g.fillStyle = `rgba(210,170,90,${0.8 * a})`; g.fillRect(x - r * 0.25, y + r * 2.15, r * 0.5, r * 0.25);
        }
        for (const d of DU) { const k = 0.5 + 0.5 * Math.sin(t * 2 + d.ph); g.fillStyle = `rgba(255,214,150,${(0.15 + 0.35 * k) * a})`; g.fillRect(d.x * w, d.y * h, 2, 2); }
      },
    };
  },
});

Object.assign(KITS, (S => ({
  news: { // typewriter keys and a carriage bell, pages turning
    pick() { S.rustle({ vol: 0.04, dur: 0.05 }); },
    place() { S.knock(1500, { vol: 0.12 }); S.hiss({ dur: 0.03, vol: 0.08, type: 'highpass', freq: 3000 }); S.thud({ vol: 0.12, f: 140 }); },
    clear(n) {
      for (let i = 0; i < n + 3; i++) { S.knock(rand(1300, 1700), { when: i * 0.065, vol: 0.1 }); S.hiss({ dur: 0.02, vol: 0.05, type: 'highpass', freq: 3500, when: i * 0.065 }); }
      S.tink(2640, { when: (n + 3) * 0.065 + 0.05, vol: 0.09, dur: 0.6 });
    },
    deal() { S.hissL({ dur: 0.35, vol: 0.05, type: 'bandpass', freq: 1200, to: 3000, q: 0.7 }); },
  },
  calendar: { // a leaf torn off, several in a row on a clear
    pick() { S.hiss({ dur: 0.03, vol: 0.05, type: 'bandpass', freq: 2500, q: 1.5 }); },
    place() { S.hiss({ dur: 0.13, vol: 0.12, type: 'bandpass', freq: 1400, to: 4200, q: 2.2 }); S.thud({ vol: 0.14, f: 150 }); },
    clear(n) {
      for (let i = 0; i < Math.min(n + 1, 5); i++) S.hiss({ dur: 0.11, vol: 0.1, type: 'bandpass', freq: 1200 + i * 200, to: 4500, q: 2, when: i * 0.09 });
      S.rustle({ vol: 0.07, dur: 0.35, when: 0.2 });
    },
    deal() { S.rustle({ vol: 0.05, dur: 0.12 }); S.knock(1400, { vol: 0.04, when: 0.08 }); },
  },
  tea: { // spoon on glass, stirring, tea being poured, a ferry horn
    pick() { S.tink(3200, { vol: 0.04, dur: 0.08 }); },
    place() { S.thud({ vol: 0.16, f: 170 }); S.tink(rand(2300, 2600), { vol: 0.09, dur: 0.25 }); },
    clear(n) {
      for (let i = 0; i < n + 3; i++) S.tink(i % 2 ? 2900 : 2600, { when: i * 0.08, vol: 0.06, dur: 0.18 });
      S.tone(150, { type: 'triangle', dur: 0.9, vol: 0.07, when: 0.35, attack: 0.05, wet: true });
      S.tone(151.5, { type: 'triangle', dur: 0.9, vol: 0.05, when: 0.35, attack: 0.05 });
    },
    deal() { S.hissL({ dur: 0.35, vol: 0.05, type: 'lowpass', freq: 900, to: 400, q: 2 }); },
  },
  spice: { // grains poured from a scoop, brass scale pans, a darbuka "doum tek"
    pick() { S.hiss({ dur: 0.04, vol: 0.05, type: 'bandpass', freq: 3200, q: 2 }); },
    place() { S.hissL({ dur: 0.22, vol: 0.08, type: 'bandpass', freq: 2600, to: 1200, q: 1.2 }); S.thud({ vol: 0.2, f: 120 }); },
    clear(n) {
      S.tone(110, { dur: 0.25, vol: 0.28, to: 70 }); S.knock(1800, { vol: 0.12, when: 0.18 }); S.knock(1800, { vol: 0.1, when: 0.3 });
      if (n > 1) { S.tone(110, { dur: 0.2, vol: 0.22, to: 70, when: 0.45 }); S.knock(1800, { vol: 0.1, when: 0.6 }); }
      S.tink(1250, { vol: 0.07, when: 0.05, dur: 0.5 }); S.tink(1580, { vol: 0.05, when: 0.1, dur: 0.4 });
      S.hissL({ dur: 0.7, vol: 0.06, type: 'bandpass', freq: 3000, to: 1500, q: 1, when: 0.05 });
    },
    deal() { S.rustle({ vol: 0.05, dur: 0.15 }); },
  },
}))(Sfx));

/* ---------- Daily collection, part 2: desert hourglass, letters, picnic, midnight library ---------- */
Object.assign(STYLES, {
  dune: { // wind-rippled sand
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.16); g.fillStyle = shade(c, -0.42); g.fill();
      const gr = g.createLinearGradient(0, 0, s * 0.3, s); gr.addColorStop(0, shade(c, 0.3)); gr.addColorStop(1, shade(c, -0.12));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.84, s * 0.14); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'dune', 1, 0.06, 0.14);
    },
  },
  envelope: { // a cream envelope closed with a wax seal in the block colour
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.08, s * 0.92, s * 0.86, s * 0.06); g.fillStyle = 'rgba(0,0,0,.3)'; g.fill();
      rr(g, s * 0.04, s * 0.05, s * 0.92, s * 0.86, s * 0.06); g.fillStyle = mixHex(c, '#f6ecd8', 0.84); g.fill();
      g.save(); rr(g, s * 0.04, s * 0.05, s * 0.92, s * 0.86, s * 0.06); g.clip(); TEX.envelope(g, s, c, seeded(c), 1); g.restore();
    },
  },
  gingham: { // checked picnic cloth with stitched edges
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.07, s * 0.92, s * 0.9, s * 0.1); g.fillStyle = 'rgba(0,0,0,.16)'; g.fill();
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.88, s * 0.1); g.fillStyle = mixHex(c, '#ffffff', 0.62); g.fill();
      g.save(); rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.88, s * 0.1); g.clip(); TEX.gingham(g, s, c, seeded(c), 1); g.restore();
      rr(g, s * 0.1, s * 0.1, s * 0.8, s * 0.76, s * 0.06);
      g.setLineDash([s * 0.05, s * 0.04]); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = Math.max(1, s * 0.022); g.stroke(); g.setLineDash([]);
    },
  },
  book: { // a leather-bound spine with gold bands and a title plate
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.92, s * 0.08); g.fillStyle = shade(c, -0.55); g.fill();
      const lg = g.createLinearGradient(0, 0, s, 0);
      lg.addColorStop(0, shade(c, -0.28)); lg.addColorStop(0.3, shade(c, 0.12)); lg.addColorStop(0.7, c); lg.addColorStop(1, shade(c, -0.32));
      rr(g, s * 0.07, s * 0.05, s * 0.86, s * 0.86, s * 0.07); g.fillStyle = lg; g.fill();
      texIn(g, s, c, 'book', 1, 0.07, 0.07);
    },
  },
});

Object.assign(TEX, {
  dune(g, s, c, rnd, k) { // ripples with a lit crest and a shaded trough, loose grains
    g.lineCap = 'round';
    const ph = rnd() * 6.3;
    for (let i = 0; i < 6; i++) {
      const y0 = s * (0.12 + i * 0.16);
      const path = () => { g.beginPath(); for (let j = 0; j <= 12; j++) { const x = j * s / 12, y = y0 + Math.sin(x / s * 7 + ph + i * 0.7) * s * 0.035; j ? g.lineTo(x, y) : g.moveTo(x, y); } };
      path(); g.strokeStyle = `rgba(90,40,10,${0.22 * k})`; g.lineWidth = Math.max(1, s * 0.028); g.stroke();
      g.save(); g.translate(0, -s * 0.022); path(); g.strokeStyle = `rgba(255,240,200,${0.3 * k})`; g.lineWidth = Math.max(1, s * 0.018); g.stroke(); g.restore();
    }
    speckle(g, s, rnd, 40, 0.003, 0.008, () => rnd() < 0.5 ? `rgba(255,240,200,${0.3 * k})` : `rgba(80,40,10,${0.25 * k})`);
  },
  envelope(g, s, c, rnd, k) { // the folds of the envelope and a round wax seal with a pressed flower
    g.lineWidth = Math.max(1, s * 0.02); g.lineJoin = 'round';
    g.strokeStyle = `rgba(110,80,50,${0.38 * k})`;
    g.beginPath(); g.moveTo(0, s * 0.06); g.lineTo(s * 0.5, s * 0.52); g.lineTo(s, s * 0.06); g.stroke();
    g.strokeStyle = `rgba(110,80,50,${0.2 * k})`;
    g.beginPath(); g.moveTo(0, s * 0.95); g.lineTo(s * 0.4, s * 0.58); g.moveTo(s, s * 0.95); g.lineTo(s * 0.6, s * 0.58); g.stroke();
    const cx = s * 0.5, cy = s * 0.52, r = s * 0.17, wax = shade(c, -0.12);
    g.fillStyle = wax;
    for (let i = 0; i < 7; i++) { const an = i / 7 * Math.PI * 2 + rnd() * 0.4; g.beginPath(); g.arc(cx + Math.cos(an) * r * 0.95, cy + Math.sin(an) * r * 0.95, r * (0.22 + rnd() * 0.12), 0, Math.PI * 2); g.fill(); }
    const gr = g.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 0, cx, cy, r * 1.1); gr.addColorStop(0, shade(c, 0.3)); gr.addColorStop(1, shade(c, -0.25));
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
    g.beginPath(); g.arc(cx, cy, r * 0.72, 0, Math.PI * 2); g.strokeStyle = shade(c, -0.4); g.lineWidth = Math.max(1, s * 0.015); g.stroke();
    g.fillStyle = shade(c, 0.35);
    for (let i = 0; i < 5; i++) { const an = i / 5 * Math.PI * 2; g.beginPath(); g.arc(cx + Math.cos(an) * r * 0.3, cy + Math.sin(an) * r * 0.3, r * 0.16, 0, Math.PI * 2); g.fill(); }
  },
  gingham(g, s, c, rnd, k) { // overlapping stripes make the checks; a fine weave on top
    const b = s / 8, dk = shade(c, -0.2);
    g.save(); g.globalAlpha = 0.5 * k; g.fillStyle = dk;
    for (let i = 0; i < 4; i++) { g.fillRect(i * s / 4 + b / 2, 0, b, s); g.fillRect(0, i * s / 4 + b / 2, s, b); }
    g.restore();
    g.strokeStyle = `rgba(255,255,255,${0.12 * k})`; g.lineWidth = 1;
    for (let x = 0; x < s; x += Math.max(2, s / 24)) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, s); g.stroke(); }
  },
  book(g, s, c, rnd, k) { // grained leather, gold bands and a dark title plate
    speckle(g, s, rnd, 40, 0.004, 0.01, () => rnd() < 0.5 ? `rgba(0,0,0,${0.18 * k})` : `rgba(255,240,220,${0.1 * k})`);
    g.fillStyle = `rgba(240,200,110,${0.85 * k})`;
    for (const y of [0.12, 0.17, 0.79, 0.84]) g.fillRect(0, s * y, s, Math.max(1, s * 0.025));
    rr(g, s * 0.24, s * 0.36, s * 0.52, s * 0.26, s * 0.03); g.fillStyle = `rgba(20,10,0,${0.4 * k})`; g.fill();
    g.strokeStyle = `rgba(240,200,110,${0.8 * k})`; g.lineWidth = Math.max(1, s * 0.015); g.stroke();
    g.fillStyle = `rgba(240,200,110,${0.75 * k})`;
    g.fillRect(s * 0.32, s * 0.44, s * 0.36, Math.max(1, s * 0.03)); g.fillRect(s * 0.38, s * 0.52, s * 0.24, Math.max(1, s * 0.025));
  },
});

Object.assign(PARTS, {
  envelope(p, s) {
    ctx.rotate(p.rot * 0.4); ctx.scale(1, 0.3 + 0.7 * Math.abs(Math.sin(p.life * 4 + p.ph)));
    ctx.fillStyle = '#f6ecd8'; ctx.fillRect(-s * 0.55, -s * 0.38, s * 1.1, s * 0.76);
    ctx.strokeStyle = 'rgba(110,80,50,.5)'; ctx.lineWidth = Math.max(1, s * 0.06);
    ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.38); ctx.lineTo(0, s * 0.05); ctx.lineTo(s * 0.55, -s * 0.38); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, s * 0.05, s * 0.14, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
  },
  page(p, s) {
    ctx.rotate(p.rot * 0.5); ctx.scale(0.25 + 0.75 * Math.abs(Math.sin(p.life * 5 + p.ph)), 1);
    ctx.fillStyle = '#f6ead2'; ctx.fillRect(-s * 0.4, -s * 0.55, s * 0.8, s * 1.1);
    ctx.fillStyle = 'rgba(80,60,40,.35)'; for (let i = 0; i < 4; i++) ctx.fillRect(-s * 0.28, -s * 0.36 + i * s * 0.22, s * 0.56, Math.max(1, s * 0.06));
  },
});

Object.assign(AMBIENTS, {
  hourglass(th) { // layered dunes at sunset, wind-blown sand, an hourglass slowly running out
    let land = null, lw = 0, lh = 0, t = 0;
    const WI = [...Array(50)].map(() => ({ x: Math.random(), y: rand(0.35, 1), v: rand(0.08, 0.2), l: rand(0.01, 0.03) }));
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d');
      [[0.66, 'rgba(230,160,90,.18)', 0.004, 0.05], [0.76, 'rgba(200,120,60,.26)', 0.006, 0.06], [0.87, 'rgba(140,76,36,.4)', 0.009, 0.05]].forEach(([y0, col, f, amp], i) => {
        g.beginPath(); g.moveTo(0, h);
        for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, h * y0 - Math.abs(Math.sin(x * f + i * 2)) * h * amp);
        g.lineTo(w, h); g.closePath(); g.fillStyle = col; g.fill();
      });
    }
    return {
      step(dt) { t += dt; for (const p of WI) { p.x += p.v * dt; if (p.x > 1.05) { p.x = -0.05; p.y = rand(0.35, 1); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sx = w * 0.7, sy = h * 0.66;
        const gl = g.createRadialGradient(sx, sy, 0, sx, sy, u * 0.5); gl.addColorStop(0, rgba(th.accent, 0.4 * a)); gl.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gl; g.fillRect(0, 0, w, h);
        g.beginPath(); g.arc(sx, sy, u * 0.13, 0, Math.PI * 2); g.fillStyle = `rgba(255,200,120,${0.55 * a})`; g.fill();
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        g.strokeStyle = `rgba(255,224,170,${0.25 * a})`; g.lineWidth = 1; g.beginPath();
        for (const p of WI) { const x = p.x * w, y = p.y * h + Math.sin(t * 2 + p.y * 30) * 2; g.moveTo(x, y); g.lineTo(x - p.l * w, y + 1); }
        g.stroke();
        const hx = w * 0.1, hy = h * 0.86, hs = u * 0.085, f = (t % 45) / 45, hw = y => hs * (0.06 + 0.49 * Math.abs(y - hy) / hs);
        const y1 = hy - hs * 0.85 * (1 - f);
        if (f < 1) poly(g, [[hx - hw(y1), y1], [hx + hw(y1), y1], [hx + hs * 0.06, hy], [hx - hs * 0.06, hy]], `rgba(240,190,110,${0.7 * a})`);
        const yb = hy + hs - hs * 0.8 * f;
        poly(g, [[hx - hs * 0.55, hy + hs], [hx + hs * 0.55, hy + hs], [hx + hw(yb) * 0.9, yb], [hx - hw(yb) * 0.9, yb]], `rgba(240,190,110,${0.7 * a})`);
        g.strokeStyle = `rgba(240,190,110,${0.7 * a})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx, yb); g.stroke();
        g.strokeStyle = `rgba(255,236,200,${0.55 * a})`; g.lineWidth = 2;
        g.beginPath(); g.moveTo(hx - hs * 0.55, hy - hs); g.lineTo(hx + hs * 0.55, hy - hs); g.lineTo(hx + hs * 0.06, hy); g.lineTo(hx + hs * 0.55, hy + hs); g.lineTo(hx - hs * 0.55, hy + hs); g.lineTo(hx - hs * 0.06, hy); g.closePath(); g.stroke();
        g.fillStyle = `rgba(110,62,26,${0.9 * a})`; g.fillRect(hx - hs * 0.72, hy - hs - hs * 0.14, hs * 1.44, hs * 0.14); g.fillRect(hx - hs * 0.72, hy + hs, hs * 1.44, hs * 0.14);
      },
    };
  },
  post(th) { // postmarks and stamps on the desk, envelopes gliding across
    let desk = null, dw = 0, dh = 0, t = 0;
    const mk = init => ({ x: init ? Math.random() : -0.15, y: rand(0.08, 0.92), v: rand(0.025, 0.05), s: rand(0.7, 1.3), ph: rand(0, 6.3), c: th.blocks[(Math.random() * 7) | 0] });
    const E = [...Array(6)].map(() => mk(true));
    function build(w, h) {
      dw = w; dh = h; desk = document.createElement('canvas'); desk.width = Math.ceil(w); desk.height = Math.ceil(h);
      const g = desk.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 5; i++) { // round postmarks with wavy cancellation lines
        const x = Math.random() * w, y = Math.random() * h, r = u * rand(0.08, 0.12);
        g.strokeStyle = 'rgba(200,210,235,.08)'; g.lineWidth = 2;
        g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(x, y, r * 0.75, 0, Math.PI * 2); g.stroke();
        for (let k = 0; k < 4; k++) { g.beginPath(); for (let j = 0; j <= 20; j++) { const xx = x + r * 1.2 + j * u * 0.02, yy = y - r * 0.5 + k * r * 0.33 + Math.sin(j * 0.9) * u * 0.008; j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
      }
      for (let i = 0; i < 6; i++) { // perforated stamp outlines
        const x = Math.random() * w, y = Math.random() * h, sw = u * 0.08, sh2 = u * 0.1;
        g.setLineDash([3, 3]); g.strokeStyle = 'rgba(232,90,74,.12)'; g.strokeRect(x, y, sw, sh2); g.setLineDash([]);
        g.fillStyle = 'rgba(232,90,74,.06)'; g.fillRect(x + 4, y + 4, sw - 8, sh2 - 8);
      }
    }
    return {
      step(dt) { t += dt; E.forEach((e, i) => { e.x += e.v * dt; if (e.x > 1.2) E[i] = mk(false); }); },
      draw(g, w, h, a) {
        if (!desk || Math.abs(w - dw) > 1 || Math.abs(h - dh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(desk, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const e of E) {
          const ew = u * 0.1 * e.s, eh = ew * 0.66, x = e.x * w, y = e.y * h + Math.sin(t * 1.2 + e.ph) * u * 0.015;
          g.save(); g.translate(x, y); g.rotate(Math.sin(t * 0.8 + e.ph) * 0.12);
          g.fillStyle = `rgba(246,236,216,${0.5 * a})`; g.fillRect(-ew / 2, -eh / 2, ew, eh);
          g.strokeStyle = `rgba(110,80,50,${0.4 * a})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-ew / 2, -eh / 2); g.lineTo(0, eh * 0.1); g.lineTo(ew / 2, -eh / 2); g.stroke();
          g.beginPath(); g.arc(0, eh * 0.1, ew * 0.1, 0, Math.PI * 2); g.fillStyle = rgba(e.c, 0.7 * a); g.fill();
          g.restore();
        }
      },
    };
  },
  park(th) { // drifting clouds, kites on long strings, butterflies, swaying grass and a line of ants
    let t = 0;
    const CL = [...Array(4)].map(() => ({ x: Math.random(), y: rand(0.05, 0.4), s: rand(0.7, 1.3), v: rand(0.006, 0.014) }));
    const KI = [0, 1].map(i => ({ x: i ? 0.8 : 0.22, y: i ? 0.14 : 0.24, c: th.blocks[i ? 4 : 0], c2: th.blocks[i ? 2 : 5], ph: rand(0, 6.3) }));
    const BF = [...Array(4)].map(() => ({ x: Math.random(), y: rand(0.3, 0.9), vx: 0, vy: 0, ph: rand(0, 6.3), c: th.blocks[(Math.random() * 7) | 0] }));
    const GR = [...Array(70)].map(() => ({ x: Math.random(), h: rand(0.03, 0.07), ph: rand(0, 6.3) }));
    return {
      step(dt) {
        t += dt;
        for (const c of CL) { c.x += c.v * dt; if (c.x > 1.3) c.x = -0.3; }
        const damp = Math.pow(0.5, dt);
        for (const b of BF) {
          b.vx = (b.vx + (Math.random() - 0.5) * 0.4 * dt) * damp; b.vy = (b.vy + (Math.random() - 0.5) * 0.4 * dt) * damp;
          b.x += b.vx * dt; b.y += b.vy * dt; b.ph += dt * 18;
          if (b.x < -0.05) b.x = 1.05; if (b.x > 1.05) b.x = -0.05; if (b.y < 0.2) b.vy += 0.05 * dt; if (b.y > 0.95) b.vy -= 0.05 * dt;
        }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const c of CL) {
          const cx = c.x * w, cy = c.y * h, r = u * 0.05 * c.s;
          g.beginPath(); for (const [dx, dy, q] of [[-1.2, 0.2, 0.8], [0, -0.2, 1.1], [1.2, 0.2, 0.8], [0.5, 0.3, 0.9], [-0.5, 0.3, 0.9]]) { g.moveTo(cx + dx * r + q * r, cy + dy * r); g.arc(cx + dx * r, cy + dy * r, q * r, 0, Math.PI * 2); }
          g.fillStyle = `rgba(255,255,255,${0.7 * a})`; g.fill();
        }
        for (const k of KI) {
          const x = k.x * w + Math.sin(t * 0.7 + k.ph) * u * 0.03, y = k.y * h + Math.cos(t * 0.9 + k.ph) * u * 0.02, r = u * 0.05, tilt = Math.sin(t * 0.8 + k.ph) * 0.2;
          g.strokeStyle = `rgba(60,60,60,${0.3 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + r); g.quadraticCurveTo(x + u * 0.1, h * 0.6, k.x * w - u * 0.05, h * 1.02); g.stroke();
          g.save(); g.translate(x, y); g.rotate(tilt);
          poly(g, [[0, -r], [r * 0.7, 0], [0, r * 1.2], [-r * 0.7, 0]], rgba(k.c, 0.85 * a));
          poly(g, [[0, -r], [r * 0.7, 0], [0, 0]], rgba(k.c2, 0.85 * a)); poly(g, [[0, r * 1.2], [-r * 0.7, 0], [0, 0]], rgba(k.c2, 0.85 * a));
          g.strokeStyle = `rgba(80,60,60,${0.5 * a})`; g.beginPath(); g.moveTo(0, r * 1.2);
          for (let i = 1; i <= 6; i++) g.lineTo(Math.sin(t * 3 + i + k.ph) * r * 0.3, r * 1.2 + i * r * 0.35); g.stroke();
          for (let i = 1; i <= 3; i++) { g.fillStyle = rgba(i % 2 ? k.c : k.c2, 0.8 * a); g.fillRect(Math.sin(t * 3 + i * 2 + k.ph) * r * 0.3 - 3, r * 1.2 + i * 2 * r * 0.35 - 2, 6, 4); }
          g.restore();
        }
        for (const b of BF) {
          const x = b.x * w, y = b.y * h, bs = u * 0.016, f = 0.25 + 0.75 * Math.abs(Math.sin(b.ph));
          g.fillStyle = rgba(b.c, 0.8 * a);
          for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(x + sd * bs * 0.6 * f, y - bs * 0.2, bs * 0.65 * f, bs * 0.8, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(x + sd * bs * 0.45 * f, y + bs * 0.45, bs * 0.45 * f, bs * 0.5, 0, 0, Math.PI * 2); g.fill(); }
          g.fillStyle = `rgba(40,30,20,${0.8 * a})`; g.fillRect(x - 1, y - bs * 0.7, 2, bs * 1.4);
        }
        g.strokeStyle = `rgba(60,120,40,${0.55 * a})`; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath();
        for (const b of GR) { const x = b.x * w, hh = b.h * h, sw = Math.sin(t * 1.4 + b.ph) * hh * 0.25; g.moveTo(x, h); g.quadraticCurveTo(x, h - hh * 0.6, x + sw, h - hh); }
        g.stroke(); g.lineCap = 'butt';
        g.fillStyle = `rgba(40,25,15,${0.7 * a})`;
        const ay = h * 0.985, sp = u * 0.025, off = (t * u * 0.03) % sp;
        for (let x = -sp + off; x < w * 0.45; x += sp) { const bob = Math.sin(x * 0.3 + t * 8) * 0.8; g.fillRect(x, ay + bob, 3, 2); g.fillRect(x + 3.5, ay + bob, 2.5, 2); }
      },
    };
  },
  library(th) { // full bookshelves, two flickering candles, dust in the air
    let shelves = null, sw = 0, sh = 0, t = 0;
    const DU = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.01, -0.003), ph: rand(0, 6.3) }));
    function build(w, h) {
      sw = w; sh = h; shelves = document.createElement('canvas'); shelves.width = Math.ceil(w); shelves.height = Math.ceil(h);
      const g = shelves.getContext('2d'), u = Math.min(w, h), rowH = u * 0.22;
      for (let y = rowH * 0.15; y < h; y += rowH) {
        for (let x = 0; x < w;) {
          const bw = u * rand(0.025, 0.05), bh = rowH * rand(0.6, 0.86), c = th.blocks[(Math.random() * 7) | 0];
          if (Math.random() < 0.08) { x += bw * 1.5; continue; } // a gap on the shelf
          g.fillStyle = rgba(c, 0.22); g.fillRect(x, y + rowH - bh - rowH * 0.08, bw - 1.5, bh);
          g.fillStyle = 'rgba(240,200,110,.12)'; g.fillRect(x, y + rowH - bh - rowH * 0.08 + bh * 0.12, bw - 1.5, 2); g.fillRect(x, y + rowH - rowH * 0.08 - bh * 0.15, bw - 1.5, 2);
          x += bw;
        }
        g.fillStyle = 'rgba(90,56,30,.5)'; g.fillRect(0, y + rowH - rowH * 0.08, w, rowH * 0.07);
      }
      const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.75);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
    }
    return {
      step(dt) { t += dt; for (const d of DU) { d.y += d.v * dt; d.x += Math.sin(t * 0.4 + d.ph) * 0.003 * dt; if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!shelves || Math.abs(w - sw) > 1 || Math.abs(h - sh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(shelves, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const cx of [0.08, 0.92]) {
          const x = cx * w, y = h * 0.9, fl = 0.85 + 0.15 * Math.sin(t * 11 + cx * 7) * Math.sin(t * 6.3 + cx), R = u * 0.4 * fl;
          const gl = g.createRadialGradient(x, y - u * 0.1, 0, x, y - u * 0.1, R); gl.addColorStop(0, rgba(th.accent, 0.3 * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - R, y - u * 0.1 - R, 2 * R, 2 * R);
          g.fillStyle = `rgba(240,228,200,${0.85 * a})`; g.fillRect(x - u * 0.014, y - u * 0.08, u * 0.028, u * 0.12);
          g.fillStyle = `rgba(160,120,60,${0.9 * a})`; g.fillRect(x - u * 0.03, y + u * 0.04, u * 0.06, u * 0.012);
          const fh = u * 0.04 * fl;
          g.beginPath(); g.moveTo(x, y - u * 0.08 - fh); g.quadraticCurveTo(x + u * 0.012, y - u * 0.08 - fh * 0.3, x, y - u * 0.078); g.quadraticCurveTo(x - u * 0.012, y - u * 0.08 - fh * 0.3, x, y - u * 0.08 - fh);
          g.fillStyle = `rgba(255,200,100,${0.95 * a})`; g.fill();
        }
        for (const d of DU) { const k = 0.5 + 0.5 * Math.sin(t * 1.5 + d.ph); g.fillStyle = `rgba(255,220,170,${(0.12 + 0.3 * k) * a})`; g.fillRect(d.x * w, d.y * h, 2, 2); }
      },
    };
  },
});

Object.assign(KITS, (S => {
  const chirp = (when, vol = 0.04) => { S.tone(2600, { dur: 0.05, vol, to: 3600, when }); S.tone(3000, { dur: 0.05, vol: vol * 0.8, to: 3900, when: when + 0.07 }); };
  return {
    sand: { // sand poured and blown by the wind
      pick() { S.hiss({ dur: 0.05, vol: 0.04, type: 'lowpass', freq: 2500 }); },
      place() { S.hissL({ dur: 0.22, vol: 0.08, type: 'lowpass', freq: 1600, to: 600, q: 1 }); S.thud({ vol: 0.16, f: 110 }); },
      clear(n) { S.hissL({ dur: 0.9 + n * 0.1, vol: 0.09, type: 'bandpass', freq: 400, to: 1400, q: 0.6 }); S.hissL({ dur: 0.6, vol: 0.05, type: 'highpass', freq: 5000, when: 0.15 }); },
      deal() { S.hissL({ dur: 0.3, vol: 0.04, type: 'lowpass', freq: 2200, to: 900 }); },
    },
    letter: { // envelopes sliding, a wax stamp pressed, a little post bell
      pick() { S.hiss({ dur: 0.06, vol: 0.05, type: 'bandpass', freq: 2200, to: 1200, q: 1 }); },
      place() { S.thud({ vol: 0.28, f: 95 }); S.knock(600, { vol: 0.12, when: 0.01 }); },
      clear(n) {
        for (let i = 0; i < Math.min(n + 1, 4); i++) S.hiss({ dur: 0.12, vol: 0.07, type: 'bandpass', freq: 2400, to: 1100, q: 1, when: i * 0.08 });
        S.thud({ vol: 0.3, f: 90, when: 0.3 }); S.tink(2200, { vol: 0.07, dur: 0.6, when: 0.4 });
      },
      deal() { S.hiss({ dur: 0.15, vol: 0.05, type: 'bandpass', freq: 2000, to: 900, q: 1 }); },
    },
    picnic: { // birds, grass, a soda bottle opened
      pick() { S.tone(2900, { dur: 0.04, vol: 0.03, to: 3600 }); },
      place() { S.thud({ vol: 0.16, f: 150 }); S.rustle({ vol: 0.05, dur: 0.08 }); },
      clear(n) { S.pop({ vol: 0.16, f: 700 }); S.hissL({ dur: 0.6, vol: 0.04, type: 'highpass', freq: 5000, when: 0.05 }); for (let i = 0; i < Math.min(n + 1, 4); i++) chirp(0.15 + i * 0.18); },
      deal() { chirp(0, 0.03); },
    },
    library: { // pages turning, a heavy book closed, a candle crackling
      pick() { S.hiss({ dur: 0.05, vol: 0.04, type: 'bandpass', freq: 2200, q: 1.2 }); },
      place() { S.thud({ vol: 0.28, f: 100 }); S.knock(300, { vol: 0.12 }); },
      clear(n) {
        for (let i = 0; i < Math.min(n + 1, 4); i++) S.hissL({ dur: 0.14, vol: 0.07, type: 'bandpass', freq: 1500, to: 3500, q: 1, when: i * 0.1 });
        S.crunch({ vol: 0.05, n: 3, when: 0.2 }); S.thud({ vol: 0.32, f: 80, when: 0.45 });
      },
      deal() { S.hissL({ dur: 0.3, vol: 0.04, type: 'bandpass', freq: 1800, to: 3200, q: 1 }); },
    },
  };
})(Sfx));

/* ---------- Daily collection, part 3: stained glass, observatory, night train, moon phases ---------- */
Object.assign(STYLES, {
  vitray: { // glass lit from behind, held in lead
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.08); g.fillStyle = '#18141e'; g.fill();
      g.save(); rr(g, s * 0.08, s * 0.08, s * 0.84, s * 0.84, s * 0.05); g.clip();
      const gr = g.createRadialGradient(s * 0.45, s * 0.4, s * 0.02, s * 0.5, s * 0.5, s * 0.62);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.45)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.35));
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      TEX.vitray(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
  astrolabe: { // an enamelled dial in a brass rim
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = '#4a3410'; g.fill();
      const br = g.createLinearGradient(0, 0, s, s); br.addColorStop(0, '#f6dc8a'); br.addColorStop(0.5, '#b8862c'); br.addColorStop(1, '#e8c060');
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.88, s * 0.11); g.fillStyle = br; g.fill();
      const gr = g.createRadialGradient(s * 0.42, s * 0.38, s * 0.02, s * 0.5, s * 0.5, s * 0.4);
      gr.addColorStop(0, shade(c, 0.25)); gr.addColorStop(1, shade(c, -0.25));
      g.beginPath(); g.arc(s * 0.5, s * 0.49, s * 0.34, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
      TEX.astrolabe(g, s, c, seeded(c), 1);
    },
  },
  carriage: { // a painted carriage panel with a lit window and rivets
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08); g.fillStyle = shade(c, -0.55); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, shade(c, 0.18)); gr.addColorStop(1, shade(c, -0.2));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.07); g.fillStyle = gr; g.fill();
      g.save(); rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.07); g.clip(); TEX.carriage(g, s, c, seeded(c), 1); g.restore();
    },
  },
  lunar: { // a little moon in its phase, on a night tile
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.2); g.fillStyle = mixHex(c, '#08101e', 0.78); g.fill();
      const gr = g.createRadialGradient(s * 0.4, s * 0.38, s * 0.02, s * 0.5, s * 0.5, s * 0.42);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.5)); gr.addColorStop(1, shade(c, -0.15));
      g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.36, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
      g.save(); g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.36, 0, Math.PI * 2); g.clip(); TEX.lunar(g, s, c, seeded(c), 1); g.restore();
      g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.36, 0, Math.PI * 2); g.strokeStyle = rgba(c, 0.35); g.lineWidth = Math.max(1, s * 0.03); g.stroke();
    },
  },
});

Object.assign(TEX, {
  vitray(g, s, c, rnd, k) { // facets meeting near the middle, each a slightly different shade, held by lead lines
    const cx = s * (0.38 + rnd() * 0.24), cy = s * (0.38 + rnd() * 0.24);
    const E = [[rnd() * s, 0], [s, rnd() * s], [rnd() * s, s], [0, rnd() * s]], C = [[s, 0], [s, s], [0, s], [0, 0]];
    for (let i = 0; i < 4; i++) {
      poly(g, [[cx, cy], E[i], C[i], E[(i + 1) % 4]], i % 2 ? `rgba(255,255,255,${0.14 * k})` : `rgba(0,0,0,${0.16 * k})`);
    }
    speckle(g, s, rnd, 14, 0.006, 0.014, () => `rgba(255,255,255,${0.35 * k})`);
    g.strokeStyle = `rgba(22,18,28,${0.92 * k})`; g.lineWidth = Math.max(1.5, s * 0.055); g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); for (const [x, y] of E) { g.moveTo(cx, cy); g.lineTo(x, y); } g.stroke();
    g.strokeStyle = `rgba(255,255,255,${0.2 * k})`; g.lineWidth = Math.max(1, s * 0.012);
    g.beginPath(); for (const [x, y] of E) { g.moveTo(cx + 1.5, cy + 1.5); g.lineTo(x + 1.5, y + 1.5); } g.stroke();
  },
  astrolabe(g, s, c, rnd, k) { // degree ticks, an engraved circle and a rotating pointer with a star
    const cx = s * 0.5, cy = s * 0.49, R = s * 0.34;
    g.strokeStyle = `rgba(70,46,10,${0.7 * k})`; g.lineWidth = Math.max(1, s * 0.012);
    g.beginPath();
    for (let i = 0; i < 24; i++) { const an = i / 24 * Math.PI * 2, r0 = R * (i % 6 ? 1.06 : 1.0); g.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); g.lineTo(cx + Math.cos(an) * R * 1.18, cy + Math.sin(an) * R * 1.18); }
    g.stroke();
    g.strokeStyle = `rgba(255,236,190,${0.45 * k})`; g.lineWidth = Math.max(1, s * 0.015);
    g.beginPath(); g.arc(cx, cy, R * 0.62, 0, Math.PI * 2); g.stroke();
    const an = rnd() * 6.3;
    g.strokeStyle = `rgba(246,220,138,${0.9 * k})`; g.lineWidth = Math.max(1, s * 0.03); g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - Math.cos(an) * R * 0.5, cy - Math.sin(an) * R * 0.5); g.lineTo(cx + Math.cos(an) * R * 0.9, cy + Math.sin(an) * R * 0.9); g.stroke();
    g.beginPath(); g.arc(cx, cy, s * 0.04, 0, Math.PI * 2); g.fillStyle = `rgba(246,220,138,${0.95 * k})`; g.fill();
    sparkle(g, cx + Math.cos(an + 2) * R * 0.45, cy + Math.sin(an + 2) * R * 0.45, s * 0.07, 0.75 * k);
  },
  carriage(g, s, c, rnd, k) { // a lit window with a warm glow, a row of rivets and a lining stripe
    const wx = s * 0.2, wy = s * 0.16, ww = s * 0.6, wh = s * 0.36;
    const gl = g.createRadialGradient(s * 0.5, wy + wh / 2, 0, s * 0.5, wy + wh / 2, s * 0.5); gl.addColorStop(0, `rgba(255,200,110,${0.35 * k})`); gl.addColorStop(1, 'rgba(255,200,110,0)');
    g.fillStyle = gl; g.fillRect(0, 0, s, s);
    rr(g, wx - s * 0.03, wy - s * 0.03, ww + s * 0.06, wh + s * 0.06, s * 0.08); g.fillStyle = `rgba(20,16,12,${0.7 * k})`; g.fill();
    const wg = g.createLinearGradient(0, wy, 0, wy + wh); wg.addColorStop(0, `rgba(255,226,150,${0.95 * k})`); wg.addColorStop(1, `rgba(240,160,60,${0.95 * k})`);
    rr(g, wx, wy, ww, wh, s * 0.06); g.fillStyle = wg; g.fill();
    g.fillStyle = `rgba(60,30,10,${0.5 * k})`; g.fillRect(wx + ww * 0.15, wy + wh * 0.45, ww * 0.12, wh * 0.55); // a passenger's shadow
    g.beginPath(); g.arc(wx + ww * 0.21, wy + wh * 0.38, ww * 0.07, 0, Math.PI * 2); g.fill();
    g.fillStyle = `rgba(255,236,190,${0.6 * k})`; g.fillRect(0, s * 0.68, s, Math.max(1, s * 0.03));
    for (let i = 0; i < 5; i++) {
      const x = s * (0.14 + i * 0.18), y = s * 0.82;
      g.beginPath(); g.arc(x, y, s * 0.028, 0, Math.PI * 2); g.fillStyle = `rgba(0,0,0,${0.35 * k})`; g.fill();
      g.beginPath(); g.arc(x - s * 0.006, y - s * 0.006, s * 0.016, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.45 * k})`; g.fill();
    }
  },
  lunar(g, s, c, rnd, k) { // craters with a lit rim and the shadow of the phase sliding across
    for (let i = 0; i < 5; i++) {
      const x = s * (0.25 + rnd() * 0.5), y = s * (0.25 + rnd() * 0.5), r = s * (0.03 + rnd() * 0.05);
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = `rgba(0,0,0,${0.16 * k})`; g.fill();
      g.beginPath(); g.arc(x + r * 0.2, y + r * 0.2, r * 0.85, Math.PI * 0.1, Math.PI * 1.1); g.strokeStyle = `rgba(255,255,255,${0.35 * k})`; g.lineWidth = Math.max(0.8, s * 0.012); g.stroke();
    }
    const ph = 0.25 + rnd() * 0.6, dir = rnd() < 0.5 ? -1 : 1;
    g.beginPath(); g.arc(s * 0.5 + dir * s * 0.72 * ph, s * 0.5, s * 0.4, 0, Math.PI * 2); g.fillStyle = `rgba(8,14,30,${0.55 * k})`; g.fill();
  },
});

Object.assign(PARTS, {
  crescent(p, s) {
    ctx.rotate(p.rot * 0.3);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2); ctx.arc(s * 0.25, -s * 0.1, s * 0.48, 0, Math.PI * 2, true);
    ctx.fillStyle = mixHex(p.color, '#ffffff', 0.5); ctx.fill('evenodd');
  },
});

Object.assign(AMBIENTS, {
  cathedral(th) { // pointed windows high up, coloured light falling to the floor, dust in the beams
    let hall = null, hw = 0, hh = 0, t = 0;
    const DU = [...Array(36)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.01, -0.003), ph: rand(0, 6.3) }));
    const WIN = [0.2, 0.5, 0.8];
    function build(w, h) {
      hw = w; hh = h; hall = document.createElement('canvas'); hall.width = Math.ceil(w); hall.height = Math.ceil(h);
      const g = hall.getContext('2d'), u = Math.min(w, h);
      g.strokeStyle = 'rgba(255,255,255,.04)'; g.lineWidth = 1;
      for (let y = 0; y < h; y += u * 0.06) { const off = ((y / (u * 0.06)) | 0) % 2 * u * 0.06; for (let x = -off; x < w; x += u * 0.12) g.strokeRect(x, y, u * 0.12, u * 0.06); }
      for (const wx of WIN) { // a lancet window made of small coloured panes
        const cx = wx * w, ww = u * 0.11, top = h * 0.03, bot = h * 0.3;
        g.save(); g.beginPath(); g.moveTo(cx - ww, bot); g.lineTo(cx - ww, top + ww); g.quadraticCurveTo(cx - ww, top, cx, top - ww * 0.4); g.quadraticCurveTo(cx + ww, top, cx + ww, top + ww); g.lineTo(cx + ww, bot); g.closePath(); g.clip();
        for (let y = top - ww; y < bot; y += ww * 0.42) for (let x = cx - ww; x < cx + ww; x += ww * 0.5) { g.fillStyle = rgba(th.blocks[(Math.random() * 7) | 0], 0.28); g.fillRect(x + 1, y + 1, ww * 0.5 - 2, ww * 0.42 - 2); }
        g.restore();
      }
    }
    return {
      step(dt) { t += dt; for (const d of DU) { d.y += d.v * dt; d.x += Math.sin(t * 0.4 + d.ph) * 0.003 * dt; if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!hall || Math.abs(w - hw) > 1 || Math.abs(h - hh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(hall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        g.save(); g.globalCompositeOperation = 'lighter';
        WIN.forEach((wx, i) => { // a beam per window, its colour slowly changing
          const cx = wx * w, ww = u * 0.11, sh = Math.sin(t * 0.15 + i) * w * 0.05, c = th.blocks[(i * 2 + ((t / 6) | 0)) % 7];
          const gr = g.createLinearGradient(0, h * 0.3, 0, h); gr.addColorStop(0, rgba(c, 0.12 * a)); gr.addColorStop(1, rgba(c, 0.02 * a));
          g.fillStyle = gr; g.beginPath(); g.moveTo(cx - ww, h * 0.3); g.lineTo(cx + ww, h * 0.3); g.lineTo(cx + ww * 2.6 + sh, h); g.lineTo(cx - ww * 0.4 + sh, h); g.closePath(); g.fill();
          g.beginPath(); g.ellipse(cx + ww * 1.1 + sh, h * 0.95, ww * 1.6, ww * 0.35, 0, 0, Math.PI * 2); g.fillStyle = rgba(c, 0.12 * a); g.fill();
        });
        g.restore();
        for (const d of DU) { const k = 0.5 + 0.5 * Math.sin(t * 1.4 + d.ph); g.fillStyle = `rgba(255,236,200,${(0.1 + 0.3 * k) * a})`; g.fillRect(d.x * w, d.y * h, 2, 2); }
      },
    };
  },
  starchart(th) { // the sky turning round the pole star, constellation lines, brass rings, a telescope
    let t = 0;
    const ST = [...Array(120)].map(() => ({ r: Math.sqrt(Math.random()) * 1.1, an: rand(0, 6.3), s: rand(0.6, 1.8), ph: rand(0, 6.3) }));
    const CON = [...Array(5)].map(() => { const r0 = rand(0.25, 0.9), a0 = rand(0, 6.3); return [...Array(4 + ((Math.random() * 3) | 0))].map((_, i) => [r0 + rand(-0.08, 0.08), a0 + i * rand(0.08, 0.16)]); });
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        const u = Math.min(w, h), M = Math.max(w, h), px = w * 0.5, py = h * 0.12, rot = t * 0.02;
        const P = (r, an) => [px + Math.cos(an + rot) * r * M, py + Math.sin(an + rot) * r * M];
        for (const s2 of ST) { const [x, y] = P(s2.r, s2.an); g.fillStyle = `rgba(255,255,255,${(0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.3 + s2.ph))) * a})`; g.fillRect(x, y, s2.s, s2.s); }
        g.strokeStyle = rgba(th.accent, 0.22 * a); g.lineWidth = 1;
        for (const c of CON) { g.beginPath(); c.forEach(([r, an], i) => { const [x, y] = P(r, an); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); for (const [r, an] of c) { const [x, y] = P(r, an); g.beginPath(); g.arc(x, y, 2, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.6 * a); g.fill(); } }
        sparkle(g, px, py, u * 0.03, 0.9 * a);
        g.strokeStyle = rgba(th.accent, 0.16 * a); g.lineWidth = 2;
        for (const [R, sp] of [[0.5, -0.03], [0.62, 0.02]]) {
          g.beginPath(); g.arc(px, py, R * M, 0, Math.PI * 2); g.stroke();
          g.beginPath(); for (let i = 0; i < 72; i++) { const an = i / 72 * Math.PI * 2 + t * sp, l = i % 6 ? 0.012 : 0.03; g.moveTo(px + Math.cos(an) * R * M, py + Math.sin(an) * R * M); g.lineTo(px + Math.cos(an) * (R - l) * M, py + Math.sin(an) * (R - l) * M); } g.stroke();
        }
        const tx = w * 0.88, ty = h * 0.97; // telescope on its tripod
        g.strokeStyle = `rgba(200,170,110,${0.45 * a})`; g.lineWidth = 2; g.beginPath(); g.moveTo(tx, ty - u * 0.1); g.lineTo(tx - u * 0.05, ty); g.moveTo(tx, ty - u * 0.1); g.lineTo(tx + u * 0.05, ty); g.stroke();
        g.save(); g.translate(tx, ty - u * 0.1); g.rotate(-0.8); g.fillStyle = `rgba(200,170,110,${0.55 * a})`; g.fillRect(-u * 0.04, -u * 0.015, u * 0.16, u * 0.03); g.fillRect(u * 0.12, -u * 0.02, u * 0.03, u * 0.04); g.restore();
      },
    };
  },
  nighttrain(th) { // the view from the window: mountains, lights of towns and passing poles, the moon keeping up
    let far = null, fw = 0, fh = 0, t = 0;
    const TOWN = [...Array(28)].map(() => ({ x: Math.random(), y: rand(0.7, 0.8), ph: rand(0, 6.3), c: Math.random() < 0.7 ? '255,210,130' : '255,240,220' }));
    const ST = [...Array(60)].map(() => ({ x: Math.random(), y: Math.random() * 0.55, ph: rand(0, 6.3) }));
    function build(w, h) {
      fw = w; fh = h; far = document.createElement('canvas'); far.width = Math.ceil(w * 2); far.height = Math.ceil(h * 0.4);
      const g = far.getContext('2d'), H = far.height, W2 = far.width;
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= W2; x += 8) { const p = x / W2 * Math.PI * 2; g.lineTo(x, H * 0.45 - (Math.sin(p * 3) * 0.22 + Math.sin(p * 7 + 1) * 0.1 + Math.sin(p * 13) * 0.04) * H); }
      g.lineTo(W2, H); g.closePath(); g.fillStyle = 'rgba(30,32,64,.85)'; g.fill();
    }
    return {
      step(dt) { t += dt; for (const l of TOWN) { l.x -= 0.03 * dt; if (l.x < -0.02) { l.x = 1.02; l.y = rand(0.7, 0.8); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const s2 of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.4 * Math.sin(t * 1.5 + s2.ph)) * a})`; g.fillRect(s2.x * w, s2.y * h, 1.5, 1.5); }
        const mx = w * 0.78, my = h * 0.16, mr = u * 0.07;
        const gl = g.createRadialGradient(mx, my, mr, mx, my, mr * 4); gl.addColorStop(0, `rgba(230,230,255,${0.2 * a})`); gl.addColorStop(1, 'rgba(230,230,255,0)');
        g.fillStyle = gl; g.fillRect(mx - mr * 4, my - mr * 4, mr * 8, mr * 8);
        g.beginPath(); g.arc(mx, my, mr, 0, Math.PI * 2); g.fillStyle = `rgba(245,242,230,${0.9 * a})`; g.fill();
        if (!far || Math.abs(w - fw) > 1 || Math.abs(h - fh) > 1) build(w, h);
        const off = (t * w * 0.012) % (w * 2);
        g.globalAlpha = a; g.drawImage(far, -off, h * 0.42, w * 2, h * 0.4); g.drawImage(far, w * 2 - off, h * 0.42, w * 2, h * 0.4); g.globalAlpha = 1;
        g.fillStyle = `rgba(12,12,28,${0.9 * a})`; g.fillRect(0, h * 0.8, w, h * 0.2);
        for (const l of TOWN) { const k = 0.6 + 0.4 * Math.sin(t * 3 + l.ph); g.fillStyle = `rgba(${l.c},${0.7 * k * a})`; g.fillRect(l.x * w, l.y * h, 2.5, 2.5); }
        const sp = w * 0.55, po = (t * w * 0.6) % sp; // telegraph poles rushing past, wires sagging between them
        g.strokeStyle = `rgba(10,10,20,${0.8 * a})`; g.lineWidth = 3;
        for (let x = w + sp - po; x > -sp; x -= sp) { g.beginPath(); g.moveTo(x, h); g.lineTo(x, h * 0.6); g.moveTo(x - u * 0.03, h * 0.62); g.lineTo(x + u * 0.03, h * 0.62); g.stroke(); }
        g.lineWidth = 1; g.beginPath();
        for (let x = w + sp - po; x > -sp; x -= sp) { g.moveTo(x, h * 0.62); g.quadraticCurveTo(x - sp / 2, h * 0.67, x - sp, h * 0.62); } g.stroke();
        g.fillStyle = `rgba(0,0,0,${0.35 * a})`; g.fillRect(0, h * 0.93, w, h * 0.07); // window sill
      },
    };
  },
  tides(th) { // a big moon going through its phases over the sea, light on the water, clouds passing
    let t = 0;
    const ST = [...Array(80)].map(() => ({ x: Math.random(), y: Math.random() * 0.62, ph: rand(0, 6.3), s: rand(0.6, 1.6) }));
    const CL = [...Array(3)].map(() => ({ x: Math.random(), y: rand(0.08, 0.35), v: rand(0.006, 0.012), s: rand(0.8, 1.3) }));
    return {
      step(dt) { t += dt; for (const c of CL) { c.x += c.v * dt; if (c.x > 1.3) c.x = -0.3; } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), hy = h * 0.68, mx = w * 0.5, my = h * 0.2, mr = u * 0.12;
        for (const s2 of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * s2.s + s2.ph))) * a})`; g.fillRect(s2.x * w, s2.y * h, s2.s, s2.s); }
        const gl = g.createRadialGradient(mx, my, mr, mx, my, mr * 3.5); gl.addColorStop(0, `rgba(220,232,255,${0.22 * a})`); gl.addColorStop(1, 'rgba(220,232,255,0)');
        g.fillStyle = gl; g.fillRect(mx - mr * 3.5, my - mr * 3.5, mr * 7, mr * 7);
        g.save(); g.beginPath(); g.arc(mx, my, mr, 0, Math.PI * 2); g.clip();
        g.fillStyle = `rgba(236,240,250,${0.92 * a})`; g.fillRect(mx - mr, my - mr, mr * 2, mr * 2);
        g.fillStyle = `rgba(180,190,210,${0.5 * a})`; for (const [dx, dy, r] of [[-0.3, -0.2, 0.2], [0.25, 0.2, 0.26], [-0.1, 0.45, 0.13], [0.4, -0.35, 0.1]]) { g.beginPath(); g.arc(mx + dx * mr, my + dy * mr, r * mr, 0, Math.PI * 2); g.fill(); }
        const ph = (t / 40) % 1, off = (ph * 2 - 1) * mr * 2.1; // one full cycle of phases every 40 seconds
        g.beginPath(); g.arc(mx + off, my, mr * 1.02, 0, Math.PI * 2); g.fillStyle = `rgba(8,16,34,${0.88 * a})`; g.fill();
        g.restore();
        for (const c of CL) {
          const cx = c.x * w, cy = c.y * h, r = u * 0.05 * c.s;
          g.beginPath(); for (const [dx, dy, q] of [[-1, 0.1, 0.7], [0, -0.15, 1], [1, 0.1, 0.7]]) { g.moveTo(cx + dx * r + q * r, cy + dy * r); g.arc(cx + dx * r, cy + dy * r, q * r, 0, Math.PI * 2); }
          g.fillStyle = `rgba(40,56,86,${0.6 * a})`; g.fill();
        }
        const sea = g.createLinearGradient(0, hy, 0, h); sea.addColorStop(0, `rgba(20,40,70,${0.65 * a})`); sea.addColorStop(1, `rgba(6,14,28,${0.75 * a})`);
        g.fillStyle = sea; g.fillRect(0, hy, w, h - hy);
        g.strokeStyle = `rgba(230,238,255,${0.4 * a})`; g.lineWidth = 2;
        for (let i = 0; i < 10; i++) { const y = hy + (h - hy) * (0.05 + i * 0.1), len = u * (0.05 + i * 0.03) * (0.7 + 0.3 * Math.sin(t * 1.5 + i)); g.beginPath(); g.moveTo(mx - len / 2 + Math.sin(t + i * 2) * u * 0.01, y); g.lineTo(mx + len / 2 + Math.sin(t + i * 2) * u * 0.01, y); g.stroke(); }
        g.strokeStyle = `rgba(200,215,240,${0.12 * a})`; g.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) { const y0 = hy + (h - hy) * (0.15 + i * 0.22); g.beginPath(); for (let x = 0; x <= w + 10; x += 10) { const y = y0 + Math.sin(x * 0.02 + t * (0.8 + i * 0.2) + i) * u * 0.006; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      },
    };
  },
});

Object.assign(KITS, (S => ({
  organ: { // glass clinks and an organ chord with a slow swell
    pick() { S.tink(3000, { vol: 0.035, dur: 0.15 }); },
    place() { S.thud({ vol: 0.18, f: 130 }); S.tink(rand(2000, 2600), { vol: 0.07, dur: 0.3 }); },
    clear(n) {
      const r = S.snd.root * 0.5;
      [0, 7, 12, n > 2 ? 16 : 19].forEach(st => { const f = r * Math.pow(2, st / 12); S.tone(f, { dur: 1.3, vol: 0.05, attack: 0.15, wet: true }); S.tone(f * 2, { type: 'triangle', dur: 1.1, vol: 0.02, attack: 0.15 }); });
      for (let i = 0; i < n + 2; i++) S.tink(rand(2200, 3800), { when: 0.05 + i * 0.06, vol: 0.035, dur: 0.4 });
    },
    deal() { S.tink(2600, { vol: 0.03, dur: 0.5 }); },
  },
  brass: { // ticking brass gears and an observatory bell
    pick() { S.knock(2600, { vol: 0.04 }); },
    place() { S.thud({ vol: 0.22, f: 120 }); S.tink(900, { vol: 0.07, dur: 0.25 }); },
    clear(n) { for (let i = 0; i < 6; i++) S.knock(2400, { vol: 0.04, when: i * 0.05 }); S.tink(660, { vol: 0.11, dur: 1.6, when: 0.3 }); if (n > 1) S.tink(990, { vol: 0.07, dur: 1.2, when: 0.45 }); },
    deal() { for (let i = 0; i < 3; i++) S.knock(2800, { vol: 0.03, when: i * 0.06 }); },
  },
  train: { // rail joints "ta-tak", a steam whistle on a clear
    pick() { S.knock(1800, { vol: 0.04 }); },
    place() { S.knock(210, { vol: 0.26 }); S.knock(180, { vol: 0.22, when: 0.09 }); },
    clear(n) {
      S.tone(740, { type: 'triangle', dur: 0.75, vol: 0.05, attack: 0.05, wet: true }); S.tone(932, { type: 'triangle', dur: 0.75, vol: 0.045, attack: 0.05 });
      S.hissL({ dur: 0.8, vol: 0.05, type: 'bandpass', freq: 2500, q: 0.8 });
      for (let i = 0; i < Math.min(n + 1, 4); i++) { S.knock(210, { vol: 0.18, when: 0.8 + i * 0.22 }); S.knock(180, { vol: 0.15, when: 0.89 + i * 0.22 }); }
    },
    deal() { for (let i = 0; i < 4; i++) S.hiss({ dur: 0.08, vol: 0.05, type: 'bandpass', freq: 900, q: 0.8, when: i * 0.12 }); },
  },
  moon: { // soft chimes on a pentatonic scale and a wave on the shore
    pick() { S.tink(2800, { vol: 0.03, dur: 0.4 }); },
    place() { S.thud({ vol: 0.14, f: 140 }); S.tone(S.snd.root * 0.5, { dur: 0.5, vol: 0.04, attack: 0.03, wet: true }); },
    clear(n) {
      const P = [0, 2, 4, 7, 9, 12, 14];
      for (let i = 0; i < n + 2; i++) S.tink(S.snd.root * 2 * Math.pow(2, P[i % 7] / 12), { when: 0.04 + i * 0.12, vol: 0.04, dur: 0.9 });
      S.hissL({ dur: 1.2, vol: 0.06, type: 'lowpass', freq: 700, to: 200, when: 0.2 });
    },
    deal() { S.hissL({ dur: 0.6, vol: 0.03, type: 'lowpass', freq: 600, to: 250 }); },
  },
}))(Sfx));

/* ---------- Daily collection, part 4: Zeugma mosaic and the finale, the comet ---------- */
Object.assign(STYLES, {
  tesserae: { // small stone tiles set in mortar
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08); g.fillStyle = '#b8a890'; g.fill();
      g.save(); rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08); g.clip(); TEX.tesserae(g, s, c, seeded(c), 1); g.restore();
    },
  },
  cometcore: { // an icy core racing up the tile with its tail behind it
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.18); g.fillStyle = mixHex(c, '#04061a', 0.82); g.fill();
      g.save(); rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.18); g.clip();
      const neb = g.createRadialGradient(s * 0.62, s * 0.38, 0, s * 0.5, s * 0.5, s * 0.7); neb.addColorStop(0, rgba(c, 0.45)); neb.addColorStop(1, rgba(c, 0.05));
      g.fillStyle = neb; g.fillRect(0, 0, s, s);
      TEX.cometcore(g, s, c, seeded(c), 1);
      g.restore();
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.18); g.strokeStyle = rgba(c, 0.55); g.lineWidth = Math.max(1, s * 0.03); g.stroke();
    },
  },
});

Object.assign(TEX, {
  tesserae(g, s, c, rnd, k) { // a 4 x 4 set of slightly uneven tiles, each a shade of its own, with mortar lines between
    const n = 4, q = s / n;
    g.fillStyle = `rgba(150,130,100,${0.55 * k})`; g.fillRect(0, 0, s, s);
    for (let r = 0; r < n; r++) for (let cc = 0; cc < n; cc++) {
      const j = () => (rnd() - 0.5) * q * 0.1, x = cc * q + q * 0.08 + j(), y = r * q + q * 0.08 + j(), w = q * 0.84 + j(), h = q * 0.84 + j();
      const v = (rnd() - 0.5) * 0.3;
      g.fillStyle = v > 0 ? mixHex(c, '#ffffff', v) : shade(c, v);
      g.globalAlpha = k; rr(g, x, y, w, h, q * 0.12); g.fill();
      g.fillStyle = `rgba(255,255,255,${0.18 * k})`; g.fillRect(x + w * 0.1, y + h * 0.1, w * 0.35, h * 0.12);
      g.globalAlpha = 1;
    }
  },
  cometcore(g, s, c, rnd, k) { // tail streaks, a glowing core and a few stars
    const hx = s * 0.68, hy = s * 0.32;
    g.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const off = (i - 2) * s * 0.05, len = s * (0.6 + rnd() * 0.25);
      const gr = g.createLinearGradient(hx, hy, hx - len * 0.7, hy + len * 0.7);
      gr.addColorStop(0, `rgba(255,255,255,${0.75 * k})`); gr.addColorStop(0.3, rgba(c, 0.6 * k)); gr.addColorStop(1, rgba(c, 0));
      g.strokeStyle = gr; g.lineWidth = Math.max(1, s * (i === 2 ? 0.09 : 0.035));
      g.beginPath(); g.moveTo(hx + off * 0.7, hy + off * 0.7); g.lineTo(hx - len * 0.7 + off * 0.7, hy + len * 0.7 + off * 0.7); g.stroke();
    }
    const gl = g.createRadialGradient(hx, hy, 0, hx, hy, s * 0.22); gl.addColorStop(0, `rgba(255,255,255,${0.95 * k})`); gl.addColorStop(0.35, rgba(c, 0.6 * k)); gl.addColorStop(1, rgba(c, 0));
    g.fillStyle = gl; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 3; i++) sparkle(g, s * (0.15 + rnd() * 0.3), s * (0.1 + rnd() * 0.3), s * (0.03 + rnd() * 0.03), 0.8 * k);
  },
});

Object.assign(AMBIENTS, {
  mosaicfloor(th) { // a floor mosaic coming to light tile by tile from the middle, a brush of dust at the edge
    let tiles = [], tw = 0, thh = 0, t = 0, q = 0;
    const DU = [...Array(24)].map(() => ({ x: Math.random(), y: Math.random(), ph: rand(0, 6.3) }));
    function build(w, h) {
      tw = w; thh = h; tiles = []; q = Math.max(10, Math.min(w, h) * 0.035);
      const cols = Math.ceil(w / q), rows = Math.ceil(h / q), cx = cols / 2, cy = rows / 2;
      const B = th.blocks;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const edge = Math.min(r, c, rows - 1 - r, cols - 1 - c);
        let col;
        if (edge === 0) col = '#4a2a1a';
        else if (edge === 1 || edge === 2) col = ((c + r + (edge === 2 ? 1 : 0)) % 4 < 2) ? B[0] : B[6]; // a running wave band
        else if (edge === 3) col = '#4a2a1a';
        else {
          const d = Math.hypot(c - cx, (r - cy) * 1.0), ring = Math.floor(d / 1.6);
          const an = Math.atan2(r - cy, c - cx), petal = Math.cos(an * 8) > 0.3;
          col = d < 1.5 ? B[2] : ring % 3 === 0 ? B[4] : ring % 3 === 1 ? (petal ? B[1] : B[6]) : (petal ? B[3] : B[6]);
        }
        const v = (Math.random() - 0.5) * 0.25; // each stone a little lighter or darker, worked out once
        tiles.push({ x: c * q, y: r * q, fill: v > 0 ? mixHex(col, '#ffffff', v) : shade(col, v), d: Math.hypot(c, rows - r) + Math.random() * 2.5 }); // uncovered from the bottom-left corner, which the board does not hide
      }
      tiles.sort((a, b) => a.d - b.d);
    }
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        if (!tiles.length || Math.abs(w - tw) > 1 || Math.abs(h - thh) > 1) build(w, h);
        const cyc = 44, ct = t % cyc, reveal = Math.min(1, ct / 24), fade = ct > 40 ? 1 - (ct - 40) / 4 : 1;
        const n = Math.floor(tiles.length * reveal);
        g.globalAlpha = 0.32 * a * fade;
        for (let i = 0; i < n; i++) { const p = tiles[i]; g.fillStyle = p.fill; g.fillRect(p.x + 1, p.y + 1, q - 2, q - 2); }
        g.globalAlpha = 1;
        if (n < tiles.length && n > 0) { // dust being brushed off at the edge of what has been uncovered
          const e = tiles[n - 1], R = q * 3;
          for (const d of DU) { const x = e.x + Math.cos(d.ph + t * 2) * R * d.x, y = e.y + Math.sin(d.ph + t * 2) * R * d.y; g.fillStyle = `rgba(230,210,180,${0.4 * a})`; g.fillRect(x, y, 2, 2); }
        }
      },
    };
  },
  comet(th) { // a great comet sweeping across the sky with a dust tail, stars, a nebula and now and then a meteor
    let t = 0, dust = [], met = null, mwait = rand(2, 5);
    const ST = [...Array(130)].map(() => ({ x: Math.random(), y: Math.random(), s: rand(0.5, 1.8), ph: rand(0, 6.3), f: rand(0.5, 2) }));
    const head = () => { const k = (t % 24) / 24; return [-0.15 + k * 1.3, 0.97 - k * 0.2]; }; // low across the sky, below the board
    return {
      step(dt) {
        t += dt;
        const [hx, hy] = head();
        if (!REDUCED) for (let i = 0; i < 3; i++) dust.push({ x: hx, y: hy, vx: -rand(0.02, 0.06), vy: rand(0.005, 0.03), life: 0, c: th.blocks[(Math.random() * 7) | 0] });
        for (const p of dust) { p.x += p.vx * dt; p.y += p.vy * dt; p.life += dt / 2.5; }
        dust = dust.filter(p => p.life < 1);
        mwait -= dt;
        if (!met && mwait < 0 && !REDUCED) { met = { x: rand(0.2, 1), y: rand(0, 0.3), life: 0 }; mwait = rand(3, 7); }
        if (met) { met.life += dt / 0.7; if (met.life >= 1) met = null; }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), M = Math.max(w, h);
        const neb = g.createRadialGradient(w * 0.3, h * 0.7, 0, w * 0.3, h * 0.7, M * 0.6); neb.addColorStop(0, rgba(th.blocks[5], 0.14 * a)); neb.addColorStop(1, rgba(th.blocks[5], 0));
        g.fillStyle = neb; g.fillRect(0, 0, w, h);
        for (const s2 of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * s2.f + s2.ph))) * a})`; g.fillRect(s2.x * w, s2.y * h, s2.s, s2.s); }
        const [hx, hy] = head(), x = hx * w, y = hy * h, L = M * 0.55;
        g.save(); g.globalCompositeOperation = 'lighter';
        for (const p of dust) { g.fillStyle = rgba(p.c, 0.5 * (1 - p.life) * a); g.fillRect(p.x * w, p.y * h, 2, 2); }
        g.translate(x, y); g.rotate(Math.atan2(0.2 * h, -1.3 * w) + Math.PI); // the tail points away from where it is heading
        for (const [wd, al, col] of [[0.16, 0.18, th.accent], [0.07, 0.35, '#ffffff'], [0.22, 0.08, th.blocks[6]]]) {
          const gr = g.createLinearGradient(0, 0, -L, 0); gr.addColorStop(0, rgba(col, al * a)); gr.addColorStop(1, rgba(col, 0));
          g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(-L, -L * wd); g.lineTo(-L, L * wd); g.closePath(); g.fill();
        }
        g.restore();
        const gl = g.createRadialGradient(x, y, 0, x, y, u * 0.08); gl.addColorStop(0, `rgba(255,255,255,${0.95 * a})`); gl.addColorStop(0.3, rgba(th.accent, 0.6 * a)); gl.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gl; g.fillRect(x - u * 0.08, y - u * 0.08, u * 0.16, u * 0.16);
        if (met) {
          const k = met.life, mx = (met.x - k * 0.25) * w, my = (met.y + k * 0.18) * h, len = u * 0.15;
          const gr = g.createLinearGradient(mx, my, mx + len, my - len * 0.72); gr.addColorStop(0, `rgba(255,255,255,${(1 - k) * a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
          g.strokeStyle = gr; g.lineWidth = 2; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + len, my - len * 0.72); g.stroke();
        }
      },
    };
  },
});

Object.assign(KITS, (S => ({
  mosaic: { // stone tiles set down one by one, a brush sweeping the dust
    pick() { S.knock(2200, { vol: 0.04 }); },
    place() { S.knock(900, { vol: 0.16 }); S.knock(1200, { vol: 0.1, when: 0.04 }); S.thud({ vol: 0.12, f: 140 }); },
    clear(n) { for (let i = 0; i < n * 3 + 4; i++) S.knock(rand(900, 1600), { when: i * 0.035 + Math.random() * 0.02, vol: 0.07 }); S.hissL({ dur: 0.5, vol: 0.05, type: 'bandpass', freq: 2500, to: 1200, q: 0.8, when: 0.1 }); },
    deal() { for (let i = 0; i < 3; i++) S.knock(1400 + i * 150, { vol: 0.04, when: i * 0.05 }); },
  },
  comet: { // shimmering ice and a whoosh as the comet passes
    pick() { S.tink(3600, { vol: 0.03, dur: 0.3 }); },
    place() { S.thud({ vol: 0.15, f: 140 }); S.tone(S.snd.root * 0.5, { dur: 0.35, vol: 0.04, to: S.snd.root, wet: true }); },
    clear(n) {
      for (let i = 0; i < n + 4; i++) S.tink(S.snd.root * 2 * Math.pow(2, [0, 4, 7, 11, 12, 16, 19, 23][i % 8] / 12), { when: i * 0.06, vol: 0.04, dur: 0.6 });
      S.hissL({ dur: 0.9, vol: 0.07, type: 'bandpass', freq: 300, to: 4000, q: 0.7 });
    },
    deal() { S.tink(3200, { vol: 0.03, dur: 0.4 }); S.tink(4200, { vol: 0.02, dur: 0.3, when: 0.06 }); },
  },
}))(Sfx));

/* ---------- Zen collection: shapes shared by blocks, backgrounds and particles ---------- */
// eight-pointed star (two squares at 45°), the heart of zellige tilework
function star8(g, x, y, r) {
  g.beginPath();
  for (let i = 0; i < 16; i++) {
    const an = i * Math.PI / 8 - Math.PI / 2, rad = i % 2 ? r * 0.765 : r;
    i ? g.lineTo(x + Math.cos(an) * rad, y + Math.sin(an) * rad) : g.moveTo(x + Math.cos(an) * rad, y + Math.sin(an) * rad);
  }
  g.closePath();
}
// four ovals round a centre, the kawung motif of Javanese batik (filled with the current fillStyle)
function kawung(g, x, y, r) {
  for (let i = 0; i < 4; i++) {
    const an = Math.PI / 4 + i * Math.PI / 2;
    g.beginPath(); g.ellipse(x + Math.cos(an) * r * 0.5, y + Math.sin(an) * r * 0.5, r * 0.46, r * 0.26, an, 0, Math.PI * 2); g.fill();
  }
}
// a Greek key running along a strip (path only, stroked by the caller)
function meander(g, x, y, w, h) {
  g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + w, y + h);
  for (let x0 = x; x0 < x + w - h * 0.2; x0 += h) {
    [[0, 1], [0, 0], [0.8, 0], [0.8, 0.68], [0.32, 0.68], [0.32, 0.34], [0.56, 0.34]].forEach(([px, py], i) => i ? g.lineTo(x0 + px * h, y + py * h) : g.moveTo(x0 + px * h, y + py * h));
  }
}
// a papel picado flag: zigzag hem and cut-out holes (fill with 'evenodd')
function papelPath(g, x, y, fw, fh) {
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + fw, y); g.lineTo(x + fw, y + fh * 0.82);
  for (let i = 5; i >= 0; i--) g.lineTo(x + fw * i / 6, y + fh * (i % 2 ? 1 : 0.82));
  g.closePath();
  const cx = x + fw / 2, cy = y + fh * 0.42, r = fw * 0.16;
  g.moveTo(cx, cy - r); g.lineTo(cx + r, cy); g.lineTo(cx, cy + r); g.lineTo(cx - r, cy); g.closePath();
  for (const dx of [-0.32, 0.32]) { g.moveTo(cx + dx * fw + fw * 0.06, cy); g.arc(cx + dx * fw, cy, fw * 0.06, 0, Math.PI * 2); }
}
// a hand-painted Puebla flower: four petals, leaves on the diagonals, quarter circles in the corners, a yellow eye
function talaveraFlower(g, s, col, eye) {
  const cx = s / 2, cy = s / 2;
  g.fillStyle = col;
  for (let i = 0; i < 4; i++) {
    g.save(); g.translate(cx, cy); g.rotate(i * Math.PI / 2);
    g.beginPath(); g.ellipse(0, -s * 0.16, s * 0.085, s * 0.14, 0, 0, Math.PI * 2); g.fill();
    g.rotate(Math.PI / 4); g.beginPath(); g.ellipse(0, -s * 0.27, s * 0.035, s * 0.07, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s]]) { g.beginPath(); g.arc(x, y, s * 0.14, 0, Math.PI * 2); g.fill(); }
  g.beginPath(); g.arc(cx, cy, s * 0.065, 0, Math.PI * 2); g.fillStyle = eye; g.fill();
}
const paleHex = c => { const [r, g, b] = hexRgb(c); return r + g + b > 560; }; // a light block colour needs dark ornament
// soft bands of mist drifting slowly sideways; rgb is "r,g,b"
function mistBands(g, w, h, a, t, ys, rgb) {
  ys.forEach((yf, i) => {
    const y = h * yf, off = Math.sin(t * 0.1 + i * 2) * w * 0.15, gr = g.createLinearGradient(0, y - h * 0.06, 0, y + h * 0.06);
    gr.addColorStop(0, `rgba(${rgb},0)`); gr.addColorStop(0.5, `rgba(${rgb},${0.1 * a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(off - w * 0.2, y - h * 0.06, w * 1.4, h * 0.12);
  });
}

/* ---------- Zen collection: block looks and textures ---------- */
// a framed tile: dark rim, the block colour, then the theme's texture clipped inside
function framedTile(g, s, c, style, r = 0.08) {
  rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * r); g.fillStyle = shade(c, -0.45); g.fill();
  rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * r * 0.9); g.fillStyle = c; g.fill();
  g.save(); g.clip(); TEX[style](g, s, c, seeded(c), 1); g.restore();
}
Object.assign(STYLES, {
  zellige: { // a glazed tile set in cream mortar, an eight-pointed star cut into it
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.08); g.fillStyle = '#d8ccb0'; g.fill();
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, shade(c, 0.25)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.2));
      rr(g, s * 0.07, s * 0.07, s * 0.86, s * 0.86, s * 0.06); g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.zellige(g, s, c, seeded(c), 1); g.restore();
    },
  },
  bojagi: { // patches of translucent silk sewn together
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.globalAlpha = 0.92; g.fillStyle = mixHex(c, '#ffffff', 0.15); g.fill(); g.globalAlpha = 1;
      g.save(); g.clip(); TEX.bojagi(g, s, c, seeded(c), 1); g.restore();
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.strokeStyle = shade(c, -0.25); g.lineWidth = Math.max(1, s * 0.025); g.stroke();
    },
  },
  rangoli: { // a soft mound of coloured powder with a flower laid out in white dots
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.22); g.fillStyle = shade(c, -0.3); g.fill();
      const gr = g.createRadialGradient(s * 0.42, s * 0.38, s * 0.03, s * 0.5, s * 0.5, s * 0.6);
      gr.addColorStop(0, shade(c, 0.25)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.1));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.2); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'rangoli', 1, 0.07, 0.2);
    },
  },
  kente: { block(g, s, c) { framedTile(g, s, c, 'kente', 0.06); } }, // a strip of woven kente cloth
  talavera: { // a glazed white tile with a flower painted in the block colour
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08); g.fillStyle = shade(c, -0.45); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.07); g.fillStyle = '#fbf6ea'; g.fill();
      g.save(); g.clip();
      talaveraFlower(g, s, c, '#f0b020');
      g.strokeStyle = c; g.lineWidth = Math.max(1, s * 0.03); g.strokeRect(s * 0.13, s * 0.12, s * 0.74, s * 0.74);
      softGlint(g, s * 0.3, s * 0.26, s * 0.22, 0.6);
      g.restore();
    },
  },
  andean: { block(g, s, c) { framedTile(g, s, c, 'andean', 0.1); } }, // Andean weaving with a stepped diamond
  batik: { block(g, s, c) { framedTile(g, s, c, 'batik', 0.12); } },   // wax-resist cloth with the kawung motif
  cycladic: { // a whitewashed, rounded tile like a Cycladic wall, painted in the block colour
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.07, s * 0.9, s * 0.9, s * 0.18); g.fillStyle = shade(c, -0.28); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.25)); gr.addColorStop(1, c);
      rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.88, s * 0.18); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'cycladic', 1, 0.05, 0.18);
    },
  },
  carpet: { block(g, s, c) { framedTile(g, s, c, 'carpet', 0.06); } }, // a square of hand-knotted Persian carpet
  inkwash: { // a square of rice paper soaked with ink in the block colour
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.05, s * 0.92, s * 0.92, s * 0.05); g.fillStyle = 'rgba(0,0,0,.18)'; g.fill();
      rr(g, s * 0.04, s * 0.03, s * 0.92, s * 0.92, s * 0.05); g.fillStyle = '#f4efe2'; g.fill();
      g.save(); g.clip();
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, rgba(c, 0.95)); gr.addColorStop(1, rgba(c, 0.62));
      g.fillStyle = gr; g.fillRect(s * 0.08, s * 0.08, s * 0.84, s * 0.84);
      TEX.inkwash(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  zellige(g, s, c, rnd, k) { // a pale star in the glaze, mortar lines out to the corners, an uneven shine
    star8(g, s * 0.5, s * 0.5, s * 0.34); g.fillStyle = rgba(hexOf(mixHex(c, '#ffffff', 0.5)), 0.45 * k); g.fill();
    g.strokeStyle = `rgba(232,224,204,${0.8 * k})`; g.lineWidth = Math.max(1, s * 0.028); g.stroke();
    g.beginPath(); for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s]]) { g.moveTo(x, y); g.lineTo(s * 0.5 + (x - s * 0.5) * 0.48, s * 0.5 + (y - s * 0.5) * 0.48); } g.stroke();
    speckle(g, s, rnd, 12, 0.006, 0.016, () => `rgba(255,255,255,${0.22 * k})`);
    softGlint(g, s * 0.3, s * 0.27, s * 0.22, 0.45 * k);
  },
  bojagi(g, s, c, rnd, k) { // three patches of silk in slightly different shades, the seams stitched and showing
    const x0 = s * (0.3 + rnd() * 0.4), y0 = s * (0.3 + rnd() * 0.4);
    g.fillStyle = `rgba(255,255,255,${0.2 * k})`; g.fillRect(0, 0, x0, s);
    g.fillStyle = `rgba(0,0,0,${0.06 * k})`; g.fillRect(x0, 0, s - x0, y0);
    g.fillStyle = `rgba(255,255,255,${0.36 * k})`; g.fillRect(x0, y0, s - x0, s - y0);
    const seam = (x1, y1, x2, y2) => {
      g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2);
      g.strokeStyle = `rgba(255,255,255,${0.75 * k})`; g.lineWidth = Math.max(1.2, s * 0.035); g.stroke();
      g.strokeStyle = `rgba(0,0,0,${0.14 * k})`; g.lineWidth = Math.max(0.6, s * 0.01); g.setLineDash([s * 0.035, s * 0.03]); g.stroke(); g.setLineDash([]);
    };
    seam(x0, 0, x0, s); seam(x0, y0, s, y0);
    const sh = g.createLinearGradient(0, 0, s, s); sh.addColorStop(0, `rgba(255,255,255,${0.25 * k})`); sh.addColorStop(0.5, 'rgba(255,255,255,0)'); sh.addColorStop(1, `rgba(255,255,255,${0.12 * k})`);
    g.fillStyle = sh; g.fillRect(0, 0, s, s);
  },
  rangoli(g, s, c, rnd, k) { // powder grain and a flower of eight petals drawn in dotted white lines
    speckle(g, s, rnd, 50, 0.003, 0.009, () => rnd() < 0.5 ? `rgba(255,255,255,${0.22 * k})` : `rgba(0,0,0,${0.18 * k})`);
    const cx = s / 2, cy = s / 2;
    g.save(); g.lineCap = 'round'; g.setLineDash([0.1, s * 0.05]); g.lineWidth = Math.max(1.2, s * 0.035); g.strokeStyle = `rgba(255,250,235,${0.9 * k})`;
    for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4; g.beginPath(); g.ellipse(cx + Math.cos(an) * s * 0.2, cy + Math.sin(an) * s * 0.2, s * 0.12, s * 0.055, an, 0, Math.PI * 2); g.stroke(); }
    g.beginPath(); g.arc(cx, cy, s * 0.4, 0, Math.PI * 2); g.stroke();
    g.restore();
    g.beginPath(); g.arc(cx, cy, s * 0.07, 0, Math.PI * 2); g.fillStyle = `rgba(255,250,235,${0.95 * k})`; g.fill();
  },
  kente(g, s, c, rnd, k) { // a dark band with a zigzag, thin stripes, check rows and the warp showing through
    const acc = c === '#e8b818' ? '#2a9a3a' : '#f0c020', q = s / 8;
    g.fillStyle = `rgba(16,12,4,${0.78 * k})`; g.fillRect(0, s * 0.38, s, s * 0.24);
    g.strokeStyle = rgba(acc, 0.95 * k); g.lineWidth = Math.max(1, s * 0.045); g.lineJoin = 'miter';
    g.beginPath(); for (let j = 0; j <= 8; j++) { const x = j / 8 * s, y = s * (j % 2 ? 0.43 : 0.57); j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.fillStyle = rgba(acc, 0.85 * k); g.fillRect(0, s * 0.29, s, s * 0.035); g.fillRect(0, s * 0.675, s, s * 0.035);
    g.fillStyle = `rgba(16,12,4,${0.55 * k})`;
    for (let i = 0; i < 8; i++) for (const y of [0.06, 0.76]) g.fillRect(i * q, s * y + (i % 2) * q, q, q);
    g.strokeStyle = `rgba(0,0,0,${0.1 * k})`; g.lineWidth = 1; g.beginPath();
    for (let x = 0; x < s; x += Math.max(2, s / 16)) { g.moveTo(x, 0); g.lineTo(x, s); } g.stroke();
  },
  talavera(g, s, c, rnd, k) { talaveraFlower(g, s, `rgba(255,250,235,${0.85 * k})`, `rgba(240,176,32,${0.95 * k})`); },
  andean(g, s, c, rnd, k) { // a stepped diamond woven in, fringe stripes top and bottom, the weft lines
    const q = s / 10;
    for (let r = 0; r < 10; r++) for (let cc = 0; cc < 10; cc++) {
      const d = Math.abs(cc - 4.5) + Math.abs(r - 4.5);
      if (d < 1.5) g.fillStyle = `rgba(30,10,0,${0.45 * k})`;
      else if (d >= 3 && d < 4) g.fillStyle = `rgba(255,248,230,${0.8 * k})`;
      else if (d >= 5 && d < 6) g.fillStyle = `rgba(30,10,0,${0.3 * k})`;
      else continue;
      g.fillRect(cc * q, r * q, q + 0.5, q + 0.5);
    }
    g.fillStyle = `rgba(255,248,230,${0.5 * k})`; g.fillRect(0, s * 0.06, s, Math.max(1, s * 0.03)); g.fillRect(0, s * 0.91, s, Math.max(1, s * 0.03));
    g.fillStyle = `rgba(0,0,0,${0.07 * k})`; for (let y = 0; y < s; y += Math.max(2, s / 18)) g.fillRect(0, y, s, 1);
  },
  batik(g, s, c, rnd, k) { // kawung ovals left pale by the wax, dots inside, fine cracks where the wax broke
    g.fillStyle = `rgba(255,240,210,${0.55 * k})`;
    kawung(g, s * 0.5, s * 0.5, s * 0.36);
    for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s]]) kawung(g, x, y, s * 0.36);
    g.fillStyle = `rgba(40,20,5,${0.45 * k})`;
    for (let i = 0; i < 4; i++) { const an = Math.PI / 4 + i * Math.PI / 2; g.beginPath(); g.arc(s * 0.5 + Math.cos(an) * s * 0.18, s * 0.5 + Math.sin(an) * s * 0.18, s * 0.03, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = `rgba(40,20,5,${0.35 * k})`; g.lineWidth = Math.max(0.7, s * 0.01);
    for (let i = 0; i < 4; i++) {
      let x = rnd() * s, y = rnd() * s; g.beginPath(); g.moveTo(x, y);
      for (let j = 0; j < 5; j++) { x += (rnd() - 0.5) * s * 0.3; y += (rnd() - 0.5) * s * 0.3; g.lineTo(x, y); }
      g.stroke();
    }
  },
  cycladic(g, s, c, rnd, k) { // whitewash grain, a Greek key along the bottom, sun on the plaster
    speckle(g, s, rnd, 30, 0.004, 0.01, () => rnd() < 0.5 ? `rgba(255,255,255,${0.25 * k})` : `rgba(0,0,0,${0.08 * k})`);
    g.strokeStyle = paleHex(c) ? `rgba(30,94,200,${0.85 * k})` : `rgba(255,255,255,${0.85 * k})`; g.lineWidth = Math.max(1, s * 0.03); g.lineJoin = 'miter';
    meander(g, s * 0.1, s * 0.66, s * 0.8, s * 0.17); g.stroke();
    softGlint(g, s * 0.3, s * 0.24, s * 0.24, 0.45 * k);
  },
  carpet(g, s, c, rnd, k) { // the knot grid of the pile, a border, a dotted inner border and a medallion
    const lt = paleHex(c) ? '#1e2a5a' : '#f6ecd4', au = c === '#e8c06a' ? '#b8283e' : '#e8c06a', q = s / 14;
    g.fillStyle = `rgba(0,0,0,${0.08 * k})`;
    for (let y = 0; y < 14; y++) for (let x = y % 2; x < 14; x += 2) g.fillRect(x * q, y * q, q, q);
    g.strokeStyle = rgba(lt, 0.7 * k); g.lineWidth = Math.max(1, s * 0.03); g.strokeRect(s * 0.12, s * 0.12, s * 0.76, s * 0.76);
    g.setLineDash([Math.max(1, s * 0.03), Math.max(1, s * 0.03)]); g.lineWidth = Math.max(1, s * 0.02); g.strokeStyle = rgba(au, 0.75 * k);
    g.strokeRect(s * 0.19, s * 0.19, s * 0.62, s * 0.62); g.setLineDash([]);
    poly(g, [[s * 0.5, s * 0.27], [s * 0.73, s * 0.5], [s * 0.5, s * 0.73], [s * 0.27, s * 0.5]], rgba(au, 0.85 * k));
    rosette(g, s * 0.5, s * 0.5, s * 0.13, rgba(lt, 0.85 * k), rgba(c, 1));
  },
  inkwash(g, s, c, rnd, k) { // darker pools in the wet ink, dry-brush streaks at the edges, sometimes a red seal
    for (let i = 0; i < 3; i++) {
      const x = rnd() * s, y = rnd() * s, r = s * (0.2 + rnd() * 0.25), gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, `rgba(10,10,8,${0.22 * k})`); gr.addColorStop(1, 'rgba(10,10,8,0)'); g.fillStyle = gr; g.fillRect(0, 0, s, s);
    }
    for (let i = 0; i < 16; i++) {
      const y = rnd() < 0.5 ? s * (0.04 + rnd() * 0.14) : s * (0.82 + rnd() * 0.14);
      g.fillStyle = `rgba(242,236,220,${(0.35 + rnd() * 0.35) * k})`; g.fillRect(s * rnd() * 0.4, y, s * (0.3 + rnd() * 0.6), Math.max(0.6, s * 0.014));
    }
    if (rnd() < 0.45) {
      rr(g, s * 0.66, s * 0.64, s * 0.2, s * 0.2, s * 0.02); g.fillStyle = `rgba(196,42,34,${0.9 * k})`; g.fill();
      g.strokeStyle = `rgba(255,240,230,${0.85 * k})`; g.lineWidth = Math.max(0.8, s * 0.018);
      g.beginPath(); g.moveTo(s * 0.7, s * 0.69); g.lineTo(s * 0.82, s * 0.69); g.moveTo(s * 0.76, s * 0.67); g.lineTo(s * 0.76, s * 0.82); g.moveTo(s * 0.7, s * 0.78); g.lineTo(s * 0.82, s * 0.78); g.stroke();
    }
  },
});

/* ---------- Zen collection: clear-effect particles ---------- */
Object.assign(PARTS, {
  zillij(p, s) { ctx.rotate(p.rot); star8(ctx, 0, 0, s * 0.6); ctx.fillStyle = p.color; ctx.fill(); ctx.lineWidth = Math.max(1, s * 0.1); ctx.strokeStyle = '#efe6d2'; ctx.stroke(); },
  silk(p, s) {
    ctx.rotate(p.rot * 0.4); ctx.scale(1, 0.25 + 0.75 * Math.abs(Math.sin(p.life * 5 + p.ph))); ctx.globalAlpha *= 0.85;
    ctx.fillStyle = mixHex(p.color, '#ffffff', 0.25); ctx.fillRect(-s * 0.55, -s * 0.45, s * 1.1, s * 0.9);
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = Math.max(1, s * 0.06); ctx.strokeRect(-s * 0.55, -s * 0.45, s * 1.1, s * 0.9);
  },
  powder(p, s, k) { const r = p.size * (0.5 + (1 - k) * 1.6), gr = ctx.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, rgba(p.color, 0.7)); gr.addColorStop(1, rgba(p.color, 0)); ctx.fillStyle = gr; ctx.fillRect(-r, -r, 2 * r, 2 * r); },
  thread(p, s) {
    const wv = s * 0.4 * Math.sin(p.life * 8 + p.ph);
    ctx.rotate(p.rot); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.2, s * 0.2); ctx.strokeStyle = p.color;
    ctx.beginPath(); ctx.moveTo(-s * 0.8, 0); ctx.quadraticCurveTo(-s * 0.4, -wv, 0, 0); ctx.quadraticCurveTo(s * 0.4, wv, s * 0.8, 0); ctx.stroke();
  },
  flag(p, s) { ctx.rotate(p.rot * 0.4); ctx.scale(1, 0.3 + 0.7 * Math.abs(Math.sin(p.life * 6 + p.ph))); papelPath(ctx, -s * 0.5, -s * 0.55, s, s * 1.1); ctx.fillStyle = p.color; ctx.fill('evenodd'); },
  wool(p, s) { ctx.fillStyle = mixHex(p.color, '#ffffff', 0.2); for (let i = 0; i < 6; i++) { const an = i * 1.05 + p.ph; ctx.beginPath(); ctx.arc(Math.cos(an) * s * 0.25, Math.sin(an) * s * 0.25, s * 0.28, 0, Math.PI * 2); ctx.fill(); } },
  inkdrop(p, s) {
    ctx.fillStyle = mixHex(p.color, '#141210', 0.55);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 4; i++) { const an = p.ph + i * 1.7, d = s * (i % 2 ? 0.8 : 0.62); ctx.beginPath(); ctx.arc(Math.cos(an) * d, Math.sin(an) * d, s * 0.1, 0, Math.PI * 2); ctx.fill(); }
  },
});

/* ---------- Zen collection: living backgrounds ---------- */
Object.assign(AMBIENTS, {
  riad(th) { // a riad courtyard at night: star-tiled walls, horseshoe arches, a fountain, brass lanterns
    let wall = null, ww = 0, wh = 0, t = 0, acc = 0, D = [];
    function build(w, h) {
      ww = w; wh = h; wall = document.createElement('canvas'); wall.width = Math.ceil(w); wall.height = Math.ceil(h);
      const g = wall.getContext('2d'), u = Math.min(w, h), q = Math.max(46, u * 0.15);
      g.lineWidth = 1.5; g.strokeStyle = 'rgba(232,224,204,.07)';
      for (let y = 0; y < h + q; y += q) for (let x = 0; x < w + q; x += q) {
        star8(g, x, y, q * 0.42); g.fillStyle = 'rgba(232,184,74,.04)'; g.fill(); g.stroke();
        g.save(); g.translate(x + q / 2, y + q / 2); g.rotate(Math.PI / 4); g.strokeRect(-q * 0.13, -q * 0.13, q * 0.26, q * 0.26); g.restore();
      }
      const ah = h * 0.22, aw = Math.max(70, w / 4.5);
      g.fillStyle = 'rgba(0,0,0,.28)';
      for (let x = aw / 2; x < w + aw; x += aw) {
        g.beginPath(); g.moveTo(x - aw * 0.36, h); g.lineTo(x - aw * 0.36, h - ah * 0.55);
        g.arc(x, h - ah * 0.55, aw * 0.4, Math.PI * 0.85, Math.PI * 2.15); g.lineTo(x + aw * 0.36, h); g.closePath(); g.fill();
      }
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        while (acc > 0.04) { acc -= 0.04; if (!REDUCED || Math.random() < 0.3) D.push({ x: 0, y: 0, vx: rand(-0.09, 0.09), vy: rand(-0.32, -0.22) }); }
        for (const p of D) { p.vy += 0.9 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
        D = D.filter(p => p.y < 0.02);
      },
      draw(g, w, h, a) {
        if (!wall || Math.abs(w - ww) > 1 || Math.abs(h - wh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(wall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), fx = w / 2, fy = h * 0.95;
        g.beginPath(); g.ellipse(fx, fy, u * 0.2, u * 0.035, 0, 0, Math.PI * 2); g.fillStyle = `rgba(40,150,150,${0.35 * a})`; g.fill();
        g.strokeStyle = `rgba(232,224,204,${0.35 * a})`; g.lineWidth = 2; g.stroke();
        g.fillStyle = `rgba(180,240,235,${0.6 * a})`;
        for (const p of D) g.fillRect(fx + p.x * u, fy - u * 0.02 + p.y * u, 2, 2);
        for (const [lx, ph] of [[0.12, 0], [0.88, 2]]) {
          const x = lx * w, y = h * 0.12 + Math.sin(t * 0.9 + ph) * 3, r = u * 0.035, fl = 0.85 + 0.15 * Math.sin(t * 9 + ph) * Math.sin(t * 5.3);
          g.strokeStyle = `rgba(200,160,90,${0.5 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, y - r); g.stroke();
          const gl = g.createRadialGradient(x, y, 0, x, y, u * 0.3 * fl); gl.addColorStop(0, rgba(th.accent, 0.3 * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - u * 0.3, y - u * 0.3, u * 0.6, u * 0.6);
          star8(g, x, y, r); g.fillStyle = `rgba(255,210,120,${0.85 * fl * a})`; g.fill(); g.strokeStyle = `rgba(120,80,30,${0.8 * a})`; g.lineWidth = 1.5; g.stroke();
        }
      },
    };
  },
  hanok(th) { // the curved eave of a hanok, bojagi cloths swaying on a line, plum blossoms drifting
    let t = 0;
    const CL = [...Array(6)].map((_, i) => ({ c: th.blocks[(i * 3) % 7], c2: th.blocks[(i * 3 + 2) % 7], ph: rand(0, 6.3), s: rand(0.85, 1.15), sx: rand(0.35, 0.65) }));
    const PE = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.02, 0.05), rot: rand(0, 6.3), vr: rand(-1.2, 1.2), ph: rand(0, 6.3) }));
    return {
      step(dt) { t += dt; for (const p of PE) { p.y += p.v * dt; p.x += Math.sin(t * 0.7 + p.ph) * 0.012 * dt; p.rot += p.vr * dt; if (p.y > 1.04) { p.y = -0.04; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), eave = x => h * (0.03 + 0.06 * Math.sin(x / w * Math.PI)); // lowest in the middle, lifting at both ends
        g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); for (let x = w; x >= 0; x -= 10) g.lineTo(x, eave(x)); g.closePath();
        g.fillStyle = `rgba(58,52,64,${0.6 * a})`; g.fill();
        g.strokeStyle = `rgba(255,255,255,${0.25 * a})`; g.lineWidth = 1.5; g.beginPath();
        for (let x = 6; x < w; x += u * 0.03) { g.moveTo(x, eave(x) - u * 0.04); g.lineTo(x, eave(x)); } g.stroke(); // roof tile ends
        const ly = x => h * 0.2 + Math.sin(x / w * Math.PI) * h * 0.03;
        g.strokeStyle = `rgba(80,60,60,${0.45 * a})`; g.lineWidth = 1.2; g.beginPath();
        for (let x = 0; x <= w; x += 10) x ? g.lineTo(x, ly(x)) : g.moveTo(0, ly(0)); g.stroke();
        CL.forEach((c, i) => {
          const x = (i + 0.5) / CL.length * w, cw = u * 0.12 * c.s, ch = cw * 1.15, sx = -cw / 2 + cw * c.sx;
          g.save(); g.translate(x, ly(x)); g.rotate(Math.sin(t * 0.8 + c.ph) * 0.07);
          g.fillStyle = rgba(c.c, 0.32 * a); g.fillRect(-cw / 2, 0, cw, ch);
          g.fillStyle = rgba(c.c2, 0.3 * a); g.fillRect(sx, ch * 0.45, cw / 2 - sx, ch * 0.55);
          g.strokeStyle = `rgba(255,255,255,${0.6 * a})`; g.lineWidth = 1.2; g.strokeRect(-cw / 2, 0, cw, ch);
          g.beginPath(); g.moveTo(sx, ch * 0.45); g.lineTo(sx, ch); g.moveTo(-cw / 2, ch * 0.45); g.lineTo(cw / 2, ch * 0.45); g.stroke();
          g.fillStyle = `rgba(80,60,60,${0.6 * a})`; g.fillRect(-1.5, -3, 3, 5);
          g.restore();
        });
        for (const p of PE) { // plum blossoms: five round petals and a dark heart
          const r = u * 0.008;
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(p.rot); g.fillStyle = `rgba(255,214,226,${0.85 * a})`;
          for (let k = 0; k < 5; k++) { const an = k * Math.PI * 0.4; g.beginPath(); g.arc(Math.cos(an) * r, Math.sin(an) * r, r * 0.8, 0, Math.PI * 2); g.fill(); }
          g.fillStyle = `rgba(200,58,90,${0.8 * a})`; g.beginPath(); g.arc(0, 0, r * 0.45, 0, Math.PI * 2); g.fill(); g.restore();
        }
      },
    };
  },
  diya(th) { // a great rangoli on the floor turning very slowly, clay lamps flickering in a row, marigold petals falling
    let man = null, mu = 0, t = 0;
    const MG = [...Array(28)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.03, 0.06), ph: rand(0, 6.3), c: Math.random() < 0.6 ? '#ff9a1a' : '#ffd83a' }));
    function build(u) {
      mu = u; const S = Math.ceil(u * 1.3); man = document.createElement('canvas'); man.width = man.height = S;
      const g = man.getContext('2d'), c = S / 2;
      for (let ring = 6; ring >= 1; ring--) {
        const n = 6 + ring * 4, R = S * 0.075 * ring, col = th.blocks[ring % 7];
        for (let i = 0; i < n; i++) {
          const an = i / n * Math.PI * 2 + ring * 0.3;
          g.save(); g.translate(c + Math.cos(an) * R, c + Math.sin(an) * R); g.rotate(an);
          g.beginPath(); g.ellipse(0, 0, S * 0.035, S * 0.016 * (1 + ring * 0.15), 0, 0, Math.PI * 2); g.fillStyle = rgba(col, 0.22); g.fill(); g.restore();
        }
        g.setLineDash([0.1, S * 0.012]); g.lineCap = 'round'; g.lineWidth = S * 0.006; g.strokeStyle = 'rgba(255,250,235,.16)';
        g.beginPath(); g.arc(c, c, R + S * 0.035, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
      }
      g.beginPath(); g.arc(c, c, S * 0.045, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.3); g.fill();
    }
    return {
      step(dt) { t += dt; for (const m of MG) { m.y += m.v * dt; m.ph += dt * 2; if (m.y > 1.04) { m.y = -0.04; m.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        if (!man || Math.abs(u - mu) > 1) build(u);
        const S = man.width;
        g.save(); g.globalAlpha = a; g.translate(w / 2, h * 0.5); g.rotate(t * 0.015); g.drawImage(man, -S / 2, -S / 2); g.restore();
        const n = Math.max(5, Math.round(w / 70));
        for (let i = 0; i < n; i++) {
          const x = (i + 0.5) / n * w, y = h * 0.97, fl = 0.8 + 0.2 * Math.sin(t * 10 + i * 1.9) * Math.sin(t * 6.1 + i);
          const gl = g.createRadialGradient(x, y - u * 0.03, 0, x, y - u * 0.03, u * 0.12 * fl); gl.addColorStop(0, rgba(th.accent, 0.35 * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - u * 0.12, y - u * 0.15, u * 0.24, u * 0.24);
          g.beginPath(); g.moveTo(x - u * 0.03, y - u * 0.012); g.quadraticCurveTo(x, y + u * 0.02, x + u * 0.03, y - u * 0.012); g.closePath(); g.fillStyle = `rgba(170,80,40,${0.85 * a})`; g.fill();
          const fh = u * 0.03 * fl;
          g.beginPath(); g.moveTo(x, y - u * 0.012 - fh); g.quadraticCurveTo(x + u * 0.009, y - u * 0.016, x, y - u * 0.01); g.quadraticCurveTo(x - u * 0.009, y - u * 0.016, x, y - u * 0.012 - fh);
          g.fillStyle = `rgba(255,200,90,${0.95 * a})`; g.fill();
        }
        for (const m of MG) { g.beginPath(); g.ellipse((m.x + Math.sin(m.ph) * 0.01) * w, m.y * h, u * 0.009, u * 0.006 * (0.4 + 0.6 * Math.abs(Math.sin(m.ph))), m.ph, 0, Math.PI * 2); g.fillStyle = rgba(m.c, 0.75 * a); g.fill(); }
      },
    };
  },
  loom(th) { // narrow strips of kente coming off the loom one block at a time, warp threads, a shuttle passing
    let t = 0;
    const NS = 5, B = th.blocks, at = m => B[((m % 7) + 7) % 7];
    const seg = (g, x, y, sw, sh, k, i) => { // one block of a strip, in one of three weaves
      const c = at(k * 3 + i * 2), c2 = at(k * 3 + i * 2 + 3), kind = (((k + i) % 3) + 3) % 3;
      g.fillStyle = rgba(c, 0.2); g.fillRect(x, y, sw, sh);
      if (kind === 0) { g.fillStyle = 'rgba(10,8,4,.25)'; for (let j = 1; j < 4; j++) g.fillRect(x, y + sh * j / 4 - sh * 0.03, sw, sh * 0.06); }
      else if (kind === 1) { g.fillStyle = rgba(c2, 0.18); const q = sw / 4; for (let r = 0; r < 4; r++) for (let cc = 0; cc < 4; cc++) if ((r + cc) % 2) g.fillRect(x + cc * q, y + r * sh / 4, q, sh / 4); }
      else {
        g.fillStyle = 'rgba(10,8,4,.3)'; g.fillRect(x, y + sh * 0.3, sw, sh * 0.4);
        g.strokeStyle = rgba(c2, 0.35); g.lineWidth = 2; g.beginPath();
        for (let j = 0; j <= 6; j++) { const px = x + j / 6 * sw, py = y + sh * (j % 2 ? 0.38 : 0.62); j ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.stroke();
      }
    };
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        const u = Math.min(w, h), gap = w / NS, sw = gap * 0.62, sh = sw * 1.1, run = t * u * 0.012, off = run % sh, base = Math.floor(run / sh);
        g.globalAlpha = a * 0.6; // kept faint so the cloth does not compete with the board
        g.strokeStyle = 'rgba(255,240,200,.06)'; g.lineWidth = 1; g.beginPath();
        for (let x = 0; x < w; x += 6) { g.moveTo(x, 0); g.lineTo(x, h); } g.stroke();
        for (let i = 0; i < NS; i++) {
          const x = gap * (i + 0.5) - sw / 2;
          for (let j = -1; j * sh < h + sh; j++) seg(g, x, j * sh + off, sw, sh, j - base + i * 5, i);
        }
        const sx = (0.5 + 0.46 * Math.sin(t * 0.6)) * w, sy = h * 0.05;
        g.fillStyle = 'rgba(200,150,80,.5)'; g.beginPath(); g.ellipse(sx, sy, u * 0.045, u * 0.011, 0, 0, Math.PI * 2); g.fill();
        g.globalAlpha = 1;
      },
    };
  },
  plaza(th) { // strings of papel picado over the square, an adobe arcade, confetti in the air
    let t = 0;
    const CF = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.03, 0.07), rot: rand(0, 6.3), vr: rand(-2, 2), c: th.blocks[(Math.random() * 7) | 0] }));
    return {
      step(dt) { t += dt; for (const p of CF) { p.y += p.v * dt; p.rot += p.vr * dt; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), aw = Math.max(80, w / 4), ah = h * 0.2;
        g.fillStyle = `rgba(200,110,70,${0.18 * a})`; g.fillRect(0, h - ah, w, ah);
        g.fillStyle = `rgba(10,20,50,${0.4 * a})`;
        for (let x = aw / 2; x < w + aw; x += aw) { g.beginPath(); g.moveTo(x - aw * 0.32, h); g.lineTo(x - aw * 0.32, h - ah * 0.5); g.arc(x, h - ah * 0.5, aw * 0.32, Math.PI, 0); g.lineTo(x + aw * 0.32, h); g.closePath(); g.fill(); }
        for (const [y0, sag, n, sh] of [[0.03, 0.04, 9, 0], [0.13, 0.05, 7, 3]]) {
          const ly = x => h * y0 + Math.sin(x / w * Math.PI) * h * sag;
          g.strokeStyle = `rgba(255,255,255,${0.35 * a})`; g.lineWidth = 1; g.beginPath(); for (let x = 0; x <= w; x += 10) x ? g.lineTo(x, ly(x)) : g.moveTo(0, ly(0)); g.stroke();
          for (let i = 0; i < n; i++) {
            const x = (i + 0.5) / n * w, fw = Math.min(w / n * 0.8, u * 0.11);
            g.save(); g.translate(x, ly(x)); g.rotate(Math.sin(t * 1.4 + i * 0.9 + sh) * 0.12); g.scale(1, 0.9 + 0.1 * Math.cos(t * 2 + i));
            papelPath(g, -fw / 2, 0, fw, fw * 1.1); g.fillStyle = rgba(th.blocks[(i + sh) % 7], 0.7 * a); g.fill('evenodd');
            g.restore();
          }
        }
        for (const p of CF) { g.save(); g.translate(p.x * w, p.y * h); g.rotate(p.rot); g.fillStyle = rgba(p.c, 0.7 * a); g.fillRect(-u * 0.006, -u * 0.003, u * 0.012, u * 0.006); g.restore(); }
      },
    };
  },
  terraces(th) { // terraced slopes in the mist, a condor circling, llamas walking along a ledge
    let land = null, lw = 0, lh = 0, t = 0;
    const LL = [0, 1, 2].map(i => ({ x: i * 0.12, s: rand(0.85, 1.1) }));
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d');
      [[0.42, 'rgba(120,90,80,.18)', 0.006, 0.12], [0.56, 'rgba(100,110,70,.26)', 0.009, 0.1], [0.72, 'rgba(70,90,50,.34)', 0.012, 0.08]].forEach(([y0, col, f, amp], L) => {
        const top = x => h * y0 - (Math.sin(x * f + L) * 0.5 + 0.5) * h * amp;
        g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, top(x)); g.lineTo(w, h); g.closePath(); g.fillStyle = col; g.fill();
        g.strokeStyle = 'rgba(255,240,210,.08)'; g.lineWidth = 1.2;
        for (let k = 1; k < 7; k++) { g.beginPath(); for (let x = 0; x <= w + 8; x += 8) { const y = top(x) + k * h * 0.025; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      });
    }
    return {
      step(dt) { t += dt; for (const l of LL) { l.x += 0.012 * dt; if (l.x > 1.15) l.x -= 1.4; } },
      draw(g, w, h, a) {
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        mistBands(g, w, h, a, t, [0.4, 0.55, 0.7], '255,245,235');
        const cx = w * 0.7 + Math.cos(t * 0.15) * w * 0.15, cy = h * 0.15 + Math.sin(t * 0.15) * h * 0.05, cs = u * 0.05, fl = Math.sin(t * 0.8) * 0.08;
        g.fillStyle = `rgba(30,20,16,${0.6 * a})`; g.beginPath(); g.moveTo(cx - cs, cy - cs * (0.25 + fl));
        g.quadraticCurveTo(cx - cs * 0.4, cy - cs * 0.1, cx, cy); g.quadraticCurveTo(cx + cs * 0.4, cy - cs * 0.1, cx + cs, cy - cs * (0.25 + fl));
        g.quadraticCurveTo(cx + cs * 0.4, cy + cs * 0.05, cx, cy + cs * 0.1); g.quadraticCurveTo(cx - cs * 0.4, cy + cs * 0.05, cx - cs, cy - cs * (0.25 + fl)); g.fill();
        const ly = h * 0.9;
        for (const l of LL) { // llamas: body, long neck, ears, legs stepping
          const x = l.x * w, s = u * 0.03 * l.s, st = Math.sin(t * 5 + l.x * 40) * s * 0.18;
          g.fillStyle = g.strokeStyle = `rgba(250,236,214,${0.55 * a})`; g.lineWidth = Math.max(1.5, s * 0.16); g.lineCap = 'round';
          g.beginPath(); g.ellipse(x, ly - s * 1.1, s * 0.75, s * 0.42, 0, 0, Math.PI * 2); g.fill();
          g.fillRect(x + s * 0.45, ly - s * 2.4, s * 0.26, s * 1.3);
          g.beginPath(); g.ellipse(x + s * 0.68, ly - s * 2.42, s * 0.3, s * 0.15, 0, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.moveTo(x + s * 0.52, ly - s * 2.5); g.lineTo(x + s * 0.5, ly - s * 2.85); g.moveTo(x + s * 0.64, ly - s * 2.5); g.lineTo(x + s * 0.66, ly - s * 2.85);
          for (const [lx, sg] of [[-0.5, 1], [-0.3, -1], [0.35, -1], [0.55, 1]]) { g.moveTo(x + lx * s, ly - s * 0.8); g.lineTo(x + lx * s + st * sg, ly); }
          g.stroke(); g.lineCap = 'butt';
        }
      },
    };
  },
  paddy(th) { // rice terraces holding water at dawn, a stupa on the far hill, mist, egrets crossing
    let land = null, lw = 0, lh = 0, t = 0;
    const EG = [...Array(3)].map(() => ({ x: Math.random(), y: rand(0.1, 0.3), v: rand(0.02, 0.035), ph: rand(0, 6.3) }));
    const bend = (x, w, h, k) => Math.sin(x / w * Math.PI * 1.3 + k * 0.6) * h * 0.02;
    const hill = (x, w, h) => h * (0.46 - 0.08 * Math.sin(x / w * Math.PI));
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d'), u = Math.min(w, h);
      g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, hill(x, w, h)); g.lineTo(w, h); g.closePath(); g.fillStyle = 'rgba(70,50,36,.3)'; g.fill();
      const sx = w * 0.62, sy = hill(sx, w, h), su = u * 0.05; // a bell-shaped stupa on stepped platforms
      g.fillStyle = 'rgba(60,42,30,.45)';
      for (let i = 0; i < 3; i++) g.fillRect(sx - su * (1.6 - i * 0.35), sy - su * 0.3 * (i + 1), su * 2 * (1.6 - i * 0.35), su * 0.3);
      g.beginPath(); g.arc(sx, sy - su * 0.9, su * 0.6, Math.PI, 0); g.fill(); g.fillRect(sx - su * 0.08, sy - su * 2, su * 0.16, su * 0.6);
      for (let k = 0; k < 9; k++) {
        const y0 = h * (0.56 + k * 0.05), y1 = y0 + h * 0.05;
        g.beginPath(); for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, y0 + bend(x, w, h, k)); for (let x = w + 8; x >= 0; x -= 8) g.lineTo(x, y1 + bend(x, w, h, k + 1)); g.closePath();
        g.fillStyle = k % 2 ? 'rgba(220,190,140,.12)' : 'rgba(90,150,60,.22)'; g.fill();
        g.strokeStyle = 'rgba(30,20,10,.25)'; g.lineWidth = 1.5; g.beginPath(); for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, y0 + bend(x, w, h, k)); g.stroke();
      }
    }
    return {
      step(dt) { t += dt; for (const e of EG) { e.x += e.v * dt; e.ph += dt * 5; if (e.x > 1.1) { e.x = -0.1; e.y = rand(0.1, 0.3); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const sun = g.createRadialGradient(w * 0.8, h * 0.3, 0, w * 0.8, h * 0.3, u * 0.6); sun.addColorStop(0, rgba(th.accent, 0.3 * a)); sun.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = sun; g.fillRect(0, 0, w, h);
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        g.strokeStyle = `rgba(255,230,180,${0.35 * a})`; g.lineWidth = 1.5; g.beginPath(); // light on the flooded terraces
        for (let k = 1; k < 9; k += 2) for (let i = 0; i < 4; i++) {
          const x = ((i * 0.27 + k * 0.13 + t * 0.01) % 1) * w, y = h * (0.585 + k * 0.05) + bend(x, w, h, k), l = u * 0.04 * (0.6 + 0.4 * Math.sin(t + i + k));
          g.moveTo(x - l, y); g.lineTo(x + l, y);
        }
        g.stroke();
        mistBands(g, w, h, a, t, [0.5, 0.62], '255,240,220');
        g.strokeStyle = `rgba(255,255,250,${0.75 * a})`; g.lineWidth = 2;
        for (const e of EG) { // egrets: white, slow wing beats
          const x = e.x * w, y = e.y * h, bs = u * 0.022, f = Math.sin(e.ph) * 0.5 + 0.5;
          g.beginPath(); g.moveTo(x - bs, y - bs * 0.4 * f); g.quadraticCurveTo(x - bs * 0.45, y - bs * 0.7 * f, x, y); g.quadraticCurveTo(x + bs * 0.45, y - bs * 0.7 * f, x + bs, y - bs * 0.4 * f); g.stroke();
        }
      },
    };
  },
  caldera(th) { // the caldera at sunset: white houses and blue domes on the cliff, a windmill, the sea and a sail
    let cliff = null, cw = 0, ch = 0, t = 0, bx0 = 0.5;
    function build(w, h) {
      cw = w; ch = h; cliff = document.createElement('canvas'); cliff.width = Math.ceil(w); cliff.height = Math.ceil(h);
      const g = cliff.getContext('2d'), u = Math.min(w, h), edge = y => w * (0.06 + 0.3 * Math.max(0, (y - h * 0.26) / (h * 0.5)));
      g.beginPath(); g.moveTo(0, h * 0.24); for (let y = h * 0.24; y <= h; y += 10) g.lineTo(edge(y) + Math.sin(y * 0.05) * u * 0.01, y); g.lineTo(0, h); g.closePath();
      g.fillStyle = 'rgba(160,100,80,.4)'; g.fill();
      const H = [];
      for (let i = 0; i < 40; i++) { const y = h * (0.26 + Math.random() * 0.36); H.push({ y, x: Math.random() * edge(y) * 0.9 }); }
      H.sort((p, q) => p.y - q.y);
      for (const p of H) { // whitewashed cubes, a shaded side, a blue door, now and then a blue dome
        const hw = u * rand(0.03, 0.05), hh = hw * rand(0.6, 0.9);
        g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(p.x, p.y - hh, hw, hh);
        g.fillStyle = 'rgba(120,150,190,.35)'; g.fillRect(p.x + hw * 0.75, p.y - hh, hw * 0.25, hh);
        g.fillStyle = 'rgba(30,94,200,.8)'; g.fillRect(p.x + hw * 0.3, p.y - hh * 0.55, hw * 0.18, hh * 0.55);
        if (Math.random() < 0.25) { g.beginPath(); g.arc(p.x + hw / 2, p.y - hh, hw * 0.38, Math.PI, 0); g.fillStyle = 'rgba(30,94,200,.9)'; g.fill(); }
      }
    }
    return {
      step(dt) { t += dt; bx0 += 0.01 * dt; if (bx0 > 1.15) bx0 = 0.3; },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sea = h * 0.6, sx = w * 0.78, sy = h * 0.56;
        const gl = g.createRadialGradient(sx, sy, 0, sx, sy, u * 0.55); gl.addColorStop(0, `rgba(255,190,120,${0.55 * a})`); gl.addColorStop(1, 'rgba(255,190,120,0)');
        g.fillStyle = gl; g.fillRect(0, 0, w, h);
        g.beginPath(); g.arc(sx, sy, u * 0.06, 0, Math.PI * 2); g.fillStyle = `rgba(255,214,150,${0.9 * a})`; g.fill();
        const sg = g.createLinearGradient(0, sea, 0, h); sg.addColorStop(0, `rgba(40,110,170,${0.55 * a})`); sg.addColorStop(1, `rgba(20,70,130,${0.7 * a})`);
        g.fillStyle = sg; g.fillRect(0, sea, w, h - sea);
        g.strokeStyle = `rgba(255,220,170,${0.5 * a})`; g.lineWidth = 2;
        for (let i = 0; i < 8; i++) { const y = sea + (h - sea) * (0.05 + i * 0.12), l = u * (0.04 + i * 0.025) * (0.7 + 0.3 * Math.sin(t * 1.4 + i)); g.beginPath(); g.moveTo(sx - l, y); g.lineTo(sx + l, y); g.stroke(); }
        const bx = bx0 * w, by = sea + (h - sea) * 0.25 + Math.sin(t * 1.2) * 2, bs = u * 0.04;
        g.fillStyle = `rgba(40,40,50,${0.7 * a})`; g.beginPath(); g.moveTo(bx - bs, by); g.lineTo(bx + bs, by); g.lineTo(bx + bs * 0.7, by + bs * 0.3); g.lineTo(bx - bs * 0.7, by + bs * 0.3); g.closePath(); g.fill();
        g.fillStyle = `rgba(255,255,255,${0.85 * a})`; g.beginPath(); g.moveTo(bx, by - bs * 1.6); g.lineTo(bx, by - bs * 0.1); g.lineTo(bx + bs * 0.8, by - bs * 0.1); g.closePath(); g.fill();
        if (!cliff || Math.abs(w - cw) > 1 || Math.abs(h - ch) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(cliff, 0, 0, w, h); g.globalAlpha = 1;
        const mx = w * 0.05, my = h * 0.2, mh = u * 0.1; // the windmill on the cliff top
        g.fillStyle = `rgba(255,255,255,${0.9 * a})`; g.fillRect(mx - mh * 0.2, my, mh * 0.4, mh * 0.6);
        poly(g, [[mx - mh * 0.24, my], [mx, my - mh * 0.25], [mx + mh * 0.24, my]], `rgba(120,80,60,${0.8 * a})`);
        g.save(); g.translate(mx, my - mh * 0.05); g.strokeStyle = `rgba(80,60,50,${0.7 * a})`; g.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
          g.rotate(Math.PI / 3 + (i ? 0 : t * 0.6));
          g.beginPath(); g.moveTo(0, 0); g.lineTo(mh * 0.6, 0); g.stroke();
          poly(g, [[mh * 0.2, 0], [mh * 0.6, 0], [mh * 0.55, mh * 0.12], [mh * 0.22, mh * 0.08]], `rgba(255,255,255,${0.75 * a})`);
        }
        g.restore();
      },
    };
  },
  charbagh(th) { // a Persian garden seen from above: a carpet border, water channels quartering it, cypresses, a fountain, rose petals
    let base = null, bw = 0, bh = 0, t = 0;
    const PE = [...Array(22)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.02, 0.045), rot: rand(0, 6.3), vr: rand(-1, 1), ph: rand(0, 6.3) }));
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h), cx = w / 2, cy = h / 2, ch = u * 0.05, m = u * 0.03, bd = u * 0.05, i0 = m + bd;
      g.strokeStyle = rgba(th.accent, 0.2); g.lineWidth = 2; g.strokeRect(m, m, w - 2 * m, h - 2 * m); g.strokeRect(i0, i0, w - 2 * i0, h - 2 * i0);
      const dm = (x, y) => poly(g, [[x, y - bd * 0.3], [x + bd * 0.3, y], [x, y + bd * 0.3], [x - bd * 0.3, y]], rgba(th.blocks[0], 0.22));
      for (let x = i0; x < w - i0; x += bd) { dm(x, m + bd / 2); dm(x, h - m - bd / 2); }
      for (let y = i0; y < h - i0; y += bd) { dm(m + bd / 2, y); dm(w - m - bd / 2, y); }
      for (let i = 0; i < 220; i++) { // flower beds in the four quarters
        const x = i0 + Math.random() * (w - 2 * i0), y = i0 + Math.random() * (h - 2 * i0);
        if (Math.abs(x - cx) < ch * 2.2 || Math.abs(y - cy) < ch * 2.2) continue;
        g.beginPath(); g.arc(x, y, u * 0.006, 0, Math.PI * 2); g.fillStyle = rgba(th.blocks[(Math.random() * 7) | 0], 0.25); g.fill();
      }
      g.fillStyle = 'rgba(60,150,180,.2)'; g.fillRect(cx - ch / 2, i0, ch, h - 2 * i0); g.fillRect(i0, cy - ch / 2, w - 2 * i0, ch);
      const cyp = (x, y) => { const r = u * 0.014; g.beginPath(); g.moveTo(x, y - r * 2.4); g.quadraticCurveTo(x + r * 1.2, y, x, y + r); g.quadraticCurveTo(x - r * 1.2, y, x, y - r * 2.4); g.fillStyle = 'rgba(20,60,40,.45)'; g.fill(); };
      for (let y = i0 + u * 0.05; y < h - i0; y += u * 0.08) if (Math.abs(y - cy) > ch * 2) { cyp(cx - ch * 1.5, y); cyp(cx + ch * 1.5, y); }
      for (let x = i0 + u * 0.05; x < w - i0; x += u * 0.08) if (Math.abs(x - cx) > ch * 2) { cyp(x, cy - ch * 1.5); cyp(x, cy + ch * 1.5); }
      g.beginPath(); for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4 + Math.PI / 8; i ? g.lineTo(cx + Math.cos(an) * ch * 1.6, cy + Math.sin(an) * ch * 1.6) : g.moveTo(cx + Math.cos(an) * ch * 1.6, cy + Math.sin(an) * ch * 1.6); } g.closePath();
      g.fillStyle = 'rgba(60,150,180,.28)'; g.fill(); g.strokeStyle = rgba(th.accent, 0.3); g.stroke();
    }
    return {
      step(dt) { t += dt; for (const p of PE) { p.y += p.v * dt; p.x += Math.sin(t * 0.8 + p.ph) * 0.01 * dt; p.rot += p.vr * dt; if (p.y > 1.04) { p.y = -0.04; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), cx = w / 2, cy = h / 2, ch = u * 0.05, i0 = u * 0.08;
        g.fillStyle = `rgba(230,250,255,${0.35 * a})`; // light running along the channels, out from the fountain
        for (let k = 0; k < 5; k++) {
          const f = (t * 0.04 + k / 5) % 1;
          for (const [dx, dy, L] of [[0, -1, cy - i0], [0, 1, h - i0 - cy], [-1, 0, cx - i0], [1, 0, w - i0 - cx]]) {
            const d = ch * 1.6 + f * (L - ch * 1.6);
            g.beginPath(); g.ellipse(cx + dx * d, cy + dy * d, dx ? u * 0.018 : ch * 0.18, dy ? u * 0.018 : ch * 0.18, 0, 0, Math.PI * 2); g.fill();
          }
        }
        g.lineWidth = 1.5;
        for (let k = 0; k < 3; k++) { const f = ((t * 0.35 + k / 3) % 1 + 1) % 1; /* t can be negative */ g.beginPath(); g.arc(cx, cy, ch * 1.4 * f, 0, Math.PI * 2); g.strokeStyle = `rgba(230,250,255,${0.4 * (1 - f) * a})`; g.stroke(); }
        for (const p of PE) {
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(p.rot); g.scale(1, 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + p.ph)));
          g.beginPath(); g.ellipse(0, 0, u * 0.009, u * 0.006, 0, 0, Math.PI * 2); g.fillStyle = `rgba(214,60,90,${0.65 * a})`; g.fill(); g.restore();
        }
      },
    };
  },
  shanshui(th) { // ink mountains brushed in one layer at a time, mist between them, a boat on the river, birds, a red seal
    let layers = null, lw = 0, lh = 0, t = 0;
    const BD = [...Array(5)].map(() => ({ x: Math.random(), y: rand(0.08, 0.25), v: rand(0.015, 0.03), ph: rand(0, 6.3) }));
    function build(w, h) {
      lw = w; lh = h; layers = [];
      [[0.36, 0.16, 0.14], [0.5, 0.24, 0.22], [0.64, 0.28, 0.32], [0.8, 0.2, 0.45]].forEach(([y0, ph, ink], L) => {
        const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h);
        const g = c.getContext('2d');
        const P = [...Array(2 + L)].map(() => ({ x: Math.random() * w, hg: ph * h * rand(0.6, 1.2), wd: w * rand(0.15, 0.32) }));
        const top = x => { let y = h * y0; for (const p of P) { const d = (x - p.x) / p.wd; if (Math.abs(d) < 1) y = Math.min(y, h * y0 - p.hg * (1 - d * d) * (0.9 + 0.1 * Math.cos(d * 11))); } return y; };
        g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 6; x += 6) g.lineTo(x, top(x)); g.lineTo(w, h); g.closePath();
        const gr = g.createLinearGradient(0, h * y0 - ph * h * 1.2, 0, h * y0 + h * 0.14); gr.addColorStop(0, `rgba(28,26,22,${ink})`); gr.addColorStop(1, 'rgba(28,26,22,0)');
        g.fillStyle = gr; g.fill();
        g.strokeStyle = `rgba(28,26,22,${Math.min(0.8, ink * 1.6)})`; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 1.8;
        g.beginPath(); let on = false;
        for (let x = 0; x <= w + 6; x += 6) { const y = top(x); if (y < h * y0 - 1) { on ? g.lineTo(x, y) : g.moveTo(x, y); on = true; } else on = false; }
        g.stroke();
        for (let i = 0; i < 30 + L * 10; i++) { // texture strokes running down the slopes
          const x = Math.random() * w, y = top(x); if (y >= h * y0 - 4) continue;
          g.lineWidth = rand(0.8, 2.2); g.beginPath(); g.moveTo(x, y + 2); g.quadraticCurveTo(x + rand(-8, 8), y + rand(8, 18), x + rand(-14, 14), y + rand(16, 34)); g.stroke();
        }
        layers.push(c);
      });
    }
    return {
      step(dt) { t += dt; for (const b of BD) { b.x += b.v * dt; b.ph += dt * 6; if (b.x > 1.1) { b.x = -0.1; b.y = rand(0.08, 0.25); } } },
      draw(g, w, h, a) {
        if (!layers || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        const u = Math.min(w, h), ct = t % 64, fade = REDUCED ? 1 : ct > 58 ? 1 - (ct - 58) / 6 : 1;
        layers.forEach((c, L) => { // far layers first, each painted in from left to right
          const r = REDUCED ? 1 : clamp01((ct - L * 5) / 8); if (r <= 0) return;
          g.save(); g.beginPath(); g.rect(0, 0, w * inOut(r), h); g.clip(); g.globalAlpha = a * fade; g.drawImage(c, 0, 0, w, h); g.restore();
        });
        mistBands(g, w, h, a, t, [0.42, 0.58, 0.74], '250,247,239');
        g.strokeStyle = `rgba(28,26,22,${0.18 * a})`; g.lineWidth = 1.5; g.beginPath(); // the river, a few dry strokes
        for (let i = 0; i < 4; i++) { const y = h * (0.87 + i * 0.03), x0 = w * (0.1 + i * 0.13 + 0.05 * Math.sin(t * 0.2 + i)); g.moveTo(x0, y); g.lineTo(x0 + w * 0.3, y); }
        g.stroke();
        const bx = (((t * 0.008) % 1.3) - 0.15) * w, by = h * 0.9, bs = u * 0.04;
        g.fillStyle = `rgba(28,26,22,${0.7 * a})`;
        g.beginPath(); g.moveTo(bx - bs, by); g.quadraticCurveTo(bx, by + bs * 0.35, bx + bs, by); g.closePath(); g.fill();
        g.fillRect(bx - bs * 0.1, by - bs * 0.45, bs * 0.12, bs * 0.45); g.beginPath(); g.arc(bx - bs * 0.04, by - bs * 0.5, bs * 0.1, 0, Math.PI * 2); g.fill();
        g.strokeStyle = `rgba(28,26,22,${0.5 * a})`; g.lineWidth = 1.4;
        for (const b of BD) { const x = b.x * w, y = b.y * h, s2 = u * 0.012, f = Math.sin(b.ph) * 0.5 + 0.5; g.beginPath(); g.moveTo(x - s2, y - s2 * 0.5 * f); g.quadraticCurveTo(x - s2 * 0.4, y - s2 * 0.6 * f, x, y); g.quadraticCurveTo(x + s2 * 0.4, y - s2 * 0.6 * f, x + s2, y - s2 * 0.5 * f); g.stroke(); }
        const sx = u * 0.05, sy = h * 0.8, ss = u * 0.06; // the painter's red seal
        rr(g, sx, sy, ss, ss * 1.3, ss * 0.08); g.fillStyle = `rgba(196,42,34,${0.75 * a})`; g.fill();
        g.strokeStyle = `rgba(255,240,230,${0.8 * a})`; g.lineWidth = Math.max(1, ss * 0.07); g.beginPath();
        g.moveTo(sx + ss * 0.2, sy + ss * 0.3); g.lineTo(sx + ss * 0.8, sy + ss * 0.3); g.moveTo(sx + ss * 0.5, sy + ss * 0.2); g.lineTo(sx + ss * 0.5, sy + ss * 1.1);
        g.moveTo(sx + ss * 0.22, sy + ss * 0.75); g.lineTo(sx + ss * 0.78, sy + ss * 0.75); g.stroke();
      },
    };
  },
});

/* ---------- Zen collection: sound kits, one instrument from each culture ---------- */
Object.assign(KITS, (S => {
  const pluck = (f, { when = 0, vol = 0.08, dur = 0.6, type = 'triangle', to = null } = {}) => {
    S.tone(f, { type, dur, vol, when, attack: 0.002, to, wet: true });
    S.tone(f * 2, { dur: dur * 0.3, vol: vol * 0.3, when, attack: 0.002 });
  };
  const at = (sc, i, base) => base * Math.pow(2, sc[i % sc.length] / 12) * (i >= sc.length ? 2 : 1); // i-th note of a scale, the next octave after the last
  return {
    oud: { // a plucked oud in maqam hijaz over a darbuka "doum tek tek"
      pick() { pluck(S.snd.root * 2, { vol: 0.03, dur: 0.15 }); },
      place() { S.thud({ vol: 0.2, f: 120 }); pluck(S.snd.root * 0.5, { vol: 0.09, dur: 0.45 }); },
      clear(n) {
        const H = [0, 1, 4, 5, 7, 8, 11];
        for (let i = 0; i < n + 3; i++) pluck(at(H, i, S.snd.root * 0.5), { when: i * 0.075, vol: 0.06, dur: 0.35 });
        S.tone(110, { dur: 0.22, vol: 0.22, to: 70 }); S.knock(1700, { vol: 0.1, when: 0.2 }); S.knock(1700, { vol: 0.08, when: 0.3 });
      },
      deal() { pluck(S.snd.root, { vol: 0.03, dur: 0.2 }); },
    },
    gayageum: { // silk strings on a pentatonic scale, each note bent a little as it fades
      pick() { pluck(S.snd.root * 2, { type: 'sine', vol: 0.03, dur: 0.2 }); },
      place() { S.thud({ vol: 0.16, f: 140 }); pluck(S.snd.root * 0.5, { type: 'sine', vol: 0.08, dur: 0.7, to: S.snd.root * 0.49 }); },
      clear(n) {
        const P = [0, 2, 5, 7, 9];
        for (let i = 0; i < n + 3; i++) { const f = at(P, i, S.snd.root * 0.5); pluck(f, { type: 'sine', when: i * 0.1, vol: 0.06, dur: 0.8, to: f * 0.985 }); }
      },
      deal() { pluck(S.snd.root * 1.5, { type: 'sine', vol: 0.03, dur: 0.3 }); },
    },
    sitar: { // tabla strokes, and a sitar run in raag yaman with a slide into each note
      pick() { S.tone(520, { dur: 0.08, vol: 0.06, to: 470 }); },
      place() { S.tone(95, { dur: 0.35, vol: 0.22, to: 140 }); S.tone(520, { dur: 0.1, vol: 0.06, to: 480, when: 0.05 }); },
      clear(n) {
        const Y = [0, 2, 4, 6, 7, 9, 11];
        for (let i = 0; i < n + 3; i++) { const f = at(Y, i, S.snd.root * 0.5); pluck(f, { when: i * 0.09, vol: 0.06, dur: 0.5, to: f * 1.015 }); S.tink(f * 3, { when: i * 0.09 + 0.02, vol: 0.012, dur: 0.6 }); }
        S.tone(95, { dur: 0.35, vol: 0.2, to: 140 }); S.tone(560, { dur: 0.1, vol: 0.07, to: 500, when: 0.18 });
      },
      deal() { S.tink(S.snd.root * 3, { vol: 0.02, dur: 0.8 }); },
    },
    djembe: { // djembe bass and tone strokes, and a balafon: wooden keys over gourds
      pick() { S.hiss({ dur: 0.03, vol: 0.05, type: 'highpass', freq: 3000 }); },
      place() { S.tone(78, { dur: 0.25, vol: 0.32, to: 55 }); S.hiss({ dur: 0.05, vol: 0.05, type: 'bandpass', freq: 800, q: 1 }); },
      clear(n) {
        const P = [0, 2, 4, 7, 9];
        for (let i = 0; i < n + 3; i++) {
          const f = at(P, i, S.snd.root), w = i * 0.08;
          S.tone(f, { dur: 0.2, vol: 0.09, attack: 0.001, when: w }); S.tone(f * 3.9, { dur: 0.05, vol: 0.025, when: w }); S.hiss({ dur: 0.03, vol: 0.03, type: 'bandpass', freq: f * 2, q: 3, when: w });
        }
        S.tone(78, { dur: 0.25, vol: 0.3, to: 55 }); S.tone(240, { dur: 0.1, vol: 0.14, to: 200, when: 0.16 }); S.hiss({ dur: 0.06, vol: 0.08, type: 'highpass', freq: 2500, when: 0.3 });
      },
      deal() { S.tone(240, { dur: 0.08, vol: 0.1, to: 200 }); S.tone(240, { dur: 0.08, vol: 0.08, to: 200, when: 0.1 }); },
    },
    mariachi: { // guitarrón bass, a guitar strum, two trumpets
      pick() { pluck(S.snd.root * 2, { vol: 0.03, dur: 0.12 }); },
      place() { S.tone(98, { type: 'triangle', dur: 0.3, vol: 0.18, attack: 0.003 }); S.thud({ vol: 0.12, f: 140 }); },
      clear(n) {
        const r = S.snd.root * 0.5;
        [0, 4, 7, 12].forEach((st, i) => pluck(r * Math.pow(2, st / 12), { when: i * 0.02, vol: 0.05, dur: 0.4 }));
        [0, 4, 7, 12].slice(0, Math.max(2, Math.min(4, n))).forEach((st, i) => {
          const f = r * 2 * Math.pow(2, st / 12), w = 0.18 + i * 0.13;
          S.tone(f, { type: 'square', dur: 0.2, vol: 0.022, attack: 0.02, when: w }); S.tone(f * 1.003, { type: 'square', dur: 0.2, vol: 0.018, attack: 0.02, when: w });
        });
      },
      deal() { [0, 4, 7].forEach((st, i) => pluck(S.snd.root * Math.pow(2, st / 12), { when: i * 0.02, vol: 0.025, dur: 0.2 })); },
    },
    panflute: { // a breathy zampoña and the doubled strings of a charango
      pick() { pluck(S.snd.root * 2, { vol: 0.03, dur: 0.1 }); pluck(S.snd.root * 2.01, { vol: 0.025, dur: 0.1 }); },
      place() { S.thud({ vol: 0.2, f: 110 }); S.hiss({ dur: 0.08, vol: 0.04, type: 'lowpass', freq: 700 }); },
      clear(n) {
        const P = [0, 3, 5, 7, 10];
        for (let i = 0; i < n + 2; i++) { const f = at(P, i, S.snd.root), w = i * 0.14; S.tone(f, { dur: 0.45, vol: 0.07, attack: 0.04, when: w, wet: true }); S.hiss({ dur: 0.3, vol: 0.025, type: 'bandpass', freq: f * 2, q: 6, when: w }); }
      },
      deal() { S.hiss({ dur: 0.25, vol: 0.03, type: 'bandpass', freq: S.snd.root * 2, q: 5 }); },
    },
    gamelan: { // bronze keys in pelog, tuned in pairs a hair apart so they shimmer, and the big gong
      pick() { S.tone(S.snd.root * 2, { dur: 0.3, vol: 0.03, attack: 0.003 }); },
      place() { S.thud({ vol: 0.18, f: 120 }); S.tone(S.snd.root * 0.5, { dur: 0.9, vol: 0.05, attack: 0.003, wet: true }); S.tone(S.snd.root * 0.503, { dur: 0.9, vol: 0.04, attack: 0.003 }); },
      clear(n) {
        const P = [0, 1, 3, 7, 8];
        for (let i = 0; i < n + 3; i++) { const f = at(P, i, S.snd.root), w = i * 0.12; S.tone(f, { dur: 1.1, vol: 0.05, attack: 0.003, when: w, wet: true }); S.tone(f * 1.007, { dur: 1.1, vol: 0.04, attack: 0.003, when: w }); S.tone(f * 2.7, { dur: 0.25, vol: 0.015, when: w }); }
        S.tone(70, { dur: 2, vol: 0.12, attack: 0.01, when: 0.05, wet: true }); S.tone(70.6, { dur: 2, vol: 0.1, attack: 0.01, when: 0.05 });
      },
      deal() { S.tone(S.snd.root * 1.5, { dur: 0.6, vol: 0.025, attack: 0.003, wet: true }); },
    },
    bouzouki: { // a bouzouki tremolo on each note, then a wave on the shore
      pick() { pluck(S.snd.root * 2, { vol: 0.03, dur: 0.1 }); },
      place() { S.thud({ vol: 0.16, f: 140 }); pluck(S.snd.root, { vol: 0.06, dur: 0.25 }); },
      clear(n) {
        const P = [0, 2, 4, 5, 7, 9, 10];
        for (let i = 0; i < Math.min(n + 2, 6); i++) for (let j = 0; j < 4; j++) pluck(at(P, i, S.snd.root), { when: i * 0.16 + j * 0.04, vol: 0.035, dur: 0.1 });
        S.hissL({ dur: 1.1, vol: 0.05, type: 'lowpass', freq: 700, to: 220, when: 0.2 });
      },
      deal() { S.hissL({ dur: 0.6, vol: 0.03, type: 'lowpass', freq: 600, to: 250 }); },
    },
    santur: { // the hammered strings of a santur in dastgah-e shur, with its in-between koron steps
      pick() { S.tink(S.snd.root * 4, { vol: 0.02, dur: 0.2 }); },
      place() { S.thud({ vol: 0.16, f: 130 }); S.tone(S.snd.root, { dur: 0.4, vol: 0.05, attack: 0.001, wet: true }); S.tone(S.snd.root * 1.004, { dur: 0.4, vol: 0.04, attack: 0.001 }); },
      clear(n) {
        const D = [0, 1.5, 3, 5, 7, 8.5, 10];
        for (let i = 0; i < n + 3; i++) { const f = at(D, i, S.snd.root), w = i * 0.085; S.tone(f, { dur: 0.55, vol: 0.05, attack: 0.001, when: w, wet: true }); S.tone(f * 1.004, { dur: 0.5, vol: 0.04, attack: 0.001, when: w }); S.tone(f * 2, { dur: 0.2, vol: 0.015, when: w }); }
      },
      deal() { S.tone(S.snd.root * 2, { dur: 0.3, vol: 0.025, attack: 0.001, wet: true }); },
    },
    guqin: { // a guqin: low strings with the finger sliding, and bell-like harmonics
      pick() { S.tone(S.snd.root * 4, { dur: 0.4, vol: 0.02, attack: 0.002 }); },
      place() { S.thud({ vol: 0.14, f: 120 }); S.tone(S.snd.root * 0.25, { dur: 1, vol: 0.08, attack: 0.003, to: S.snd.root * 0.26, wet: true }); },
      clear(n) {
        const P = [0, 2, 4, 7, 9];
        for (let i = 0; i < n + 2; i++) { const f = at(P, i, S.snd.root * 0.5); S.tone(f, { dur: 1.2, vol: 0.06, attack: 0.003, when: i * 0.22, to: f * (i % 2 ? 1.03 : 0.98), wet: true }); }
        S.tone(S.snd.root * 4, { dur: 0.9, vol: 0.025, attack: 0.002, when: 0.1 + (n + 2) * 0.22 });
      },
      deal() { S.tone(S.snd.root * 3, { dur: 0.5, vol: 0.02, attack: 0.002 }); },
    },
  };
})(Sfx));

/* ---------- Puzzle collection: shapes shared by blocks, backgrounds, particles and gems ---------- */
// a jigsaw piece on the square x0, y0, L. e: [top, right, bottom, left], 1 a knob out, -1 a socket in, 0 flat; kn scales the tab
function jigPath(g, x0, y0, L, e, kn = 0.7) {
  const C = [[x0, y0], [x0 + L, y0], [x0 + L, y0 + L], [x0, y0 + L]], NRM = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  g.beginPath(); g.moveTo(x0, y0);
  for (let k = 0; k < 4; k++) {
    const [ax, ay] = C[k], [bx, by] = C[(k + 1) % 4], dx = bx - ax, dy = by - ay, d = e[k] * kn, [nx, ny] = NRM[k];
    if (d) {
      const P = (u, v) => [ax + dx * u + nx * v * d * L, ay + dy * u + ny * v * d * L]; // the tab is symmetric, so two neighbours trace the same curve
      g.lineTo(...P(0.37, 0));
      g.bezierCurveTo(...P(0.43, 0), ...P(0.4, 0.1), ...P(0.36, 0.15));
      g.bezierCurveTo(...P(0.3, 0.26), ...P(0.42, 0.32), ...P(0.5, 0.32));
      g.bezierCurveTo(...P(0.58, 0.32), ...P(0.7, 0.26), ...P(0.64, 0.15));
      g.bezierCurveTo(...P(0.6, 0.1), ...P(0.57, 0), ...P(0.63, 0));
    }
    g.lineTo(bx, by);
  }
  g.closePath();
}
// chalk laid down in slanted strokes, each a little uneven
function chalkHatch(g, s, col, rnd, a) {
  g.lineCap = 'round'; g.lineWidth = Math.max(1, s * 0.04);
  for (let i = -s; i < s * 1.2; i += s * 0.075) {
    const j = (rnd() - 0.5) * s * 0.03;
    g.strokeStyle = rgba(col, a * (0.6 + rnd() * 0.4));
    g.beginPath(); g.moveTo(i + j, s * 1.02); g.lineTo(i + s + j + (rnd() - 0.5) * s * 0.05, -s * 0.02); g.stroke();
  }
}
// a box drawn twice by hand in chalk, then the dust left on it
function chalkBox(g, s, c, rnd) {
  g.lineCap = 'round'; g.lineJoin = 'round';
  for (let p = 0; p < 2; p++) {
    const j = () => (rnd() - 0.5) * s * 0.035, o = s * 0.1, e = s * 0.9;
    g.strokeStyle = rgba(c, p ? 0.55 : 0.95); g.lineWidth = Math.max(1, s * (p ? 0.03 : 0.05));
    g.beginPath(); g.moveTo(o + j(), o + j()); g.lineTo(e + j(), o + j()); g.lineTo(e + j(), e + j()); g.lineTo(o + j(), e + j()); g.closePath(); g.stroke();
  }
  speckle(g, s, rnd, 24, 0.004, 0.01, () => `rgba(255,255,255,${0.12 + rnd() * 0.25})`);
}
// domino pips laid out on a square of side sz; the colour of a block picks how many
const PIP = [[], [[0.5, 0.5]], [[0.27, 0.27], [0.73, 0.73]], [[0.27, 0.27], [0.5, 0.5], [0.73, 0.73]],
  [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]], [[0.27, 0.27], [0.73, 0.27], [0.5, 0.5], [0.27, 0.73], [0.73, 0.73]],
  [[0.27, 0.24], [0.73, 0.24], [0.27, 0.5], [0.73, 0.5], [0.27, 0.76], [0.73, 0.76]]];
const DOMINO_BLOCKS = THEMES.find(t => t.id === 'domino').blocks;
const pipCount = c => { const i = DOMINO_BLOCKS.indexOf(c); return i < 0 ? 3 : (i % 6) + 1; };
function pips(g, x, y, sz, n, col, rad, sunk = true) {
  for (const [u, v] of PIP[n]) {
    const px = x + u * sz, py = y + v * sz;
    if (sunk) { g.beginPath(); g.arc(px, py + rad * 0.2, rad, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill(); } // the lower lip of the drilled hole catches the light
    g.beginPath(); g.arc(px, py, rad, 0, Math.PI * 2); g.fillStyle = col; g.fill();
  }
}
// the seven pieces of a 4 x 4 tangram square, corners in square units
const TAN = [[[0, 0], [4, 0], [2, 2]], [[0, 0], [2, 2], [0, 4]], [[4, 2], [4, 4], [2, 4]], [[3, 1], [4, 0], [4, 2]],
  [[2, 2], [3, 3], [1, 3]], [[2, 2], [3, 1], [4, 2], [3, 3]], [[0, 4], [1, 3], [3, 3], [2, 4]]];
// a square cut into triangles like tangram pieces: kind 1 and 2 cut along one diagonal, 4 along both
function tanSquare(g, x, y, w, c, lt, dk, kind, seam = 'rgba(255,250,240,.85)') {
  const A = [x, y], B = [x + w, y], C = [x + w, y + w], D = [x, y + w], M = [x + w / 2, y + w / 2];
  if (kind === 4) { poly(g, [A, B, M], lt); poly(g, [B, C, M], c); poly(g, [C, D, M], dk); poly(g, [D, A, M], c); }
  else if (kind === 1) { poly(g, [A, B, D], lt); poly(g, [B, C, D], c); }
  else { poly(g, [A, B, C], lt); poly(g, [A, C, D], c); }
  g.strokeStyle = seam; g.lineWidth = Math.max(1, w * 0.035); g.lineCap = 'round'; g.beginPath();
  if (kind === 4) { g.moveTo(...A); g.lineTo(...C); g.moveTo(...B); g.lineTo(...D); }
  else if (kind === 1) { g.moveTo(...B); g.lineTo(...D); }
  else { g.moveTo(...A); g.lineTo(...C); }
  g.stroke();
}
// a note or photo pinned to the board; rnd picks its handwriting
function memoFace(g, s, c, rnd, k) {
  if (c === '#efe9dc') { // a polaroid: a dark photo of somebody, a caption under it
    const x0 = s * 0.17, y0 = s * 0.2, pw = s * 0.66, ph = s * 0.46;
    const gr = g.createLinearGradient(0, y0, 0, y0 + ph); gr.addColorStop(0, `rgba(44,54,66,${k})`); gr.addColorStop(1, `rgba(82,96,104,${k})`);
    g.fillStyle = gr; g.fillRect(x0, y0, pw, ph);
    g.save(); g.beginPath(); g.rect(x0, y0, pw, ph); g.clip(); g.fillStyle = `rgba(14,16,22,${0.75 * k})`;
    g.beginPath(); g.arc(s * 0.5, y0 + ph * 0.42, s * 0.085, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(s * 0.5, y0 + ph * 1.02, s * 0.2, s * 0.16, 0, 0, Math.PI * 2); g.fill();
    g.restore();
    g.strokeStyle = `rgba(40,40,60,${0.5 * k})`; g.lineWidth = Math.max(1, s * 0.022); g.lineCap = 'round';
    g.beginPath(); for (let i = 0; i <= 8; i++) { const x = s * (0.24 + i * 0.05), y = s * 0.8 + Math.sin(i * 1.9 + rnd() * 2) * s * 0.02; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    return;
  }
  g.strokeStyle = `rgba(36,30,48,${0.5 * k})`; g.lineWidth = Math.max(1, s * 0.024); g.lineCap = 'round';
  for (let r = 0; r < 3; r++) { // handwriting: a few wobbly lines
    const y0 = s * (0.4 + r * 0.16), x1 = s * (0.55 + rnd() * 0.27), ph = rnd() * 6;
    g.beginPath(); for (let x = s * 0.18; x <= x1; x += s * 0.04) { const y = y0 + Math.sin(x / s * 30 + ph) * s * 0.018; x === s * 0.18 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
  }
  if (c === '#c8a274') { // a case file: a red stamp across it
    g.save(); g.translate(s * 0.52, s * 0.6); g.rotate(-0.28);
    g.strokeStyle = `rgba(196,40,36,${0.75 * k})`; g.lineWidth = Math.max(1, s * 0.03); g.strokeRect(-s * 0.3, -s * 0.1, s * 0.6, s * 0.2);
    g.fillStyle = `rgba(196,40,36,${0.75 * k})`; g.font = `800 ${s * 0.15}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('GİZLİ', 0, s * 0.01);
    g.restore();
  }
}
function memoPin(g, x, y, r, col) {
  g.beginPath(); g.ellipse(x + r * 0.35, y + r * 0.5, r * 0.9, r * 0.55, 0.4, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.3)'; g.fill();
  const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r); gr.addColorStop(0, mixHex(col, '#ffffff', 0.55)); gr.addColorStop(1, shade(col, -0.25));
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
}

/* ---------- Puzzle collection: block looks and textures ---------- */
Object.assign(STYLES, {
  jigsaw: { // a cardboard jigsaw piece with two sockets and two knobs, a scrap of the picture printed on it
    block(g, s, c) {
      const kn = 0.6, x0 = s * 0.03, L = s * 0.94 / (1 + 0.32 * kn), E = [-1, 1, 1, -1];
      g.save(); g.translate(0, s * 0.03); jigPath(g, x0, x0, L, E, kn); g.fillStyle = shade(c, -0.4); g.fill(); g.restore();
      jigPath(g, x0, x0, L, E, kn);
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, shade(c, 0.24)); gr.addColorStop(1, shade(c, -0.06));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.jigsawPic(g, s, c, seeded(c), 1); g.restore();
      jigPath(g, x0, x0, L, E, kn); g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = Math.max(1, s * 0.022); g.stroke();
    },
  },
  chalk: { // a square hatched in coloured chalk on the blackboard
    block(g, s, c) {
      const rnd = seeded(c);
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.08); g.fillStyle = mixHex(c, '#163224', 0.68); g.fill();
      g.save(); g.clip(); chalkHatch(g, s, c, rnd, 0.85); g.restore();
      chalkBox(g, s, c, rnd);
    },
  },
  domino: { // an ivory domino half, the pips drilled and filled with the block colour
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.06, s * 0.92, s * 0.9, s * 0.16); g.fillStyle = 'rgba(0,0,0,.38)'; g.fill();
      rr(g, s * 0.04, s * 0.03, s * 0.92, s * 0.9, s * 0.16); g.fillStyle = mixHex(c, '#cfc3a8', 0.85); g.fill();
      const iv = g.createLinearGradient(0, 0, 0, s); iv.addColorStop(0, '#fffaf0'); iv.addColorStop(1, mixHex(c, '#efe4cc', 0.9));
      rr(g, s * 0.06, s * 0.04, s * 0.88, s * 0.83, s * 0.14); g.fillStyle = iv; g.fill();
      pips(g, s * 0.06, s * 0.035, s * 0.88, pipCount(c), c, s * 0.075);
      g.beginPath(); g.ellipse(s * 0.34, s * 0.12, s * 0.2, s * 0.035, -0.1, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill();
    },
  },
  tangram: { // flat lacquered wood cut into tangram triangles
    block(g, s, c) {
      const rnd = seeded(c), o = s * 0.05, w = s * 0.9, r = rnd();
      g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(o + s * 0.025, o + s * 0.035, w, w);
      tanSquare(g, o, o, w, c, mixHex(c, '#ffffff', 0.26), shade(c, -0.14), r < 0.34 ? 4 : r < 0.67 ? 1 : 2);
      g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = Math.max(1, s * 0.02); g.strokeRect(o, o, w, w);
      softGlint(g, s * 0.3, s * 0.26, s * 0.22, 0.35);
    },
  },
  memo: { // a note or a polaroid pinned to the cork, a little askew
    block(g, s, c) {
      const rnd = seeded(c), rot = (rnd() - 0.5) * 0.12;
      g.save(); g.translate(s / 2, s / 2); g.rotate(rot); g.translate(-s / 2, -s / 2);
      rr(g, s * 0.08, s * 0.1, s * 0.86, s * 0.84, s * 0.03); g.fillStyle = 'rgba(0,0,0,.42)'; g.fill();
      rr(g, s * 0.06, s * 0.06, s * 0.88, s * 0.86, s * 0.03);
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.18)); gr.addColorStop(1, shade(c, -0.05));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); memoFace(g, s, c, rnd, 1);
      poly(g, [[s * 0.94, s * 0.76], [s * 0.94, s * 0.92], [s * 0.76, s * 0.92]], 'rgba(0,0,0,.18)'); // a curled corner
      poly(g, [[s * 0.94, s * 0.76], [s * 0.76, s * 0.92], [s * 0.8, s * 0.79]], mixHex(c, '#ffffff', 0.45));
      g.restore(); g.restore();
      memoPin(g, s * 0.5, s * 0.14, s * 0.075, c === '#ef98ae' ? '#2f6fc8' : '#d6332e');
    },
  },
});

Object.assign(TEX, {
  jigsawPic(g, s, c, rnd, k) { // a scrap of the printed picture: soft patches of light and shade, cardboard fibres
    for (let i = 0; i < 3; i++) {
      const x = rnd() * s, y = rnd() * s, r = s * (0.25 + rnd() * 0.3), gr = g.createRadialGradient(x, y, 0, x, y, r);
      const col = i === 1 ? '#ffffff' : i === 2 ? '#3a2410' : '#fff2c8';
      gr.addColorStop(0, rgba(col, (i === 2 ? 0.14 : 0.24) * k)); gr.addColorStop(1, rgba(col, 0));
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
    }
    speckle(g, s, rnd, 26, 0.003, 0.008, () => rnd() < 0.5 ? `rgba(255,255,255,${0.22 * k})` : `rgba(60,40,20,${0.12 * k})`);
  },
  jigsaw(g, s, c, rnd, k) { // the classic tile gets the cut of a piece pressed into it
    TEX.jigsawPic(g, s, c, rnd, k * 0.7);
    carved(g, () => jigPath(g, s * 0.2, s * 0.2, s * 0.5, [-1, 1, 1, -1], 0.6), Math.max(1, s * 0.024), `rgba(255,250,235,${0.5 * k})`, `rgba(60,35,10,${0.45 * k})`);
  },
  chalk(g, s, c, rnd, k) { chalkHatch(g, s, '#ffffff', rnd, 0.2 * k); speckle(g, s, rnd, 22, 0.004, 0.01, () => `rgba(255,255,255,${(0.15 + rnd() * 0.25) * k})`); },
  domino(g, s, c, rnd, k) { pips(g, s * 0.08, s * 0.08, s * 0.84, pipCount(c), rgba('#fff8e8', 0.92 * k), s * 0.07, false); },
  tangram(g, s, c, rnd, k) {
    const one = rnd() < 0.5;
    poly(g, one ? [[0, 0], [s, 0], [0, s]] : [[0, 0], [s, 0], [s, s]], `rgba(255,255,255,${0.22 * k})`);
    g.strokeStyle = `rgba(255,250,240,${0.7 * k})`; g.lineWidth = Math.max(1, s * 0.03); g.beginPath();
    if (one) { g.moveTo(s, 0); g.lineTo(0, s); } else { g.moveTo(0, 0); g.lineTo(s, s); } g.stroke();
  },
  memo(g, s, c, rnd, k) { memoFace(g, s, c, rnd, k * 0.9); memoPin(g, s * 0.5, s * 0.15, s * 0.07, c === '#ef98ae' ? '#2f6fc8' : '#d6332e'); },
});

/* ---------- Puzzle collection: each theme's own gem ---------- */
const GEM_LOOKS = {
  jigsaw(g, s, th) { // the last missing piece
    const L = s * 0.42, x0 = s * 0.29, E = [1, 1, 1, 1];
    jigPath(g, x0, x0, L, E, 0.55); g.lineWidth = s * 0.08; g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineJoin = 'round'; g.stroke();
    const gr = g.createLinearGradient(0, x0, 0, x0 + L); gr.addColorStop(0, mixHex(th.accent, '#ffffff', 0.45)); gr.addColorStop(1, shade(th.accent, -0.25));
    g.fillStyle = gr; g.fill();
    g.lineWidth = Math.max(1, s * 0.032); g.strokeStyle = 'rgba(255,255,255,.9)'; g.stroke();
    sparkle(g, s * 0.38, s * 0.36, s * 0.1, 0.9);
  },
  chalk(g, s, th) { // a question mark circled in yellow chalk
    g.lineCap = 'round';
    for (const [w, a, dx] of [[0.11, 0.5, 0], [0.065, 1, 0], [0.03, 0.6, s * 0.015]]) {
      g.beginPath(); g.arc(s * 0.5 + dx, s * 0.5, s * 0.29, 0.2, Math.PI * 2.05); g.lineWidth = s * w;
      g.strokeStyle = w > 0.1 ? 'rgba(0,0,0,.5)' : rgba(th.accent, a); g.stroke();
    }
    g.font = `800 ${s * 0.46}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = s * 0.07; g.strokeStyle = 'rgba(0,0,0,.5)'; g.strokeText('?', s * 0.5, s * 0.54);
    g.fillStyle = th.accent; g.fillText('?', s * 0.5, s * 0.54);
  },
  domino(g, s, th) { // the double six
    const w = s * 0.36, h = s * 0.7, x = (s - w) / 2, y = (s - h) / 2;
    rr(g, x - s * 0.03, y - s * 0.02, w + s * 0.06, h + s * 0.06, s * 0.08); g.fillStyle = 'rgba(0,0,0,.55)'; g.fill();
    rr(g, x, y, w, h, s * 0.06); g.fillStyle = '#fbf4e4'; g.fill();
    g.fillStyle = 'rgba(60,40,30,.5)'; g.fillRect(x + w * 0.12, y + h / 2 - s * 0.01, w * 0.76, Math.max(1, s * 0.02));
    for (const yy of [y, y + h / 2]) pips(g, x + w * 0.04, yy + h * 0.03, w * 0.92, 6, th.accent === '#f2c14e' ? '#c8323a' : th.accent, s * 0.03, false);
    g.beginPath(); g.arc(x + w / 2, y + h / 2, s * 0.03, 0, Math.PI * 2); g.fillStyle = th.accent; g.fill(); // the brass spinner
  },
  tangram(g, s, th) { // the tangram square itself, turned on its corner
    g.save(); g.translate(s / 2, s / 2); g.rotate(Math.PI / 4);
    const w = s * 0.46;
    g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(-w / 2 - s * 0.04, -w / 2 - s * 0.04, w + s * 0.08, w + s * 0.08);
    tanSquare(g, -w / 2, -w / 2, w, th.accent, mixHex(th.accent, '#ffffff', 0.4), shade(th.accent, -0.25), 4, 'rgba(255,255,255,.95)');
    g.restore();
  },
  detective(g, s, th) { // a fingerprint lifted in red
    g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.33, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill();
    g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.29, 0, Math.PI * 2); g.fillStyle = '#fbf3e4'; g.fill();
    g.save(); g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.27, 0, Math.PI * 2); g.clip();
    g.strokeStyle = th.accent; g.lineWidth = Math.max(1, s * 0.024); g.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const rx = s * (0.035 + i * 0.038), a0 = 0.3 + (i % 3) * 0.5, a1 = Math.PI * 2 - 0.25 - (i % 2) * 0.6;
      g.beginPath(); g.ellipse(s * 0.5, s * 0.53, rx, rx * 1.3, 0.15, a0, a1); g.stroke();
    }
    g.restore();
  },
};

/* ---------- Puzzle collection: clear-effect particles ---------- */
Object.assign(PARTS, {
  piece(p, s) { ctx.rotate(p.rot); const L = s * 0.75; jigPath(ctx, -L / 2, -L / 2, L, [1, -1, 1, -1], 0.6); ctx.fillStyle = p.color; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = Math.max(1, s * 0.06); ctx.stroke(); },
  chalkdust(p, s, k) {
    const r = p.size * (0.35 + (1 - k) * 1.3); ctx.globalAlpha *= 0.55; ctx.fillStyle = mixHex(p.color, '#ffffff', 0.6);
    ctx.beginPath(); for (const [x, y, q] of [[-0.4, 0.1, 0.55], [0.1, -0.25, 0.7], [0.45, 0.15, 0.5]]) { ctx.moveTo(x * r + q * r, y * r); ctx.arc(x * r, y * r, q * r, 0, Math.PI * 2); } ctx.fill();
  },
  bone(p, s) {
    ctx.rotate(p.rot); rr(ctx, -s * 0.32, -s * 0.6, s * 0.64, s * 1.2, s * 0.12); ctx.fillStyle = '#f8f1e2'; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = Math.max(1, s * 0.05); ctx.stroke();
    ctx.fillStyle = 'rgba(60,40,30,.5)'; ctx.fillRect(-s * 0.22, -s * 0.02, s * 0.44, Math.max(1, s * 0.04));
    ctx.fillStyle = p.color; for (const y of [-0.3, 0.3]) { ctx.beginPath(); ctx.arc(0, y * s, s * 0.09, 0, Math.PI * 2); ctx.fill(); }
  },
  tan(p, s) { ctx.rotate(p.rot); poly(ctx, [[-s * 0.6, s * 0.3], [s * 0.6, s * 0.3], [0, -s * 0.3]], p.color); ctx.strokeStyle = 'rgba(255,250,240,.8)'; ctx.lineWidth = Math.max(1, s * 0.05); ctx.stroke(); },
  memo(p, s) {
    ctx.rotate(p.rot * 0.4); ctx.scale(1, 0.25 + 0.75 * Math.abs(Math.sin(p.life * 5 + p.ph)));
    ctx.fillStyle = mixHex(p.color, '#ffffff', 0.1); ctx.fillRect(-s * 0.5, -s * 0.5, s, s);
    ctx.fillStyle = 'rgba(36,30,48,.35)'; ctx.fillRect(-s * 0.32, -s * 0.05, s * 0.6, Math.max(1, s * 0.06)); ctx.fillRect(-s * 0.32, s * 0.18, s * 0.4, Math.max(1, s * 0.06));
    ctx.beginPath(); ctx.arc(0, -s * 0.36, s * 0.1, 0, Math.PI * 2); ctx.fillStyle = '#d6332e'; ctx.fill();
  },
});

/* ---------- Puzzle collection: living backgrounds ---------- */
Object.assign(AMBIENTS, {
  jigsawtable(th) { // a puzzle mat with the cut lines printed on it; loose pieces drift about and every few seconds one flies home
    let mat = null, mw = 0, mh = 0, q = 0, t = 0, acc = 1.2;
    const hsh = (i, j, k) => (Math.imul(i + 101, 73856093) ^ Math.imul(j + 37, 19349663) ^ Math.imul(k, 83492791)) >>> 0;
    const hor = (i, j) => (hsh(i, j, 1) >>> 4) & 1 ? 1 : -1, ver = (i, j) => (hsh(i, j, 2) >>> 4) & 1 ? 1 : -1;
    const edges = (i, j) => [-ver(i, j - 1), hor(i, j), ver(i, j), -hor(i - 1, j)];
    const mk = init => ({ x: init ? Math.random() : (Math.random() < 0.5 ? -0.1 : 1.1), y: Math.random(), vx: rand(-0.012, 0.012), vy: rand(-0.01, 0.01), rot: rand(0, 6.3), vr: rand(-0.3, 0.3),
      c: th.blocks[(Math.random() * 7) | 0], e: [0, 1, 2, 3].map(() => (Math.random() < 0.5 ? 1 : -1)), s: rand(0.8, 1.05), fly: null });
    const P = [...Array(8)].map(() => mk(true));
    let placed = [];
    function build(w, h) {
      mw = w; mh = h; q = Math.max(44, Math.min(w, h) * 0.11);
      mat = document.createElement('canvas'); mat.width = Math.ceil(w); mat.height = Math.ceil(h);
      const g = mat.getContext('2d');
      g.strokeStyle = 'rgba(90,60,30,.11)'; g.lineWidth = 1.5; g.lineJoin = 'round';
      for (let j = 0; j * q < h + q; j++) for (let i = 0; i * q < w + q; i++) { jigPath(g, i * q, j * q, q, edges(i, j)); g.stroke(); }
      placed = [];
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        for (const p of P) if (!p.fly) { p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; if (p.x < -0.15) p.x = 1.15; if (p.x > 1.15) p.x = -0.15; if (p.y < -0.15) p.y = 1.15; if (p.y > 1.15) p.y = -0.15; }
        if (acc > 2.6 && q) {
          acc = 0;
          const p = P.find(o => !o.fly), cols = Math.floor(mw / q), rows = Math.floor(mh / q);
          if (p && cols > 0 && rows > 0) {
            for (let tries = 0; tries < 12; tries++) {
              const i = (Math.random() * cols) | 0, j = (Math.random() * rows) | 0;
              if (placed.some(o => o.i === i && o.j === j)) continue;
              const r0 = ((p.rot % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI; // turn the short way round
              p.fly = { t: 0, r0, i, j }; p.e = edges(i, j);
              break;
            }
          }
        }
        P.forEach((p, k) => {
          if (!p.fly) return;
          p.fly.t += dt / 1.6;
          if (p.fly.t >= 1) { placed.push({ i: p.fly.i, j: p.fly.j, c: p.c, t0: t }); P[k] = mk(false); }
        });
        placed = placed.filter(o => t - o.t0 < 30);
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const lamp = g.createRadialGradient(w * 0.15, 0, 0, w * 0.15, 0, Math.max(w, h) * 0.8); lamp.addColorStop(0, `rgba(255,236,190,${0.4 * a})`); lamp.addColorStop(1, 'rgba(255,236,190,0)');
        g.fillStyle = lamp; g.fillRect(0, 0, w, h);
        if (!mat || Math.abs(w - mw) > 1 || Math.abs(h - mh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(mat, 0, 0, w, h); g.globalAlpha = 1;
        g.lineJoin = 'round';
        for (const o of placed) {
          const age = t - o.t0, fade = age > 26 ? 1 - (age - 26) / 4 : 1, pop = clamp01(age / 0.35);
          jigPath(g, o.i * q, o.j * q, q, edges(o.i, o.j));
          g.fillStyle = rgba(o.c, 0.3 * a * fade); g.fill();
          g.strokeStyle = rgba(th.accent, (1 - pop) * 0.8 * a); g.lineWidth = 3; g.stroke();
        }
        for (const p of P) {
          let x = p.x * w, y = p.y * h, rot = p.rot, L = q * p.s;
          if (p.fly) { const e = inOut(clamp01(p.fly.t)); x = lerp(x, p.fly.i * q + q / 2, e); y = lerp(y, p.fly.j * q + q / 2, e); rot = lerp(p.fly.r0, 0, e); L = lerp(L, q, e); }
          const lift = p.fly ? Math.sin(Math.PI * clamp01(p.fly.t)) * u * 0.02 : 0;
          g.save(); g.translate(x, y - lift); g.rotate(rot);
          g.save(); g.translate(u * 0.008 + lift * 0.5, u * 0.012 + lift); jigPath(g, -L / 2, -L / 2, L, p.e); g.fillStyle = `rgba(60,40,20,${0.14 * a})`; g.fill(); g.restore();
          jigPath(g, -L / 2, -L / 2, L, p.e); g.fillStyle = rgba(p.c, 0.55 * a); g.fill();
          g.strokeStyle = `rgba(255,255,255,${0.55 * a})`; g.lineWidth = 1.5; g.stroke();
          g.restore();
        }
      },
    };
  },
  blackboard(th) { // sums and drawings appear in chalk, stay a while, then an eraser wipes them; a ledge with chalk below
    let base = null, bw = 0, bh = 0, t = 0, next = 0.4;
    const TX = ['a² + b² = c²', 'x + 7 = 12', 'π ≈ 3,14', 'E = mc²', '√64 = 8', 'y = 2x + 1', '8 × 8 = 64', '∠A = 90°', '(a + b)²', 'Σ n', 'f(x) = x²', '3 · 4 = 12'];
    const SLOTS = [[0.05, 0.19], [0.55, 0.18], [0.03, 0.4], [0.82, 0.36], [0.03, 0.6], [0.82, 0.62], [0.06, 0.91], [0.56, 0.9], [0.3, 0.23], [0.3, 0.95]]; // clear of the score and level name at the top
    const items = [];
    const LIFE = 10.7;
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h);
      g.lineCap = 'round';
      for (let i = 0; i < 9; i++) { // old eraser swirls
        g.strokeStyle = `rgba(255,255,255,${rand(0.015, 0.035)})`; g.lineWidth = u * rand(0.05, 0.1);
        const x = Math.random() * w, y = Math.random() * h, r = u * rand(0.1, 0.25);
        g.beginPath(); g.arc(x, y, r, rand(0, 3), rand(3.5, 6)); g.stroke();
      }
      const lh = u * 0.03; // the wooden chalk ledge along the bottom
      g.fillStyle = 'rgba(112,74,42,.9)'; g.fillRect(0, h - lh, w, lh);
      g.fillStyle = 'rgba(255,230,190,.25)'; g.fillRect(0, h - lh, w, 2);
      const sticks = ['#f6f4ea', '#ffe27a', '#f5a3cf', '#8ecdf0'];
      for (let i = 0; i < 4; i++) { const x = w * (0.2 + i * 0.07); rr(g, x, h - lh - u * 0.012, u * 0.05, u * 0.012, u * 0.006); g.fillStyle = sticks[i]; g.fill(); }
      rr(g, w * 0.7, h - lh - u * 0.03, u * 0.11, u * 0.03, u * 0.006); g.fillStyle = 'rgba(150,110,70,.95)'; g.fill();
      g.fillStyle = 'rgba(60,60,64,.95)'; g.fillRect(w * 0.7, h - lh - u * 0.012, u * 0.11, u * 0.012);
      g.strokeStyle = 'rgba(90,60,34,.8)'; g.lineWidth = u * 0.018; g.strokeRect(u * 0.009, u * 0.009, w - u * 0.018, h - u * 0.018); // the frame
    }
    function add() {
      const used = new Set(items.map(o => o.slot)), free = SLOTS.map((_, i) => i).filter(i => !used.has(i));
      if (!free.length) return;
      const r = Math.random(), slot = free[(Math.random() * free.length) | 0];
      items.push({ slot, age: 0, kind: r < 0.6 ? 'text' : r < 0.8 ? 'circle' : 'tri', text: TX[(Math.random() * TX.length) | 0],
        col: Math.random() < 0.75 ? '#f6f4ea' : th.blocks[(Math.random() * 7) | 0] });
    }
    return {
      step(dt) {
        t += dt; next -= dt;
        if (next <= 0) { next = rand(2.2, 3.4); add(); }
        for (const o of items) o.age += dt;
        for (let i = items.length - 1; i >= 0; i--) if (items[i].age > LIFE) items.splice(i, 1);
      },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), fs = u * 0.055;
        g.font = `700 ${fs}px "Baloo 2", sans-serif`; g.textBaseline = 'middle'; g.textAlign = 'left'; g.lineCap = 'round'; g.lineJoin = 'round';
        for (const o of items) {
          const [sx, sy] = SLOTS[o.slot], x = sx * w, y = sy * h;
          const wr = clamp01(o.age / 1.6), er = clamp01((o.age - (LIFE - 1.1)) / 1.1);
          const R = u * 0.055, W = o.kind === 'text' ? g.measureText(o.text).width : o.kind === 'circle' ? R * 2 : R * 2.4, top = y - (o.kind === 'text' ? fs * 0.7 : 0), H = o.kind === 'text' ? fs * 1.4 : R * 2.2;
          g.save(); g.beginPath(); g.rect(x - 4 + er * (W + 8), top - 4, (W + 8) * (1 - er), H + 8); g.clip();
          if (o.kind === 'text') {
            g.beginPath(); g.rect(x - 4, top - 4, (W + 8) * wr, H + 8); g.clip();
            g.fillStyle = rgba(o.col, 0.55 * a); g.fillText(o.text, x, y);
            g.fillStyle = rgba(o.col, 0.22 * a); g.fillText(o.text, x + 1.2, y + 0.8);
          } else {
            g.strokeStyle = rgba(o.col, 0.55 * a); g.lineWidth = 2.5;
            if (o.kind === 'circle') {
              const L = Math.PI * 2 * R; g.setLineDash([L * wr, L + 1]);
              g.beginPath(); g.arc(x + R, y + R, R, -Math.PI / 2, Math.PI * 1.5); g.stroke(); g.setLineDash([]);
              if (wr >= 1) { g.beginPath(); g.moveTo(x + R, y + R); g.lineTo(x + R * 1.7, y + R * 0.3); g.stroke(); g.beginPath(); g.arc(x + R, y + R, 2.5, 0, Math.PI * 2); g.fillStyle = rgba(o.col, 0.6 * a); g.fill(); }
            } else {
              const A = [x, y], B = [x, y + R * 2], C = [x + R * 2.4, y + R * 2], L = R * 2 + R * 2.4 + Math.hypot(R * 2.4, R * 2);
              g.setLineDash([L * wr, L + 1]); g.beginPath(); g.moveTo(...A); g.lineTo(...B); g.lineTo(...C); g.closePath(); g.stroke(); g.setLineDash([]);
              if (wr >= 1) { g.strokeRect(x, y + R * 2 - R * 0.35, R * 0.35, R * 0.35); }
            }
          }
          g.restore();
          if (er > 0 && er < 1) { // the eraser passing over, a smear of dust behind it
            g.fillStyle = `rgba(255,255,255,${0.06 * a * (1 - er)})`; g.fillRect(x - 4, top - 4, (W + 8) * er, H + 8);
            const ex = x - 4 + er * (W + 8), eh = H + 12;
            rr(g, ex - u * 0.015, top - 6, u * 0.04, eh, u * 0.008); g.fillStyle = `rgba(150,110,70,${0.9 * a})`; g.fill();
            g.fillStyle = `rgba(60,60,64,${0.95 * a})`; g.fillRect(ex - u * 0.015, top - 6, u * 0.015, eh);
          }
        }
      },
    };
  },
  dominorun(th) { // a long line of dominoes snaking over the felt; a wave knocks them down one after another, then they stand up again
    let felt = null, fw = 0, fh = 0, path = [], t = 0, phase = 0, head = 0, wait = 0, rise = 0;
    function build(w, h) {
      fw = w; fh = h; felt = document.createElement('canvas'); felt.width = Math.ceil(w); felt.height = Math.ceil(h);
      const g = felt.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 1800; i++) { g.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,.025)' : 'rgba(0,0,0,.07)'; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); }
      const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)');
      g.fillStyle = v; g.fillRect(0, 0, w, h);
      const ys = [0.2, 0.43, 0.68, 0.955], pts = [], x0 = w * 0.06, x1 = w * 0.94;
      ys.forEach((yf, r) => { // rows across the table joined by turns at the ends
        const y = yf * h, ltr = r % 2 === 0, a0 = ltr ? x0 : x1, a1 = ltr ? x1 : x0;
        for (let k = 0; k <= 60; k++) pts.push([lerp(a0, a1, k / 60), y + Math.sin(k / 60 * Math.PI * 3 + r) * u * 0.015]);
        if (r < ys.length - 1) { const R = (ys[r + 1] * h - y) / 2; for (let k = 1; k < 24; k++) { const an = -Math.PI / 2 + k / 24 * Math.PI; pts.push([a1 + (ltr ? 1 : -1) * Math.cos(an) * Math.min(R * 0.4, w * 0.05), y + R + Math.sin(an) * R]); } }
      });
      path = []; const d = u * 0.034; let acc = 0;
      for (let i = 1; i < pts.length; i++) { // resample at even spacing
        const [ax, ay] = pts[i - 1], [bx, by] = pts[i], seg = Math.hypot(bx - ax, by - ay), ang = Math.atan2(by - ay, bx - ax);
        while (acc <= seg) { const k = acc / seg; path.push({ x: lerp(ax, bx, k), y: lerp(ay, by, k), ang }); acc += d; }
        acc -= seg;
      }
    }
    return {
      step(dt) {
        t += dt;
        if (!path.length) return;
        if (phase === 0) { head += dt * 22; if (head > path.length + 3) { phase = 1; wait = 2.2; } }
        else if (phase === 1) { wait -= dt; if (wait <= 0) { phase = 2; rise = 0; } }
        else { rise += dt * 0.9; if (rise >= 1) { phase = 0; head = 0; } }
      },
      draw(g, w, h, a) {
        if (!felt || Math.abs(w - fw) > 1 || Math.abs(h - fh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(felt, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        const lamp = g.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.max(w, h) * 0.6); lamp.addColorStop(0, rgba(th.accent, 0.1 * a)); lamp.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = lamp; g.fillRect(0, 0, w, h);
        const T = u * 0.009, W = u * 0.022, L = u * 0.046, n = path.length;
        for (let i = 0; i < n; i++) {
          const d = path[i];
          const f = phase === 0 ? inOut(clamp01((head - i) / 2.5)) : phase === 1 ? 1 : 1 - inOut(clamp01(rise * 1.6 - (i / n) * 0.6));
          const len = lerp(T, L, f), off = lerp(0, L / 2 - T / 2, f);
          g.save(); g.translate(d.x, d.y); g.rotate(d.ang);
          g.fillStyle = `rgba(0,0,0,${0.25 * a})`; g.fillRect(off - len / 2 + 2, -W / 2 + 2, len, W);
          g.fillStyle = `rgba(246,238,222,${(0.42 + 0.18 * f) * a})`; g.fillRect(off - len / 2, -W / 2, len, W);
          if (f > 0.6) { // lying face up: the dividing line and a pip on each half
            g.fillStyle = `rgba(40,20,20,${0.45 * a})`; g.fillRect(off - 0.5, -W * 0.35, 1, W * 0.7);
            g.beginPath(); g.arc(off - len * 0.25, 0, W * 0.12, 0, Math.PI * 2); g.arc(off + len * 0.25, 0, W * 0.12, 0, Math.PI * 2); g.fillStyle = rgba(th.blocks[i % 7], 0.6 * a); g.fill();
          } else { g.fillStyle = `rgba(255,255,255,${0.25 * a})`; g.fillRect(off - len / 2, -W / 2, len, 1.5); }
          g.restore();
        }
      },
    };
  },
  tans(th) { // tangram sets on rice paper: each one sits as a square, falls apart into its seven pieces, then finds its way back
    let paper = null, pw = 0, ph = 0, t = 0;
    const CEN = TAN.map(p => [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length]);
    const scatter = () => TAN.map(() => ({ dx: rand(-3.2, 3.2), dy: rand(-2.6, 2.6), r: ((Math.random() * 8) | 0) * Math.PI / 4 }));
    const SETS = [[0.22, 0.205, 0.04, 0], [0.8, 0.9, 0.05, 5], [0.1, 0.62, 0.034, 9], [0.9, 0.38, 0.034, 3]].map(([x, y, s, ph0]) => ({ x, y, s, ph0, sc: scatter(), cyc: -1 }));
    function build(w, h) {
      pw = w; ph = h; paper = document.createElement('canvas'); paper.width = Math.ceil(w); paper.height = Math.ceil(h);
      const g = paper.getContext('2d');
      g.lineCap = 'round';
      for (let i = 0; i < 260; i++) {
        const x = Math.random() * w, y = Math.random() * h, an = Math.random() * Math.PI, l = rand(6, 22);
        g.strokeStyle = Math.random() < 0.5 ? 'rgba(255,255,255,.4)' : 'rgba(120,100,70,.08)'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(an) * l * 0.5 + rand(-3, 3), y + Math.sin(an) * l * 0.5 + rand(-3, 3), x + Math.cos(an) * l, y + Math.sin(an) * l); g.stroke();
      }
    }
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        if (!paper || Math.abs(w - pw) > 1 || Math.abs(h - ph) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(paper, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const S of SETS) {
          const ct = t + S.ph0, cyc = Math.floor(ct / 16), k = ct % 16;
          if (cyc !== S.cyc) { S.cyc = cyc; S.sc = scatter(); }
          const e = k < 5 ? 0 : k < 7.5 ? inOut((k - 5) / 2.5) : k < 12 ? 1 : k < 15 ? 1 - inOut((k - 12) / 3) : 0;
          const U = S.s * u, cx = S.x * w, cy = S.y * h, spin = Math.sin(t * 0.1 + S.ph0) * 0.15;
          g.save(); g.translate(cx, cy); g.rotate(spin);
          TAN.forEach((pc, i) => {
            const [mx, my] = CEN[i], sc = S.sc[i], drift = e * Math.sin(t * 0.4 + i) * 0.15;
            g.save(); g.translate((mx - 2 + sc.dx * e + drift) * U, (my - 2 + sc.dy * e) * U); g.rotate(sc.r * e);
            g.beginPath(); pc.forEach(([px, py], j) => j ? g.lineTo((px - mx) * U, (py - my) * U) : g.moveTo((px - mx) * U, (py - my) * U)); g.closePath();
            g.fillStyle = rgba(th.blocks[i], 0.38 * a); g.fill();
            g.strokeStyle = `rgba(255,250,240,${0.8 * a})`; g.lineWidth = 1.5; g.lineJoin = 'round'; g.stroke();
            g.restore();
          });
          g.restore();
        }
      },
    };
  },
  corkboard(th) { // a cork board of clues: notes and photos pinned up, red string drawn between them one by one, a magnifying glass passing over
    let cork = null, cw = 0, ch = 0, t = 0, pins = [], links = [], drawn = 0, prog = 0;
    const SPOTS = [[0.12, 0.22], [0.46, 0.2], [0.85, 0.23], [0.93, 0.47], [0.06, 0.5], [0.12, 0.89], [0.5, 0.95], [0.87, 0.88], [0.66, 0.6], [0.3, 0.64]]; // clear of the score and level name at the top
    function build(w, h) {
      cw = w; ch = h; cork = document.createElement('canvas'); cork.width = Math.ceil(w); cork.height = Math.ceil(h);
      const g = cork.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 2600; i++) { const r = rand(0.6, 2); g.fillStyle = Math.random() < 0.6 ? 'rgba(20,10,0,.2)' : 'rgba(255,215,160,.08)'; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, r, 0, Math.PI * 2); g.fill(); }
      pins = [];
      SPOTS.forEach(([fx, fy], i) => {
        const x = fx * w, y = fy * h, s = u * rand(0.12, 0.16), rot = rand(-0.18, 0.18), kind = i % 3, c = th.blocks[(i * 3) % 7];
        g.save(); g.translate(x, y); g.rotate(rot);
        g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-s / 2 + 3, -s * 0.4 + 4, s, s * 0.85);
        if (kind === 0) { // a photo
          g.fillStyle = '#efe9dc'; g.fillRect(-s / 2, -s * 0.4, s, s * 0.85);
          g.fillStyle = 'rgba(44,54,66,.9)'; g.fillRect(-s * 0.4, -s * 0.32, s * 0.8, s * 0.55);
          g.fillStyle = 'rgba(14,16,22,.6)'; g.beginPath(); g.arc(0, -s * 0.1, s * 0.1, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(0, s * 0.18, s * 0.22, s * 0.14, 0, Math.PI, 0); g.fill();
        } else if (kind === 1) { // a note
          g.fillStyle = c; g.fillRect(-s / 2, -s * 0.4, s, s * 0.85);
          g.strokeStyle = 'rgba(36,30,48,.4)'; g.lineWidth = 1.5;
          for (let r = 0; r < 4; r++) { g.beginPath(); g.moveTo(-s * 0.36, -s * 0.15 + r * s * 0.15); g.lineTo(s * (0.1 + Math.random() * 0.25), -s * 0.15 + r * s * 0.15); g.stroke(); }
        } else { // a scrap of map
          g.fillStyle = '#e8dcc0'; g.fillRect(-s / 2, -s * 0.4, s, s * 0.85);
          g.strokeStyle = 'rgba(80,120,150,.45)'; g.lineWidth = 1;
          for (let r = 1; r < 5; r++) { g.beginPath(); g.moveTo(-s / 2, -s * 0.4 + r * s * 0.17); g.lineTo(s / 2, -s * 0.4 + r * s * 0.17); g.moveTo(-s / 2 + r * s * 0.2, -s * 0.4); g.lineTo(-s / 2 + r * s * 0.2, s * 0.45); g.stroke(); }
          g.strokeStyle = 'rgba(196,40,36,.7)'; g.lineWidth = 2; g.beginPath(); g.arc(s * 0.08, s * 0.05, s * 0.12, 0, Math.PI * 2); g.stroke();
        }
        g.restore();
        pins.push({ x: x + Math.sin(rot) * s * 0.3, y: y - Math.cos(rot) * s * 0.3 });
      });
      g.strokeStyle = 'rgba(70,44,22,.85)'; g.lineWidth = u * 0.02; g.strokeRect(u * 0.01, u * 0.01, w - u * 0.02, h - u * 0.02); // the board's frame
      const order = [0, 9, 1, 8, 2, 3, 7, 6, 5, 4, 9, 8];
      links = []; for (let i = 1; i < order.length; i++) links.push([order[i - 1], order[i]]);
    }
    return {
      step(dt) { t += dt; prog += dt / 1.4; if (prog >= 1) { prog = 0; drawn++; if (drawn > links.length + 3) drawn = 0; } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const lamp = g.createRadialGradient(w * 0.85, 0, 0, w * 0.85, 0, Math.max(w, h) * 0.75); lamp.addColorStop(0, `rgba(255,214,150,${0.22 * a})`); lamp.addColorStop(1, 'rgba(255,214,150,0)');
        g.fillStyle = lamp; g.fillRect(0, 0, w, h);
        if (!cork || Math.abs(w - cw) > 1 || Math.abs(h - ch) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(cork, 0, 0, w, h); g.globalAlpha = 1;
        const fade = drawn > links.length ? 1 - clamp01((drawn - links.length - 1 + prog) / 2) : 1;
        g.lineCap = 'round';
        links.forEach(([i, j], k) => {
          if (k > drawn) return;
          const A = pins[i], B = pins[j], part = k === drawn ? prog : 1;
          const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 + Math.hypot(B.x - A.x, B.y - A.y) * 0.1 + Math.sin(t * 0.8 + k) * u * 0.005;
          const pt = s => [(1 - s) * (1 - s) * A.x + 2 * (1 - s) * s * mx + s * s * B.x, (1 - s) * (1 - s) * A.y + 2 * (1 - s) * s * my + s * s * B.y];
          for (const [dx, col, lw] of [[2, `rgba(0,0,0,${0.25 * a * fade})`, 2], [0, rgba(th.accent, 0.8 * a * fade), 2]]) {
            g.strokeStyle = col; g.lineWidth = lw; g.beginPath();
            for (let s = 0; s <= 24; s++) { const [x, y] = pt(s / 24 * part); s ? g.lineTo(x + dx, y + dx) : g.moveTo(x + dx, y + dx); }
            g.stroke();
          }
        });
        for (const p of pins) { g.save(); g.globalAlpha = a; memoPin(g, p.x, p.y, u * 0.011, '#d6332e'); g.restore(); }
        const lx = (0.5 + 0.38 * Math.sin(t * 0.13)) * w, ly = (0.5 + 0.4 * Math.sin(t * 0.17 + 1)) * h, lr = u * 0.07; // the magnifying glass
        g.save(); g.globalAlpha = a;
        g.strokeStyle = 'rgba(40,24,12,.85)'; g.lineWidth = u * 0.018; g.beginPath(); g.moveTo(lx + lr * 0.75, ly + lr * 0.75); g.lineTo(lx + lr * 1.7, ly + lr * 1.7); g.stroke();
        g.beginPath(); g.arc(lx, ly, lr, 0, Math.PI * 2); g.fillStyle = 'rgba(255,250,235,.1)'; g.fill();
        g.strokeStyle = 'rgba(30,20,10,.75)'; g.lineWidth = u * 0.012; g.stroke();
        g.strokeStyle = 'rgba(214,176,96,.7)'; g.lineWidth = u * 0.005; g.beginPath(); g.arc(lx, ly, lr * 0.93, 0, Math.PI * 2); g.stroke();
        g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = u * 0.006; g.beginPath(); g.arc(lx, ly, lr * 0.72, Math.PI * 1.1, Math.PI * 1.45); g.stroke();
        g.restore();
      },
    };
  },
});

/* ---------- Puzzle collection: sound kits ---------- */
Object.assign(KITS, (S => {
  const scratch = (when, dur, vol) => S.hiss({ dur, vol, type: 'bandpass', freq: rand(2500, 4200), to: rand(2000, 5000), q: 4, when });
  const clack = (f, when, vol) => { S.knock(f, { when, vol }); S.tink(f * 1.9, { when, vol: vol * 0.22, dur: 0.05 }); };
  const pizz = (f, when, vol) => { S.tone(f, { dur: 0.38, vol, when, attack: 0.003, to: f * 0.995 }); S.tone(f * 2, { dur: 0.12, vol: vol * 0.35, when, attack: 0.002 }); };
  const WALK = [0, 3, 5, 7, 10, 12];
  return {
    jigsaw: { // cardboard lifted off the table, a piece clicking into place, a run of them snapping in
      pick() { S.rustle({ vol: 0.035, dur: 0.05 }); },
      place() { S.knock(1150, { vol: 0.17 }); S.thud({ vol: 0.18, f: 150 }); S.hiss({ dur: 0.03, vol: 0.05, type: 'bandpass', freq: 2800, q: 2 }); },
      clear(n) { for (let i = 0; i < n + 3; i++) S.knock(rand(1000, 1400), { when: i * 0.06, vol: 0.1 }); S.pop({ when: (n + 3) * 0.06, vol: 0.12, f: 620 }); },
      deal() { S.rustle({ vol: 0.05, dur: 0.18 }); S.knock(1300, { vol: 0.04, when: 0.1 }); },
    },
    chalk: { // chalk tapped on the board, a few strokes scratched, then the eraser
      pick() { S.knock(2400, { vol: 0.04 }); },
      place() { S.knock(1900, { vol: 0.13 }); scratch(0.01, 0.06, 0.05); S.thud({ vol: 0.14, f: 160 }); },
      clear(n) { const m = Math.min(n + 2, 5); for (let i = 0; i < m; i++) scratch(i * 0.09, 0.12, 0.06); S.hissL({ dur: 0.45, vol: 0.06, type: 'lowpass', freq: 900, to: 380, q: 0.7, when: m * 0.09 + 0.05 }); },
      deal() { S.knock(2100, { vol: 0.05 }); S.knock(2100, { vol: 0.04, when: 0.08 }); },
    },
    domino: { // ivory tiles: a clack when one is set down, a chain of them toppling faster and longer with the combo
      pick() { clack(2100, 0, 0.06); },
      place() { clack(1500, 0, 0.18); clack(1300, 0.035, 0.12); S.thud({ vol: 0.16, f: 140 }); },
      clear(n, combo) {
        const m = 6 + n * 3 + Math.min(combo || 1, 6) * 2; let w = 0, gap = 0.07;
        for (let i = 0; i < m; i++) { clack(rand(1400, 1800), w, 0.09); w += gap; gap = Math.max(0.025, gap * 0.93); }
      },
      deal() { for (let i = 0; i < 6; i++) S.knock(rand(1200, 1700), { when: i * 0.04 + Math.random() * 0.02, vol: 0.05 }); S.rustle({ vol: 0.04, dur: 0.2 }); },
    },
    tangram: { // lacquered wooden pieces: a soft tak, a clatter on a clear and a little chime
      pick() { S.knock(1600, { vol: 0.05 }); },
      place() { S.knock(820, { vol: 0.2 }); S.tink(1640, { vol: 0.03, dur: 0.1 }); S.thud({ vol: 0.15, f: 150 }); },
      clear(n) { for (let i = 0; i < n * 2 + 4; i++) S.knock(rand(700, 1200), { when: i * 0.045 + Math.random() * 0.02, vol: 0.08 }); S.tink(S.snd.root * 2, { when: 0.3, vol: 0.04, dur: 0.6 }); },
      deal() { for (let i = 0; i < 3; i++) S.hiss({ dur: 0.06, vol: 0.04, type: 'lowpass', freq: 1200, when: i * 0.05 }); },
    },
    detective: { // a pin pushed into cork, paper, a string snapping, a double bass walking under it
      pick() { S.rustle({ vol: 0.04, dur: 0.05 }); },
      place() { S.knock(2700, { vol: 0.07 }); S.thud({ vol: 0.22, f: 130 }); },
      clear(n, combo) {
        S.tone(900, { type: 'triangle', dur: 0.12, vol: 0.06, to: 380 }); S.rustle({ vol: 0.07, dur: 0.3, when: 0.05 });
        const r = S.snd.root / 4;
        for (let i = 0; i < Math.min(n + 1, 4); i++) pizz(r * Math.pow(2, WALK[(i + (combo || 0)) % 6] / 12), 0.1 + i * 0.14, 0.16);
      },
      deal() { S.rustle({ vol: 0.05, dur: 0.2 }); S.rustle({ vol: 0.04, dur: 0.15, when: 0.12 }); },
    },
  };
})(Sfx));

/* ---------- Puzzle collection, part 2: shapes shared by blocks, backgrounds, particles and gems ---------- */
// cipher keys: each block colour wears its own letter
const CIPHER_BLOCKS = THEMES.find(t => t.id === 'cipher').blocks;
const cipherLetter = c => 'XKQZRVJ'[Math.max(0, CIPHER_BLOCKS.indexOf(c))];
// a chess piece as a filled silhouette, standing on its base at y + h/2; kind 0 pawn, 1 rook, 2 knight, 3 bishop, 4 queen, 5 king
const CHESS_BLOCKS = THEMES.find(t => t.id === 'chess').blocks;
const ALCHEMY_BLOCKS = THEMES.find(t => t.id === 'alchemy').blocks;
const chessKind = c => [0, 1, 2, 3, 4, 5, 0][Math.max(0, CHESS_BLOCKS.indexOf(c))];
function chessPiece(g, kind, x, y, h, flip = false) {
  const P = (u, v) => [x + (flip ? -u : u) * h, y + v * h];
  const shape = pts => { g.beginPath(); pts.forEach(([u, v], i) => i ? g.lineTo(...P(u, v)) : g.moveTo(...P(u, v))); g.closePath(); g.fill(); };
  const disc = (u, v, r) => { g.beginPath(); g.arc(...P(u, v), r * h, 0, Math.PI * 2); g.fill(); };
  const oval = (u, v, rx, ry) => { g.beginPath(); g.ellipse(...P(u, v), rx * h, ry * h, 0, 0, Math.PI * 2); g.fill(); };
  shape([[-0.32, 0.5], [0.32, 0.5], [0.32, 0.41], [0.22, 0.35], [-0.22, 0.35], [-0.32, 0.41]]); // the base, the same for every piece
  if (kind === 0) { shape([[-0.17, 0.36], [-0.07, 0.0], [0.07, 0.0], [0.17, 0.36]]); oval(0, 0.0, 0.14, 0.04); disc(0, -0.15, 0.14); }
  else if (kind === 1) {
    shape([[-0.18, 0.36], [-0.14, -0.12], [0.14, -0.12], [0.18, 0.36]]);
    shape([[-0.21, -0.1], [-0.21, -0.36], [-0.12, -0.36], [-0.12, -0.28], [-0.04, -0.28], [-0.04, -0.36], [0.04, -0.36], [0.04, -0.28], [0.12, -0.28], [0.12, -0.36], [0.21, -0.36], [0.21, -0.1]]);
  } else if (kind === 2) {
    shape([[-0.2, 0.36], [-0.15, 0.1], [-0.05, -0.04], [-0.2, 0.0], [-0.28, -0.08], [-0.18, -0.24], [-0.04, -0.36], [0.0, -0.46], [0.06, -0.37], [0.16, -0.3], [0.24, -0.12], [0.25, 0.1], [0.21, 0.36]]);
  } else if (kind === 3) {
    shape([[-0.16, 0.36], [-0.07, 0.02], [0.07, 0.02], [0.16, 0.36]]); oval(0, 0.01, 0.15, 0.045);
    oval(0, -0.17, 0.13, 0.18); disc(0, -0.39, 0.05);
  } else {
    shape([[-0.18, 0.36], [-0.09, -0.06], [0.09, -0.06], [0.18, 0.36]]); oval(0, -0.06, 0.17, 0.045);
    if (kind === 4) {
      shape([[-0.19, -0.08], [-0.25, -0.31], [-0.12, -0.17], [-0.06, -0.35], [0, -0.19], [0.06, -0.35], [0.12, -0.17], [0.25, -0.31], [0.19, -0.08]]);
      for (const [u, v] of [[-0.25, -0.33], [-0.06, -0.37], [0.06, -0.37], [0.25, -0.33]]) disc(u, v, 0.04);
    } else {
      shape([[-0.17, -0.08], [-0.21, -0.26], [0.21, -0.26], [0.17, -0.08]]);
      shape([[-0.035, -0.26], [-0.035, -0.38], [-0.1, -0.38], [-0.1, -0.44], [-0.035, -0.44], [-0.035, -0.5], [0.035, -0.5], [0.035, -0.44], [0.1, -0.44], [0.1, -0.38], [0.035, -0.38], [0.035, -0.26]]);
    }
  }
}
// alchemical signs, stroked with the current strokeStyle: fire, water, air, earth, sun, moon, salt
function alchemySign(g, kind, x, y, r) {
  g.beginPath();
  const tri = up => { const d = up ? -1 : 1; g.moveTo(x, y + d * r); g.lineTo(x + r * 0.9, y - d * r * 0.6); g.lineTo(x - r * 0.9, y - d * r * 0.6); g.closePath(); };
  if (kind < 4) { tri(kind % 2 === 0); if (kind >= 2) { const d = kind === 2 ? 1 : -1; g.moveTo(x - r * 0.75, y + d * r * 0.1); g.lineTo(x + r * 0.75, y + d * r * 0.1); } }
  else if (kind === 4) { g.arc(x, y, r * 0.85, 0, Math.PI * 2); g.moveTo(x + r * 0.16, y); g.arc(x, y, r * 0.16, 0, Math.PI * 2); }
  else if (kind === 5) { g.arc(x, y, r * 0.85, Math.PI * 0.35, Math.PI * 1.65); g.arc(x + r * 0.42, y, r * 0.62, Math.PI * 1.25, Math.PI * 0.75, true); }
  else { g.arc(x, y, r * 0.85, 0, Math.PI * 2); g.moveTo(x - r * 0.85, y); g.lineTo(x + r * 0.85, y); }
  g.stroke();
}
// a round-bottomed potion flask with its liquid, a couple of bubbles (lt: [dx, dy, r]) and a cork
function flask(g, x, y, w, c, lt) {
  const r = w * 0.36, by = y + w * 0.1, nw = w * 0.11;
  g.save(); g.beginPath(); g.arc(x, by, r, 0, Math.PI * 2); g.rect(x - nw, y - w * 0.46, nw * 2, w * 0.3); g.clip();
  g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x - r, y - w, r * 2, w * 2);
  const ly = by - r * 0.15, gr = g.createLinearGradient(0, ly, 0, by + r);
  gr.addColorStop(0, mixHex(c, '#ffffff', 0.35)); gr.addColorStop(1, shade(c, -0.25));
  g.fillStyle = gr; g.fillRect(x - r, ly, r * 2, r * 2);
  g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x - r, ly, r * 2, Math.max(1, w * 0.02));
  for (const [dx, dy, br] of lt) { g.beginPath(); g.arc(x + dx * r, by + dy * r, br * w, 0, Math.PI * 2); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = Math.max(0.7, w * 0.012); g.stroke(); }
  g.restore();
  g.beginPath(); g.arc(x, by, r, 0, Math.PI * 2); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = Math.max(1, w * 0.03); g.stroke();
  g.strokeRect(x - nw, y - w * 0.46, nw * 2, w * 0.25);
  rr(g, x - nw * 1.25, y - w * 0.53, nw * 2.5, w * 0.11, w * 0.02); g.fillStyle = '#9a6a3c'; g.fill(); // the cork
  g.beginPath(); g.ellipse(x - r * 0.42, by - r * 0.38, r * 0.14, r * 0.3, 0.5, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.45)'; g.fill();
}
// one face of a 3 x 3 puzzle cube seen straight on
function cubeFace(g, x, y, w, cols, gap = 0.07) {
  rr(g, x, y, w, w, w * 0.1); g.fillStyle = '#101014'; g.fill();
  const q = w / 3;
  cols.forEach((c, i) => {
    const cx = x + (i % 3) * q, cy = y + ((i / 3) | 0) * q;
    rr(g, cx + q * gap, cy + q * gap, q * (1 - 2 * gap), q * (1 - 2 * gap), q * 0.18); g.fillStyle = c; g.fill();
  });
}
// a datum target from a technical drawing: a circle quartered, two quarters filled
function datum(g, x, y, r, col, lw) {
  g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, -Math.PI / 2, 0); g.closePath(); g.fillStyle = col; g.fill();
  g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, Math.PI / 2, Math.PI); g.closePath(); g.fill();
  g.strokeStyle = col; g.lineWidth = lw;
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.moveTo(x - r * 1.35, y); g.lineTo(x + r * 1.35, y); g.moveTo(x, y - r * 1.35); g.lineTo(x, y + r * 1.35); g.stroke();
}

/* ---------- Puzzle collection, part 2: block looks and textures ---------- */
Object.assign(STYLES, {
  cipherkey: { // a round typewriter key in a chrome ring, its letter printed on top, set in the dark machine
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.12); g.fillStyle = '#121618'; g.fill();
      g.beginPath(); g.arc(s * 0.5, s * 0.54, s * 0.4, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.6)'; g.fill();
      const ring = g.createLinearGradient(0, s * 0.1, 0, s * 0.9); ring.addColorStop(0, '#f2f4f2'); ring.addColorStop(0.5, '#7c8482'); ring.addColorStop(1, '#d4d8d6');
      g.beginPath(); g.arc(s * 0.5, s * 0.49, s * 0.4, 0, Math.PI * 2); g.fillStyle = ring; g.fill();
      const cap = g.createRadialGradient(s * 0.42, s * 0.38, s * 0.02, s * 0.5, s * 0.5, s * 0.36);
      cap.addColorStop(0, mixHex(c, '#ffffff', 0.35)); cap.addColorStop(1, shade(c, -0.3));
      g.beginPath(); g.arc(s * 0.5, s * 0.49, s * 0.33, 0, Math.PI * 2); g.fillStyle = cap; g.fill();
      TEX.cipherkey(g, s, c, seeded(c), 1);
    },
  },
  cubeface: { // a sticker on the black plastic of a puzzle cube
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.14); g.fillStyle = '#0c0c10'; g.fill();
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.14); g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = Math.max(1, s * 0.02); g.stroke();
      const gr = g.createLinearGradient(0, s * 0.1, 0, s * 0.9); gr.addColorStop(0, mixHex(c, '#ffffff', 0.22)); gr.addColorStop(1, shade(c, -0.12));
      rr(g, s * 0.12, s * 0.12, s * 0.76, s * 0.76, s * 0.14); g.fillStyle = gr; g.fill();
      g.save(); rr(g, s * 0.12, s * 0.12, s * 0.76, s * 0.76, s * 0.14); g.clip();
      poly(g, [[s * 0.12, s * 0.12], [s * 0.88, s * 0.12], [s * 0.12, s * 0.62]], 'rgba(255,255,255,.18)');
      g.restore();
    },
  },
  draft: { // a part drawn on blueprint paper: tinted fill, white outline, hatching and a dimension line
    block(g, s, c) {
      g.fillStyle = rgba(c, 0.62); g.fillRect(s * 0.08, s * 0.08, s * 0.84, s * 0.84);
      g.save(); g.beginPath(); g.rect(s * 0.08, s * 0.08, s * 0.84, s * 0.84); g.clip();
      TEX.draft(g, s, c, seeded(c), 1);
      g.restore();
      g.strokeStyle = '#f4f9ff'; g.lineWidth = Math.max(1, s * 0.04); g.strokeRect(s * 0.08, s * 0.08, s * 0.84, s * 0.84);
      g.strokeStyle = 'rgba(244,249,255,.7)'; g.lineWidth = Math.max(1, s * 0.015);
      g.beginPath(); for (const [x, y] of [[0.08, 0.08], [0.92, 0.08], [0.08, 0.92], [0.92, 0.92]]) { g.moveTo(s * x - s * 0.06, s * y); g.lineTo(s * x + s * 0.06, s * y); g.moveTo(s * x, s * y - s * 0.06); g.lineTo(s * x, s * y + s * 0.06); } g.stroke();
    },
  },
  flask: { // a glowing potion on a dark wooden shelf
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.fillStyle = '#1c1220'; g.fill();
      const glow = g.createRadialGradient(s * 0.5, s * 0.6, 0, s * 0.5, s * 0.6, s * 0.5); glow.addColorStop(0, rgba(c, 0.45)); glow.addColorStop(1, rgba(c, 0));
      g.fillStyle = glow; g.fillRect(0, 0, s, s);
      g.fillStyle = '#4a2e1c'; g.fillRect(s * 0.04, s * 0.86, s * 0.92, s * 0.1); g.fillStyle = 'rgba(255,220,170,.25)'; g.fillRect(s * 0.04, s * 0.86, s * 0.92, Math.max(1, s * 0.015));
      const rnd = seeded(c);
      flask(g, s * 0.5, s * 0.5, s * 0.78, c, [[-0.2 + rnd() * 0.4, 0.3 + rnd() * 0.3, 0.025], [0.1 + rnd() * 0.2, 0.15 + rnd() * 0.2, 0.017]]);
    },
  },
  chesstile: { // a polished square of the board with a piece inlaid in it
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.05, s * 0.94, s * 0.92, s * 0.08); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill();
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.2)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.22));
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.9, s * 0.08); g.fillStyle = gr; g.fill();
      g.strokeStyle = 'rgba(255,240,200,.35)'; g.lineWidth = Math.max(1, s * 0.02); g.strokeRect(s * 0.11, s * 0.1, s * 0.78, s * 0.74);
      TEX.chesstile(g, s, c, seeded(c), 1);
      g.beginPath(); g.ellipse(s * 0.3, s * 0.13, s * 0.18, s * 0.035, -0.2, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.35)'; g.fill();
    },
  },
});

Object.assign(TEX, {
  cipherkey(g, s, c, rnd, k) { // the key's letter, dark on pale caps and white on dark ones
    const light = hexRgb(c).reduce((a, b) => a + b, 0) > 560;
    g.font = `800 ${s * 0.38}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = light ? `rgba(30,30,34,${0.85 * k})` : `rgba(255,255,255,${0.92 * k})`;
    g.fillText(cipherLetter(c), s * 0.5, s * 0.53);
  },
  cubeface(g, s, c, rnd, k) { // the classic tile is cut into a cube face of nine stickers
    g.strokeStyle = `rgba(0,0,0,${0.4 * k})`; g.lineWidth = Math.max(1, s * 0.035);
    g.beginPath(); for (const v of [1 / 3, 2 / 3]) { g.moveTo(s * v, s * 0.1); g.lineTo(s * v, s * 0.9); g.moveTo(s * 0.1, s * v); g.lineTo(s * 0.9, s * v); } g.stroke();
  },
  draft(g, s, c, rnd, k) { // 45° hatching, a centre mark and a little dimension line
    g.strokeStyle = `rgba(255,255,255,${0.3 * k})`; g.lineWidth = Math.max(1, s * 0.018);
    g.beginPath(); for (let i = -s; i < s; i += s * 0.14) { g.moveTo(i, s); g.lineTo(i + s, 0); } g.stroke();
    g.strokeStyle = `rgba(244,249,255,${0.9 * k})`; g.lineWidth = Math.max(1, s * 0.02); g.setLineDash([s * 0.08, s * 0.04, s * 0.02, s * 0.04]);
    g.beginPath(); g.moveTo(s * 0.5, s * 0.2); g.lineTo(s * 0.5, s * 0.8); g.moveTo(s * 0.2, s * 0.5); g.lineTo(s * 0.8, s * 0.5); g.stroke(); g.setLineDash([]);
    const r = s * (0.12 + rnd() * 0.08);
    g.beginPath(); g.arc(s * 0.5, s * 0.5, r, 0, Math.PI * 2); g.stroke();
  },
  flask(g, s, c, rnd, k) { g.strokeStyle = `rgba(255,248,230,${0.6 * k})`; g.lineWidth = Math.max(1, s * 0.04); g.lineJoin = 'round'; alchemySign(g, Math.max(0, ALCHEMY_BLOCKS.indexOf(c)), s * 0.5, s * 0.52, s * 0.26); },
  chesstile(g, s, c, rnd, k) { // the piece inlaid in a lighter or darker wood than the square
    const light = hexRgb(c).reduce((a, b) => a + b, 0) > 520;
    g.fillStyle = light ? `rgba(40,28,20,${0.62 * k})` : `rgba(255,246,226,${0.7 * k})`;
    chessPiece(g, chessKind(c), s * 0.5, s * 0.47, s * 0.62);
  },
});

/* ---------- Puzzle collection, part 2: each theme's own gem ---------- */
Object.assign(GEM_LOOKS, {
  cipher(g, s, th) { // a lamp on the lampboard, lit with the coded letter
    const gl = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s * 0.48); gl.addColorStop(0, rgba(th.accent, 0.9)); gl.addColorStop(0.55, rgba(th.accent, 0.35)); gl.addColorStop(1, rgba(th.accent, 0));
    g.fillStyle = gl; g.fillRect(0, 0, s, s);
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.3, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.55)'; g.fill();
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.26, 0, Math.PI * 2); g.fillStyle = mixHex(th.accent, '#fff6d8', 0.45); g.fill();
    g.fillStyle = '#2a1a06'; g.strokeStyle = '#2a1a06'; g.lineWidth = s * 0.05; g.lineCap = 'round'; // the key that breaks the code
    g.beginPath(); g.arc(s * 0.4, s * 0.5, s * 0.09, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(s * 0.49, s * 0.5); g.lineTo(s * 0.68, s * 0.5); g.moveTo(s * 0.62, s * 0.5); g.lineTo(s * 0.62, s * 0.58); g.moveTo(s * 0.68, s * 0.5); g.lineTo(s * 0.68, s * 0.6); g.stroke();
  },
  cube(g, s, th) { // a little cube in three-quarter view, solved on every side
    const cx = s / 2, cy = s * 0.5, r = s * 0.3, h = r * Math.sqrt(3) / 2;
    const top = [[cx, cy - r], [cx + h, cy - r / 2], [cx, cy], [cx - h, cy - r / 2]], left = [[cx - h, cy - r / 2], [cx, cy], [cx, cy + r], [cx - h, cy + r / 2]], right = [[cx, cy], [cx + h, cy - r / 2], [cx + h, cy + r / 2], [cx, cy + r]];
    g.lineJoin = 'round'; g.beginPath(); [[cx, cy - r], [cx + h, cy - r / 2], [cx + h, cy + r / 2], [cx, cy + r], [cx - h, cy + r / 2], [cx - h, cy - r / 2]].forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
    g.fillStyle = '#0c0c10'; g.fill(); g.lineWidth = s * 0.05; g.strokeStyle = 'rgba(0,0,0,.6)'; g.stroke();
    const face = (Q, col) => { // nine stickers on a parallelogram
      const [A, B, , D] = Q, ux = (B[0] - A[0]) / 3, uy = (B[1] - A[1]) / 3, vx = (D[0] - A[0]) / 3, vy = (D[1] - A[1]) / 3;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
        const P = (a, b) => [A[0] + ux * (i + a) + vx * (j + b), A[1] + uy * (i + a) + vy * (j + b)];
        poly(g, [P(0.12, 0.12), P(0.88, 0.12), P(0.88, 0.88), P(0.12, 0.88)], col);
      }
    };
    face(top, th.accent); face(left, '#e8333a'); face(right, '#2a6ce8');
  },
  blueprint(g, s, th) { // a datum target, the reference every dimension is measured from
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.36, 0, Math.PI * 2); g.fillStyle = 'rgba(10,30,60,.6)'; g.fill();
    datum(g, s / 2, s / 2, s * 0.24, th.accent, Math.max(1, s * 0.04));
  },
  alchemy(g, s, th) { // the philosopher's stone: a red stone engraved with circle, square, triangle and circle
    const gr = g.createRadialGradient(s * 0.42, s * 0.38, s * 0.02, s / 2, s / 2, s * 0.34); gr.addColorStop(0, '#ff8a8a'); gr.addColorStop(0.6, '#c8202a'); gr.addColorStop(1, '#5a0810');
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.36, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.5)'; g.fill();
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.32, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
    g.strokeStyle = '#ffd86a'; g.lineWidth = Math.max(1, s * 0.022); g.lineJoin = 'round';
    const R = s * 0.27, a = R * Math.SQRT1_2;
    g.beginPath(); g.arc(s / 2, s / 2, R, 0, Math.PI * 2); g.stroke();
    g.strokeRect(s / 2 - a, s / 2 - a, a * 2, a * 2);
    g.beginPath(); g.moveTo(s / 2, s / 2 - a); g.lineTo(s / 2 + a, s / 2 + a); g.lineTo(s / 2 - a, s / 2 + a); g.closePath(); g.stroke();
    g.beginPath(); g.arc(s / 2, s / 2 + a * 0.33, a * 0.42, 0, Math.PI * 2); g.stroke();
    sparkle(g, s * 0.36, s * 0.32, s * 0.09, 0.9);
  },
  chess(g, s, th) { // the king in gold
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.38, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.4)'; g.fill();
    g.save(); g.translate(s * 0.02, s * 0.03); g.fillStyle = 'rgba(0,0,0,.55)'; chessPiece(g, 5, s / 2, s * 0.5, s * 0.62); g.restore();
    const gr = g.createLinearGradient(0, s * 0.18, 0, s * 0.82); gr.addColorStop(0, '#fff2b0'); gr.addColorStop(0.5, th.accent); gr.addColorStop(1, '#8a5a12');
    g.fillStyle = gr; chessPiece(g, 5, s / 2, s * 0.5, s * 0.62);
    sparkle(g, s * 0.4, s * 0.3, s * 0.08, 0.9);
  },
});

/* ---------- Puzzle collection, part 2: clear-effect particles ---------- */
Object.assign(PARTS, {
  cipherchar(p, s) { // a typed letter flying off the tape
    ctx.rotate(p.rot * 0.5); rr(ctx, -s * 0.45, -s * 0.5, s * 0.9, s, s * 0.1); ctx.fillStyle = '#f4efe0'; ctx.fill();
    ctx.font = `800 ${s * 0.8}px "Baloo 2", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = shade(p.color, -0.35);
    ctx.fillText('XKQZRVJ'[(p.ph * 7 | 0) % 7], 0, s * 0.06);
  },
  sticker(p, s) { ctx.rotate(p.rot); ctx.scale(1, 0.3 + 0.7 * Math.abs(Math.cos(p.life * 7 + p.ph))); rr(ctx, -s * 0.5, -s * 0.5, s, s, s * 0.18); ctx.fillStyle = '#0c0c10'; ctx.fill(); rr(ctx, -s * 0.38, -s * 0.38, s * 0.76, s * 0.76, s * 0.14); ctx.fillStyle = p.color; ctx.fill(); },
  dimension(p, s) { // a dimension line with its two arrowheads
    ctx.rotate(p.rot * 0.4); ctx.strokeStyle = '#f4f9ff'; ctx.fillStyle = '#f4f9ff'; ctx.lineWidth = Math.max(1, s * 0.08);
    ctx.beginPath(); ctx.moveTo(-s * 0.7, 0); ctx.lineTo(s * 0.7, 0); ctx.moveTo(-s * 0.7, -s * 0.25); ctx.lineTo(-s * 0.7, s * 0.25); ctx.moveTo(s * 0.7, -s * 0.25); ctx.lineTo(s * 0.7, s * 0.25); ctx.stroke();
    poly(ctx, [[-s * 0.7, 0], [-s * 0.45, -s * 0.12], [-s * 0.45, s * 0.12]], '#f4f9ff'); poly(ctx, [[s * 0.7, 0], [s * 0.45, -s * 0.12], [s * 0.45, s * 0.12]], '#f4f9ff');
  },
  rune(p, s) { ctx.rotate(Math.sin(p.life * 3 + p.ph) * 0.4); ctx.strokeStyle = mixHex(p.color, '#ffffff', 0.45); ctx.lineWidth = Math.max(1.2, s * 0.14); ctx.lineJoin = 'round'; alchemySign(ctx, (p.ph * 7 | 0) % 7, 0, 0, s * 0.6); },
  chessman(p, s) { ctx.rotate(p.rot * 0.4); ctx.fillStyle = 'rgba(0,0,0,.35)'; chessPiece(ctx, (p.ph * 6 | 0) % 6, s * 0.06, s * 0.08, s * 1.3); ctx.fillStyle = mixHex(p.color, '#ffffff', 0.15); chessPiece(ctx, (p.ph * 6 | 0) % 6, 0, 0, s * 1.3); },
});

/* ---------- Puzzle collection, part 2: living backgrounds ---------- */
Object.assign(AMBIENTS, {
  enigma(th) { // a cipher machine: rotors stepping at the sides, letters lighting on the lampboard, coded tape running out below
    const ROWS = ['QWERTZUIO', 'ASDFGHJK', 'PYXCVBNML'], ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let t = 0, keyT = 0.5, lit = null, rot = [3, 17, 9], step = [0, 0, 0], tape = '', off = 0, base = null, bw = 0, bh = 0;
    for (let i = 0; i < 60; i++) tape += (i % 6 === 5) ? ' ' : ABC[(Math.random() * 26) | 0];
    const lamps = [];
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 1400; i++) { g.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,.02)' : 'rgba(0,0,0,.12)'; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } // crackle paint
      lamps.length = 0;
      const lr = Math.min(u * 0.026, w / 28), top = h * 0.885; // low, under the tray
      ROWS.forEach((row, ri) => [...row].forEach((ch, ci) => {
        const x = w / 2 + (ci - (row.length - 1) / 2) * lr * 2.6, y = top + ri * lr * 2.3;
        g.beginPath(); g.arc(x, y, lr, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.5)'; g.fill();
        g.beginPath(); g.arc(x, y, lr * 0.82, 0, Math.PI * 2); g.fillStyle = 'rgba(240,230,200,.05)'; g.fill();
        g.font = `700 ${lr}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(240,230,200,.2)'; g.fillText(ch, x, y + lr * 0.08);
        lamps.push({ ch, x, y, r: lr });
      }));
    }
    return {
      step(dt) {
        t += dt; keyT -= dt; off += dt * 26;
        if (keyT <= 0 && lamps.length) {
          keyT = rand(0.35, 0.9); lit = { i: (Math.random() * lamps.length) | 0, t0: t };
          step[2] = 1; rot[2] = (rot[2] + 1) % 26; // the fast rotor steps on every key, the next one every full turn
          if (rot[2] === 0) { step[1] = 1; rot[1] = (rot[1] + 1) % 26; if (rot[1] === 0) { step[0] = 1; rot[0] = (rot[0] + 1) % 26; } }
        }
        for (let k = 0; k < 3; k++) step[k] = Math.max(0, step[k] - dt * 5);
      },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        if (lit) { // the lit lamp glows, then fades
          const L = lamps[lit.i], k = clamp01(1 - (t - lit.t0) / 0.8);
          const gl = g.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r * 4); gl.addColorStop(0, rgba(th.accent, 0.55 * k * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(L.x - L.r * 4, L.y - L.r * 4, L.r * 8, L.r * 8);
          g.beginPath(); g.arc(L.x, L.y, L.r * 0.82, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.85 * k * a); g.fill();
          g.font = `800 ${L.r}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(40,24,4,${k * a})`; g.fillText(L.ch, L.x, L.y + L.r * 0.08);
        }
        const rw = u * 0.075, rh = u * 0.26; // three rotors standing at the edges, ridged, a window showing the letter
        [[0.035, 0], [0.965, 1], [0.035, 2]].forEach(([fx, k], idx) => {
          const x = fx * w - rw / 2, y = h * (idx === 2 ? 0.52 : 0.3) - rh / 2 + (idx === 1 ? h * 0.1 : 0);
          const gr = g.createLinearGradient(x, 0, x + rw, 0); gr.addColorStop(0, `rgba(40,44,46,${0.9 * a})`); gr.addColorStop(0.5, `rgba(120,126,124,${0.9 * a})`); gr.addColorStop(1, `rgba(40,44,46,${0.9 * a})`);
          g.fillStyle = gr; g.fillRect(x, y, rw, rh);
          const sp = rh / 12, ro = (rot[k] + 1 - step[k]) * sp;
          g.fillStyle = `rgba(0,0,0,${0.35 * a})`;
          for (let j = -1; j < 13; j++) { const yy = y + ((j * sp + ro) % rh + rh) % rh; g.fillRect(x, yy, rw, Math.max(1, sp * 0.25)); }
          rr(g, x + rw * 0.15, y + rh / 2 - rw * 0.4, rw * 0.7, rw * 0.8, rw * 0.1); g.fillStyle = `rgba(245,238,220,${0.85 * a})`; g.fill();
          g.font = `800 ${rw * 0.5}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(30,24,16,${a})`;
          g.fillText(ABC[rot[k]], x + rw / 2, y + rh / 2 + rw * 0.04 - step[k] * rw * 0.3);
        });
        const ty = h * 0.965, th2 = u * 0.04, cw = th2 * 0.62; // the coded tape running out along the bottom
        g.fillStyle = `rgba(240,232,210,${0.7 * a})`; g.fillRect(0, ty - th2 / 2, w, th2);
        g.font = `700 ${th2 * 0.7}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(40,30,20,${0.75 * a})`;
        const n = tape.length, shift = off % (n * cw);
        for (let i = 0; i * cw < w + cw * n; i++) { const x = i * cw - shift; if (x < -cw || x > w + cw) continue; g.fillText(tape[i % n], x, ty + th2 * 0.05); }
      },
    };
  },
  cubes(th) { // puzzle cubes turning in space; now and then their stickers get shuffled
    const FACES = [[[1, 0, 0], [0, 0, -1], [0, 1, 0]], [[-1, 0, 0], [0, 0, 1], [0, 1, 0]], [[0, 1, 0], [1, 0, 0], [0, 0, 1]], [[0, -1, 0], [1, 0, 0], [0, 0, -1]], [[0, 0, 1], [1, 0, 0], [0, 1, 0]], [[0, 0, -1], [-1, 0, 0], [0, 1, 0]]];
    const COLS = th.blocks.slice(0, 6);
    const mk = (x, y, s) => ({ x, y, s, ax: rand(0, 6.3), ay: rand(0, 6.3), vx: rand(0.1, 0.25), vy: rand(0.15, 0.35), st: FACES.map((_, f) => Array(9).fill(f)), flip: Array(54).fill(1), wait: rand(2, 6) });
    const C = [mk(0.12, 0.88, 0.075), mk(0.87, 0.83, 0.06), mk(0.9, 0.26, 0.045), mk(0.1, 0.27, 0.04)];
    const rot = (v, ax, ay) => { const [x, y, z] = v, cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax); const x1 = x * cy + z * sy, z1 = -x * sy + z * cy; return [x1, y * cx - z1 * sx, y * sx + z1 * cx]; };
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const c of C) {
          c.ax += c.vx * dt; c.ay += c.vy * dt; c.wait -= dt;
          for (let i = 0; i < 54; i++) c.flip[i] = Math.min(1, c.flip[i] + dt * 3);
          if (c.wait <= 0) { // shuffle a few stickers, or solve the cube again after a while
            c.wait = rand(3, 6);
            const solve = Math.random() < 0.25;
            c.st.forEach((f, fi) => f.forEach((_, i) => { if (solve ? f[i] !== fi : Math.random() < 0.35) { f[i] = solve ? fi : (Math.random() * 6) | 0; c.flip[fi * 9 + i] = 0; } }));
          }
        }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const c of C) {
          const S = c.s * u * 2, cx = c.x * w, cy = c.y * h;
          const faces = FACES.map(([n, uu, vv], fi) => ({ fi, n: rot(n, c.ax, c.ay), uu: rot(uu, c.ax, c.ay), vv: rot(vv, c.ax, c.ay) })).filter(f => f.n[2] > 0.02).sort((p, q) => p.n[2] - q.n[2]);
          for (const f of faces) {
            const at = (a2, b2) => [cx + (f.n[0] * 0.5 + f.uu[0] * (a2 - 0.5) + f.vv[0] * (b2 - 0.5)) * S, cy + (f.n[1] * 0.5 + f.uu[1] * (a2 - 0.5) + f.vv[1] * (b2 - 0.5)) * S];
            poly(g, [at(0, 0), at(1, 0), at(1, 1), at(0, 1)], `rgba(12,12,16,${0.85 * a})`);
            const lightK = 0.55 + 0.45 * f.n[2];
            for (let i = 0; i < 9; i++) {
              const q = (i % 3) / 3, r2 = ((i / 3) | 0) / 3, d = 0.025 + (1 - c.flip[f.fi * 9 + i]) * 0.13; // a sticker that just changed grows back in
              poly(g, [at(q + d, r2 + d), at(q + 1 / 3 - d, r2 + d), at(q + 1 / 3 - d, r2 + 1 / 3 - d), at(q + d, r2 + 1 / 3 - d)], rgba(hexOf(mixHex(COLS[c.st[f.fi][i]], '#000000', 1 - lightK)), 0.75 * a));
            }
          }
        }
        const glow = g.createRadialGradient(w / 2, h * 0.55, 0, w / 2, h * 0.55, Math.max(w, h) * 0.6); glow.addColorStop(0, rgba(th.accent, 0.06 * a)); glow.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = glow; g.fillRect(0, 0, w, h);
      },
    };
  },
  drafting(th) { // blueprint paper: parts drawn line by line with dimensions, a compass swinging round, a title block in the corner
    let base = null, bw = 0, bh = 0, t = 0, next = 0.3;
    const SLOTS = [[0.06, 0.2], [0.62, 0.2], [0.08, 0.76], [0.58, 0.74], [0.3, 0.86], [0.04, 0.48], [0.74, 0.48]];
    const KINDS = ['circle', 'rect', 'hex', 'gear', 'angle'];
    const items = [], LIFE = 11;
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h), q = u * 0.035;
      g.lineWidth = 1;
      for (let i = 0, x = 0; x < w; i++, x += q) { g.strokeStyle = i % 5 ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.11)'; g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, h); g.stroke(); }
      for (let i = 0, y = 0; y < h; i++, y += q) { g.strokeStyle = i % 5 ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.11)'; g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(w, y + 0.5); g.stroke(); }
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.strokeRect(u * 0.02, u * 0.02, w - u * 0.04, h - u * 0.04);
      const tw = Math.min(w * 0.42, u * 0.5), tbh = u * 0.09, tx = w - u * 0.02 - tw, ty = h - u * 0.02 - tbh; // title block
      g.fillStyle = 'rgba(10,40,80,.5)'; g.fillRect(tx, ty, tw, tbh); g.strokeRect(tx, ty, tw, tbh);
      g.lineWidth = 1; g.beginPath(); g.moveTo(tx, ty + tbh / 2); g.lineTo(tx + tw, ty + tbh / 2); g.moveTo(tx + tw * 0.6, ty); g.lineTo(tx + tw * 0.6, ty + tbh); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.55)'; g.font = `700 ${tbh * 0.3}px "Baloo 2", sans-serif`; g.textBaseline = 'middle'; g.textAlign = 'left';
      g.fillText('BLOKZEN', tx + tw * 0.04, ty + tbh * 0.27); g.fillText('PAFTA 8×8', tx + tw * 0.04, ty + tbh * 0.76);
      g.fillText('ÖLÇEK 1:1', tx + tw * 0.64, ty + tbh * 0.27); g.fillText('A-01', tx + tw * 0.64, ty + tbh * 0.76);
    }
    function add() {
      const used = new Set(items.map(o => o.slot)), free = SLOTS.map((_, i) => i).filter(i => !used.has(i));
      if (!free.length) return;
      items.push({ slot: free[(Math.random() * free.length) | 0], age: 0, kind: KINDS[(Math.random() * KINDS.length) | 0], n: 10 + ((Math.random() * 90) | 0) });
    }
    return {
      step(dt) { t += dt; next -= dt; if (next <= 0) { next = rand(2.4, 3.6); add(); } for (const o of items) o.age += dt; for (let i = items.length - 1; i >= 0; i--) if (items[i].age > LIFE) items.splice(i, 1); },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), R = u * 0.06;
        g.lineCap = 'round'; g.lineJoin = 'round';
        for (const o of items) {
          const [sx, sy] = SLOTS[o.slot], x = sx * w + R * 1.2, y = sy * h + R * 1.2;
          const wr = clamp01(o.age / 2), fade = clamp01((LIFE - o.age) / 1.2), al = 0.6 * a * fade;
          g.strokeStyle = `rgba(244,249,255,${al})`; g.fillStyle = `rgba(244,249,255,${al})`; g.lineWidth = 1.8;
          const dash = L => g.setLineDash([L * wr, L + 1]);
          g.beginPath();
          if (o.kind === 'circle') { dash(Math.PI * 2 * R); g.arc(x, y, R, -Math.PI / 2, Math.PI * 1.5); }
          else if (o.kind === 'rect') { dash(R * 7.2); g.rect(x - R * 1.1, y - R * 0.7, R * 2.2, R * 1.4); }
          else if (o.kind === 'hex') { dash(R * 6.2); hexPath(g, x, y, R); }
          else if (o.kind === 'gear') { dash(R * 14); gearPath(g, x, y, R, 10, 0, 0.3); }
          else { dash(R * 4.4); g.moveTo(x - R, y + R * 0.6); g.lineTo(x + R * 1.2, y + R * 0.6); g.moveTo(x - R, y + R * 0.6); g.lineTo(x + R * 0.6, y - R * 0.9); }
          g.stroke(); g.setLineDash([]);
          if (wr >= 1) { // dimensions and a centre mark once the part is drawn
            g.lineWidth = 1;
            g.beginPath(); g.moveTo(x - R * 0.25, y); g.lineTo(x + R * 0.25, y); g.moveTo(x, y - R * 0.25); g.lineTo(x, y + R * 0.25); g.stroke();
            const dy = y + R * 1.45, x0 = x - R * 1.1, x1 = x + R * 1.1;
            g.beginPath(); g.moveTo(x0, dy); g.lineTo(x1, dy); g.moveTo(x0, dy - R * 0.2); g.lineTo(x0, dy + R * 0.2); g.moveTo(x1, dy - R * 0.2); g.lineTo(x1, dy + R * 0.2); g.stroke();
            poly(g, [[x0, dy], [x0 + R * 0.2, dy - R * 0.08], [x0 + R * 0.2, dy + R * 0.08]], `rgba(244,249,255,${al})`); poly(g, [[x1, dy], [x1 - R * 0.2, dy - R * 0.08], [x1 - R * 0.2, dy + R * 0.08]], `rgba(244,249,255,${al})`);
            g.font = `700 ${R * 0.42}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'bottom'; g.fillStyle = `rgba(244,249,255,${al})`;
            g.fillText(o.kind === 'circle' ? `Ø${o.n}` : o.kind === 'angle' ? `${30 + (o.n % 4) * 15}°` : String(o.n), x, dy - R * 0.06);
          } else if (o.kind === 'circle') { // the compass swinging round while it draws
            const an = -Math.PI / 2 + wr * Math.PI * 2, px = x + Math.cos(an) * R, py = y + Math.sin(an) * R, hx = (x + px) / 2 - Math.sin(an) * R * 0.1, hy = Math.min(y, py) - R * 1.4;
            g.strokeStyle = `rgba(255,255,255,${0.75 * a})`; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x, y); g.lineTo(hx, hy); g.lineTo(px, py); g.stroke();
            g.beginPath(); g.arc(hx, hy, 3.5, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.9 * a); g.fill();
          }
        }
      },
    };
  },
  alchemylab(th) { // a bubbling cauldron, shelves of jars, alchemical signs drifting up through the vapour
    let base = null, bw = 0, bh = 0, t = 0, acc = 0, B = [], V = [];
    const SG = [...Array(12)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.012, 0.03), k: (Math.random() * 7) | 0, ph: rand(0, 6.3), s: rand(0.7, 1.3) }));
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h);
      for (const [x0, x1] of [[0, w * 0.2], [w * 0.8, w]]) for (const y of [0.3, 0.55]) { // two shelves of jars on each wall
        const sy = h * y;
        g.fillStyle = 'rgba(80,50,30,.55)'; g.fillRect(x0, sy, x1 - x0, u * 0.014);
        for (let x = x0 + u * 0.02; x < x1 - u * 0.03; x += u * rand(0.045, 0.065)) {
          const jw = u * rand(0.028, 0.042), jh = jw * rand(1.1, 1.8), c = th.blocks[(Math.random() * 7) | 0];
          rr(g, x, sy - jh, jw, jh, jw * 0.25); g.fillStyle = 'rgba(255,255,255,.08)'; g.fill();
          rr(g, x, sy - jh * 0.6, jw, jh * 0.6, jw * 0.2); g.fillStyle = rgba(c, 0.35); g.fill();
          g.fillStyle = 'rgba(120,80,50,.6)'; g.fillRect(x + jw * 0.15, sy - jh - jw * 0.15, jw * 0.7, jw * 0.18);
        }
      }
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        if (acc > 0.18) { acc = 0; B.push({ x: rand(-0.09, 0.09), life: 0, r: rand(0.006, 0.014) }); if (Math.random() < 0.45) V.push({ x: rand(-0.06, 0.06), y: 0, life: 0 }); }
        for (const b of B) b.life += dt / 0.9;
        B = B.filter(b => b.life < 1);
        for (const v of V) { v.life += dt / 5; v.y -= 0.05 * dt; v.x += Math.sin(t + v.life * 6) * 0.01 * dt; }
        V = V.filter(v => v.life < 1);
        for (const s of SG) { s.y -= s.v * dt; s.ph += dt; if (s.y < 0.15) { s.y = 1.0; s.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), cx = w / 2, cy = h * 0.97, cr = u * 0.17;
        const gl = g.createRadialGradient(cx, cy - cr * 0.6, 0, cx, cy - cr * 0.6, u * 0.6); gl.addColorStop(0, rgba(th.accent, 0.22 * a)); gl.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gl; g.fillRect(0, 0, w, h);
        for (const v of V) { const r = u * (0.03 + v.life * 0.1), x = cx + v.x * w, y = cy - cr * 0.7 + v.y * h, al = Math.sin(v.life * Math.PI) * 0.12 * a; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(th.accent, al)); gr.addColorStop(1, rgba(th.accent, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
        g.beginPath(); g.ellipse(cx, cy - cr * 0.62, cr * 0.95, cr * 0.2, 0, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.6 * a); g.fill(); // the brew
        for (const b of B) { const x = cx + b.x * w, y = cy - cr * 0.65 - b.life * cr * 0.25, r = b.r * u * (0.6 + b.life); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.strokeStyle = `rgba(230,255,235,${0.7 * (1 - b.life) * a})`; g.lineWidth = 1.5; g.stroke(); }
        g.beginPath(); g.moveTo(cx - cr, cy - cr * 0.62); g.quadraticCurveTo(cx - cr * 1.15, cy + cr * 0.2, cx - cr * 0.6, cy + cr * 0.35); g.lineTo(cx + cr * 0.6, cy + cr * 0.35); g.quadraticCurveTo(cx + cr * 1.15, cy + cr * 0.2, cx + cr, cy - cr * 0.62);
        g.quadraticCurveTo(cx, cy - cr * 0.38, cx - cr, cy - cr * 0.62); g.fillStyle = `rgba(16,12,18,${0.95 * a})`; g.fill(); // the cauldron in front of its brew
        g.beginPath(); g.ellipse(cx, cy - cr * 0.62, cr, cr * 0.2, 0, 0, Math.PI); g.strokeStyle = `rgba(90,80,100,${0.8 * a})`; g.lineWidth = u * 0.012; g.stroke();
        g.lineWidth = 1.8; g.lineJoin = 'round';
        for (const s of SG) { const k = Math.sin(clamp01((1 - s.y) / 0.85) * Math.PI); g.strokeStyle = rgba(th.accent, 0.5 * k * a); alchemySign(g, s.k, (s.x + Math.sin(t * 0.5 + s.ph) * 0.02) * w, s.y * h, u * 0.022 * s.s); }
      },
    };
  },
  chessboard(th) { // a big board under the game; pieces make their moves one after another, the last move marked
    let q = 0, cols = 0, rows = 0, r0 = 0, base = null, bw = 0, bh = 0, t = 0, wait = 1, mv = null, last = null;
    let P = [];
    const DIRS = { 1: [[1, 0], [-1, 0], [0, 1], [0, -1]], 3: [[1, 1], [1, -1], [-1, 1], [-1, -1]] };
    function build(w, h) {
      bw = w; bh = h; q = Math.max(42, Math.min(w, h) * 0.13); cols = Math.ceil(w / q); rows = Math.ceil(h / q); r0 = Math.ceil(h * 0.18 / q); // pieces stay below the score
      base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d');
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { g.fillStyle = (r + c) % 2 ? 'rgba(0,0,0,.18)' : 'rgba(255,236,200,.05)'; g.fillRect(c * q, r * q, q, q); }
      P = [];
      const kinds = [0, 0, 1, 2, 3, 4, 5, 0, 2, 3];
      kinds.forEach((k, i) => { for (let tries = 0; tries < 30; tries++) { const c = (Math.random() * cols) | 0, r = r0 + ((Math.random() * (rows - r0)) | 0); if (!P.some(p => p.c === c && p.r === r)) { P.push({ k, side: i % 2, c, r, x: c, y: r, gone: 0 }); break; } } });
    }
    function plan() {
      const p = P[(Math.random() * P.length) | 0]; if (!p || p.gone) return;
      const ok = (c, r) => c >= 0 && r >= r0 && c < cols && r < rows && !P.some(o => o !== p && !o.gone && o.c === c && o.r === r && o.side === p.side);
      let opts = [];
      if (p.k === 2) opts = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]].map(([dc, dr]) => [p.c + dc, p.r + dr]);
      else if (p.k === 0) opts = [[p.c, p.r + (p.side ? 1 : -1)], [p.c + 1, p.r + (p.side ? 1 : -1)], [p.c - 1, p.r + (p.side ? 1 : -1)]];
      else if (p.k === 5) for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) { if (dc || dr) opts.push([p.c + dc, p.r + dr]); }
      else { const D = p.k === 4 ? [...DIRS[1], ...DIRS[3]] : DIRS[p.k]; for (const [dc, dr] of D) for (let n = 1; n <= 3; n++) opts.push([p.c + dc * n, p.r + dr * n]); }
      opts = opts.filter(([c, r]) => ok(c, r));
      if (!opts.length) { if (p.k === 0) p.side ^= 1; return; } // a pawn stuck at the edge turns round
      const [c, r] = opts[(Math.random() * opts.length) | 0];
      const victim = P.find(o => o !== p && !o.gone && o.c === c && o.r === r);
      mv = { p, c0: p.c, r0: p.r, c, r, t: 0, victim };
    }
    return {
      step(dt) {
        t += dt;
        for (const p of P) if (p.gone) { p.gone += dt; if (p.gone > 3) { p.gone = 0; for (let tries = 0; tries < 30; tries++) { const c = (Math.random() * cols) | 0, r = r0 + ((Math.random() * (rows - r0)) | 0); if (!P.some(o => o !== p && o.c === c && o.r === r)) { p.c = p.x = c; p.r = p.y = r; break; } } } }
        if (mv) {
          mv.t += dt / 0.7; const e = inOut(clamp01(mv.t));
          mv.p.x = lerp(mv.c0, mv.c, e); mv.p.y = lerp(mv.r0, mv.r, e);
          if (mv.t >= 1) { mv.p.c = mv.c; mv.p.r = mv.r; if (mv.victim) mv.victim.gone = 0.001; last = mv; mv = null; wait = rand(0.8, 1.6); }
        } else if (q) { wait -= dt; if (wait <= 0) plan(); }
      },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const hl = mv || last;
        if (hl) { g.fillStyle = rgba(th.accent, 0.13 * a); g.fillRect(hl.c0 * q, hl.r0 * q, q, q); g.fillRect(hl.c * q, hl.r * q, q, q); }
        for (const p of P) {
          const hop = mv && mv.p === p && p.k === 2 ? Math.sin(Math.PI * clamp01(mv.t)) * q * 0.35 : 0;
          const fade = p.gone ? Math.max(0, 1 - p.gone * 2) : 1; if (fade <= 0) continue;
          const x = (p.x + 0.5) * q, y = (p.y + 0.5) * q - hop;
          g.fillStyle = `rgba(0,0,0,${0.25 * a * fade})`; chessPiece(g, p.k, x + q * 0.04, y + q * 0.05, q * 0.7, p.side === 1);
          g.fillStyle = p.side ? `rgba(30,22,16,${0.75 * a * fade})` : `rgba(250,240,220,${0.55 * a * fade})`; chessPiece(g, p.k, x, y, q * 0.7, p.side === 1);
        }
      },
    };
  },
});

/* ---------- Puzzle collection, part 2: sound kits ---------- */
Object.assign(KITS, (S => {
  const key = (when, vol) => { S.knock(rand(1500, 1800), { when, vol }); S.hiss({ dur: 0.02, vol: vol * 0.5, type: 'highpass', freq: 3500, when }); };
  const click = (when, vol, f = 2600) => { S.tone(f, { type: 'square', dur: 0.012, vol: vol * 0.25, when, attack: 0.001 }); S.hiss({ dur: 0.015, vol, type: 'bandpass', freq: f * 1.4, q: 3, when }); };
  const pencil = (when, dur, vol) => S.hiss({ dur, vol, type: 'bandpass', freq: rand(3200, 4800), to: rand(2600, 5200), q: 3, when });
  return {
    cipher: { // typewriter keys, the rotors ratcheting on, a bell at the end of the line
      pick() { S.knock(2600, { vol: 0.04 }); },
      place() { key(0, 0.15); click(0.05, 0.06, 3200); S.thud({ vol: 0.14, f: 150 }); },
      clear(n) { for (let i = 0; i < n + 3; i++) { key(i * 0.07, 0.1); click(i * 0.07 + 0.03, 0.04, 3200); } S.tink(2640, { when: (n + 3) * 0.07 + 0.05, vol: 0.08, dur: 0.6 }); },
      deal() { for (let i = 0; i < 3; i++) click(i * 0.05, 0.07, 2800 + i * 200); },
    },
    cube: { // the plastic of a speed cube: snaps, a quick run of turns on a clear, a little chord when it all lines up
      pick() { click(0, 0.05, 3000); },
      place() { S.knock(2200, { vol: 0.12 }); S.knock(1800, { vol: 0.1, when: 0.03 }); S.thud({ vol: 0.14, f: 170 }); },
      clear(n) { let w = 0; for (let i = 0; i < 6 + n * 3; i++) { click(w, 0.06, rand(2200, 3000)); w += 0.028; } S.hiss({ dur: 0.25, vol: 0.04, type: 'bandpass', freq: 1500, to: 3500, q: 1 }); [0, 4, 7].forEach((st, i) => S.tink(S.snd.root * 2 * Math.pow(2, st / 12), { when: w + 0.05 + i * 0.03, vol: 0.04, dur: 0.5 })); },
      deal() { for (let i = 0; i < 4; i++) click(i * 0.03, 0.05, 2600); },
    },
    blueprint: { // pencil on drafting paper, a ruler set down, the approval stamp on a clear
      pick() { pencil(0, 0.04, 0.04); },
      place() { S.knock(900, { vol: 0.14 }); pencil(0.02, 0.07, 0.05); S.thud({ vol: 0.12, f: 160 }); },
      clear(n) { for (let i = 0; i < Math.min(n + 2, 5); i++) pencil(i * 0.08, 0.1, 0.06); S.thud({ vol: 0.32, f: 95, when: Math.min(n + 2, 5) * 0.08 + 0.05 }); S.knock(420, { vol: 0.12, when: Math.min(n + 2, 5) * 0.08 + 0.05 }); },
      deal() { S.rustle({ vol: 0.05, dur: 0.18 }); },
    },
    alchemy: { // glass clinking on glass, the brew bubbling, a shimmer when it turns
      pick() { S.tink(2900, { vol: 0.03, dur: 0.15 }); },
      place() { S.tink(rand(1900, 2200), { vol: 0.07, dur: 0.3 }); S.plop(260, { vol: 0.12, when: 0.02 }); S.thud({ vol: 0.1, f: 140 }); },
      clear(n) { for (let i = 0; i < n + 3; i++) S.plop(rand(250, 520), { when: i * 0.06, vol: 0.08 }); for (let i = 0; i < 5; i++) S.tink(S.snd.root * 2 * Math.pow(2, [0, 3, 7, 10, 12][i] / 12), { when: 0.18 + i * 0.05, vol: 0.03, dur: 0.7 }); S.hissL({ dur: 0.7, vol: 0.05, type: 'bandpass', freq: 600, to: 3000, q: 0.8, when: 0.1 }); },
      deal() { S.plop(380, { vol: 0.06 }); S.tink(2500, { vol: 0.03, dur: 0.2, when: 0.05 }); },
    },
    chess: { // a weighted wooden piece set down, the chess clock pressed, a bell for check on a bigger clear
      pick() { S.knock(1150, { vol: 0.05 }); },
      place() { S.thud({ vol: 0.3, f: 190 }); S.knock(640, { vol: 0.15 }); },
      clear(n, combo) {
        S.knock(700, { vol: 0.16 }); S.thud({ vol: 0.28, f: 170 }); S.knock(560, { vol: 0.12, when: 0.09 }); // a capture: one piece off, the other in its place
        click(0.3, 0.1, 2400); S.knock(1800, { vol: 0.08, when: 0.3 });
        if (n > 1 || (combo || 0) > 2) S.tink(1568, { vol: 0.07, dur: 1, when: 0.42 });
      },
      deal() { for (let i = 0; i < 3; i++) S.knock(rand(900, 1300), { vol: 0.05, when: i * 0.06 }); },
    },
  };
})(Sfx));

/* ---------- Boot ---------- */
function start(data) {
  document.documentElement.lang = 'tr'; // Turkish casing for uppercase labels (i → İ)
  best = store.get(BEST_KEY) | 0;
  Sfx.muted = !!store.get(MUTE_KEY);
  const sp = store.get(PREFS_KEY);
  if (sp && typeof sp === 'object') {
    const v = sp.vol | 0; if (v >= 5 && v <= 100) prefs.vol = v;
    prefs.vib = sp.vib !== false; prefs.lowFx = !!sp.lowFx;
  }
  applyPrefs();
  const meta = store.get(THEME_KEY);
  if (meta) {
    if (Array.isArray(meta.disc)) meta.disc.forEach(i => { if (i >= 0 && i < T) earned.add(i | 0); });
    settings.auto = meta.auto !== false; settings.fixed = (meta.fixed | 0) % T;
    settings.block = meta.block === 'soft' ? 'soft' : 'classic';
  }
  if (meta && (meta.v | 0) < META_V) THEMES.forEach((t, i) => { if (NEW_TASKS.includes(t.id)) earned.delete(i); });
  THEMES.forEach((t, i) => { if (!UNLOCKS[t.id]) earned.add(i); });
  devMode = !!store.get(DEV_KEY); syncOpen();
  if (meta && Array.isArray(meta.fresh)) meta.fresh.forEach(i => { if (discovered.has(i)) fresh.add(i); });
  if (!discovered.has(settings.fixed)) settings.fixed = 0;
  if (meta && (meta.v | 0) < META_V) saveMeta();
  const st = store.get(STATS_KEY);
  if (st) for (const k in stats) stats[k] = +st[k] || 0;
  stats.bestScore = Math.max(stats.bestScore, best);
  const dn = store.get(DONE_KEY);
  if (Array.isArray(dn)) dn.forEach(id => { if (THEMES.some(t => t.id === id)) themesDone.add(id); });
  stats.themesDone = themesDone.size;
  loadDaily();
  loadPuzzle();
  stats.dailyBestStreak = Math.max(stats.dailyBestStreak, daily.best);
  document.addEventListener('visibilitychange', () => { if (document.hidden) store.set(STATS_KEY, stats); });
  if (!store.get(TUT_KEY) && (best > 0 || stats.totalLines > 0)) store.set(TUT_KEY, true); // returning players skip the automatic guide
  theme.mode = theme.prevMode = settings.block;
  syncMute();
  layout();
  snapTheme(settings.auto ? 0 : settings.fixed);
  const oldSave = store.get(OLD_SAVE_KEY);
  if (oldSave) store.set(OLD_SAVE_KEY, null); // migrate once, never resurrect later
  // a live reload keeps its game; otherwise pick up the mode played last (a daily only on its own day)
  const lastMode = store.get(MODE_KEY);
  const dsave = lastMode === 'daily' ? store.get(DAILY_SAVE_KEY) : null;
  const zsave = lastMode === 'zen' ? store.get(ZEN_SAVE_KEY) : null;
  const psave = lastMode === 'puzzle' ? store.get(PUZ_SAVE_KEY) : null;
  const ok = restore(data && data.grid ? data : null) || (dsave && dsave.day === dayKey() && restore(dsave)) || (zsave && zsave.mode === 'zen' && restore(zsave)) || (psave && psave.mode === 'puzzle' && restore(psave)) || restore(store.get(SAVE_KEY)) || restore(oldSave);
  if (!ok) { grid = null; tray = []; score = 0; mode = 'classic'; newGame(); }
  else { refreshFits(); checkOver(performance.now()); }
  applyPrefs(); // the volume depends on the mode that was picked up
  checkUnlocks(performance.now() + 400);
  updateHud();
  new ResizeObserver(() => layout()).observe(stage);
  window.addEventListener('resize', layout);
  if (document.fonts && document.fonts.load) document.fonts.load('800 20px "Baloo 2"');
  requestAnimationFrame(frame);
  if (!(data && data.grid)) openMenu(false); // a live reload keeps playing; a fresh visit starts on the main menu
}
window.claude?.hot?.snapshot?.(snapshot);
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
})();
