(() => {
  const run = document.querySelector('#run-workflow');
  const bar = document.querySelector('#progress span');
  const empty = document.querySelector('#empty');
  const results = document.querySelector('#results');
  const tabs = [...document.querySelectorAll('.tab')];
  const panels = [...document.querySelectorAll('.panel')];
  const approve = document.querySelector('#approve');
  const state = document.querySelector('#approval-state');
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  function activate(id, moveFocus = false) {
    tabs.forEach(tab => {
      const active = tab.dataset.panel === id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && moveFocus) tab.focus();
    });
    panels.forEach(panel => panel.classList.toggle('active', panel.id === id));
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.panel));
    tab.addEventListener('keydown', event => {
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== null) {
        event.preventDefault();
        activate(tabs[next].dataset.panel, true);
      }
    });
  });

  run?.addEventListener('click', async () => {
    run.disabled = true;
    run.textContent = 'Checking…';
    bar.style.width = '18%';
    await wait(420);
    run.textContent = 'Structuring…';
    bar.style.width = '52%';
    await wait(510);
    run.textContent = 'Testing gaps…';
    bar.style.width = '79%';
    await wait(500);
    bar.style.width = '100%';
    await wait(230);
    empty.hidden = true;
    results.hidden = false;
    activate('brief');
    run.textContent = 'Run complete';
    run.disabled = false;
  });

  approve?.addEventListener('click', () => {
    approve.textContent = 'Approved';
    approve.disabled = true;
    state.textContent = 'Approved by human · ready to send';
    state.classList.add('approved');
    document.querySelector('#approval-log').textContent = 'approved';
    window.showToast?.('Draft approved; trace updated');
  });
})();
