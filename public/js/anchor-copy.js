/**
 * Octen Homepage - Anchor Copy Controller
 * 点击胶囊标签，静默复制指定锚点完整网址到剪贴板（不触发任何视觉变化）
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
   * 点击事件处理（纯静默复制，不改变任何 DOM 样式或提示）
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

    // 静默写入剪贴板
    copyTextToClipboard(fullUrl);

    // 静默同步更新浏览器地址栏 Hash
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', normalizedAnchor);
    }
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
