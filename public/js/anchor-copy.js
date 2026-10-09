/**
 * Octen Homepage - Anchor Copy Controller
 * 点击胶囊标签，自动复制指定锚点完整网址到剪贴板
 * 前缀: https://octen-homepage.vercel.app/
 */
(function () {
  'use strict';

  const BASE_URL = 'https://octen-homepage.vercel.app/';

  /**
   * 跨浏览器剪贴板复制（支持安全上下文与传统 execCommand 回退）
   */
  async function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        // 回退至 execCommand
      }
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      textarea.style.opacity = '0';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (err) {
      console.warn('[AnchorCopy] 复制失败:', err);
      return false;
    }
  }

  // Toast 提示单例
  let toastEl = null;
  let toastTimer = null;

  function showCopyToast(url) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'octen-anchor-toast';
      toastEl.className = 'octen-anchor-toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    // 转义 HTML 保证安全
    const safeUrl = url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    toastEl.innerHTML = `
      <div class="octen-toast-content">
        <div class="octen-toast-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E575" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="octen-toast-text">
          <div class="octen-toast-title">已复制锚点网址到剪贴板</div>
          <div class="octen-toast-url">${safeUrl}</div>
        </div>
      </div>
    `;

    toastEl.classList.remove('octen-toast-hide');
    toastEl.classList.remove('octen-toast-show');
    // 强制回流以重置过渡动画
    void toastEl.offsetWidth;
    toastEl.classList.add('octen-toast-show');

    // 点击提示框可立即隐藏
    toastEl.onclick = () => {
      toastEl.classList.remove('octen-toast-show');
      toastEl.classList.add('octen-toast-hide');
    };

    toastTimer = setTimeout(() => {
      toastEl.classList.remove('octen-toast-show');
      toastEl.classList.add('octen-toast-hide');
    }, 2800);
  }

  /**
   * 解析元素对应的锚点 ID
   */
  function resolveAnchor(tag) {
    if (tag.hasAttribute('data-copy-anchor')) {
      return tag.getAttribute('data-copy-anchor');
    }

    // 类名与层级回退自动解析
    if (tag.classList.contains('built-perf-tag') || tag.closest('#built-to-perform')) {
      return '#built-to-perform';
    }
    if (tag.closest('#showcase')) {
      return '#showcase';
    }
    if (tag.closest('#web-search')) {
      return '#web-search';
    }
    if (tag.closest('#vertical-search')) {
      return '#vertical-search';
    }
    if (tag.closest('#modalities')) {
      if (tag.closest('.octen-search-column:first-child')) {
        return '#image-search';
      }
      return '#video-search';
    }
    if (tag.closest('#get-started') || tag.classList.contains('start-building-tag')) {
      return '#get-started';
    }

    const parentWithId = tag.closest('[id]');
    if (parentWithId && parentWithId.id) {
      return '#' + parentWithId.id;
    }

    return null;
  }

  /**
   * 点击事件处理
   */
  function handleTagClick(e) {
    const tag = e.target.closest(
      '[data-copy-anchor], .built-perf-tag, .start-building-tag, .octen-search-fast-tag, .octen-search-premier-tag, .octen-glass-tag'
    );
    if (!tag) return;

    // 若点击的是普通的内部链接且未标记复制，则不拦截
    if (e.target.tagName.toLowerCase() === 'a' && !e.target.hasAttribute('data-copy-anchor') && !tag.hasAttribute('data-copy-anchor')) {
      return;
    }

    const anchor = resolveAnchor(tag);
    if (!anchor) return;

    e.preventDefault();
    e.stopPropagation();

    const normalizedAnchor = anchor.startsWith('#') ? anchor : '#' + anchor;
    const fullUrl = BASE_URL + normalizedAnchor;

    copyTextToClipboard(fullUrl).then(() => {
      // 胶囊自身微动效反馈
      tag.classList.add('tag-copied-success');
      setTimeout(() => {
        tag.classList.remove('tag-copied-success');
      }, 1500);

      // 无感同步更新浏览器地址栏 Hash
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', normalizedAnchor);
      }

      // 弹出轻量 Toast 提示
      showCopyToast(fullUrl);
    });
  }

  // 事件委托监听（捕获阶段以防止某些子容器阻止冒泡）
  document.addEventListener('click', handleTagClick, true);

  // 键盘无障碍支持（聚焦后按 Enter 或空格键触发）
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const active = document.activeElement;
      if (
        active &&
        (active.hasAttribute('data-copy-anchor') ||
          active.classList.contains('built-perf-tag') ||
          active.classList.contains('start-building-tag'))
      ) {
        e.preventDefault();
        handleTagClick({ target: active, preventDefault: () => {}, stopPropagation: () => {} });
      }
    }
  });
})();
