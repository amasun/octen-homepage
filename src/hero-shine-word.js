import { ShineWord } from './lib/shine-word.js';

// 词组保持原样(与原打字机一致)
const WORDS = ['Real-Time', 'Web', 'Broad', 'Image', 'Video', 'News', 'Business', 'Place', 'Design', 'Everything'];

const host = document.getElementById('heroShineWord');
// 静止态字色:取 Hero 背景光的绿 → 黄绿渐变(#70fe7e → #F4FE38),扫光仍按各自配色经过
if (host) new ShineWord(host, { words: WORDS, baseGradient: ['#70fe7e', '#F4FE38'], initialDelay: 2000, loopPause: 2000 });   // 首屏、以及每轮循环结束后,都先让 "Search" 单独居中停留 2s,再展开并开始 shine
