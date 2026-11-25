import { ShineWord } from './lib/shine-word.js';

// Sense 卡片标题里的产品名:沿用 Hero / planB Broad Search 标题的 Shine Word(热成像扫光),只播放一次后静止,再次进入视口重播
const host = document.getElementById('senseShineWord');
if (host) new ShineWord(host, { words: ['Sense Search'], baseGradient: ['#70fe7e', '#F4FE38'], once: true, natural: true });
