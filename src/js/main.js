const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-menu-toggle]');
const desktop = window.matchMedia('(min-width: 80rem)');

function setMenu(open) {
  header.classList.toggle('is-menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
}

toggle.addEventListener('click', () => {
  setMenu(toggle.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header.classList.contains('is-menu-open')) {
    setMenu(false);
    toggle.focus();
  }
});

desktop.addEventListener('change', () => setMenu(false));
