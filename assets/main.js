(() => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.links');

  function closeMenu() {
    if (!toggle || !links) return;
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  }

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    toggle.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    links.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  window.showToast = message => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__toast);
    window.__toast = setTimeout(() => toast.classList.remove('show'), 2200);
  };
})();
