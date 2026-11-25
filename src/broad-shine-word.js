import { ShineWord } from './lib/shine-word.js';

// Broad Search 卡片标题里的强调词:沿用 Hero 的 Shine Word(热成像扫光),只播放一次后静止,再次进入视口重播
const host = document.getElementById('broadShineWord');
if (host) new ShineWord(host, { words: ['Broad Search'], baseGradient: ['#70fe7e', '#F4FE38'], once: true, natural: true });
