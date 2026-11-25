import { ShineWord } from './lib/shine-word.js';

// 聚焦核心定位与垂类词组
const WORDS = ['Real-Time', 'Web', 'News', 'Business', 'Place', 'Design'];

const host = document.getElementById('heroShineWord');
// 静止态字色:取 Hero 背景光的绿 → 黄绿渐变(#70fe7e → #F4FE38),扫光仍按各自配色经过
if (host) new ShineWord(host, { words: WORDS, baseGradient: ['#70fe7e', '#F4FE38'], initialDelay: 2500, loopPause: 3000 });   // 首屏、以及每轮循环结束后,都先让 "Search" 单独居中停留 2.5s-3s,再展开并开始 shine
