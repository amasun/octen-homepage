/**
 * Search the way AI does 模块 A/B 底色切换(临时对比用)
 * A = 白底(默认),B = #080B12 深底;选择记在 localStorage,刷新保留。样式见 web-search.css 末尾 .ws-theme-b
 * 定稿后:删除本文件、10-scripts.html 中的引用,保留选中的那套样式即可
 */
(function () {
  var sec = document.getElementById('web-search');
  if (!sec) return;
  var KEY = 'octen-ws-theme';
  var box = document.createElement('div');
  box.className = 'ws-ab';
  box.setAttribute('role', 'group');
  box.setAttribute('aria-label', 'Section background variant');
  box.innerHTML = '<button type="button" data-v="a">A</button><button type="button" data-v="b">B</button>';
  sec.appendChild(box);
  function set(v) {
    sec.classList.toggle('ws-theme-b', v === 'b');
    box.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === v)); });
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }
  var saved = 'a';
  try { saved = localStorage.getItem(KEY) || 'a'; } catch (e) {}
  set(saved);
  box.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) set(b.dataset.v); });
})();
