/**
 * Showcase「Try Octen in our applications」五张卡里的模拟控制台演示:
 *  每个 .sc-demo 里按 DOM 顺序依次播放:
 *    data-pop  → 淡入上浮出现;  data-type → 文字逐字输入(带内联角标的段落也能逐字输出)
 *  默认显示最终画面(静态);鼠标移到卡片上(hover,触屏为按下)时从头播放一遍,播完停在最终画面;
 *  移开鼠标回到最终画面。prefers-reduced-motion 下始终显示最终画面,不播放。
 */
(function () {
  'use strict';
  var demos = Array.prototype.slice.call(document.querySelectorAll('#showcase .sc-demo'));
  if (!demos.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var states = demos.map(function (d) {
    var items = Array.prototype.slice.call(d.querySelectorAll('[data-pop], [data-type], [data-swap], [data-send], [data-shift]')).map(function (el) {
      var texts = [];
      if (el.hasAttribute('data-type')) {
        var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n;
        while ((n = w.nextNode())) { if (n.nodeValue.length) texts.push({ node: n, full: n.nodeValue, owner: n.parentNode !== el ? n.parentNode : null }); }
      }
      return { el: el, texts: texts, type: el.hasAttribute('data-type'), send: el.hasAttribute('data-send'), shift: el.hasAttribute('data-shift') ? (+el.getAttribute('data-shift') || 1) : 0, swap: el.hasAttribute('data-swap') ? (el.getAttribute('data-swap') || 'b').charCodeAt(0) - 97 : -1 };
    });
    return { d: d, items: items, token: 0, visible: false, running: false, speed: 1 };
  });

  // 多画面切换:画面按 data-scene="a|b|c" 排序;level = 当前显示的画面序号。序号之前的画面淡出,当前画面淡入(a 默认可见)
  function scenes(st, level) {
    Array.prototype.forEach.call(st.d.querySelectorAll('[data-scene]'), function (e) {
      var i = e.getAttribute('data-scene').charCodeAt(0) - 97;
      e.classList.toggle('is-out', i < level);
      e.classList.toggle('is-in', i === level && i > 0);
    });
  }
  function showAll(st) {
    var max = 0;
    Array.prototype.forEach.call(st.d.querySelectorAll('[data-scene]'), function (e) { max = Math.max(max, e.getAttribute('data-scene').charCodeAt(0) - 97); });
    scenes(st, max);
    track(st, 2);
    st.d.classList.remove('is-typing');
    st.d.classList.add('is-static');   // 静态最终画面:结果图直接清晰、说明文字直接是 Generated(不播放生成过程)
    st.items.forEach(function (it) {
      it.texts.forEach(function (t) { t.node.nodeValue = t.full; if (t.owner) t.owner.style.display = ''; });
      it.el.classList.add('is-on');
    });
    Array.prototype.forEach.call(st.d.querySelectorAll('[data-clear]'), function (e) {   // 对话形式:发送之后输入框是空的(显示占位提示)
      var w2 = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, null), n2;
      while ((n2 = w2.nextNode())) n2.nodeValue = '';
      e.classList.add('is-empty');
    });
    follow(st);
  }
  function track(st, level) {   // 卡片轨道(Plan / Round 1 / Round 2):每遇到 data-shift,整体再左移一档,露出下一张
    Array.prototype.forEach.call(st.d.querySelectorAll('.scw-track'), function (e) {
      e.classList.remove('is-s1', 'is-s2');
      if (level > 0) e.classList.add('is-s' + level);
    });
  }
  // 跟随:答案越来越长时(data-follow 的容器),把内容整体上移,让最新生成的部分始终在画面里,更早的内容滑出画面上方
  function follow(st) {
    Array.prototype.forEach.call(st.d.querySelectorAll('[data-follow]'), function (e) {
      var box = e.closest('.scw-scene') || e.parentNode;
      // 只按"已经出现的内容"的底边计算:未出现的元素(透明但仍占位)不参与,否则一开始就会被推到最底下
      var bottom = 0;
      Array.prototype.forEach.call(e.querySelectorAll('.is-on'), function (it) {
        if (it.querySelector('[data-pop], [data-type]')) return;   // 容器类元素(如表格外框)跳过,只看最里层的项,避免容器刚出现时按整体高度算
        bottom = Math.max(bottom, it.offsetTop + it.offsetHeight);
      });
      var off = Math.max(0, bottom - box.clientHeight + 6);
      e.style.transform = off ? 'translateY(' + (-off) + 'px)' : '';
    });
  }
  function resetAll(st) {
    st.d.classList.remove('is-static', 'is-typing');
    scenes(st, 0);
    track(st, 0);
    Array.prototype.forEach.call(st.d.querySelectorAll('[data-follow]'), function (e) { e.style.transform = ''; });
    Array.prototype.forEach.call(st.d.querySelectorAll('[data-ph]'), function (e) { e.classList.add('is-empty'); });
    st.items.forEach(function (it) {
      it.el.classList.remove('is-on');
      it.texts.forEach(function (t) { t.node.nodeValue = ''; if (t.owner) t.owner.style.display = 'none'; });   // 引用角标等内联元素在对应文字出现前隐藏(否则会露出空的绿色方框)
    });
  }
  function sleep(ms, st, tk) {
    return new Promise(function (res) { setTimeout(function () { res(st.token === tk); }, ms * st.speed); });
  }

  async function typeItem(it, st, tk) {
    it.el.classList.add('is-on');
    it.el.classList.remove('is-empty');
    var inInput = !!it.el.closest('.scw-input');
    if (inInput) st.d.classList.add('is-typing');   // 光标只在输入框里打字时显示,输完即消失
    for (var i = 0; i < it.texts.length; i++) {
      var t = it.texts[i];
      for (var c = 1; c <= t.full.length; c++) {
        if (c === 1 && t.owner) t.owner.style.display = '';
        t.node.nodeValue = t.full.slice(0, c);
        if (c % 4 === 0) follow(st);
        if (!(await sleep(16 + Math.random() * 10, st, tk))) return false;
      }
    }
    if (inInput) st.d.classList.remove('is-typing');
    return true;
  }

  // data-with:画面一显示,其中带 data-with 的项就按各自的间隔(毫秒,默认 850)陆续出现,与该画面里的打字等并行
  // (例如答案逐字生成的同时,右侧 Rounds / Citations 同步冒出来,而不是等答案写完)
  function launchWith(st, tk, level) {
    var sceneEl = st.d.querySelector('[data-scene="' + String.fromCharCode(97 + level) + '"]');
    if (!sceneEl) return;
    var wt = 300;
    Array.prototype.forEach.call(sceneEl.querySelectorAll('[data-with]'), function (el) {
      var at = wt;
      wt += +(el.getAttribute('data-with') || 850) || 850;
      (async function () { if (await sleep(at, st, tk)) el.classList.add('is-on'); })();
    });
  }

  // 从头播放一遍:重置 → 按顺序出现 / 打字 / 切画面;播完停在最终画面
  async function play(st) {
    var tk = ++st.token;
    resetAll(st);
    if (!(await sleep(250, st, tk))) return;
    var ok = true;
    for (var i = 0; i < st.items.length && ok; i++) {
      var it = st.items[i];
      if (it.el.hasAttribute('data-with')) continue;   // 并行项:切到所在画面时按各自间隔陆续放出
      if (it.shift) { track(st, it.shift); ok = await sleep(700, st, tk); continue; }
      if (it.send) {   // 发送:清空输入框(显示占位提示),随后的消息气泡接着出现
        await sleep(260, st, tk);
        Array.prototype.forEach.call(st.d.querySelectorAll('[data-clear]'), function (e) {
          var w2 = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, null), n2;
          while ((n2 = w2.nextNode())) n2.nodeValue = '';
          e.classList.add('is-empty');
        });
        ok = await sleep(220, st, tk);
        continue;
      }
      if (it.swap > 0) { await sleep(900, st, tk); scenes(st, it.swap); launchWith(st, tk, it.swap); ok = await sleep(120, st, tk); continue; }   // 画面切换后几乎立刻开始输出(淡入与打字并行)
      if (it.type) ok = await typeItem(it, st, tk);
      else {
        it.el.classList.add('is-on');
        follow(st);
        var gap = it.el.getAttribute('data-gap');   // data-gap:该项出现后到下一项的间隔(毫秒),默认 450
        ok = await sleep(gap !== null ? +gap : 450, st, tk);
      }
      if (ok) ok = await sleep(it.type ? 260 : (it.el.hasAttribute('data-gap') ? 0 : 80), st, tk);
    }
  }

  // thinking 点阵:随机淡淡闪烁的方块(每个方块的闪烁周期与相位随机)
  Array.prototype.forEach.call(document.querySelectorAll('#showcase .scw-dotfield'), function (f) {
    var n = +f.getAttribute('data-n') || 280, html = '';
    for (var k = 0; k < n; k++) {
      html += '<i style="--d:' + (-(Math.random() * 3)).toFixed(2) + 's;--t:' + (1.4 + Math.random() * 2.2).toFixed(2) + 's;--a:' + (0.18 + Math.random() * 0.3).toFixed(2) + '"></i>';
    }
    f.innerHTML = html;
  });

  // 默认显示最终画面;hover(触屏:按下)时从头播放,移开后回到最终画面
  states.forEach(function (st) {
    showAll(st);
    if (reduce) return;
    var card = st.d.closest('.sc-app');
    if (!card) return;
    card.addEventListener('mouseenter', function () { play(st); });
    card.addEventListener('mouseleave', function () { st.token++; showAll(st); });
    card.addEventListener('touchstart', function () { play(st); }, { passive: true });
  });
  // 布局稳定后(字体 / 图片加载完)重新计算"跟随"的位置
  function settle() { states.forEach(function (st) { if (st.d.classList.contains('is-static')) follow(st); }); }
  window.addEventListener('load', settle);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
  window.addEventListener('resize', settle, { passive: true });
})();
