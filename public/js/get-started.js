/**
 * Section 8: Start Building / Get Started (#get-started)
 * Handles Skills / MCP / CLI tabs, agent selector dropdown, Cursor deeplink, and clipboard copy.
 */
(function () {
  'use strict';

  var root = document.getElementById('get-started');
  if (!root) return;

  var SKILLS_AGENTS = [
    {
      value: 'claude-code',
      label: 'Claude Code',
      icon: '/_next/static/media/icon-claude-code.5bebf761.svg',
      command: 'npx skills add Octen-Team/octen-skills -a claude-code',
    },
    {
      value: 'cursor',
      label: 'Cursor',
      icon: '/_next/static/media/icon-cursor.d7473059.svg',
      command: 'npx skills add Octen-Team/octen-skills -a cursor',
    },
    {
      value: 'codex',
      label: 'Codex',
      icon: '/_next/static/media/icon-codex.4e8595e2.svg',
      command: 'npx skills add Octen-Team/octen-skills -a codex',
    },
    {
      value: 'gemini',
      label: 'Gemini',
      icon: '/_next/static/media/icon-gemini-dark.2e7a376a.svg',
      command: 'npx skills add Octen-Team/octen-skills -a gemini-cli',
    },
    {
      value: 'other',
      label: 'Other Agents',
      icon: '/_next/static/media/icon-cli.90b74a96.svg',
      command: 'npx skills add Octen-Team/octen-skills -a other',
    },
  ];

  var MCP_CLIENTS = [
    {
      value: 'claude-code',
      label: 'Claude Code',
      icon: '/_next/static/media/icon-claude-code.5bebf761.svg',
      command: 'claude mcp add --scope user octen -- npx -y octen-mcp',
    },
    {
      value: 'cursor',
      label: 'Cursor',
      icon: '/_next/static/media/icon-cursor.d7473059.svg',
      command: '',
      href: 'cursor://anysphere.cursor-deeplink/mcp/install?name=octen&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIm9jdGVuLW1jcCJdLCJlbnYiOnsiT0NURU5fQVBJX0tFWSI6InlvdXIta2V5LWhlcmUifX0%3D',
    },
    {
      value: 'codex',
      label: 'Codex',
      icon: '/_next/static/media/icon-codex.4e8595e2.svg',
      command: 'codex mcp add octen -- npx -y octen-mcp',
    },
    {
      value: 'gemini',
      label: 'Gemini',
      icon: '/_next/static/media/icon-gemini-dark.2e7a376a.svg',
      command: 'gemini mcp add octen -- npx -y octen-mcp',
    },
    {
      value: 'other',
      label: 'Other',
      icon: '/_next/static/media/icon-cli.90b74a96.svg',
      command: '{"mcpServers":{"octen":{"command":"npx","args":["-y","octen-mcp"],"env":{"OCTEN_API_KEY":"your-key-here"}}}}',
    },
  ];

  var TAB_META = {
    Skills: {
      githubUrl: 'https://github.com/Octen-Team/octen-skills',
      docsUrl: 'https://docs.octen.ai/integrations/octen-skills',
    },
    MCP: {
      githubUrl: 'https://github.com/Octen-Team/octen-mcp',
      docsUrl: 'https://docs.octen.ai/integrations/octen-mcp-server',
    },
    CLI: {
      githubUrl: 'https://github.com/Octen-Team/octen-cli',
      docsUrl: 'https://docs.octen.ai/integrations/octen-cli',
      command: 'npm i -g @octen.ai/cli',
    },
  };

  var state = {
    tab: 'Skills',
    skillsAgent: 'claude-code',
    mcpClient: 'claude-code',
    menuOpen: false,
  };

  var tabs = root.querySelectorAll('.gs-tab');
  var selectWrap = root.querySelector('.gs-select');
  var selectTrigger = root.querySelector('.gs-select-trigger');
  var selectIcon = root.querySelector('.gs-select-icon');
  var selectLabel = root.querySelector('.gs-select-label');
  var selectMenu = root.querySelector('.gs-select-menu');
  var cmdSep = root.querySelector('.gs-cmd-sep');
  var cmdCode = root.querySelector('.gs-cmd-code');
  var cmdLink = root.querySelector('.gs-cmd-link');
  var copyBtn = root.querySelector('.gs-copy-btn');
  var githubBtn = root.querySelector('[data-gs-link="github"]');
  var docsBtn = root.querySelector('[data-gs-link="docs"]');
  var copyTimer = null;

  function activeItems() {
    return state.tab === 'MCP' ? MCP_CLIENTS : SKILLS_AGENTS;
  }

  function activeValue() {
    return state.tab === 'MCP' ? state.mcpClient : state.skillsAgent;
  }

  function setMenuOpen(open) {
    state.menuOpen = open;
    if (selectMenu) selectMenu.hidden = !open;
    if (selectTrigger) selectTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function renderOptions() {
    if (!selectMenu) return;
    var items = activeItems();
    var current = activeValue();
    selectMenu.innerHTML = '';

    items.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gs-select-option' + (item.value === current ? ' is-selected' : '');
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', item.value === current ? 'true' : 'false');
      btn.setAttribute('data-value', item.value);

      var img = document.createElement('img');
      img.className = 'gs-select-icon';
      img.src = item.icon;
      img.alt = '';
      btn.appendChild(img);

      var span = document.createElement('span');
      span.textContent = item.label;
      btn.appendChild(span);

      var check = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      check.setAttribute('viewBox', '0 0 24 24');
      check.setAttribute('fill', 'none');
      check.setAttribute('stroke', 'currentColor');
      check.setAttribute('stroke-width', '2.5');
      check.setAttribute('stroke-linecap', 'round');
      check.setAttribute('stroke-linejoin', 'round');
      check.setAttribute('class', 'gs-select-check');
      check.setAttribute('aria-hidden', 'true');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M20 6 9 17l-5-5');
      check.appendChild(path);
      btn.appendChild(check);

      selectMenu.appendChild(btn);
    });
  }

  function render() {
    var meta = TAB_META[state.tab];

    tabs.forEach(function (tabBtn) {
      var isActive = tabBtn.getAttribute('data-tab') === state.tab;
      tabBtn.classList.toggle('is-active', isActive);
      tabBtn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (githubBtn && meta) githubBtn.href = meta.githubUrl;
    if (docsBtn && meta) docsBtn.href = meta.docsUrl;

    var showSelect = state.tab !== 'CLI';
    if (selectWrap) selectWrap.hidden = !showSelect;
    if (cmdSep) cmdSep.hidden = !showSelect;

    var currentCommand = '';
    var currentHref = '';

    if (showSelect) {
      var items = activeItems();
      var val = activeValue();
      var selected = items.find(function (item) {
        return item.value === val;
      }) || items[0];

      if (selectIcon) selectIcon.src = selected.icon;
      if (selectLabel) selectLabel.textContent = selected.label;
      currentCommand = selected.command || '';
      currentHref = selected.href || '';
      renderOptions();
    } else {
      currentCommand = meta.command || '';
    }

    if (currentHref) {
      if (cmdCode) cmdCode.hidden = true;
      if (copyBtn) copyBtn.hidden = true;
      if (cmdLink) {
        cmdLink.href = currentHref;
        cmdLink.hidden = false;
      }
    } else {
      if (cmdLink) cmdLink.hidden = true;
      if (cmdCode) {
        cmdCode.textContent = currentCommand;
        cmdCode.hidden = false;
      }
      if (copyBtn) copyBtn.hidden = false;
    }
  }

  function copyCommand() {
    var text = cmdCode ? cmdCode.textContent : '';
    if (!text) return;

    function markCopied() {
      if (!copyBtn) return;
      copyBtn.classList.add('is-copied');
      if (copyTimer) clearTimeout(copyTimer);
      copyTimer = setTimeout(function () {
        copyBtn.classList.remove('is-copied');
      }, 1800);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(markCopied).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }

    function fallbackCopy() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        markCopied();
      } finally {
        document.body.removeChild(ta);
      }
    }
  }

  tabs.forEach(function (tabBtn) {
    tabBtn.addEventListener('click', function () {
      var nextTab = tabBtn.getAttribute('data-tab');
      if (!nextTab || !TAB_META[nextTab]) return;
      state.tab = nextTab;
      setMenuOpen(false);
      render();
    });
  });

  if (selectTrigger) {
    selectTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenuOpen(!state.menuOpen);
    });
  }

  if (selectMenu) {
    selectMenu.addEventListener('click', function (e) {
      var opt = e.target.closest('.gs-select-option');
      if (!opt) return;
      var val = opt.getAttribute('data-value');
      if (state.tab === 'MCP') {
        state.mcpClient = val;
      } else {
        state.skillsAgent = val;
      }
      setMenuOpen(false);
      render();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', copyCommand);
  }

  document.addEventListener('click', function (e) {
    if (state.menuOpen && selectWrap && !selectWrap.contains(e.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && state.menuOpen) {
      setMenuOpen(false);
      if (selectTrigger) selectTrigger.focus();
    }
  });

  render();
})();
